// console.log("hello world! hiii I am a student");
//here the import statement is used to import the express module, which is a web framework for Node.js. The morgan module is also imported, which is a middleware for logging HTTP requests.
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const sequelize = require("./DB"); // installed sequelize package is imported to connect to the database and perform database operations. Sequelize is an Object-Relational Mapping (ORM) library for Node.js that provides an easy-to-use interface for interacting with relational databases like PostgreSQL, MySQL, SQLite, etc.
const { DataTypes } = require("sequelize"); // DataTypes is an object provided by Sequelize that contains various data types that can be used to define the structure of database tables. It allows you to specify the type of data that each column in a table should hold, such as strings, integers, dates, etc. In this code snippet, DataTypes is imported from the sequelize package to define the data types for the Product model.
const cors = require("cors"); // cors is a middleware that allows cross-origin requests. It enables the server to accept requests from different domains, which is useful when the frontend and backend are hosted on different servers or ports. In this code snippet, the cors middleware is imported to handle cross-origin requests in the Express application.

console.log("Running my index.js file");


const db = sequelize;

const Product = db.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// db.authenticate()
//     .then(() => {
//         console.log("Database connected successfully!");
//     })
//     .catch((err) => {
//         console.error("Unable to connect to the database:", err);
//     });


//here the server setup is done using the express() function, which creates an instance of an Express application. The morgan middleware is used to log HTTP requests in the console. Finally, the server is set to listen on port 3000, and a message is logged to the console when the server starts running.
const server = express(); 


// const products = [
//   {
//     id: 1,
//     title: "Product 1",
//     description: "This is product 1",
//     category: "Category 1",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     title: "Product 2",
//     description: "This is product 2",
//     category: "Category 2",
//     image: "https://via.placeholder.com/150",
//   },
// ];

//here all server configurations are done, like using morgan middleware for logging HTTP requests in the console. The server is set to listen on port 3000, and a message is logged to the console when the server starts running.
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

//here server routes are defined using the server.get() method. The first route is the root route ("/"), which sends a response of "Hello World!" when accessed. The second route is "/api/products", which sends a JSON response containing an array of product objects when accessed.
server.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Hello World!");
});
// server.get("/api/products", (request, response) => {

//     response.status(200).json({
//       message: "Products fetched successfully",
//       products: products,
//       error: false
//     })
//     // response.json({ message: "Hii I am a student" });
// });


server.get("/api/products", async (request, response) => {

  try {

    const products = await Product.findAll();

    response.status(200).json({
      message: "Products fetched successfully",
      products: products,
      error: false
    });

  } catch (error) {

    console.log(error);

    response.status(500).json({
      message: "Internal server error",
      error: true
    });

  }

});



server.get("/api/products/:id", async (request, response) => {

  try {

    const { id } = request.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
      });
    }

    response.status(200).json({
      message: "Product fetched successfully",
      product: product,
      error: false,
    });

  } catch (error) {

    console.log(error);

    response.status(500).json({
      message: "Internal server error",
      error: true,
    });

  }

});



server.put("/api/products/:id", async (request, response) => {

  try {

    const { id } = request.params;
    const { title, price, description, category, image } = request.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
      });
    }

    product.title = title;
    product.price = price;
    product.description = description;
    product.category = category;
    product.image = image;

    await product.save();

    response.status(200).json({
      message: "Product updated successfully",
      product: product,
      error: false,
    });

  } catch (error) {

    console.log(error);

    response.status(500).json({
      message: "Internal Server Error",
      error: true,
    });

  }

});



server.delete("/api/products/:id", async (request, response) => {

  try {

    const { id } = request.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
      });
    }

    await product.destroy();

    response.status(200).json({
      message: "Product deleted successfully",
      error: false,
    });

  } catch (error) {

    console.log(error);

    response.status(500).json({
      message: "Internal Server Error",
      error: true,
    });

  }

});



// /GET /PUT /POST /DELETE /PATCH THESE ARE CRUD OPERATIONS
//EX OF POST REQUEST

server.post("/api/products", async (request, response) => {

  console.log("========== POST ROUTE HIT ==========");
  console.log("Request Body:", request.body);

  try {

    const { title, price, description, category, image } = request.body;

    const product = await Product.create({
      title,
      price,
      description,
      category,
      image,
    });

    console.log("Product Created:", product.toJSON());

    response.status(201).json({
      message: "Product created successfully",
      product: product,
      error: false,
    });

  } catch (error) {

    console.log("ERROR:", error);

    response.status(500).json({
      message: error.message,
      error: true,
    });

  }

});



//here the server is set to listen on port 3000, and a message is logged to the console when the server starts running.
server.listen(process.env.PORT || 5000, () => {

    db.authenticate()
    .then(() => {
        console.log("Database connected successfully!");
        return db.sync();
    })
    
    .then(() =>{
      console.log("Database synced successfully!");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

  console.log("Server is running on port " + (process.env.PORT || 5000));
});
