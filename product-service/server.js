const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let products = [];

// UI PAGE
app.get("/", (req, res) => {
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
                        <small>${new Date(p.createdAt).toLocaleString()}</small>
                    </div>
                `
                )
                .join("")}
        </body>
        </html>
    `);
});

// CREATE PRODUCT (Fix for 404)
app.post("/create", (req, res) => {
    const { name, price } = req.body;

    const product = {
        id: products.length + 1,
        name,
        price,
        createdAt: new Date().toISOString()
    };

    products.push(product);

    // Reload UI
    res.redirect("/");
});

// API GET all products
app.get("/products", (req, res) => {
    res.json(products);
});

app.listen(3000, "0.0.0.0", () => console.log("Product Service running on port 3000"));
