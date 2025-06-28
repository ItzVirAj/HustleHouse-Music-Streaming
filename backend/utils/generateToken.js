import jwt from "jsonwebtoken";
const JWT_SECRET = "your_strong_jwt_secret_key_here_12345!@#";

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set cookie (optional if you only want localStorage)
  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  // ✅ Send token to frontend so it can store it
  return token;
};


export default generateToken;
