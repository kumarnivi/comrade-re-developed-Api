"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./src/config/database"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
const category_routes_1 = __importDefault(require("./src/routes/category.routes"));
const product_routes_1 = __importDefault(require("./src/routes/product.routes"));
const review_routes_1 = __importDefault(require("./src/routes/review.routes"));
const cart_routes_1 = __importDefault(require("./src/routes/cart.routes"));
const payment_routes_1 = __importDefault(require("./src/routes/payment.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
const allowedOrigins = [
    "http://localhost:5000", // Allow local frontend
    "https://your-production-site.com", // Allow production domain
    "http://localhost:5173/"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true, // Allows cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
// Serve the uploads folder as a static directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", adminRoutes_1.default); //Use Admin Routes
app.use("/categories", category_routes_1.default);
app.use("/products", product_routes_1.default);
app.use("/reviews", review_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/payment", payment_routes_1.default);
// Start server & connect to DB
database_1.default.sync({ force: false }).then(() => {
    console.log("✅ Database connected & Tables created.");
});
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
