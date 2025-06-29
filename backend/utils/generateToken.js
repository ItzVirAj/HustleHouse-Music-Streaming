import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;


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
