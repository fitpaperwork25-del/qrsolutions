// ─── BUSINESS CONFIG ─────────────────────────────────────────────────────────
// In production these are loaded from Supabase `businesses` + `services` tables.
// This file serves as the local config / fallback.

export const BUSINESSES = {
  "blade-co": {
    id: "blade-co", name: "BLADE & CO.", tagline: "Precision cuts. No wait.",
    type: "Barbershop", mode: "book",
    accent: "#E8C547", bg: "#0D0D0D", surface: "#161616", text_color: "#F0EDE8",
  },
  komo: {
    id: "komo", name: "KOMO", tagline: "Japanese street fare.",
    type: "Restaurant", mode: "order",
    accent: "#FF5C3A", bg: "#0A0A0A", surface: "#141414", text_color: "#F5F2EE",
  },
  drift: {
    id: "drift", name: "DRIFT", tagline: "Slow roast. Fast pickup.",
    type: "Coffee Shop", mode: "order",
    accent: "#7EC8A4", bg: "#0F0E0C", surface: "#181614", text_color: "#EDE9E3",
  },
  "snelling": {
    id: "snelling", name: "SNELLING CAFE", tagline: "East African & American fare.",
    type: "Restaurant", mode: "order",
    accent: "#C8973A", bg: "#0C0A08", surface: "#161410", text_color: "#F2EDE6",
  },
};

