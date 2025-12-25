import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Order = sequelize.define("Order", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  paymentIntentId: { type: DataTypes.STRING },
});

export default Order;
