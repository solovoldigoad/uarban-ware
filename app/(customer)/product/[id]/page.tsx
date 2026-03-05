'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, Star, ChevronLeft, Truck, RotateCcw, Shield } from 'lucide-react';
import ProductCard from '@/app/componets/store/productGride';
import { products, sizes } from '@/data/products';
import { useCartStore } from '@/app/componets/store/cartStore';
import { useWishlistStore } from '@/app/componets/store/wishlistStoer';
import Image from 'next/image';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, clearCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Product not found</h1>
          <Link href="/shop" className="text-accent underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const availableSizes = (product as any).sizes && (product as any).sizes.length
    ? (product as any).sizes
    : sizes;
  const effectiveSelectedSize = selectedSize ?? availableSizes[0];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, effectiveSelectedSize, product.color);
    }
  };

  const handlePlaceOrder = () => {
    clearCart();
    for (let i = 0; i < quantity; i++) {
      addItem(product, effectiveSelectedSize, product.color);
    }
    router.push('/checkout');
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 pb-4">
        <div className="container mx-auto px-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-product bg-secondary rounded-lg overflow-hidden"
            >
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.isNew && (
                  <span className="bg-primary text-primary-foreground text-xs uppercase tracking-wider px-2 py-1 rounded">
                    New
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-accent text-accent-foreground text-xs uppercase tracking-wider px-2 py-1 rounded">
                    Trending
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
              <p className="text-2xl font-medium mb-4">₹{product.price}</p>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating!)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Color */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Color: <span className="text-foreground">{product.color}</span>
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">Size</p>
                  <button className="text-sm underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border rounded text-sm font-medium transition-colors ${
                        (effectiveSelectedSize || '') === size
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-3">Quantity</p>
                <div className="inline-flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded font-medium hover:bg-primary/90 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  Place Order — ₹{(product.price * quantity).toFixed(0)}
                </button>
                <button
                  onClick={() => toggleItem(product)}
                  className={`w-14 border rounded flex items-center justify-center transition-colors ${
                    inWishlist
                      ? 'bg-accent border-accent text-accent-foreground'
                      : 'border-border hover:border-foreground'
                  }`}
                >
                  <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-8 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Truck size={18} className="text-muted-foreground" />
                  <span>Free shipping on orders over ₹2000</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw size={18} className="text-muted-foreground" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield size={18} className="text-muted-foreground" />
                  <span>2 year warranty included</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="text-headline mb-12 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
