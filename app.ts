import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./src/config/database";
import authRoutes from "./src/routes/auth.routes";
import categoryRoutes from "./src/routes/category.routes";
import productRoutes from "./src/routes/product.routes";
import reviewRoutes from "./src/routes/review.routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);

// Start server & connect to DB
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database connected & Tables created.");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
