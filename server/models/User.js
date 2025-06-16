import { DataTypes } from "sequelize"; // ✅ Ensure DataTypes is imported
import sequelize from "../config/db.js"; // ✅ Connect to Azure SQL

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true, // ✅ Adds createdAt and updatedAt fields
  tableName: "Users", // ✅ Explicitly set table name
});

// Ensure the table exists before using it
(async () => {
  try {
    await User.sync(); // ✅ Creates table if it doesn’t exist
    console.log("✅ User model synced with Azure SQL Database");
  } catch (error) {
    console.error("❌ Error syncing User model:", error);
  }
})();

export default User;
