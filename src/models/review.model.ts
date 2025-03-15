import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./product.model";

class Review extends Model {
  public id!: number;
  public productId!: number;
  public rating!: number;
  public comment!: string;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "reviews",
  }
);

Review.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });

export default Review;
