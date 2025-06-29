import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "15d",
  });

  // ✅ Set as HTTP-only cookie (good for SSR or server-auth)
  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Only over HTTPS
  });

  return token; // ✅ Return for frontend to store in localStorage
};

export default generateToken;
