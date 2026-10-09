import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerPhone, customerName, orderId, itemsSummary, totalAmount } = await request.json();

    if (!customerPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Format WhatsApp receipt message
    const messageText = 
      `🍵 *Chiya SAN - Order Confirmed!*\n\n` +
      `Hi ${customerName || 'Tea Lover'},\n` +
      `Your order *#${orderId.slice(-5)}* has been received at our Chakupat counter.\n\n` +
      `*Items:* ${itemsSummary}\n` +
      `*Total:* NPR ${totalAmount}\n\n` +
      `We'll message you here as soon as your order is fresh and ready!`;

    // Dispatch to Vextro Outbound REST API
    const vextroRes = await fetch('https://app.vextro.net/api/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VEXTRO_API_KEY}`,[cite: 18]
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: customerPhone, // Must be formatted with country code (e.g., +97798XXXXXXXX)
        type: 'text',
        text: messageText,
      }),
    });

    const data = await vextroRes.json();

    if (!vextroRes.ok) {
      return NextResponse.json({ error: 'Failed to dispatch WhatsApp message', details: data }, { status: vextroRes.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
