<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Chiya SAN Bot</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#FFFBEB] p-4">
<div class="max-w-md mx-auto bg-white rounded-3xl shadow-xl flex flex-col h-[90vh]">
<div class="bg-black text-white p-4 rounded-t-3xl">
<h1 class="font-bold">☕ Chiya SAN</h1>
<p class="text-xs opacity-70">Chakupat • Open till 8PM • +977 970-9085103</p>
</div>
<div id="chat" class="flex-1 overflow-y-auto p-4 space-y-3 text-sm"></div>
<div class="p-3 border-t flex gap-2">
<input id="input" class="flex-1 border rounded-full px-4 py-2" placeholder="Type your order..." />
<button onclick="send()" class="bg-black text-white rounded-full px-5">Send</button>
</div>
</div>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyB8XHVv0U4GtdnI3U26C10fpGDpnELSdg", authDomain: "chiya-san-orders.firebaseapp.com", projectId: "chiya-san-orders", messagingSenderId: "171390546624", appId: "1:171390546624:web:58120d6d4cb7c2e667f325" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MENU = {
"chicken chilly": 300, "fry sausage": 60, "lemonade": 150,
"chicken steam momo": 200, "chicken jhol momo": 230, "chicken kothey momo": 250,
"veg & paneer steam momo": 180, "veg & paneer jhol momo": 210, "veg & paneer kothey momo": 230,
"normal milk tea": 40, "honey milk tea": 55, "masala milk tea": 65, "normal black tea": 30, "lemon tea": 35, "masala black tea": 35, "hot lemon": 80, "hot lemon with ginger honey": 120,
"panga set": 250, "chicken nuggets": 300, "wai-wai sadeko": 100, "sausage wai-wai sadeko": 180, "veg sandwich": 180, "chicken sandwich": 250, "french fries": 180, "spicy fries": 200, "chicken drumsticks": 300, "boiled sausage": 60, "sausage sadeko": 340, "bread omelette": 130,
"cold lemon tea": 80, "lemon soda": 110, "masala coke": 130, "lemon sprite": 130, "virgin mojito": 150, "mint lemonade": 160, "mocktail mojito": 180, "chocolate milkshake": 250, "oreo milkshake": 280, "plain lassi": 100, "banana lassi": 200, "iced americano": 180, "iced milk coffee": 200,
"peanut macarons": 25, "choco chips cookies": 50, "vanilla ice cream": 150, "strawberry ice cream": 150, "chocolate ice cream": 150
};

let cart = [];
let stage = "greet";
let customer = {name:"", phone:"", type:""};

function addMsg(who, text){
  const c = document.getElementById('chat');
  c.innerHTML += <div class="${who=='bot'?'bg-gray-100':'bg-black text-white ml-10'} p-3 rounded-2xl">${text}</div>;
  c.scrollTop = c.scrollHeight;
}

window.onload = () => {
  addMsg('bot', Namaste! Welcome to Chiya SAN ☕<br>Good Chiya + Good Food + Good People + Good Time!<br><br>We are at Chakupat Saraswoti Marg, near Patan Durbar Square. Bamboo seating, rooftop, board games (Jenga, Uno, Chess). Open till 8 PM.<br><br><b>What would you like to order today?</b><br>Example: "1 chicken chilly, 1 fry sausage, 1 lemonade");
};

window.send = async () => {
  let txt = document.getElementById('input').value.trim();
  if(!txt) return;
  addMsg('user', txt);
  document.getElementById('input').value = "";

  // simple parsing for your order: "1 plate chicken chilly 1 plate fry sausage 1 glass lemonade"
  let lower = txt.toLowerCase();
  if(stage === "greet"){
    // find menu items
    for(let item in MENU){
      if(lower.includes(item)){
        let qtyMatch = lower.match(new RegExp((\\d+)\\s*(?:plate|glass)?\\s*${item}));
        let qty = qtyMatch? parseInt(qtyMatch[1]) : 1;
        cart.push({name: item, qty, price: MENU[item]});
      }
    }
    if(cart.length > 0){
      let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
      let summary = cart.map(i=>• ${i.qty}x ${i.name} - Rs. ${i.price*i.qty}).join('<br>');
      addMsg('bot', Perfect! 🙏<br><br><b>Your Order:</b><br>${summary}<br><br><b>GRAND TOTAL: Rs. ${total}</b><br><br>Is this correct? And please tell me:<br>1. Your <b>Name</b><br>2. <b>Phone</b><br>3. Is it <b>Dine-in (Table No?), Pickup, or Delivery?</b>);
      stage = "details";
    } else {
      addMsg('bot', Got it! Could you tell me item names exactly from menu? Like "Chicken Chilly, Fry Sausage, Lemonade"?);
    }
  } else if(stage === "details"){
    customer.name = txt; // Simplified - in real bot we parse all 3
    addMsg('bot', Thank you ${txt}! Please send your phone number and Table No / Address in one message.<br>Example: "98XXXXXXXX, Table T5");
    stage = "final";
  } else if(stage === "final"){
    // Save to Firebase -> Shows on your Kitchen Dashboard!
    let parts = txt.split(',');
    customer.phone = parts[0] || txt;
    customer.type = parts[1] || "Dine-in";
    let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

    await addDoc(collection(db, "orders"), {
      customerName: customer.name,
      customerPhone: customer.phone,
      orderType: customer.type,
      items: cart,
      totalAmount: total,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    let ticket = --- KITCHEN ORDER TICKET ---<br>Customer Name: ${customer.name}<br>Phone: ${customer.phone}<br>Order Type: ${customer.type}<br><br>Items:<br>${cart.map(i=>- ${i.qty}x ${i.name} - Rs. ${i.price*i.qty}).join('<br>')}<br><br>GRAND TOTAL: Rs. ${total}<br>------------------------------;
    addMsg('bot', ✅ Order Confirmed! Chiya ready huncha! ☕<br><br>${ticket}<br><br>Your order is sent to kitchen. Dhanyabad! See you at Chiya SAN!);
    stage = "done";
  }
};
</script>
</body>
</html>
