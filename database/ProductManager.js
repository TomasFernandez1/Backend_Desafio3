import fs from "fs";

export class ProductManager {
  constructor() {
    this.path = "./database/products.json";
  }

  async getProducts() {
    try {
      const products = await this.getProductsJSON()
      return products;
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProductsJSON();
    const product = products.find((p) => p.id === id);
    
    if(product) return product

    throw new Error("The product doesn't exist");
  }

  async addProduct(product) {
    try {

      // Get all products
      const products = await this.getProductsJSON()

      // Check that the product has all the fields
      const fields = [
        "title",
        "description",
        "price",
        "thumbnail",
        "code",
        "stock",
      ];
      const fields_product = Object.keys(product);
      const fieldsConfirm = fields.every((field) =>
        fields_product.includes(field)
      );

      if(!fieldsConfirm) return console.log('A field is missing from the product.');

      // Check that the code field is not repeated
      const productAdd = products.find((p) => p.code === product.code)

      // If the product does not exist, it is added to the array
      if(!productAdd){
        product.id = products.length+1
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
        return console.log('Product added successfully');
      }

      return console.log("There is already a product with that code.")

    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    try {
      // Get all products
      const products = await this.getProductsJSON();

      // Find the index of the product with the given ID
      const index = products.findIndex(await this.getProductById(id));

      // If the product with the given ID is not found, return an error
      if (index === -1) {
        return console.log("Product not found.");
      }

      // Update the product fields with the new values
      products[index].title = title;
      products[index].description = description;
      products[index].price = price;
      products[index].thumbnail = thumbnail;
      products[index].stock = stock;

      products.forEach(p => {
        if(code === !p.code) products[index].code = code;
      })


      // Write the updated array back to the file
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

      return console.log("Product updated successfully.");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      // Get all products
      const products = await this.getProductsJSON();

      // Find the index of the product with the ID
      const index = products.findIndex(await this.getProductById(id));

      // If the product with the ID is not found, return an error
      if (index === -1) {
        return console.log("Product not found.");
      }

      // Remove the product from the array
      products.splice(index, 1);

      // Write the updated array back to the file
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

      return console.log("Product deleted successfully.");
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsJSON(){
    try {
      // Get all the products from the file
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");

      // Parse the JSON 
      const products = await JSON.parse(productsJSON);
      return products
    } catch (error) {
      return []
    }
  }
}
