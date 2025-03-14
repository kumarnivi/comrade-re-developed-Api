import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Category from "./category.model";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public categoryId!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

export default Product;
