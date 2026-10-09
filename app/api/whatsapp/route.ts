import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.VEXTRO_API_KEY;
    // Set your Admin / Kitchen WhatsApp phone number here or in Vercel env vars
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '9779863263690'; 

    if (!apiKey) {
      console.error('VEXTRO_API_KEY missing');
      return NextResponse.json({ error: 'Missing VEXTRO_API_KEY' }, { status: 500 });
    }

    const { customerPhone, customerName, orderId, itemsSummary, totalAmount, orderType } = await request.json();

    // 1. Format & sanitize customer phone number
    let formattedCustomerPhone = customerPhone.replace(/\D/g, '');
    if (formattedCustomerPhone.length === 10 && formattedCustomerPhone.startsWith('9')) {
      formattedCustomerPhone = '977' + formattedCustomerPhone;
    }

    // 2. Customer Receipt Text
    const customerMessageText =
      `🍵 *Chiya SAN - Order Confirmed!*\n\n` +
      `Hi ${customerName || 'Valued Customer'},\n` +
      `Your order *#${orderId.slice(-5)}* has been received at our kitchen.\n\n` +
      `*Order Type:* ${orderType || 'Dine-in'}\n` +
      `*Items:* ${itemsSummary}\n` +
      `*Total Amount:* NPR ${totalAmount}\n\n` +
      `We will notify you here when it is ready!`;

    // 3. Admin / Kitchen Alert Text
    const adminMessageText =
      `🚨 *NEW WEB ORDER RECEIVED!*\n\n` +
      `*Order ID:* #${orderId.slice(-5)}\n` +
      `*Customer Name:* ${customerName}\n` +
      `*Customer Phone:* +${formattedCustomerPhone}\n` +
      `*Order Type:* ${orderType}\n\n` +
      `*ITEMS TO PREPARE:*\n` +
      `${itemsSummary.split(', ').map((item: string) => `• ${item}`).join('\n')}\n\n` +
      `*Total Bill:* NPR ${totalAmount}`;

    // 4. Send BOTH WhatsApp messages in parallel
    const [customerRes, adminRes] = await Promise.all([
      // Message 1: To Customer
      fetch('https://app.vextro.net/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedCustomerPhone,
          type: 'text',
          text: customerMessageText,
        }),
      }),
      // Message 2: To Admin / Kitchen
      fetch('https://app.vextro.net/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminPhone,
          type: 'text',
          text: adminMessageText,
        }),
      }),
    ]);

    const customerData = await customerRes.json();
    const adminData = await adminRes.json();

    return NextResponse.json({
      success: true,
      customerNotification: customerData,
      adminNotification: adminData,
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
