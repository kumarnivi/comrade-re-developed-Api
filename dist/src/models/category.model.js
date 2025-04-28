"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT, // Using TEXT for longer descriptions
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING, // Store image file path or URL
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: "categories",
});
exports.default = Category;
