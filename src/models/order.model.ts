// models/order.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./product.model";

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public paymentStatus!: "pending" | "paid" | "failed";
  public paymentIntentId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public product?: any; // to access item.product

}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;
