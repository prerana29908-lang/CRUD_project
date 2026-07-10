require("dotenv").config();

console.log("====================================");
console.log("DB_URL exists:", !!process.env.DB_URL);

if (process.env.DB_URL) {
  console.log(
    "DB_URL starts with:",
    process.env.DB_URL.substring(0, 35) + "..."
  );
} else {
  console.log("DB_URL is undefined!");
}

console.log("====================================");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error");
    console.error("Message:", err.message);

    if (err.original) {
      console.error("Original Error:", err.original);
    }

    console.error(err);
  });

module.exports = sequelize;