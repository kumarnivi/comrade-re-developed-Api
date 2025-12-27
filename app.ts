import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./src/config/database";
import authRoutes from "./src/routes/auth.routes";
import adminRoutes from "./src/routes/adminRoutes";
import categoryRoutes from "./src/routes/category.routes";
import productRoutes from "./src/routes/product.routes";
import reviewRoutes from "./src/routes/review.routes";
import cartRoutes from "./src/routes/cart.routes";
import paymentRoutes from "./src/routes/payment.routes";
import path from "path";
import  checkoutRoutes  from "./src/routes/checkout.routes";
import getLatestOrder  from "./src/routes/order.routes";

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();


const allowedOrigins = [
  "http://localhost:5000", // Allow local frontend
  "https://your-production-site.com", // Allow production domain
  "http://localhost:5173/"
];

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allows cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Serve the uploads folder as a static directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); //Use Admin Routes

app.use("/api/checkout", checkoutRoutes);

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/", paymentRoutes)
app.use("/", getLatestOrder)


// JSON middleware AFTER webhook
app.use(express.json());[]



// Start server & connect to DB
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database connected & Tables created.");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
