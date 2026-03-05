'use client';

import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/app/componets/store/productGride';
import { useWishlistStore } from '@/app/componets/store/wishlistStoer';
import { products } from '@/data/products';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();

  const suggestedProducts = products
    .filter((p) => !items.find((item) => item.id === p.id))
    .slice(0, 4);

  return (
    <div>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-headline mb-4">Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </motion.div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
              <h2 className="text-xl font-serif mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Save your favorite pieces for later
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded font-medium hover:bg-primary/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
                {items.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <ProductCard product={product} index={0} />
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-background/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Suggested Products */}
          {suggestedProducts.length > 0 && (
            <div className="border-t pt-16">
              <h2 className="text-headline text-center mb-12">You Might Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
