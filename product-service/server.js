const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Product Service running");
});

app.listen(3000, () => console.log("Product Service on 3000"));
