"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/app/componets/store/productGride';

export default function TrendingProducts() {
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <p className="text-subhead text-muted-foreground mb-4">Best Sellers</p>
            <h2 className="text-headline">Trending Now</h2>
          </div>
          <Link
            href="/shop?category=trending"
            className="group inline-flex items-center gap-2 mt-4 md:mt-0 text-sm font-medium"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
