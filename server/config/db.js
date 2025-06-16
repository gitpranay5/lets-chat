import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.AZURE_SQL_CONNECTION_STRING, {
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: false,
      authentication: {
        type: "azure-active-directory-default"
      }
    }
  }
});

sequelize.authenticate()
  .then(() => console.log("Connected to Azure SQL Database with Entra ID"))
  .catch(err => console.error("Azure SQL connection error:", err));

export default sequelize;
