"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const product_model_1 = __importDefault(require("./product.model"));
class Review extends sequelize_1.Model {
}
Review.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "products",
            key: "id",
        },
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: "reviews",
});
Review.belongsTo(product_model_1.default, { foreignKey: "productId", as: "product" });
product_model_1.default.hasMany(Review, { foreignKey: "productId", as: "reviews" });
exports.default = Review;
