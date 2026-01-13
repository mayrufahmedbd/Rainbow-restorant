const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ===== CONFIG =====
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234"; // change this

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static("public"));

// ===== HELPERS =====
function readOrders() {
  return JSON.parse(fs.readFileSync("orders.json", "utf8"));
}

function writeOrders(data) {
  fs.writeFileSync("orders.json", JSON.stringify(data, null, 2));
}

// ===== AUTH MIDDLEWARE =====
function checkAuth(req, res, next) {
  const { username, password } = req.headers;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ===== ROUTES =====

// Admin login check
app.post("/api/order", (req, res) => {
  const orders = readOrders();

  orders.push({
    id: Date.now(),
    name: req.body.name,
    product: req.body.product
  });

  writeOrders(orders);
  res.json({ success: true });
});

// Create order (public)
app.post("/api/order", (req, res) => {
  const orders = readOrders();
  orders.push({
    id: Date.now(),
    ...req.body
  });
  writeOrders(orders);
  res.json({ success: true });
});

// Get all orders (admin)
app.get("/api/orders", checkAuth, (req, res) => {
  res.json(readOrders());
});

// Update order
app.put("/api/order/:id", checkAuth, (req, res) => {
  let orders = readOrders();
  orders = orders.map(o =>
    o.id == req.params.id ? { ...o, ...req.body } : o
  );
  writeOrders(orders);
  res.json({ success: true });
});

// Delete order
app.delete("/api/order/:id", checkAuth, (req, res) => {
  const orders = readOrders().filter(o => o.id != req.params.id);
  writeOrders(orders);
  res.json({ success: true });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
