import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";
import product11 from "@/assets/product-11.jpg";
import product12 from "@/assets/product-12.jpg";
import product13 from "@/assets/product-13.jpg";
import product14 from "@/assets/product-14.jpg";
import product15 from "@/assets/product-15.jpg";
import product16 from "@/assets/product-16.jpg";
import product17 from "@/assets/product-17.jpg";
import product18 from "@/assets/product-18.jpg";
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
  material?: string;
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
  { id: "rings", name: "Rings", image: categoryRings, productCount: 312 },
  { id: "necklaces", name: "Necklaces", image: categoryNecklace, productCount: 245 },
  { id: "earrings", name: "Earrings", image: categoryEarrings, productCount: 198 },
  { id: "bracelets", name: "Bracelets", image: categoryBracelet, productCount: 134 },
  { id: "pendants", name: "Pendants", image: product5, productCount: 156 },
  { id: "watches", name: "Watches", image: product10, productCount: 89 },
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
    material: "18K Gold",
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
    material: "Platinum",
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
    material: "14K Gold",
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
    material: "18K White Gold",
    seller: { name: "Royal Gems Ltd", verified: true, rating: 4.9 },
  },
  {
    id: "5",
    name: "Diamond Solitaire Necklace",
    price: 1250,
    image: product5,
    category: "pendants",
    stone: "Diamond",
    style: "Minimalist",
    material: "Platinum",
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
    material: "Sterling Silver",
    seller: { name: "Vintage Gems", verified: false, rating: 4.6 },
  },
  {
    id: "7",
    name: "Rose Gold Diamond Halo Ring",
    price: 6750,
    originalPrice: 7500,
    image: product7,
    category: "rings",
    stone: "Diamond",
    style: "Modern",
    material: "Rose Gold",
    seller: { name: "Eternal Sparkle", verified: true, rating: 4.9 },
    isNew: true,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Blue Topaz Pendant",
    price: 1450,
    image: product8,
    category: "pendants",
    stone: "Topaz",
    style: "Classic",
    material: "14K Gold",
    seller: { name: "Azure Gems", verified: true, rating: 4.7 },
  },
  {
    id: "9",
    name: "Gold Diamond Hoop Earrings",
    price: 2200,
    image: product9,
    category: "earrings",
    stone: "Diamond",
    style: "Minimalist",
    material: "18K Gold",
    seller: { name: "Golden Hour", verified: true, rating: 4.8 },
    isNew: true,
  },
  {
    id: "10",
    name: "Platinum Diamond Bangle",
    price: 8900,
    originalPrice: 9800,
    image: product10,
    category: "bracelets",
    stone: "Diamond",
    style: "Modern",
    material: "Platinum",
    seller: { name: "Platinum Elite", verified: true, rating: 5.0 },
    isFeatured: true,
  },
  {
    id: "11",
    name: "Vintage Opal Filigree Ring",
    price: 2350,
    image: product11,
    category: "rings",
    stone: "Opal",
    style: "Vintage",
    material: "Sterling Silver",
    seller: { name: "Antique Treasures", verified: true, rating: 4.8 },
  },
  {
    id: "12",
    name: "Tanzanite Diamond Earrings",
    price: 4800,
    originalPrice: 5400,
    image: product12,
    category: "earrings",
    stone: "Tanzanite",
    style: "Elegant",
    material: "18K White Gold",
    seller: { name: "Rare Gems Co.", verified: true, rating: 4.9 },
    isFeatured: true,
  },
  {
    id: "13",
    name: "Emerald Cut Diamond Ring",
    price: 12500,
    image: product13,
    category: "rings",
    stone: "Diamond",
    style: "Classic",
    material: "Platinum",
    seller: { name: "Bridal Elegance", verified: true, rating: 5.0 },
    isNew: true,
  },
  {
    id: "14",
    name: "Citrine Layered Necklace",
    price: 1680,
    image: product14,
    category: "necklaces",
    stone: "Citrine",
    style: "Modern",
    material: "14K Gold",
    seller: { name: "Sunstone Studio", verified: true, rating: 4.6 },
  },
  {
    id: "15",
    name: "Peridot Bezel Stud Earrings",
    price: 780,
    originalPrice: 920,
    image: product15,
    category: "earrings",
    stone: "Peridot",
    style: "Minimalist",
    material: "14K Gold",
    seller: { name: "Green Glow", verified: false, rating: 4.5 },
  },
  {
    id: "16",
    name: "Garnet Pearl Charm Bracelet",
    price: 1890,
    image: product16,
    category: "bracelets",
    stone: "Garnet",
    style: "Elegant",
    material: "Sterling Silver",
    seller: { name: "Bohemian Jewels", verified: true, rating: 4.7 },
    isNew: true,
  },
  {
    id: "17",
    name: "Aquamarine Five Stone Ring",
    price: 3450,
    image: product17,
    category: "rings",
    stone: "Aquamarine",
    style: "Classic",
    material: "18K White Gold",
    seller: { name: "Ocean Blue", verified: true, rating: 4.8 },
    isFeatured: true,
  },
  {
    id: "18",
    name: "Morganite Rose Gold Pendant",
    price: 2150,
    originalPrice: 2500,
    image: product18,
    category: "pendants",
    stone: "Morganite",
    style: "Elegant",
    material: "Rose Gold",
    seller: { name: "Blush & Gold", verified: true, rating: 4.9 },
    isNew: true,
  },
  // Additional products for more variety
  {
    id: "19",
    name: "Art Deco Diamond Ring",
    price: 7890,
    image: product7,
    category: "rings",
    stone: "Diamond",
    style: "Vintage",
    material: "Platinum",
    seller: { name: "Heritage Collection", verified: true, rating: 4.9 },
    isFeatured: true,
  },
  {
    id: "20",
    name: "Ceylon Sapphire Pendant",
    price: 5400,
    originalPrice: 6200,
    image: product1,
    category: "pendants",
    stone: "Sapphire",
    style: "Classic",
    material: "18K Gold",
    seller: { name: "Ceylon Gems", verified: true, rating: 4.8 },
    isNew: true,
  },
  {
    id: "21",
    name: "Black Onyx Statement Earrings",
    price: 1120,
    image: product12,
    category: "earrings",
    stone: "Onyx",
    style: "Modern",
    material: "Sterling Silver",
    seller: { name: "Dark Elegance", verified: true, rating: 4.7 },
  },
  {
    id: "22",
    name: "Diamond Tennis Bracelet",
    price: 15800,
    image: product4,
    category: "bracelets",
    stone: "Diamond",
    style: "Classic",
    material: "18K White Gold",
    seller: { name: "Diamond House", verified: true, rating: 5.0 },
    isFeatured: true,
  },
  {
    id: "23",
    name: "Turquoise Bohemian Ring",
    price: 680,
    image: product6,
    category: "rings",
    stone: "Turquoise",
    style: "Elegant",
    material: "Sterling Silver",
    seller: { name: "Desert Dreams", verified: false, rating: 4.5 },
    isNew: true,
  },
  {
    id: "24",
    name: "Pearl Strand Necklace",
    price: 3200,
    image: product14,
    category: "necklaces",
    stone: "Pearl",
    style: "Classic",
    material: "14K Gold Clasp",
    seller: { name: "Pearl Masters", verified: true, rating: 4.9 },
  },
  {
    id: "25",
    name: "Alexandrite Color Change Ring",
    price: 8900,
    originalPrice: 10500,
    image: product2,
    category: "rings",
    stone: "Alexandrite",
    style: "Modern",
    material: "Platinum",
    seller: { name: "Rare Earth Gems", verified: true, rating: 4.8 },
    isFeatured: true,
  },
  {
    id: "26",
    name: "Diamond Cluster Earrings",
    price: 4250,
    image: product9,
    category: "earrings",
    stone: "Diamond",
    style: "Elegant",
    material: "18K Gold",
    seller: { name: "Cluster Collection", verified: true, rating: 4.7 },
    isNew: true,
  },
  {
    id: "27",
    name: "Jade Bangle Bracelet",
    price: 2890,
    image: product16,
    category: "bracelets",
    stone: "Jade",
    style: "Classic",
    material: "Natural Jade",
    seller: { name: "Jade Garden", verified: true, rating: 4.8 },
  },
  {
    id: "28",
    name: "Ruby Heart Pendant",
    price: 3650,
    originalPrice: 4200,
    image: product5,
    category: "pendants",
    stone: "Ruby",
    style: "Elegant",
    material: "18K Gold",
    seller: { name: "Heart of Gems", verified: true, rating: 4.9 },
    isFeatured: true,
  },
  {
    id: "29",
    name: "Moonstone Crescent Ring",
    price: 1340,
    image: product11,
    category: "rings",
    stone: "Moonstone",
    style: "Minimalist",
    material: "Sterling Silver",
    seller: { name: "Luna Jewels", verified: true, rating: 4.6 },
    isNew: true,
  },
  {
    id: "30",
    name: "Emerald Eternity Band",
    price: 6780,
    image: product13,
    category: "rings",
    stone: "Emerald",
    style: "Classic",
    material: "18K Gold",
    seller: { name: "Emerald Isle", verified: true, rating: 4.9 },
  },
];

export const stones = [
  "All Stones",
  "Diamond",
  "Emerald",
  "Sapphire",
  "Ruby",
  "Pearl",
  "Amethyst",
  "Topaz",
  "Opal",
  "Tanzanite",
  "Citrine",
  "Peridot",
  "Garnet",
  "Aquamarine",
  "Morganite",
  "Turquoise",
  "Onyx",
  "Jade",
  "Moonstone",
  "Alexandrite",
];

export const styles = ["All Styles", "Classic", "Modern", "Minimalist", "Vintage", "Elegant"];

export const materials = [
  "All Materials",
  "18K Gold",
  "14K Gold",
  "Rose Gold",
  "White Gold",
  "Platinum",
  "Sterling Silver",
];

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 - $3,000", min: 1000, max: 3000 },
  { label: "$3,000 - $5,000", min: 3000, max: 5000 },
  { label: "$5,000 - $10,000", min: 5000, max: 10000 },
  { label: "Over $10,000", min: 10000, max: Infinity },
];