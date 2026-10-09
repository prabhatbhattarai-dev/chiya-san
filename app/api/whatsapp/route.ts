import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerPhone, customerName, orderId, itemsSummary, totalAmount } = await request.json();

    if (!customerPhone) {
      return NextResponse.json({ error: 'Customer phone number is required' }, { status: 400 });
    }

    // Receipt message formatting
    const messageText =
      `🍵 *Chiya SAN - Order Confirmed!*\n\n` +
      `Hi ${customerName || 'Tea Lover'},\n` +
      `Your order *#${orderId.slice(-5)}* has been received at our Chakupat counter.\n\n` +
      `*Items:* ${itemsSummary}\n` +
      `*Total:* NPR ${totalAmount}\n\n` +
      `We will notify you here as soon as your order is ready!`;

    // Dispatch to Vextro Outbound REST API
    const vextroRes = await fetch('https://app.vextro.net/api/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VEXTRO_API_KEY}`,[cite: 18]
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: customerPhone,
        type: 'text',
        text: messageText,
      }),
    });

    const data = await vextroRes.json();

    if (!vextroRes.ok) {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message via Vextro', details: data },
        { status: vextroRes.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
