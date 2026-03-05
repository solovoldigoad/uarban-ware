"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/design/ui/button';
export default function MyOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/logIn?redirect=orders');
      return;
    }
    if (status !== 'authenticated') return;

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, [status, router]);

  if (loading || status === 'loading') {
    return (
      <div>
        <div className="pt-28 pb-16 flex items-center justify-center bg-hero-background min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const statusColor = (s: string) => {
    if (s === 'delivered') return 'text-accent';
    if (s === 'cancelled') return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="relative min-h-screen bg-hero-background overflow-hidden">
      <div className="relative z-10 bg-linear-to-r from-white/80 via-white/20 to-transparent min-h-screen">
        <section className="pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-headline mb-2"
          >
            My Orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mb-8"
          >
            Track and manage your orders
          </motion.p>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild><Link href="/shop">Start Shopping</Link></Button>     
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const items = Array.isArray(order.items) ? order.items : [];
                const isCancelled = order.status === 'cancelled';
                const cardBg = isCancelled ? 'var(--order-highlight-cancel)' : 'var(--order-highlight)';
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/orders/${order._id}`}
                      className="block rounded-lg p-5 hover:shadow-md transition-shadow group"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{String(order._id).slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium capitalize ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Package size={14} className="text-muted-foreground" />
                          <span>{items.length} item(s)</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="font-medium">
                            ₹{Number(order.total).toFixed(0)}
                          </span>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
