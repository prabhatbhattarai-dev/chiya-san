'use client';

import React, { useState } from 'react';

export default function OrderPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample cart state
  const [cartItems] = useState([
    { name: 'Matka Chiya', quantity: 2, price: 50 },
    { name: 'Chicken Steam MoMo', quantity: 1, price: 180 },
  ]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate Order ID (or swap with Firestore auto-ID)
      const mockOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

      // Call internal API Route
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone,
          customerName,
          orderId: mockOrderId,
          itemsSummary: cartItems.map((item) => `${item.name} x${item.quantity}`).join(', '),
          totalAmount,
        }),
      });

      if (res.ok) {
        alert('Order placed successfully! Check your WhatsApp for receipt.');
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert('Order placed, but failed to send WhatsApp notification. Check console/logs.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      alert('An error occurred while submitting your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-xl rounded-2xl border border-stone-200">
      <h1 className="text-2xl font-bold mb-6 text-amber-900">Place Order - Chiya SAN</h1>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-stone-700">Full Name</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-800"
            placeholder="e.g. Prabhat Bhattarai"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-stone-700">WhatsApp Number (with Country Code)</label>
          <input
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-800"
            placeholder="+97798XXXXXXXX"
          />
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <h2 className="font-semibold text-amber-900 mb-2">Order Summary</h2>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm py-1 text-stone-700">
              <span>{item.name} x{item.quantity}</span>
              <span>NPR {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-amber-200 mt-2 pt-2 flex justify-between font-bold text-amber-950">
            <span>Total:</span>
            <span>NPR {totalAmount}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Sending Order...' : 'Confirm Order & Get WhatsApp Receipt'}
        </button>
      </form>
    </div>
  );
}
