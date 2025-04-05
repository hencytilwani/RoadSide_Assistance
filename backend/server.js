import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./Config/dbConnection.js";
import router from "./Routes/index.js";
// import createDefaultUsers from "./DefaultData.js"; // Import the default data function

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add support for urlencoded data
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Static files (if needed)
// app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api", router);

// Sample Route
// app.get("/", (req, res) => {
//   res.send("SwapSmart Backend Running!");
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(colors.red("Error:"), err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 middleware for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Connect to MySQL Database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Sync Database with Models (consider using force: false in production)
    await sequelize.sync();
    console.log(`${process.env.DB_NAME}`);
    
    console.log(colors.green("✅ Database & Tables Synced Successfully!"));
    
    // Seed default data
    // await createDefaultUsers();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(colors.cyan(`🚀 Server running on port ${PORT}`));
      console.log(colors.yellow(`📝 Environment: ${process.env.NODE_ENV || 'development'}`));
      console.log(colors.green(`📡 Access from other devices using your local IP address and port ${PORT}`));
    });
  } catch (error) {
    console.error(colors.red("❌ Failed to start server:"), error);
    process.exit(1);
  }
};

startServer();