
import http from "node:http";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";

const APP_DIR = "/root/enabazar-server";
const DEPLOY_FILE = path.join(APP_DIR, "deploy.sh");

const PORT = 9100;
const SECRET = process.env.WEBHOOK_SECRET;

if (!SECRET) {
  console.error("ERROR: WEBHOOK_SECRET is missing!");
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/webhook") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Inabazar webhook running");
  }

  if (req.method !== "POST" || req.url !== "/webhook") {
    res.writeHead(404);
    return res.end("Not Found");
  }

  try {
    // Read raw GitHub payload
    const chunks = [];
    let totalSize = 0;

    for await (const chunk of req) {
      totalSize += chunk.length;

      if (totalSize > 1024 * 1024) {
        res.writeHead(413);
        return res.end("Payload too large");
      }

      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks);

    // Verify GitHub signature
    const signature = req.headers["x-hub-signature-256"];

    if (!signature || !signature.startsWith("sha256=")) {
      res.writeHead(401);
      return res.end("Missing signature");
    }

    const expected =
      "sha256=" +
      crypto.createHmac("sha256", SECRET)
        .update(rawBody)
        .digest("hex");

    const receivedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      res.writeHead(401);
      return res.end("Invalid signature");
    }

    // Only accept GitHub push events
    const event = req.headers["x-github-event"];

    if (event === "ping") {
      res.writeHead(200);
      return res.end("Webhook connected successfully");
    }

    if (event !== "push") {
      res.writeHead(200);
      return res.end("Event ignored");
    }

    const payload = JSON.parse(rawBody.toString("utf8"));

    console.log("📥 Received payload:", {
      repository: payload.repository?.full_name,
      branch: payload.ref
    });

    // Only deploy main branch
    if (payload.ref !== "refs/heads/main") {
      res.writeHead(200);
      return res.end("Branch ignored");
    }

    // Respond immediately
    res.writeHead(202, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      success: true,
      message: "Deployment started"
    }));

    // Run deployment script
    const child = spawn("bash", [DEPLOY_FILE], {
      cwd: APP_DIR,
      detached: true,
      stdio: "ignore",
      env: process.env
    });

    child.on("error", (err) => {
      console.error("Deployment spawn error:", err.message);
    });

    child.unref();

    console.log("🚀 Inabazar deployment started");

  } catch (err) {
    console.error("Webhook error:", err.message);

    if (!res.headersSent) {
      res.writeHead(500);
      res.end("Internal server error");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Inabazar webhook running on port ${PORT}`);
});

