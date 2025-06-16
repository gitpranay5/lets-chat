import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

if (!process.env.AZURE_SQL_CONNECTION_STRING) {
  console.error("❌ AZURE_SQL_CONNECTION_STRING is missing or incorrectly formatted!");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.AZURE_SQL_CONNECTION_STRING, {
  dialect: "mssql",
  dialectOptions: { options: { encrypt: true } }
});

sequelize.authenticate()
  .then(() => console.log("✅ Connected to Azure SQL Database"))
  .catch((error) => console.error("❌ Database connection error:", error));

export default sequelize;
