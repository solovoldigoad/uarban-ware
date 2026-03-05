"use client"

import { motion } from 'framer-motion';
import { BRAND_NAME } from '@/lib/brand';

export default function About() {
  return (
    <div>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <p className="text-subhead text-muted-foreground mb-4">About Us</p>
            <h1 className="text-display mb-8">Our Story</h1>
            <p className="text-body-lg text-muted-foreground">
              {BRAND_NAME} was founded on the belief that exceptional quality and timeless design 
              should be accessible to those who appreciate the finer things in life.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              {
                title: 'Craftsmanship',
                description:
                  'Every piece is crafted with meticulous attention to detail, using time-honored techniques passed down through generations of skilled artisans.',
              },
              {
                title: 'Sustainability',
                description:
                  'We believe in responsible fashion. Our materials are ethically sourced, and we work with partners who share our commitment to the environment.',
              },
              {
                title: 'Timelessness',
                description:
                  'We design pieces meant to last, both in quality and style. Each item transcends fleeting trends, becoming a lasting part of your wardrobe.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-serif mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground py-20 px-8 rounded-lg text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-serif italic max-w-2xl mx-auto mb-6">
              "Simplicity is the ultimate sophistication."
            </blockquote>
            <cite className="text-sm text-primary-foreground/60 not-italic">
              — Leonardo da Vinci
            </cite>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
