import React, { useEffect, useState } from "react";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:3000/orders");
    const data = await res.json();
    setOrders(data);
  };

  const createOrder = async () => {
    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, qty })
    });
    const data = await res.json();
    setOrders([...orders, data]);
    setItem("");
    setQty(1);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Order Management UI</h1>

      <div className="mb-6 p-4 border rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Create Order</h2>
        <input
          className="border p-2 w-full rounded mb-3"
          placeholder="Item name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded mb-3"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={createOrder}
        >
          Add Order
        </button>
      </div>

      <div className="p-4 border rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Orders List</h2>
        <ul>
          {orders.map((o) => (
            <li key={o.id} className="border-b py-2">
              <span className="font-medium">{o.item}</span> — Qty: {o.qty}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
