'use client';

import { useEffect, useState } from 'react';
import { demoProducts, Product } from '@/data/products';

type CartItem = { sku: string; qty: number };
type Lead = { id: string; date: string; name: string; phone: string; email: string; source: string; interest: string; message: string; status: string };
type Order = { id: string; date: string; name: string; phone: string; email: string; customerType: string; location: string; payment: string; source: string; notes: string; items: { sku: string; name: string; qty: number }[]; orderStatus: string; paymentStatus: string; fulfillmentStatus: string };

const productKey = 'realights.products';
const cartKey = 'realights.cart';
const leadKey = 'realights.leads';
const orderKey = 'realights.orders';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
}
function write<T>(key: string, value: T) { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value)); }
function priceText(product: Product) { return product.priceMode === 'fixed' && product.price ? `₱${product.price.toLocaleString('en-PH')}` : 'Request quote'; }

export function Storefront({ page }: { page: 'home' | 'catalog' | 'checkout' }) {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [drawer, setDrawer] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = read<Product[]>(productKey, demoProducts);
    write(productKey, stored.length ? stored : demoProducts);
    setProducts(stored.length ? stored : demoProducts);
    setCart(read<CartItem[]>(cartKey, []));
  }, []);

  const active = products.filter((p) => p.status === 'active');
  const categories = ['All', ...Array.from(new Set(active.map((p) => p.category)))];
  const shown = active.filter((p) => (category === 'All' || p.category === category) && [p.sku, p.name, p.category, p.specs, p.series].join(' ').toLowerCase().includes(query.toLowerCase()));
  const lines = cart.map((item) => ({ ...item, product: products.find((p) => p.sku === item.sku) })).filter((x): x is CartItem & { product: Product } => Boolean(x.product));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  function saveCart(next: CartItem[]) { setCart(next); write(cartKey, next); }
  function add(sku: string) {
    const next = [...cart];
    const existing = next.find((x) => x.sku === sku);
    if (existing) existing.qty += 1; else next.push({ sku, qty: 1 });
    saveCart(next);
    setDrawer(true);
  }
  function qty(sku: string, amount: number) {
    const next = cart.map((x) => x.sku === sku ? { ...x, qty: amount } : x).filter((x) => x.qty > 0);
    saveCart(next);
  }
  function submitLead(form: FormData) {
    const lead: Lead = { id: `LEAD-${Date.now()}`, date: new Date().toISOString(), name: String(form.get('name') || ''), phone: String(form.get('phone') || ''), email: String(form.get('email') || ''), source: String(form.get('source') || 'Website'), interest: String(form.get('interest') || 'Solar quote'), message: String(form.get('message') || ''), status: 'New' };
    write(leadKey, [lead, ...read<Lead[]>(leadKey, [])]);
    setSuccess('Inquiry saved. Realights will contact the customer.');
  }
  function submitOrder(form: FormData) {
    if (!lines.length) { setSuccess('Please add products to cart first.'); return; }
    const order: Order = { id: `RLT-RFQ-${Date.now()}`, date: new Date().toISOString(), name: String(form.get('name') || ''), phone: String(form.get('phone') || ''), email: String(form.get('email') || ''), customerType: String(form.get('customerType') || 'Residential'), location: String(form.get('location') || ''), payment: String(form.get('payment') || 'Formal quotation first'), source: String(form.get('source') || 'Website'), notes: String(form.get('notes') || ''), items: lines.map((line) => ({ sku: line.sku, name: line.product.name, qty: line.qty })), orderStatus: 'Draft RFQ', paymentStatus: 'Unpaid', fulfillmentStatus: 'Not reserved' };
    write(orderKey, [order, ...read<Order[]>(orderKey, [])]);
    saveCart([]);
    setSuccess(`RFQ submitted: ${order.id}`);
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <article className="product">
      <div className="pimg"><img src={product.image} alt={product.name} /></div>
      <div className="body">
        <div className="chips"><span className="badge green">Realights</span><span className="badge">{product.category}</span><span className="badge gold">{product.stock > 0 ? `${product.stock} available` : 'Quote availability'}</span></div>
        <p className="summary" style={{ textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 11 }}>{product.series || product.category}</p>
        <h3>{product.name}</h3>
        <p className="summary">{product.description}</p>
        <p className="summary">{product.specs}</p>
        <div className="footer"><strong>{priceText(product)}</strong><button className="btn primary" onClick={() => add(product.sku)}>Add</button></div>
      </div>
    </article>
  );

  return <>
    <header className="top"><div className="wrap nav"><a className="brand" href="/"><span className="logo">R</span><span>Realights<small>Customer online store</small></span></a><nav className="links"><a href="/">Home</a><a href="/catalog">Catalog</a><a href="/checkout">Checkout</a><button className="primary" onClick={() => setDrawer(true)}>Cart {count}</button></nav></div></header>
    <main>
      {page === 'home' && <>
        <section className="hero"><div className="wrap heroGrid"><div className="heroMain"><div><span className="eyebrow">Realights solar store</span><h1>Clean energy products, ready for quotation.</h1><p className="lead">A separate public storefront for Realights with a clean product catalog, quote-first checkout, social media lead capture, and a separated backoffice.</p><div className="actions"><a className="btn primary" href="/catalog">Shop catalog</a><a className="btn" href="#lead">Ask for quote</a></div></div><div className="stats"><div className="stat"><strong>{active.length}</strong><span>products</span></div><div className="stat"><strong>{active.reduce((s,p)=>s+p.stock,0)}</strong><span>available stock</span></div><div className="stat"><strong>RFQ</strong><span>quote-first checkout</span></div><div className="stat"><strong>Safe</strong><span>manual import</span></div></div></div><div className="card media"><div><img src="/product-system.svg" alt="Solar products"/><h2>Realights product catalog</h2><p>Clean, no-logo product visuals are used for quotation workflows until final supplier media permissions and inventory files are approved.</p></div></div></div></section>
        <SupplierSection />
        <section className="section"><div className="wrap head"><div><h2>Featured solar products</h2><p className="lead">Selected products displayed with Realights quote-first ordering.</p></div><span className="pill">Customer view only</span></div><div className="wrap grid">{active.slice(0,6).map((p) => <ProductCard product={p} key={p.sku} />)}</div></section>
        <LeadForm onSubmit={submitLead} success={success} />
      </>}
      {page === 'catalog' && <section className="section"><div className="wrap head"><div><h2>Catalog</h2><p className="lead">Realights customer catalog with product series, product name, and key specifications.</p></div><span className="pill">{shown.length} products</span></div><div className="wrap toolbar"><div className="links">{categories.map((c) => <button className={c===category?'primary':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><input className="input search" placeholder="Search products, SKU, category, series" value={query} onChange={(e)=>setQuery(e.target.value)} /></div><div className="wrap grid">{shown.map((p)=><ProductCard product={p} key={p.sku}/>)}</div></section>}
      {page === 'checkout' && <Checkout lines={lines} onSubmit={submitOrder} success={success} />}
    </main>
    {drawer && <aside className="drawer"><div className="head"><h2>Cart</h2><button className="btn" onClick={()=>setDrawer(false)}>Close</button></div>{lines.length ? lines.map((line)=><div className="cartItem" key={line.sku}><img src={line.product.image} alt=""/><div><strong>{line.product.name}</strong><p className="summary">{line.product.category} • {line.product.sku}</p><div className="qty"><button onClick={()=>qty(line.sku,line.qty-1)}>-</button><span>{line.qty}</span><button onClick={()=>qty(line.sku,line.qty+1)}>+</button></div></div><button onClick={()=>qty(line.sku,0)}>Remove</button></div>) : <div className="empty">Cart is empty.</div>}<a className="btn primary" href="/checkout">Proceed to checkout</a></aside>}
  </>;
}

function SupplierSection() {
  return <section className="section"><div className="wrap card" style={{ padding: 24 }}><div className="head"><div><span className="eyebrow">Clean catalog mode</span><h2>No supplier logos shown</h2><p className="lead">The customer store now uses Realights branding and neutral product visuals. Supplier logos are removed from the visible storefront.</p></div><div className="stat"><strong>Realights</strong><span>main visible brand</span></div></div><div className="grid4"><div className="stat"><strong>Upload</strong><span>inventory reports</span></div><div className="stat"><strong>List</strong><span>active products</span></div><div className="stat"><strong>Capture</strong><span>leads and RFQs</span></div><div className="stat"><strong>Export</strong><span>reports and audits</span></div></div><p className="summary" style={{ marginTop: 14 }}>Product images can be replaced later with Realights-owned photos or supplier-approved no-logo media.</p></div></section>;
}

function LeadForm({ onSubmit, success }: { onSubmit: (form: FormData) => void; success: string }) {
  return <section id="lead" className="section"><div className="wrap card" style={{padding:24}}><span className="eyebrow">Lead gathering</span><h2>Get a solar quote</h2><form className="form" action={onSubmit}><input className="input" name="name" placeholder="Name" required/><input className="input" name="phone" placeholder="Phone" required/><input className="input" name="email" placeholder="Email"/><select className="input" name="source"><option>Website direct</option><option>Facebook Ads</option><option>Instagram Ads</option><option>TikTok Ads</option><option>Google Search</option><option>Messenger</option></select><select className="input" name="interest"><option>Home solar</option><option>Commercial solar</option><option>Battery backup</option><option>EV charging</option></select><textarea className="input full" name="message" placeholder="Project location, monthly bill, timeline, questions"/><button className="btn primary" type="submit">Submit inquiry</button></form>{success && <p className="notice">{success}</p>}</div></section>;
}

function Checkout({ lines, onSubmit, success }: { lines: (CartItem & { product: Product })[]; onSubmit: (form: FormData) => void; success: string }) {
  return <section className="section"><div className="wrap heroGrid"><div className="card" style={{padding:24}}><span className="eyebrow">Checkout / RFQ</span><h1>Request a quote.</h1><p className="lead">Creates a Draft RFQ for backoffice review. No live payment and no ERP deduction.</p><form className="form" action={onSubmit}><input className="input" name="name" placeholder="Customer name" required/><input className="input" name="phone" placeholder="Phone" required/><input className="input" name="email" placeholder="Email"/><select className="input" name="customerType"><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Dealer / reseller</option></select><input className="input full" name="location" placeholder="Project / delivery location" required/><select className="input" name="payment"><option>Formal quotation first</option><option>Bank transfer after approval</option><option>GCash/Maya after approval</option><option>Card after approval</option></select><select className="input" name="source"><option>Website direct</option><option>Facebook Ads</option><option>Instagram Ads</option><option>TikTok Ads</option><option>Google Search</option></select><textarea className="input full" name="notes" placeholder="Notes"/><button className="btn primary" type="submit">Submit RFQ</button></form>{success && <p className="notice">{success}</p>}</div><div className="card" style={{padding:24}}><h2>Order summary</h2>{lines.length ? lines.map((line)=><div className="cartItem" key={line.sku}><img src={line.product.image} alt=""/><div><strong>{line.product.name}</strong><p className="summary">{line.product.category} • {line.sku}</p></div><strong>x{line.qty}</strong></div>) : <div className="empty">Cart is empty.</div>}</div></div></section>;
}
