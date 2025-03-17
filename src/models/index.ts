import Category from "./product.model";
import Product from "./product.model";

// ✅ Ensure associations are defined after initializing models
Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });
Product.belongsTo(Category, { as: "category", foreignKey: "categoryId" });

export { Category, Product };
