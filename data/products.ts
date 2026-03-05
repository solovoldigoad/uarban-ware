import product1 from '@/public/product-1.jpg';
import product2 from '@/public/product-2.jpg';
import product3 from '@/public/product-3.jpg';
import product4 from '@/public/product-4.jpg';

import { Product } from "@/types/index";

export const products: Product[] = [
  {
    id: '1',
    name: 'Camel Wool Coat',
    price: 895,
    image: product1,
    category: 'women',
    womensCategory: 'Dresses',
    color: 'Camel',
    description: 'Luxurious wool blend coat with a timeless silhouette. Perfect for transitional weather, this piece features a relaxed fit and premium Italian fabric.',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isTrending: true,
  },
  {
    id: '2',
    name: 'Tailored Black Blazer',
    price: 645,
    image: product2,
    category: 'women',
    womensCategory: 'Tops',
    color: 'Black',
    description: 'A modern take on the classic blazer. Crafted from premium wool with a refined structure and clean lines.',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isTrending: true,
  },
  {
    id: '3',
    name: 'Silk Ivory Blouse',
    price: 385,
    image: product3,
    category: 'women',
    womensCategory: 'Tops',
    color: 'Ivory',
    description: 'Elegant silk blouse with delicate balloon sleeves. A versatile piece that transitions effortlessly from day to evening.',
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isTrending: false,
  },
  {
    id: '4',
    name: 'Charcoal Cashmere Sweater',
    price: 425,
    image: product4,
    category: 'men',
    mensCategory: 'Sweaters',
    color: 'Charcoal',
    description: 'Ultra-soft cashmere sweater in a classic ribbed knit. Designed for comfort and longevity with premium Mongolian cashmere.',
    rating: 4.9,
    reviews: 201,
    isNew: false,
    isTrending: true,
  },
  {
    id: '5',
    name: 'Structured Wool Trousers',
    price: 345,
    image: product2,
    category: 'women',
    womensCategory: 'Jeans',
    color: 'Black',
    description: 'High-waisted trousers with a tailored fit. Made from soft wool blend for all-day comfort.',
    rating: 4.6,
    reviews: 78,
    isNew: false,
    isTrending: false,
  },
  {
    id: '6',
    name: 'Merino Knit Cardigan',
    price: 295,
    image: product4,
    category: 'men',
    mensCategory: 'Jackets',
    color: 'Grey',
    description: 'Fine merino wool cardigan with a relaxed fit. Perfect for layering.',
    rating: 4.5,
    reviews: 45,
    isNew: true,
    isTrending: false,
  },
  {
    id: '7',
    name: 'Silk Midi Dress',
    price: 585,
    image: product3,
    category: 'women',
    womensCategory: 'Dresses',
    color: 'Ivory',
    description: 'Flowing silk midi dress with elegant draping. A statement piece for special occasions.',
    rating: 4.8,
    reviews: 92,
    isNew: true,
    isTrending: true,
  },
  {
    id: '8',
    name: 'Wool Overcoat',
    price: 1095,
    image: product1,
    category: 'men',
    color: 'Camel',
    description: 'Premium wool overcoat with classic lapels. Timeless outerwear crafted in Italy.',
    rating: 4.9,
    reviews: 167,
    isNew: false,
    isTrending: true,
  },
];

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'women', name: 'Women' },
  { id: 'men', name: 'Men' },
  { id: 'new', name: 'New Arrivals' },
  { id: 'trending', name: 'Trending' },
];

export const mensCategories = [
  { id: 'shirts', name: 'Shirts' },
  { id: 'tshirts', name: 'T-Shirts' },
  { id: 'pants', name: 'Pants' },
  { id: 'kurtas', name: 'Kurtas' },
  { id: 'sweaters', name: 'Sweaters' },
  { id: 'jackets', name: 'Jackets' },
  { id: 'tracksuits', name: 'Tracksuits' },
];

export const womensCategories = [
  { id: 'sarees', name: 'Sarees' },
  { id: 'kurtas', name: 'Kurtas' },
  { id: 'dresses', name: 'Dresses' },
  { id: 'tops', name: 'Tops' },
  { id: 'jeans', name: 'Jeans' },
  { id: 'crop-tops', name: 'Crop Tops' },
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export const colors = [
  { id: 'black', name: 'Black', hex: '#0a0a0a' },
  { id: 'ivory', name: 'Ivory', hex: '#f5f5f0' },
  { id: 'camel', name: 'Camel', hex: '#c19a6b' },
  { id: 'grey', name: 'Grey', hex: '#6b7280' },
  { id: 'navy', name: 'Navy', hex: '#1e3a5f' },
];

export const priceRanges = [
  { id: 'all', name: 'All Prices', min: 0, max: Infinity },
  { id: 'under-300', name: 'Under ₹300', min: 0, max: 300 },
  { id: '300-500', name: '₹300 - ₹500', min: 300, max: 500 },
  { id: '500-800', name: '₹500 - ₹800', min: 500, max: 800 },
  { id: 'over-800', name: 'Over ₹800', min: 800, max: Infinity },
];
