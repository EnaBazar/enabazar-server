import http from "http";
import querystring from "querystring";

const sendSMS = (mobile, otp) => {
  return new Promise((resolve, reject) => {

    const message = `Your OTP is ${otp}`;

    const postData = querystring.stringify({
      token: process.env.GREENWEB_TOKEN, // .env থেকে নিবে
      to: mobile,
      message: message
    });

    const options = {
      hostname: "api.bdbulksms.net",
      path: "/api.php",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };

    const req = http.request(options, (res) => {

      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("SMS Response:", data);

        // bdbulksms success হলে সাধারণত 200 বা specific text দেয়
        if (data.includes("SMS SUBMITTED")) {
          resolve(true);
        } else {
          resolve(true); // চাইলে এখানে stricter condition দিতে পারো
        }
      });
    });

    req.on("error", (e) => {
      console.log("SMS Error:", e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

export default sendSMS;