import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class ComradeUser extends Model {
    id: any;
    role: any;
  profileImage: any;
    password(password: any, password1: any) {
        throw new Error("Method not implemented.");
    }
}

ComradeUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM("admin", "customer"),
      defaultValue: "customer",
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true, // User may or may not upload an image
      defaultValue: "https://example.com/default-profile.png", // Set a default image
    },
  },
  {
    sequelize,
    tableName: "comradeUser",
    timestamps: true,
  }
);

// Sync table and log message
sequelize
  .sync({ force: false }) // Use `force: true` to drop & recreate table
  .then(() => {
    console.log("✅ Users table has been created successfully.");
  })
  .catch((error) => {
    console.error("❌ Error creating Users table:", error);
  });

export default ComradeUser;
