export function AdminPortal({ section }: { section: string }) {
  const title: Record<string, string> = {
    dashboard: 'Backoffice dashboard',
    orders: 'Orders and RFQs',
    inventory: 'Inventory and product listings',
    imports: 'Inventory imports',
    leads: 'Leads and social ads',
    audits: 'Inventory audits',
    reports: 'Reports and exports',
    settings: 'Store settings',
  };

  return (
    <>
      <header className="top">
        <div className="wrap nav">
          <a className="brand" href="/admin"><span className="logo">R</span><span>Realights<small>Backoffice portal</small></span></a>
          <nav className="links"><a href="/" target="_blank">Open customer store</a><span className="pill">Admin only</span></nav>
        </div>
      </header>
      <main className="wrap admin">
        <aside className="card side">
          <span className="eyebrow">Backoffice</span>
          <a className={section === 'dashboard' ? 'primary' : ''} href="/admin">Dashboard</a>
          <a className={section === 'orders' ? 'primary' : ''} href="/admin/orders">Orders</a>
          <a className={section === 'inventory' ? 'primary' : ''} href="/admin/inventory">Inventory</a>
          <a className={section === 'imports' ? 'primary' : ''} href="/admin/imports">Imports</a>
          <a className={section === 'leads' ? 'primary' : ''} href="/admin/leads">Leads & ads</a>
          <a className={section === 'audits' ? 'primary' : ''} href="/admin/audits">Audits</a>
          <a className={section === 'reports' ? 'primary' : ''} href="/admin/reports">Reports</a>
          <a className={section === 'settings' ? 'primary' : ''} href="/admin/settings">Settings</a>
        </aside>
        <section className="card" style={{ padding: 24 }}>
          <span className="eyebrow">Manual import mode</span>
          <h1>{title[section] || 'Backoffice'}</h1>
          <p className="lead">This is the separated admin area. Customer-facing store routes are separate from admin routes.</p>
          {section === 'dashboard' && <Dashboard />}
          {section === 'orders' && <Orders />}
          {section === 'inventory' && <Inventory />}
          {section === 'imports' && <Imports />}
          {section === 'leads' && <Leads />}
          {section === 'audits' && <Audits />}
          {section === 'reports' && <Reports />}
          {section === 'settings' && <Settings />}
        </section>
      </main>
    </>
  );
}

function Dashboard() {
  return <><div className="grid4"><div className="stat"><strong>Manual</strong><span>inventory mode</span></div><div className="stat"><strong>RFQ</strong><span>ordering flow</span></div><div className="stat"><strong>CSV</strong><span>reports</span></div><div className="stat"><strong>Safe</strong><span>no ERP sync</span></div></div><p className="notice">The existing Realights ERP/dashboard is not connected or modified.</p></>;
}
function Orders() { return <div className="table"><table><thead><tr><th>Feature</th><th>Status</th></tr></thead><tbody><tr><td>Draft RFQ orders</td><td>Ready</td></tr><tr><td>Order modification</td><td>Planned for database phase</td></tr><tr><td>Cancellation tracking</td><td>Planned for database phase</td></tr></tbody></table></div>; }
function Inventory() { return <div className="table"><table><thead><tr><th>Area</th><th>Purpose</th></tr></thead><tbody><tr><td>Product listings</td><td>Show active products in customer store</td></tr><tr><td>Manual stock</td><td>Updated from inventory import</td></tr></tbody></table></div>; }
function Imports() { return <><p className="notice">Upload current inventory CSV here in the production database phase. This prototype is already structured for manual import mode.</p><input className="input" type="file" accept=".csv" /></>; }
function Leads() { return <div className="table"><table><thead><tr><th>Lead source</th><th>Use</th></tr></thead><tbody><tr><td>Facebook / Instagram / TikTok / Google</td><td>Track social media advertising inquiries</td></tr><tr><td>Website direct</td><td>Track organic quote requests</td></tr></tbody></table></div>; }
function Audits() { return <p className="notice">Audit reports are separated from customer-facing pages and will be exported for review.</p>; }
function Reports() { return <div className="grid4"><button className="btn primary">Inventory report</button><button className="btn primary">Orders report</button><button className="btn primary">Leads report</button><button className="btn primary">Audit report</button></div>; }
function Settings() { return <p className="notice">Mode: manual_import. Customer routes: /, /catalog, /checkout. Admin routes: /admin and subpages.</p>; }
