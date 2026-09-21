import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MENU: any = {"Chicken Chilly":300,"Fry Sausage":60,"Lemonade":150,"Chicken Steam Mo:Mo":200,"Chicken Jhol Mo:Mo":230,"Normal Milk Tea":40,"Normal Black Tea":30,"Mint Lemonade":160,"Virgin Mojito":150,"French Fries":180};

const VERIFY_TOKEN = "chiya_san_123";

export async function GET(req: NextRequest){
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");
  if(mode==="subscribe" && token===VERIFY_TOKEN) return new NextResponse(challenge);
  return new NextResponse("Forbidden", {status:403});
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if(!msg) return NextResponse.json({ok:true});

  const from = msg.from;
  const text = msg.text?.body?.toLowerCase() || "";
  const phoneId = body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  const token = process.env.WHATSAPP_TOKEN!;

  let reply = "";

  if(text.includes("hi") || text.includes("menu") || text.includes("namaste")){
    reply = Namaste! Welcome to Chiya SAN ☕\n\n📍 Chakupat, Lalitpur (near Patan Durbar Square)\n🕗 Open till 8PM\n🎲 Board Games, Rooftop, Bamboo seating\n\n*Our Menu:*\nMo:Mo from Rs.180\nChiya from Rs.30\nChicken Chilly Rs.300\nFry Sausage Rs.60\nLemonade Rs.150\n\nWhat would you like to order? Just type: "1 chicken chilly, 1 lemonade";
  } else {
    // Simple order parser
    let cart:any[]=[]; let total=0;
    for(let k in MENU) if(text.includes(k.toLowerCase())){
      let m=text.match(new RegExp((\\d+)\\s*${k.toLowerCase()}));
      let qty=m?parseInt(m[1]):1;
      cart.push({name:k, qty, price:MENU[k]}); total+=MENU[k]*qty;
    }
    if(cart.length>0){
      await addDoc(collection(db,"orders"),{
        customerName: from, customerPhone: from, orderType: "WhatsApp",
        items: cart, totalAmount: total, status:"Pending", createdAt: serverTimestamp()
      });
      reply = Perfect! 🙏\n\n*Your Order:*\n${cart.map(c=>• ${c.qty}x ${c.name} - Rs. ${c.price*c.qty}).join('\n')}\n\n*GRAND TOTAL: Rs. ${total}*\n\n✅ Confirmed! Order sent to kitchen.\n\n--- KITCHEN ORDER TICKET ---\nPhone: ${from}\nType: WhatsApp\n${cart.map(c=>- ${c.qty}x ${c.name}).join('\n')}\nTotal: Rs.${total}\n\nChiya ready huncha! ☕;
    } else {
      reply = I didn't catch that. Please order like: "1 chicken chilly, 1 fry sausage, 1 lemonade"\nOr type "menu";
    }
  }

  await fetch(https://graph.facebook.com/v20.0/${phoneId}/messages,{
    method:"POST",
    headers:{Authorization:Bearer ${token},"Content-Type":"application/json"},
    body: JSON.stringify({messaging_product:"whatsapp", to: from, text:{body: reply}})
  });

  return NextResponse.json({ok:true});
}
