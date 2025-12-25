import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Category extends Model {
  public id!: number;
  public name!: string;
  public description?: string; // Optional description field
  public image?: string;       // Optional image URL field
}

Category.init(
  {
  id: {
  type: DataTypes.INTEGER.UNSIGNED,
  autoIncrement: true,
  primaryKey: true,
},
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Using TEXT for longer descriptions
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, // Store image file path or URL
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "categories",
  }
);

export default Category;
