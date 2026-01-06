import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers?.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Provide token",
        error: true,
        success: false
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false
      });
    }

    req.userId = decode.id; // ✅ attach userId
    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "You are not logged in",
      error: true,
      success: false
    });
  }
}

export default auth;
