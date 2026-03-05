"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/public/hero-main.jpg';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-hero-background overflow-hidden">
        <div className="absolute inset-0 " />
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"> 
                <Image
                    src={heroImage}
                    alt="Hero Image"
                    className="object-cover w-full h-full"
                />
            </div>
        <div className="relative z-10 container px-2 lg:px-6  h-screen flex items-center w-full bg-linear-to-r from-white/80 via-white/20 to-transparent">
            <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-shadow-md tracking-[0.2em] uppercase text-muted-foreground mb-8"
            >
              SPRING / SUMMER 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <span className="block text-7xl lg:text-8xl font-serif text-primary leading-none mb-2">
                Timeless
              </span>
              <span className="block text-7xl lg:text-8xl font-serif text-accent leading-none">
                Elegance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-muted-foreground mb-10 max-w-lg leading-relaxed"
            >
              Discover our curated collection of premium essentials. 
              Crafted for those who appreciate understated luxury.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-medium hover:bg-primary/90 transition-colors"
              >
                Shop Collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 font-medium hover:bg-primary/80 hover:text-primary-foreground transition-colors"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
      </div>
    </section>
  );
}
