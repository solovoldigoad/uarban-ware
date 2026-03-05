"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Check, Package, Truck, MapPin, Clock, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/design/ui/button';
import { Separator } from '@/design/ui/separator';
import { toast } from '@/hooks/useToast';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: ShoppingBag },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!id || status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/logIn?redirect=orders');
      return;
    }

    const load = async () => {
      try {
        const [ordersRes, profileRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/profile'),
        ]);

        const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
        const orders = ordersData.orders || [];
        const found = orders.find((o: any) => String(o._id) === id) || null;
        setOrder(found);

        if (profileRes.ok) {
          const profileJson = await profileRes.json();
          setProfile(profileJson.user || null);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, status, router]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order._id, status: 'cancelled' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to cancel order');
      }
      const data = await res.json();
      setOrder(data.order);
      toast({ title: 'Order cancelled' });
    } catch (error: any) {
      toast({ title: 'Failed to cancel', description: error.message, variant: 'destructive' });
    } finally {
      setCancelling(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="relative min-h-screen bg-hero-background overflow-hidden">
        <div className="relative z-10 pt-28 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative min-h-screen bg-hero-background overflow-hidden">
        <div className="relative z-10 pt-28 pb-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const canCancel = ['pending', 'processing'].includes(order.status);
  const items = Array.isArray(order.items) ? order.items : [];
  const estimatedDate = '5–7 business days';

  return (
    <div className="relative min-h-screen bg-hero-background overflow-hidden">
      <div className="relative z-10 bg-linear-to-r from-white/80 via-white/20 to-transparent min-h-screen">
        <section className="pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-3xl">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/orders')}
            className="inline-flex items-center gap-2 text-sm text-foreground bg-white rounded-full px-4 py-2 hover:bg-white/90 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> My Orders
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-headline mb-1"
          >
            Order Details
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mb-10 font-mono"
          >
            #{String(order._id).slice(0, 8).toUpperCase()} ·{' '}
            {new Date(order.createdAt).toLocaleDateString()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border-4 border-white rounded-2xl p-10 mb-8"
            style={{ backgroundImage: 'var(--order-panel-gradient)' }}
          >
            {isCancelled ? (
              <div className="text-center py-4">
                <p className="text-destructive font-medium">Order Cancelled</p>
                <p className="text-sm text-muted-foreground mt-1">This order has been cancelled</p>
              </div>
            ) : (
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                <motion.div
                  className="absolute top-5 left-5 h-0.5 bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX:
                      currentStepIdx >= 0 && STATUS_STEPS.length > 1
                        ? currentStepIdx / (STATUS_STEPS.length - 1)
                        : 0,
                  }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  style={{ width: 'calc(100% - 40px)' }}
                />

                {STATUS_STEPS.map((step, i) => {
                  const isComplete = i <= currentStepIdx;
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isComplete ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span
                        className={`text-xs mt-2 text-center max-w-[80px] ${
                          isComplete ? 'font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-4 border-white rounded-2xl p-10 space-y-3"
              style={{ backgroundImage: 'var(--order-panel-gradient)' }}
            >
              <h3 className="font-serif font-medium">Shipping Details</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="text-foreground font-medium">
                  {profile?.name || session?.user?.name || 'Customer'}
                </p>
                <p>{profile?.address || 'See your profile for address details'}</p>
                <p>{profile?.phone || ''}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span>Estimated: {estimatedDate}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-4 border-white rounded-2xl p-10 space-y-3"
              style={{ backgroundImage: 'var(--order-panel-gradient)' }}
            >
              <h3 className="font-serif font-medium">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="truncate mr-2">
                      {item.name} ×{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{Number(order.total).toFixed(0)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Payment: Cash on Delivery</p>
            </motion.div>
          </div>

          {canCancel && !isCancelled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center"
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelling}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                {cancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Cancel Order
              </Button>
            </motion.div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
