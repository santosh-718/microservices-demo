const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("User Service running");
});

app.listen(3000, () => console.log("User Service on 3000"));
