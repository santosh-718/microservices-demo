const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Change this to your Order service URL
const ORDER_API = "http://localhost:3000";  

app.get("/", async (req, res) => {
    let orders = [];

    try {
        const result = await axios.get(`${ORDER_API}/orders`);
        orders = result.data;
    } catch (e) {
        console.log("Order service not reachable");
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order UI</title>
            <style>
                body { font-family: Arial; margin: 40px; }
                .box { border: 1px solid #ddd; padding: 20px; border-radius: 10px; width: 350px; }
                input, button { padding: 10px; margin-top: 10px; width: 100%; }
                button { background: blue; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: darkblue; }
                .order { margin-top: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            </style>
        </head>
        <body>
            <h1>Order Management Santosh</h1>

            <div class="box">
                <h3>Create Order</h3>
                <form method="POST" action="/create">
                    <input name="item" placeholder="Item name" required />
                    <input name="qty" type="number" min="1" value="1" required />
                    <button type="submit">Add Order</button>
                </form>
            </div>

            <h3>Orders</h3>
            ${orders
                .map(o => `<div class="order"><strong>${o.item}</strong> — Qty: ${o.qty}</div>`)
                .join("")}
        </body>
        </html>
    `);
});

app.post("/create", async (req, res) => {
    const { item, qty } = req.body;

    try {
        await axios.post(`${ORDER_API}/orders`, { item, qty });
    } catch (error) {
        console.log("Error creating order");
    }

    res.redirect("/");
});

app.listen(3000, () => console.log("UI running on port 3000"));
