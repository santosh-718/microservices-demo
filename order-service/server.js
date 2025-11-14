/*
Order Service UI
- Single-file React component (default export)
- TailwindCSS utility classes used
- Framer Motion for subtle animation

How to use:
1. Create a new React app (Vite recommended):
   npm create vite@latest order-ui --template react
2. Install deps:
   cd order-ui
   npm install framer-motion
   # Tailwind setup per Tailwind docs (or use a global CDN for quick demo)
3. Replace App.jsx with this component or import it into your app.
4. Run: npm run dev

API expectations (your Express backend):
GET  /            -> health/status (returns plain text or JSON)
GET  /orders      -> list of orders (JSON array)
POST /orders      -> accept { item, qty } and return created order

This file is meant for local dev and demo. For production, separate components, error handling, and auth are recommended.
*/

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OrderServiceUI() {
  const [status, setStatus] = useState("checking...");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ item: "", qty: 1 });
  const [error, setError] = useState(null);

  const apiBase = ""; // leave empty to proxy to same origin (use /api or set full URL as needed)

  useEffect(() => {
    checkStatus();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkStatus() {
    try {
      const res = await fetch(apiBase + "/");
      if (!res.ok) throw new Error("bad status");
      const text = await res.text();
      setStatus(text || "OK");
    } catch (e) {
      setStatus("Unavailable");
    }
  }

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiBase + "/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      setError(e.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function createOrder(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(apiBase + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const created = await res.json();
      setOrders((s) => [created, ...s]);
      setForm({ item: "", qty: 1 });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold">Order Service — Dashboard</h1>
          <div className="text-sm">
            <span className="mr-3">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Unavailable' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {status}
            </span>
          </div>
        </motion.header>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="md:col-span-1 bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium mb-3">Create Order</h2>
            <form onSubmit={createOrder} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Item</label>
                <input
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="e.g. T-Shirt"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
                <button type="button" onClick={fetchOrders} className="px-3 py-2 border rounded-lg">Refresh</button>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
            </form>

            <div className="mt-4 text-xs text-slate-500">This demo expects a JSON API at <code>/orders</code>.</div>
          </div>

          <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Orders</h2>
              <div className="text-sm text-slate-500">{loading ? 'Loading…' : `${orders.length} orders`}</div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {orders.length === 0 && !loading && (
                <div className="text-sm text-slate-500">No orders yet. Create one!</div>
              )}

              {orders.map((o) => (
                <motion.div key={o.id || Math.random()} className="p-3 border rounded-lg flex items-center justify-between" whileHover={{ scale: 1.01 }}>
                  <div>
                    <div className="font-medium">{o.item || '—'}</div>
                    <div className="text-xs text-slate-500">Qty: {o.qty ?? '-'}</div>
                  </div>
                  <div className="text-xs text-slate-400">#{o.id ?? '—'}</div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.section>

        <footer className="mt-6 text-center text-xs text-slate-400">Built for demo • Connects to your Express backend</footer>
      </div>
    </div>
  );
}