export const SERVICES = {
  "blade-co": [
    { id: "s1", name: "Classic Cut",     description: "Scissor or clipper cut",       price: 35, duration_min: 30 },
    { id: "s2", name: "Fade",            description: "Low, mid or high fade",         price: 40, duration_min: 35 },
    { id: "s3", name: "Cut + Beard",     description: "Full groom package",            price: 55, duration_min: 50 },
    { id: "s4", name: "Hot Towel Shave", description: "Traditional straight razor",    price: 45, duration_min: 40 },
    { id: "s5", name: "Beard Sculpt",    description: "Shape and define",              price: 25, duration_min: 20 },
  ],
  komo: [
    { id: "m1", name: "Tonkotsu Ramen",    description: "Rich pork broth, chashu, soft egg", price: 18, category: "Mains" },
    { id: "m2", name: "Spicy Miso Ramen",  description: "Togarashi, corn, bamboo shoots",    price: 17, category: "Mains" },
    { id: "m3", name: "Gyoza (6pc)",       description: "Pan-fried pork & cabbage",           price: 9,  category: "Starters" },
    { id: "m4", name: "Karaage",           description: "Crispy fried chicken, kewpie",       price: 12, category: "Starters" },
    { id: "m5", name: "Matcha Soft Serve", description: "Ceremonial grade matcha",            price: 7,  category: "Desserts" },
    { id: "m6", name: "Ramune",            description: "Strawberry / Original",              price: 4,  category: "Drinks" },
    { id: "m7", name: "Sapporo Draft",     description: "500ml",                              price: 8,  category: "Drinks" },
  ],
  drift: [
    { id: "c1", name: "Filter Coffee", description: "Single origin pour over",     price: 5,   category: "Hot" },
    { id: "c2", name: "Flat White",    description: "Double ristretto, microfoam", price: 6,   category: "Hot" },
    { id: "c3", name: "Cortado",       description: "Equal parts espresso & milk", price: 5.5, category: "Hot" },
    { id: "c4", name: "Cold Brew",     description: "18hr steeped, served black",  price: 6.5, category: "Cold" },
    { id: "c5", name: "Iced Latte",    description: "Espresso, oat milk, ice",     price: 7,   category: "Cold" },
    { id: "c6", name: "Banana Bread",  description: "Toasted, house butter",       price: 5,   category: "Food" },
  ],
  "snelling": [
    // Salads
    { id: "sn1",  name: "Avocado Salad",   description: "Fresh avocado salad",                                           price: 12.50, category: "Salads" },
    { id: "sn2",  name: "Chicken Salad",   description: "Grilled chicken salad",                                         price: 12.50, category: "Salads" },
    { id: "sn3",  name: "Fish Salad",      description: "Fresh fish salad",                                              price: 13.65, category: "Salads" },
    { id: "sn4",  name: "Greek Salad",     description: "Classic Greek salad",                                           price: 11.85, category: "Salads" },
    { id: "sn5",  name: "House Salad",     description: "Fresh house salad, vegetarian",                                 price: 11.55, category: "Salads" },
    // Sandwiches & Wraps
    { id: "sn6",  name: "Chicken Sandwich", description: "Marinated chicken breast with garlic, ginger & special spices, served on French bread", price: 11.50, category: "Sandwiches" },
    { id: "sn7",  name: "Cheeseburger",    description: "Beef patty, lettuce, tomato, onion, cheese, mayo and fries",   price: 11.50, category: "Sandwiches" },
    { id: "sn8",  name: "Hamburger",       description: "Beef patty, lettuce, tomato, onion and mayo with fries",       price: 10.45, category: "Sandwiches" },
    { id: "sn9",  name: "Gyro Wrap",       description: "Sliced lamb, tomato, onion, lettuce, cucumber sauce, pita",    price: 12.99, category: "Sandwiches" },
    { id: "sn10", name: "Steak Sandwich",  description: "Steak in special spices, lettuce, tomato, onion, French bread",price: 14.00, category: "Sandwiches" },
    { id: "sn11", name: "Foule",           description: "Fava beans with onions, tomato, garlic & jalapenos, French bread — vegetarian", price: 13.50, category: "Sandwiches" },
    { id: "sn12", name: "Chicken Wrap",    description: "Seasoned chicken wrap",                                         price: 10.75, category: "Sandwiches" },
    { id: "sn13", name: "Turkey Sandwich", description: "Turkey breast, cheese, tomato and onion on French bread",      price: 9.50,  category: "Sandwiches" },
    { id: "sn14", name: "10 Chicken Wings", description: "Served with BBQ, ranch or blue cheese",                       price: 13.50, category: "Sandwiches" },
    // Entrees
    { id: "sn15", name: "Curry Chicken",   description: "Tender chicken sauteed with onions, jalapeno, tomato & curry sauce, served with rice", price: 17.55, category: "Entrees" },
    { id: "sn16", name: "Awaze Tibsi",     description: "Cubed beef with tomatoes, jalapenos, garlic & berbere sauce",  price: 17.85, category: "Entrees" },
    { id: "sn17", name: "Alicha Tibsi",    description: "Cubed beef with tomatoes, garlic, jalapenos, ginger & rosemary", price: 17.85, category: "Entrees" },
    { id: "sn18", name: "Doro Tibsi",      description: "Marinated chicken sauteed with onions, jalapenos, tomato & berbere sauce", price: 17.45, category: "Entrees" },
    { id: "sn19", name: "Lamb Tibsi",      description: "Marinated lamb with onions, jalapenos, garlic, ginger & tomato, served with injera", price: 19.75, category: "Entrees" },
    { id: "sn20", name: "Zilzil Tibsi",    description: "Lean beef with garlic butter, ginger, jalapenos & onions, served with injera", price: 19.65, category: "Entrees" },
    { id: "sn21", name: "Curry Beef",      description: "Cubed beef sauteed with jalapeno, tomato, garlic & ginger curry sauce", price: 17.85, category: "Entrees" },
    { id: "sn22", name: "Veggie Combo",    description: "Assorted vegetarian dishes, served with injera — vegetarian", price: 18.50, category: "Entrees" },
    { id: "sn23", name: "Shiro",           description: "Ground yellow split peas with onions, garlic, tomato & berbere sauce — vegetarian", price: 15.00, category: "Entrees" },
    { id: "sn24", name: "Miser Wat",       description: "Split lentils with garlic, tomato, ginger & berbere sauce — vegetarian", price: 15.00, category: "Entrees" },
    { id: "sn25", name: "Spaghetti",       description: "Italian style tomato, bell pepper & meat sauce",               price: 18.25, category: "Entrees" },
    // Drinks
    { id: "sn26", name: "Coffee",          description: "Classic drip coffee",                                           price: 3.25,  category: "Drinks" },
    { id: "sn27", name: "Latte",           description: "Espresso with steamed milk",                                   price: 3.95,  category: "Drinks" },
    { id: "sn28", name: "Cappuccino",      description: "Espresso with foam",                                           price: 4.25,  category: "Drinks" },
    { id: "sn29", name: "Chai Tea",        description: "Spiced chai tea",                                              price: 4.05,  category: "Drinks" },
    { id: "sn30", name: "Iced Latte",      description: "Espresso over ice with milk",                                  price: 4.49,  category: "Drinks" },
    { id: "sn31", name: "Mocha",           description: "Espresso with chocolate & steamed milk",                       price: 4.45,  category: "Drinks" },
    // Desserts
    { id: "sn32", name: "Sambusa",         description: "Crispy pastry with savory filling",                            price: 2.00,  category: "Desserts" },
    { id: "sn33", name: "Muffin",          description: "Freshly baked muffin",                                         price: 2.05,  category: "Desserts" },
    { id: "sn34", name: "Cookie",          description: "House baked cookie",                                           price: 1.25,  category: "Desserts" },
  ],
};

export const LOCATIONS = {
  komo:      [{ id: "l1", slug: "table-1", label: "Table 1" }, { id: "l2", slug: "table-2", label: "Table 2" }, { id: "l3", slug: "table-3", label: "Table 3" }, { id: "l4", slug: "table-4", label: "Table 4" }],
  drift:     [{ id: "l5", slug: "table-1", label: "Table 1" }, { id: "l6", slug: "table-2", label: "Table 2" }, { id: "l7", slug: "counter",  label: "Counter"  }],
  "blade-co":[{ id: "l8", slug: "chair-1", label: "Chair 1" }, { id: "l9", slug: "chair-2", label: "Chair 2" }, { id: "l10", slug: "waiting", label: "Waiting Area" }],
  "snelling":[{ id: "l11", slug: "table-1", label: "Table 1" }, { id: "l12", slug: "table-2", label: "Table 2" }, { id: "l13", slug: "table-3", label: "Table 3" }, { id: "l14", slug: "table-4", label: "Table 4" }, { id: "l15", slug: "counter", label: "Counter" }],
};

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
