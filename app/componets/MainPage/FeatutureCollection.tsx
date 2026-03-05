"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import collectionWomen from '@/public/women_collection.jpg';
import collectionMen from '@/public/man_collection.jpg';
import Image from 'next/image';
const collections = [
  {
    id: 'women',
    name: 'Women',
    description: 'Effortless elegance for the modern woman',
    image: collectionWomen,
    path: '/shop?category=women',
  },
  {
    id: 'men',
    name: 'Men',
    description: 'Refined essentials for the contemporary gentleman',
    image: collectionMen,
    path: '/shop?category=men',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-subhead text-muted-foreground mb-4">Explore</p>
          <h2 className="text-headline">Collections</h2>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link
                href={collection.path}
                className="group block relative aspect-square md:aspect-4/5 overflow-hidden rounded-lg"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-serif text-primary-foreground mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        {collection.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                      <ArrowUpRight size={20} className="text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}