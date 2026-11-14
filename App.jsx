import React, { useMemo, useState } from "react";
import { Search, ShoppingBag, Plus, Minus, X, Globe2, Coffee, ChevronDown } from "lucide-react";
import { products } from "./products";

const categories = [
  ["all","All","الكل"],["hot-coffee","Hot Coffee","قهوة ساخنة"],
  ["iced-coffee","Iced Coffee","قهوة باردة"],["refreshers","Refreshers","ريفريشر"],
  ["smoothies","Smoothies","سموذي"],["matcha","Matcha","ماتشا"],
  ["frappe","Frappe","فرابيه"],["desserts","Desserts","حلويات"]
];

export default function App() {
  const [lang,setLang] = useState("en");
  const [category,setCategory] = useState("all");
  const [search,setSearch] = useState("");
  const [cart,setCart] = useState({});
  const [cartOpen,setCartOpen] = useState(false);
  const [note,setNote] = useState("");
  const [customer,setCustomer] = useState({name:"",phone:"",address:""});
  const ar = lang === "ar";
  const t = (en,arabic) => ar ? arabic : en;
  const visible = useMemo(() => products.filter(p =>
    (category==="all" || p.category===category) &&
    (!search || (p.name+" "+p.ar).toLowerCase().includes(search.toLowerCase()))
  ),[category,search]);
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  const total = products.reduce((s,p)=>s+p.price*(cart[p.id]||0),0);
  const add = id => setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const change = (id,delta) => setCart(c=>{const n={...c,[id]:Math.max(0,(c[id]||0)+delta)};if(!n[id])delete n[id];return n;});
  const money = n => `${n.toFixed(2)} JD`;
  const orderText = () => {
    const lines = products.filter(p=>cart[p.id]).map(p=>`${p.name} x${cart[p.id]} - ${money(p.price*cart[p.id])}`).join("\n");
    return `DRP Coffee order\n${lines}\nTotal: ${money(total)}\nNote: ${note}\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}`;
  };
  const sendOrder = () => {
    if (!count) return;
    if (!customer.name.trim() || !customer.phone.trim()) { alert(t("Please enter your name and phone number.","يرجى إدخال الاسم ورقم الهاتف.")); return; }
    // Demo only: no order is submitted or stored yet.
    navigator.clipboard?.writeText(orderText()).then(()=>alert(t("Order summary copied. Online order submission will be connected after Supabase setup.","تم نسخ ملخص الطلب. سيتم تفعيل إرسال الطلب بعد ربط قاعدة البيانات."))).catch(()=>alert(orderText()));
  };

  return <div className="app" dir={ar?"rtl":"ltr"}>
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">DRP</span><span className="brand-sub">COFFEE BAR</span></a>
      <div className="top-actions">
        <button className="language" onClick={()=>setLang(ar?"en":"ar")}><Globe2 size={16}/>{ar?"English":"العربية"}</button>
        <button className="cart-button" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/><span>{t("Cart","السلة")}</span><b>{count}</b></button>
      </div>
    </header>

    <section className="hero">
      <div className="hero-glow"/>
      <div className="hero-copy">
        <span className="eyebrow">{t("YOUR DAILY COFFEE MOMENT","لحظتك اليومية مع القهوة")}</span>
        <h1>{t("A little joy in every sip.","متعة صغيرة في كل رشفة.")}</h1>
        <p>{t("Explore the DRP menu and order your favorites.","اكتشف منيو DRP واطلب مشروباتك المفضلة.")}</p>
        <button className="primary" onClick={()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"})}>{t("Explore menu","تصفح المنيو")} <span>↘</span></button>
      </div>
      <div className="hero-orb"><Coffee size={74} strokeWidth={1}/><span>DRP</span></div>
    </section>

    <main id="menu" className="menu-section">
      <div className="section-heading">
        <div><span className="eyebrow">{t("MADE FOR YOUR MOOD","على مزاجك")}</span><h2>{t("Our Menu","منيو DRP")}</h2></div>
        <label className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("Search menu...","ابحث في المنيو...")}/></label>
      </div>
      <div className="category-row">
        {categories.map(([id,en,arName])=><button key={id} className={category===id?"category active":"category"} onClick={()=>setCategory(id)}>{t(en,arName)}</button>)}
      </div>
      <div className="product-grid">
        {visible.map(p=><article className="product-card" key={p.id}>
          <div className="product-visual"><div className="cup-art"><span>DRP</span><i/></div><span className="product-tag">{t(categories.find(c=>c[0]===p.category)?.[1]||"DRP",categories.find(c=>c[0]===p.category)?.[2]||"DRP")}</span></div>
          <div className="product-info"><div><h3>{ar?p.ar:p.name}</h3><p>{ar?p.name:p.ar}</p></div><strong>{money(p.price)}</strong></div>
          <button className="add-button" onClick={()=>add(p.id)}>{(cart[p.id]||0)>0?<><span>{cart[p.id]} {t("added","مضاف")}</span><Plus size={16}/></>:<><Plus size={17}/>{t("Add","أضف")}</>}</button>
        </article>)}
      </div>
      {visible.length===0 && <div className="empty">{t("No items found.","لا توجد أصناف مطابقة.")}</div>}
    </main>

    {count>0 && <button className="sticky-cart" onClick={()=>setCartOpen(true)}><span><ShoppingBag size={19}/>{t("View order","عرض الطلب")} · {count} {t("items","أصناف")}</span><b>{money(total)}</b></button>}

    {cartOpen && <div className="overlay" onClick={()=>setCartOpen(false)}>
      <aside className="cart-panel" onClick={e=>e.stopPropagation()}>
        <div className="cart-head"><div><span className="eyebrow">{t("YOUR SELECTION","اختياراتك")}</span><h2>{t("Your order","طلبك")}</h2></div><button className="icon-btn" onClick={()=>setCartOpen(false)}><X/></button></div>
        <div className="cart-items">
          {products.filter(p=>cart[p.id]).map(p=><div className="cart-line" key={p.id}><div><b>{ar?p.ar:p.name}</b><small>{money(p.price)} · {money(p.price*cart[p.id])}</small></div><div className="qty"><button onClick={()=>change(p.id,-1)}><Minus size={14}/></button><b>{cart[p.id]}</b><button onClick={()=>change(p.id,1)}><Plus size={14}/></button></div></div>)}
          {!count && <p className="empty">{t("Your cart is empty.","السلة فارغة.")}</p>}
        </div>
        <label className="field">{t("Order note","ملاحظات الطلب")}<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t("Any special request?","هل لديك أي ملاحظات؟")}/></label>
        <div className="checkout-fields">
          <label className="field">{t("Name","الاسم")}<input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label>
          <label className="field">{t("Phone","رقم الهاتف")}<input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label>
          <label className="field">{t("Delivery address (optional)","عنوان التوصيل (اختياري)")}<input value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})}/></label>
        </div>
        <div className="total-row"><span>{t("Total","الإجمالي")}</span><b>{money(total)}</b></div>
        <button className="primary full" disabled={!count} onClick={sendOrder}>{t("Prepare order","تجهيز الطلب")} <span>→</span></button>
        <p className="demo-note">{t("Preview version: order submission is not connected yet.","نسخة تجريبية: إرسال الطلبات غير مفعّل بعد.")}</p>
      </aside>
    </div>}
    <footer><span className="brand-mark">DRP</span><p>COFFEE BAR · {t("MADE WITH CARE","صُنع بحب")}</p></footer>
  </div>;
}