
import { StaticImageData } from 'next/image';


export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  color?: string;
  sizes?: string[];
  mensCategory?: string;
  womensCategory?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (product: Product) => void;
}

export interface ProductCardProps {
  product: Product;
  index?: number;
}
