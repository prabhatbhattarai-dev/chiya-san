import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.VEXTRO_API_KEY;

    if (!apiKey) {
      console.error('VEXTRO_API_KEY is missing from environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing VEXTRO_API_KEY' },
        { status: 500 }
      );
    }

    const { customerPhone, customerName, orderId, itemsSummary, totalAmount, orderType } = await request.json();

    if (!customerPhone) {
      return NextResponse.json(
        { error: 'Customer phone number is required' },
        { status: 400 }
      );
    }

    // Sanitize phone number to digits only
    let formattedPhone = customerPhone.replace(/\D/g, '');

    // Auto-prepend Nepal country code (977) if standard 10-digit number starting with 9
    if (formattedPhone.length === 10 && formattedPhone.startsWith('9')) {
      formattedPhone = '977' + formattedPhone;
    }

    // Branded WhatsApp receipt text
    const messageText =
      `🍵 *Chiya SAN - Order Confirmed!*\n\n` +
      `Hi ${customerName || 'Valued Customer'},\n` +
      `Thank you for ordering with us! Your order *#${orderId.slice(-5)}* has been sent to our kitchen.\n\n` +
      `*Order Type:* ${orderType || 'Dine-in'}\n` +
      `*Items:* ${itemsSummary}\n` +
      `*Total Amount:* NPR ${totalAmount}\n\n` +
      `We'll notify you right here as soon as your order is ready at our Chakupat counter!`;

    // Dispatch message via Vextro REST API
    const vextroRes = await fetch('https://app.vextro.net/api/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        type: 'text',
        text: messageText,
      }),
    });

    const responseData = await vextroRes.json();

    if (!vextroRes.ok) {
      console.error('Vextro API error:', responseData);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message via Vextro', details: responseData },
        { status: vextroRes.status }
      );
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error('Internal API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
