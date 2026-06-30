export type Product = {
  sku:string;
  name:string;
  brand?:string;
  supplier?:string;
  category:string;
  series?:string;
  specs:string;
  description:string;
  image:string;
  sourceUrl?:string;
  stock:number;
  status:'active'|'inactive';
  priceMode:'request_quote'|'fixed';
  price?:number;
};

export const demoProducts: Product[] = [
  { sku:'RLT-PV-460', name:'460W TOPCon All-Black Solar Panel', category:'Solar Panels', series:'N-Type TOPCon Module', specs:'460W | N-Type TOPCon | All-black | Residential / Commercial', description:'Clean all-black solar module for residential and commercial installations. Listed by Realights as a quote-first product pending current inventory upload.', image:'/product-solar-panel.svg', stock:0, status:'active', priceMode:'request_quote' },
  { sku:'RLT-PV-730', name:'730W HJT Bifacial Double Glass Solar Panel', category:'Solar Panels', series:'N-Type HJT Module', specs:'730W | HJT | Bifacial | Double glass | Utility scale', description:'High-output HJT bifacial module for larger solar projects and high-efficiency system designs.', image:'/product-solar-panel.svg', stock:0, status:'active', priceMode:'request_quote' },
  { sku:'RLT-BAT-200', name:'51.2V 200Ah LiFePO4 Wall-Mounted Battery', category:'Lithium Battery', series:'Residential BESS', specs:'51.2V | 200Ah | LiFePO4 | Smart BMS | Home storage', description:'Wall-mounted lithium battery for backup power, solar energy storage, and residential energy systems.', image:'/product-battery.svg', stock:0, status:'active', priceMode:'request_quote' },
  { sku:'RLT-INV-6K', name:'6KW 48V Single Phase Hybrid Solar Inverter', category:'Solar Inverter', series:'Hybrid Inverter', specs:'6KW | 48V | Single phase | Hybrid | Residential', description:'Hybrid inverter for solar, battery, backup power, and quote-based residential energy packages.', image:'/product-inverter.svg', stock:0, status:'active', priceMode:'request_quote' },
  { sku:'RLT-SYS-4K', name:'4.2kW Solar Power System with 5.32kWh Battery', category:'Solar Power System', series:'Residential Solar Energy System', specs:'4.2kW | 5.32kWh battery | Home package | Quote-first', description:'Residential solar package concept for homes and small businesses. Final design, stock, and pricing must be confirmed by Realights.', image:'/product-system.svg', stock:0, status:'active', priceMode:'request_quote' },
  { sku:'RLT-EV-DC', name:'Portable DC EV Charging Station with Energy Storage', category:'PV Accessories', series:'EV Charger', specs:'Portable DC charger | Energy storage | EV charging | Solar-ready', description:'Advanced EV charging product category for solar-powered charging station projects and commercial inquiries.', image:'/product-ev.svg', stock:0, status:'active', priceMode:'request_quote' }
];
