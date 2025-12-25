import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

import bcrypt from "bcryptjs";

class ComradeUser extends Model {
  id: any;
  role: any;
  profileImage: any;
  password: any;
  email:any

  async setPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }
}

ComradeUser.init(
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
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("superAdmin", "admin", "customer"),
      defaultValue: "customer",
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Only `true` if approved by an admin/superAdmin
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://example.com/default-profile.png",
    },
  },
  {
    sequelize,
    tableName: "comradeUser",
    timestamps: true,
  }
);

export default ComradeUser;
