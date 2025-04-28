"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const category_model_1 = __importDefault(require("./category.model"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categories",
            key: "id",
        },
    },
    images: {
        type: sequelize_1.DataTypes.JSON, // Change from ARRAY to JSON
        allowNull: true,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Set default stock to 0
    },
}, {
    sequelize: database_1.default,
    tableName: "products",
});
Product.belongsTo(category_model_1.default, { foreignKey: "categoryId", as: "category" });
exports.default = Product;
