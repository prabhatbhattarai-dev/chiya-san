import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.VEXTRO_API_KEY;
    // Reads admin phone from Vercel env or falls back to your configured number
    const adminPhoneRaw = process.env.ADMIN_WHATSAPP_NUMBER || '9779765566682';

    if (!apiKey) {
      console.error('VEXTRO_API_KEY missing from environment variables');
      return NextResponse.json(
        { error: 'Server Configuration Error: Missing VEXTRO_API_KEY' },
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

    // 1. Sanitize customer phone number (digits only)
    let formattedCustomerPhone = customerPhone.replace(/\D/g, '');
    if (formattedCustomerPhone.length === 10 && formattedCustomerPhone.startsWith('9')) {
      formattedCustomerPhone = '977' + formattedCustomerPhone;
    }

    // 2. Sanitize admin phone number
    let formattedAdminPhone = adminPhoneRaw.replace(/\D/g, '');
    if (formattedAdminPhone.length === 10 && formattedAdminPhone.startsWith('9')) {
      formattedAdminPhone = '977' + formattedAdminPhone;
    }

    // 3. Customer Receipt Message
    const customerMessageText =
      `🍵 *Chiya SAN - Order Confirmed!*\n\n` +
      `Hi ${customerName || 'Valued Customer'},\n` +
      `Your order *#${orderId.slice(-5)}* has been received at our kitchen.\n\n` +
      `*Order Type:* ${orderType || 'Dine-in'}\n` +
      `*Items:* ${itemsSummary}\n` +
      `*Total Amount:* NPR ${totalAmount}\n\n` +
      `We will notify you right here as soon as it's ready at our Chakupat counter!`;

    // 4. Admin / Kitchen Alert Message
    const adminMessageText =
      `🚨 *NEW WEB ORDER RECEIVED!*\n\n` +
      `*Order ID:* #${orderId.slice(-5)}\n` +
      `*Customer:* ${customerName}\n` +
      `*Phone:* +${formattedCustomerPhone}\n` +
      `*Type:* ${orderType}\n\n` +
      `*ITEMS TO PREPARE:*\n` +
      `${itemsSummary.split(', ').map((item: string) => `• ${item}`).join('\n')}\n\n` +
      `*Total Bill:* NPR ${totalAmount}`;

    // 5. Fire both API dispatches simultaneously
    const [customerRes, adminRes] = await Promise.all([
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
      fetch('https://app.vextro.net/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedAdminPhone,
          type: 'text',
          text: adminMessageText,
        }),
      }),
    ]);

    const customerData = await customerRes.json();
    const adminData = await adminRes.json();

    if (!customerRes.ok) {
      console.error('Customer WhatsApp failed:', customerData);
    }
    if (!adminRes.ok) {
      console.error('Admin WhatsApp failed:', adminData);
    }

    return NextResponse.json({
      success: true,
      customerResult: customerData,
      adminResult: adminData,
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
