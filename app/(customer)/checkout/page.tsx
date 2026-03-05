"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck, Truck, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/design/ui/button';
import { Input } from '@/design/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/design/ui/form';
import { Separator } from '@/design/ui/separator';
import { useCartStore } from '@/app/componets/store/cartStore';
import { toast } from '@/hooks/useToast';
import Image from 'next/image';


const shippingSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required').max(100),
  address: z.string().trim().min(5, 'Address is required').max(500),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z.string().trim().email('Valid email required').optional().or(z.literal('')),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const SHIPPING_FEE = 0;

export default function Checkout() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, total, clearCart } = useCartStore();
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/logIn?redirect=checkout');
    }
  }, [status, router]);

  const form = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        form.reset({
          name: data.user.name || '',
          address: data.user.address || '',
          phone: data.user.phone || '',
          email: session?.user?.email || data.user.email || '',
        });
      } catch {
      }
    };
    load();
  }, [status, session, form]);

  const onSubmit = async (data: ShippingForm) => {
    if (status !== 'authenticated' || !session || items.length === 0) return;

    setIsPlacing(true);
    try {
      const profileRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          address: data.address,
        }),
      });
      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.message || 'Failed to update details');
      }
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.selectedSize,
            color: i.selectedColor,
            image: typeof i.image === 'string' ? i.image : '',
          })),
          total: total() + SHIPPING_FEE,
        }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.message || 'Failed to place order');
      }
      const { order } = await orderRes.json();
      toast({ title: 'Order placed', description: 'Your order has been created successfully.' });
      clearCart();
      if (order && order._id) {
        router.push(`/order/success/${order._id}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast({ title: 'Order failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsPlacing(false);
    }
  };

  if (status === 'loading') {
    return (
      <div>
        <div className="pt-28 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const subtotal = total();
  const orderTotal = subtotal + SHIPPING_FEE;

  return (
    <div>
      <section className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-headline mb-2"
          >
            Checkout
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mb-10"
          >
            Complete your order
          </motion.p>

          <div className="grid lg:grid-cols-[1fr,420px] gap-12">
            {/* LEFT: Shipping Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Trust badges */}
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure Checkout</span>
                <span className="flex items-center gap-1.5"><Truck size={14} /> Free Shipping</span>
              </motion.div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="checkout-form" className="space-y-8">
                  {/* Contact */}
                  <motion.div variants={fadeUp} custom={1}>
                    <h2 className="text-lg font-serif font-medium mb-4">Contact Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} className="h-12" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-3 h-12 rounded-l-md border border-input border-r-0 bg-muted text-sm font-bold text-muted-foreground">
                                +91
                              </span>
                              <Input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="00000-00000"
                                {...field}
                                className="h-12 rounded-l-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="mt-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} className="h-12" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Shipping Address */}
                  <motion.div variants={fadeUp} custom={2}>
                    <h2 className="text-lg font-serif font-medium mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl><Input placeholder="House Number-00 , Street Name , near Landmark " {...field} className="h-12" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid sm:grid-cols-3 gap-4">
                      </div>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Payment Method */}
                  <motion.div variants={fadeUp} custom={3}>
                    <h2 className="text-lg font-serif font-medium mb-4">Payment Method</h2>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="border-2 border-foreground rounded-lg p-5 flex items-start gap-4 bg-secondary/30"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-foreground flex items-center justify-center mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You will pay in cash when your order arrives.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Mobile Place Order */}
                  <div className="lg:hidden">
                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-medium"
                      disabled={isPlacing || items.length === 0}
                    >
                      {isPlacing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        `Place Order — ₹${orderTotal.toFixed(0)}`
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>

            {/* RIGHT: Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:sticky lg:top-28 h-fit"
            >
              <div className="bg-card border rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-serif font-medium">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 max-h-[320px] overflow-y-auto">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}`}
                      whileHover={{ y: -2 }}
                      className="flex gap-3 transition-shadow"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedColor && ` · ${item.selectedColor}`}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </motion.div>
                  ))}
                </div>

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-accent font-medium">
                      {SHIPPING_FEE === 0 ? 'Free' : `₹${SHIPPING_FEE}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>₹{orderTotal.toFixed(0)}</span>
                </div>

                {/* COD Badge */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded p-3">
                  <Package size={14} />
                  <span>Cash on Delivery — pay when your order arrives</span>
                </div>

                {/* Desktop Place Order */}
                <div className="hidden lg:block">
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full h-14 text-base font-medium"
                    disabled={isPlacing || items.length === 0}
                  >
                    {isPlacing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Place Order'}
                  </Button>
                </div>

                {/* Trust */}
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Secure & encrypted checkout
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
