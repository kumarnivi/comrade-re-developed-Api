// models/orderItem.model.ts
import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const OrderItem = sequelize.define("OrderItem", {
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER },
  price: { type: DataTypes.FLOAT },
});

export default OrderItem;
