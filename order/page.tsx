"use client";
import { useState } from "react";
import { db } from "@/lib/firebase"; // your firebase file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MENU: any = {
"Chicken Chilly": 300, "Fry Sausage": 60, "Lemonade": 150,
"Chicken Steam Mo:Mo": 200, "Chicken Jhol Mo:Mo": 230, "Chicken Kothey Mo:Mo": 250,
"Veg & Paneer Steam Mo:Mo": 180, "Veg & Paneer Jhol Mo:Mo": 210, "Veg & Paneer Kothey Mo:Mo": 230,
"Normal Milk Tea": 40, "Honey Milk Tea": 55, "Masala Milk Tea": 65, "Normal Black Tea": 30,
"Lemon Tea": 35, "Masala Black Tea": 35, "Hot Lemon": 80, "Hot Lemon with Ginger Honey": 120,
"Cold Lemon Tea": 80, "Lemon Soda": 110, "Virgin Mojito": 150, "Mint Lemonade": 160, "Mocktail Mojito": 180
};

export default function OrderBot(){
const [msgs,setMsgs]=useState([{from:'bot', text:'Namaste! Welcome to Chiya SAN ☕ - Good Chiya + Good Food + Good People + Good Time! What would you like to order today? Eg: 1 chicken chilly, 1 lemonade'}]);
const [input,setInput]=useState('');
const [cart,setCart]=useState<any[]>([]);
const [step,setStep]=useState(1);
const [cust,setCust]=useState({name:'', phone:'', table:''});

const send = async()=>{
 if(!input) return;
 const txt = input; setMsgs(m=>[...m,{from:'user',text:txt}]); setInput('');

 // Parse order
 let lower = txt.toLowerCase();
 let found: any[] = [];
 for(let k in MENU) if(lower.includes(k.toLowerCase())) {
   let m = lower.match(new RegExp((\\d+)\\s*${k.toLowerCase()}));
   found.push({name:k, qty: m? parseInt(m[1]):1, price:MENU[k]});
 }
 if(found.length>0 && step===1){
   setCart(found);
   let total = found.reduce((a,b)=>a+b.price*b.qty,0);
   setMsgs(m=>[...m,{from:'bot', text:Perfect! 🙏\n\n${found.map(f=>${f.qty}x ${f.name} - Rs. ${f.price*f.qty}).join('\n')}\n\nGRAND TOTAL: Rs. ${total}\n\nPlease send your Name, Phone, and Table No (e.g. Prabhat, 98XXXXXXXX, T5)}]);
   setStep(2);
 } else if(step===2){
   const parts = txt.split(',');
   const name = parts[0]?.trim(); const phone = parts[1]?.trim(); const table = parts[2]?.trim()||"T?";
   let total = cart.reduce((a,b)=>a+b.price*b.qty,0);
   await addDoc(collection(db,"orders"),{customerName:name,customerPhone:phone,orderType:table,items:cart,totalAmount:total,status:"Pending",createdAt:serverTimestamp()});
   setMsgs(m=>[...m,{from:'bot', text:--- KITCHEN ORDER TICKET ---\nCustomer: ${name}\nPhone: ${phone}\nTable: ${table}\n\n${cart.map(c=>- ${c.qty}x ${c.name} - Rs. ${c.price*c.qty}).join('\n')}\n\nGRAND TOTAL: Rs. ${total}\n\n✅ Order sent to kitchen! Chiya ready huncha!}]);
   setStep(3);
 }
}
return (
<div className="max-w-md mx-auto h-screen flex flex-col bg-[#FFFBEB] p-4">
 <div className="bg-black text-white p-4 rounded-t-2xl">☕ Chiya SAN • Chakupat • Open till 8PM</div>
 <div className="flex-1 overflow-auto bg-white p-4 space-y-3">
  {msgs.map((m,i)=><div key={i} className={p-3 rounded-2xl text-sm ${m.from==='bot'?'bg-gray-100':'bg-black text-white ml-8'}} style={{whiteSpace:'pre-line'}}>{m.text}</div>)}
 </div>
 <div className="flex gap-2 p-2 bg-white rounded-b-2xl">
  <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 border rounded-full px-4 py-2" placeholder="Type order..." />
  <button onClick={send} className="bg-black text-white rounded-full px-6">Send</button>
 </div>
</div>
)
}
