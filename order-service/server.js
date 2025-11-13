const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Order Service running");
});

app.listen(3000, () => console.log("Order Service on 3000"));
