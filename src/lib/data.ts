export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  size: string[];
  color: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "T-Shirt",
    price: 29.99,
    description: "Premium cotton blend, perfect for everyday wear",
    image: "/tshirt.webp",
    category: "shirts",
    size: ["S", "M", "L", "XL"],
    color: "white",
  },
  {
    id: 2,
    name: "Jeans",
    price: 79.99,
    description: "Comfortable stretch denim with modern fit",
    image: "jeans.webp",
    category: "pants",
    size: ["30x32", "32x32", "34x32", "36x32"],
    color: "blue",
  },
  {
    id: 3,
    name: "Jacket",
    price: 199.99,
    description: "Classic biker style with modern details",
    image: "jacket.jpg",
    category: "jackets",
    size: ["S", "M", "L", "XL"],
    color: "black",
  },
];
