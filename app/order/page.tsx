'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function OrderPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('Dine-in (At Table)');
  const [loading, setLoading] = useState(false);

  // Sample active order items
  const [cartItems] = useState<CartItem[]>([
    { id: '1', name: 'Matka Chiya', quantity: 2, price: 50 },
    { id: '2', name: 'Chicken Steam MoMo', quantity: 1, price: 180 },
    { id: '3', name: 'Potato Basket', quantity: 1, price: 150 },
  ]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Unique order ID generator
      const generatedOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const itemsSummary = cartItems.map((item) => `${item.name} x${item.quantity}`).join(', ');

      // Trigger Next.js backend API Route
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          orderId: generatedOrderId,
          itemsSummary,
          totalAmount,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(`✓ Order Placed Successfully!\n\nThank you, ${customerName}.\nTotal: NPR ${totalAmount}\n\nWe'll have your order ready shortly at Chiya SAN.`);
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert(`Order placed on site, but WhatsApp notification could not be delivered.\n\nError: ${result.error || 'Check server logs'}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An unexpected error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-stone-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-amber-950">Chiya SAN</h1>
          <p className="text-stone-500 text-sm mt-1">Tea • Culture • Chakupat</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition"
              placeholder="e.g. Prabhat Bhattarai"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Phone Number (WhatsApp)
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition"
              placeholder="98XXXXXXXX or +97798XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Order Type
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none transition"
            >
              <option value="Dine-in (At Table)">Dine-in (At Table)</option>
              <option value="Takeaway / Counter Pickup">Takeaway / Counter Pickup</option>
            </select>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl">
            <h3 className="font-bold text-amber-950 text-sm mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-stone-700">
                  <span>{item.name} <span className="text-stone-400 font-medium">x{item.quantity}</span></span>
                  <span className="font-semibold text-stone-800">NPR {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-200 mt-3 pt-3 flex justify-between font-extrabold text-amber-950 text-base">
              <span>Total Amount:</span>
              <span>NPR {totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Sending Order...</span>
            ) : (
              <span>Confirm Order</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
