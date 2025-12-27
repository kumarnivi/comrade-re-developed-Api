import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./product.model";

class Cart extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public product?: Product; // to access item.product

}




Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
   userId: {
  type: DataTypes.INTEGER.UNSIGNED,
  allowNull: false,
},
   productId: {
  type: DataTypes.INTEGER.UNSIGNED,
  allowNull: false,
  references: {
    model: "products",
    key: "id",
  },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "cart",
  }
);

Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default Cart;
