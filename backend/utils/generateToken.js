import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
  // ✅ DEBUG — remove after fixing
  console.log("🔑 Signing with secret:", process.env.JWT_SECRET?.substring(0, 10) + "...");

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return token;
};

export default generateToken;