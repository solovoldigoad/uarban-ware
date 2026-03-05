"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/brand';

export default function BrandStory() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <p className="text-subhead text-primary-foreground/60 mb-4">Our Philosophy</p>
            <h2 className="text-headline mb-6">
              Less, But
              <br />
              Better
            </h2>
            <p className="text-body-lg text-primary-foreground/80 mb-8">
              At {BRAND_NAME}, we believe in the power of simplicity. Each piece in our collection 
              is thoughtfully designed to transcend seasons and trends, becoming a cherished part 
              of your wardrobe for years to come.
            </p>
            <p className="text-primary-foreground/80 mb-8">
              We partner with the finest ateliers across Italy, Japan, and Portugal, using only 
              the most exceptional natural fabrics. Quality is not negotiable.
            </p>
            <Link
              href="/about"
              className="inline-block border border-primary-foreground/30 px-8 py-4 rounded font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Discover Our Story
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8"
          >
            {[
              { value: '100%', label: 'Natural Fabrics' },
              { value: '12+', label: 'Partner Ateliers' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '5★', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 border border-primary-foreground/20 rounded-lg"
              >
                <p className="text-4xl md:text-5xl font-serif mb-2">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
