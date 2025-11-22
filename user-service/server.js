const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let users = [];

// UI PAGE
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>User Management</title>
            <style>
                body { font-family: Arial; margin: 40px; }
                .box { border: 1px solid #ddd; padding: 20px; border-radius: 10px; width: 350px; }
                input, button { padding: 10px; margin-top: 10px; width: 100%; }
                button { background: purple; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: darkviolet; }
                .user { margin-top: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            </style>
        </head>
        <body>
            <h1>User Management</h1>

            <div class="box">
                <h3>Add User</h3>
                <form method="POST" action="/create">
                    <input name="name" placeholder="User Name" required />
                    <input name="email" type="email" placeholder="Email" required />
                    <button type="submit">Add User</button>
                </form>
            </div>

            <h3>Users</h3>
            ${users
                .map(
                    u => `
                    <div class="user">
                        <strong>${u.name}</strong><br/>
                        <small>${u.email}</small><br/>
                        <small>Created: ${new Date(u.createdAt).toLocaleString()}</small>
                    </div>
                `
                )
                .join("")}
        </body>
        </html>
    `);
});

// CREATE USER
app.post("/create", (req, res) => {
    const { name, email } = req.body;

    const user = {
        id: users.length + 1,
        name,
        email,
        createdAt: new Date().toISOString()
    };

    users.push(user);

    res.redirect("/");
});

// GET all users as API
app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(3000, "0.0.0.0", () => console.log("User Service running on port 3000"));
