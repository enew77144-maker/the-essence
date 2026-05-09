export const SITE = {
  name: "The Essence",
  tagline: "Science-Led Skincare. Honest Pricing.",
  description:
    "Clinical, ingredient-forward skincare formulated to do what it claims. Vegan, cruelty-free, fragrance-free options across serums, moisturizers, cleansers and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultImage:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200",
};

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Concerns", href: "/products?concern=hydration" },
  { label: "Routines", href: "/products?bestseller=true" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Best Sellers", href: "/products?bestseller=true" },
    { label: "New Arrivals", href: "/products?new=true" },
    { label: "Sale", href: "/products?on_sale=true" },
  ],
  help: [
    { label: "FAQ", href: "/about#faq" },
    { label: "Contact", href: "/about#contact" },
    { label: "Shipping", href: "/about#shipping" },
    { label: "Returns", href: "/about#returns" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Science", href: "/about#science" },
    { label: "Careers", href: "/about#careers" },
    { label: "Press", href: "/about#press" },
  ],
};

export const FREE_SHIPPING_THRESHOLD = 30;
