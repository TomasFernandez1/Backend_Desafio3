import express from "express";
import { ProductManager } from "../database/ProductManager.js";

const pManager = new ProductManager();

const app = express();

// Endpoint of all products
app.get("/products", async (req, res) => {
  try {
    // Get the limit if it exists
    const limit = parseInt(req.query.limit, 10);

    // Get all products
    const products = await pManager.getProducts();

    // Check if there is a limit
    if (!limit) {
      res.status(200).send(products);
    }

    // If there is a limit slice the array
    res.status(200).send(products.slice(0, limit));
  } catch (error) {
    console.log(error);
  }
});

// Endpoint of products by ID
app.get("/products/:pid", async (req, res) => {
  try {

    // Get ID
    const pid = parseInt(req.params.pid);
    const product = await pManager.getProductById(pid)
    res.send(product)
  } catch (error) {
    res.status(500).send({message: error.message})
  }
});

app.listen(8080, () => {
  console.log("Listening port 8080");
});
