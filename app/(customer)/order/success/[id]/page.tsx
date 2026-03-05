"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/design/ui/button';
import { Separator } from '@/design/ui/separator';
import { Loader2 } from 'lucide-react';

interface OrderData {
  _id: string;
  total: number;
  status: string;
  items: any[];
  createdAt: string;
}

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || status === 'loading') return;

    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const orders = data.orders || [];
        const found = orders.find((o: any) => String(o._id) === id) || null;
        setOrder(found);
        setLoading(false);
      })
      .catch(() => {
        setOrder(null);
        setLoading(false);
      });
  }, [id, status]);

  if (loading || status === 'loading') {
    return (
      <div>
        <div className="pt-28 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div className="pt-28 pb-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const estimatedDate = '5–7 business days';

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-background">
      <section className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-xl text-center">
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', damping: 12 }}
              className="w-14 h-14 rounded-full bg-accent flex items-center justify-center"
            >
              <Check size={28} className="text-accent-foreground" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-headline mb-2"
          >
            Thank You, {(session?.user?.name || 'Customer').split(' ')[0]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            Your order has been placed successfully
          </motion.p>

          {/* Order info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card border rounded-lg p-6 text-left space-y-4 mb-8"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono text-xs">{String(order._id).slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">₹{Number(order.total).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span>{estimatedDate}</span>
            </div>

            {items.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  {items.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Package size={14} className="text-muted-foreground shrink-0" />
                      <span className="truncate">{item.name}</span>
                      <span className="text-muted-foreground ml-auto">×{item.quantity}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{items.length - 3} more item(s)</p>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button asChild variant="outline" className="h-12 px-6">
              <Link href={`/orders/${order._id}`}>
                Track Order <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild className="h-12 px-6">
              <Link href="/shop">
                <ShoppingBag size={16} className="mr-2" /> Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
