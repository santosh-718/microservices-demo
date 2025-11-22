const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Product API (self)
const PRODUCT_API = "http://localhost:3000";

let products = [];

// Health check
app.get("/", async (req, res) => {
    try {
        // Fetch all products
        // (real world: call another microservice)
    } catch (e) {
        console.log("Product service not reachable");
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Product Management</title>
            <style>
                body { font-family: Arial; margin: 40px; }
                .box { border: 1px solid #ddd; padding: 20px; border-radius: 10px; width: 350px; }
                input, button { padding: 10px; margin-top: 10px; width: 100%; }
                button { background: green; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: darkgreen; }
                .product { margin-top: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            </style>
        </head>
        <body>
            <h1>Product Management</h1>

            <div class="box">
                <h3>Add Product</h3>
                <form method="POST" action="/create">
                    <input name="name" placeholder="Product Name" required />
                    <input name="price" type="number" min="1" placeholder="Price" required />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            <h3>Products</h3>
            ${products
                .map(
                    p => `
                <div class="product">
                    <strong>${p.name}</strong> — ₹${p.price}<br/>
                    <small>Created: ${new Date(p.createdAt).toLocaleString()}</small>
                </div>`
                )
                .join("")}
        </body>
        </html>
    `);
});

// Create Product
app.post("/create", (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.send("Name & Price required");
    }

    const product = {
        id: products.length + 1,
        name,
        price,
        createdAt: new Date().toISOString(),
    };

    products.push(product);

    res.redirect("/");
});

// REST API Endpoints
app.get("/products", (req, res) => {
    res.json(products);
});

app.listen(3000, "0.0.0.0", () => console.log("Product Service UI running on port 3000"));
