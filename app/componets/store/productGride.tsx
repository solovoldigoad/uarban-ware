'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/app/componets/store/cartStore';
import { ProductCardProps } from '@/types/index';
import { useWishlistStore } from '@/app/componets/store/wishlistStoer';
import Image from 'next/image';

const MotionImage = motion(Image);


export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 'M');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/product/${product.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden bg-secondary mb-4 rounded">
          <MotionImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-background/95 backdrop-blur-sm text-foreground py-3 rounded flex items-center justify-center gap-2 text-sm font-medium hover:bg-background transition-colors"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-3 rounded transition-colors ${
                inWishlist
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-background/95 backdrop-blur-sm text-foreground hover:bg-background'
              }`}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-medium group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm">{product.color}</p>
          <p className="font-medium">₹{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}
