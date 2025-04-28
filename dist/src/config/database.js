"use strict";
// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const sequelize = new Sequelize(
//   process.env.DB_NAME!,
//   process.env.DB_USER!,
//   process.env.DB_PASS!,
//   {
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT), // Ensure port is a number
//     dialect: "mysql",
//     logging: false, // Disable logging (optional)
//   }
// );
// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Connected to Clever Cloud MySQL successfully!"))
//   .catch((error) => console.error("❌ Unable to connect to the database:", error));
// export default sequelize;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("bpuimhpednzk8ebzbzxg", // Database Name
"uxwbhkqhrhocxx1h", // Username
"NXxYdz7ZXbCNhy1R6oQo", // Password
{
    host: "bpuimhpednzk8ebzbzxg-mysql.services.clever-cloud.com", // Example: your-db-host.clever-cloud.com
    port: 3306, // MySQL default port
    dialect: "mysql",
    logging: false, // Disable logging (optional)
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for Clever Cloud
        },
    },
});
sequelize
    .authenticate()
    .then(() => console.log("✅ Connected to MySQL successfully!"))
    .catch((error) => console.error("❌ Unable to connect to the database:", error));
exports.default = sequelize;
