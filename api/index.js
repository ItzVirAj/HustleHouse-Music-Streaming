import app from "../backend/index.js"; // adjust path if needed

let isDbConnected = false;

// Middleware to ensure DB is connected (cold start safe)
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await connectDb();
    isDbConnected = true;
  }
  next();
});

export default app;
