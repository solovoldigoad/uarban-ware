"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingCart, AlertTriangle, Star, Check } from 'lucide-react';
import { Card, CardContent } from '@/design/ui/card';
import { Button } from '@/design/ui/button';
import { Badge } from '@/design/ui/badge';
import { mockNotifications, Notification } from '@/data/admin';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  order: { icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
  stock: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
  review: { icon: Star, color: 'text-accent bg-accent/10' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Notifications</h2>
          <p className="text-sm text-muted-foreground">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <Check className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        {notifications.map((n, i) => {
          const tc = typeConfig[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className={cn(
                  'border-border/60 transition-colors cursor-pointer hover:bg-muted/30',
                  !n.read && 'border-l-2 border-l-accent'
                )}
                onClick={() => markRead(n.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', tc.color)}>
                    <tc.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', !n.read && 'font-medium')}>{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
