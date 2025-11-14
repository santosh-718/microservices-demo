const express = require("express");
const app = express();

app.use(express.json());

let products = [];

// Health check
app.get("/", (req, res) => {
    res.send("Product Service running");
});

// Get all
app.get("/products", (req, res) => {
    res.json(products);
});

// Create
app.post("/products", (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "name & price required" });
    }

    const product = {
        id: products.length + 1,
        name,
        price,
        createdAt: new Date().toISOString(),
    };
    products.push(product);

    res.json(product);
});

// Update
app.put("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = products.find((p) => p.id === id);

    if (!item) return res.status(404).json({ error: "Product not found" });

    const { name, price } = req.body;
    if (name) item.name = name;
    if (price) item.price = price;

    res.json(item);
});

// Delete
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter((p) => p.id !== id);

    res.json({ message: "Product deleted" });
});

app.listen(3000, "0.0.0.0", () => console.log("Product Service on 3000"));
