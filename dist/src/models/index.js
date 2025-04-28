"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Category = void 0;
const product_model_1 = __importDefault(require("./product.model"));
exports.Category = product_model_1.default;
const product_model_2 = __importDefault(require("./product.model"));
exports.Product = product_model_2.default;
// ✅ Ensure associations are defined after initializing models
product_model_1.default.hasMany(product_model_2.default, { as: "products", foreignKey: "categoryId" });
product_model_2.default.belongsTo(product_model_1.default, { as: "category", foreignKey: "categoryId" });
