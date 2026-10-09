// Inside order/page.tsx
const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Save order to Firebase / Firestore DB
    const orderRef = await saveOrderToFirestore({
      customerName,
      customerPhone,
      cartItems,
      totalAmount,
      createdAt: new Date(),
    });

    // 2. Trigger WhatsApp API Route
    await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerPhone: customerPhone,
        customerName: customerName,
        orderId: orderRef.id,
        itemsSummary: cartItems.map((item) => `${item.name} x${item.quantity}`).join(', '),
        totalAmount: totalAmount,
      }),
    });

    // 3. Redirect or show confirmation modal
    alert('Order placed successfully! Check your WhatsApp for confirmation.');
  } catch (err) {
    console.error('Order submission error:', err);
  }
};
