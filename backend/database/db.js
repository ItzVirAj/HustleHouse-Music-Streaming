import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://boltedaddy9:6CDOUSRj3RzXPMiN@tunetrails.jmfdmhb.mongodb.net/?retryWrites=true&w=majority&appName=TuneTrails",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit the process on connection failure
  }
};

export { connectDb };
