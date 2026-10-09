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
  const [orderType, setOrderType] = useState('Takeaway / Pick-up');
  const [loading, setLoading] = useState(false);

  // Custom Success Modal State
  const [showModal, setShowModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    total: number;
    phone: string;
  } | null>(null);

  // Sample active order items (connect to your cart state/context)
  const [cartItems] = useState<CartItem[]>([
    { id: '1', name: 'Special Matka Chiya', quantity: 2, price: 50 },
    { id: '2', name: 'Chicken Steam MoMo', quantity: 1, price: 180 },
    { id: '3', name: 'Potato Basket', quantity: 1, price: 150 },
  ]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
      const itemsSummary = cartItems.map((item) => `${item.name} x${item.quantity}`).join(', ');

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

      const data = await res.json();

      if (res.ok && data.success) {
        // Trigger custom modal
        setCompletedOrder({
          id: generatedOrderId,
          total: totalAmount,
          phone: customerPhone,
        });
        setShowModal(true);

        // Reset form fields
        setCustomerName('');
        setCustomerPhone('');
      } else {
        alert(`Order created, but WhatsApp notification could not be sent.\n\nError: ${data.error || 'Check server logs'}`);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      alert('An error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-stone-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-amber-950">Chiya SAN</h1>
          <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mt-1">
            Tea • Culture • Chakupat
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 outline-none transition"
              placeholder="e.g. Prabhat Bhattarai"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Phone Number (WhatsApp)
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 outline-none transition"
              placeholder="98XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Order Type
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-600 outline-none transition"
            >
              <option value="Dine-in (At Table)">Dine-in (At Table)</option>
              <option value="Takeaway / Pick-up">Takeaway / Pick-up</option>
            </select>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
            <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-2">
              Order Summary
            </h3>
            <div className="space-y-1.5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-stone-700">
                  <span>
                    {item.name} <span className="text-stone-400 font-medium">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-stone-800">NPR {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-200 mt-2.5 pt-2.5 flex justify-between font-extrabold text-amber-950 text-base">
              <span>Total Amount:</span>
              <span>NPR {totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing Order...' : 'Confirm Order'}
          </button>
        </form>
      </div>

      {/* MODERN CAFÉ SUCCESS MODAL */}
      {showModal && completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-amber-100 text-center animate-in fade-in zoom-in duration-200">
            {/* Animated Icon */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-amber-950 mb-1">Order Placed!</h3>
            <p className="text-xs text-stone-500 font-medium mb-4">Chiya SAN • Chakupat Counter</p>

            {/* Order Badge */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-left mb-4 space-y-2">
              <div className="flex justify-between text-xs text-stone-600 font-semibold">
                <span>Order ID:</span>
                <span className="text-amber-950 font-mono font-bold">#{completedOrder.id.slice(-5)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600 font-semibold">
                <span>Kitchen Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Received in Kitchen
                </span>
              </div>
              <div className="border-t border-amber-200/80 pt-2 flex justify-between text-sm font-extrabold text-amber-950">
                <span>Total Amount:</span>
                <span>NPR {completedOrder.total}</span>
              </div>
            </div>

            {/* WhatsApp Notification Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-5 flex items-center gap-3 text-left">
              <span className="text-2xl">💬</span>
              <p className="text-xs text-emerald-900 font-medium leading-tight">
                An official receipt has been sent to your <strong className="font-bold">WhatsApp</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-amber-950 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
