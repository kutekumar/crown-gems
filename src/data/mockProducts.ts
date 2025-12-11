import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklace from "@/assets/category-necklace.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryBracelet from "@/assets/category-bracelet.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stone: string;
  style: string;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
  };
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "rings", name: "Rings", image: categoryRings, productCount: 234 },
  { id: "necklaces", name: "Necklaces", image: categoryNecklace, productCount: 189 },
  { id: "earrings", name: "Earrings", image: categoryEarrings, productCount: 156 },
  { id: "bracelets", name: "Bracelets", image: categoryBracelet, productCount: 98 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Emerald Teardrop Pendant",
    price: 2850,
    originalPrice: 3200,
    image: product1,
    category: "necklaces",
    stone: "Emerald",
    style: "Classic",
    seller: { name: "Gemstone Atelier", verified: true, rating: 4.9 },
    isFeatured: true,
  },
  {
    id: "2",
    name: "Sapphire Solitaire Ring",
    price: 4250,
    image: product2,
    category: "rings",
    stone: "Sapphire",
    style: "Modern",
    seller: { name: "Crown Jewelers", verified: true, rating: 4.8 },
    isNew: true,
  },
  {
    id: "3",
    name: "Pearl Drop Earrings",
    price: 890,
    image: product3,
    category: "earrings",
    stone: "Pearl",
    style: "Elegant",
    seller: { name: "Pearl & Co.", verified: true, rating: 4.7 },
    isFeatured: true,
  },
  {
    id: "4",
    name: "Ruby Tennis Bracelet",
    price: 5680,
    originalPrice: 6500,
    image: product4,
    category: "bracelets",
    stone: "Ruby",
    style: "Classic",
    seller: { name: "Royal Gems Ltd", verified: true, rating: 4.9 },
  },
  {
    id: "5",
    name: "Diamond Solitaire Necklace",
    price: 1250,
    image: product5,
    category: "necklaces",
    stone: "Diamond",
    style: "Minimalist",
    seller: { name: "Lux Diamonds", verified: true, rating: 5.0 },
    isNew: true,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Amethyst Cocktail Ring",
    price: 1890,
    image: product6,
    category: "rings",
    stone: "Amethyst",
    style: "Vintage",
    seller: { name: "Vintage Gems", verified: false, rating: 4.6 },
  },
];

export const stones = ["All Stones", "Diamond", "Emerald", "Sapphire", "Ruby", "Pearl", "Amethyst"];
export const styles = ["All Styles", "Classic", "Modern", "Minimalist", "Vintage", "Elegant"];
export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 - $3,000", min: 1000, max: 3000 },
  { label: "$3,000 - $5,000", min: 3000, max: 5000 },
  { label: "Over $5,000", min: 5000, max: Infinity },
];
