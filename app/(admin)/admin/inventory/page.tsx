"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, TrendingUp, Package, PackageX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design/ui/card';
import { Input } from '@/design/ui/input';
import { Badge } from '@/design/ui/badge';
import { Progress } from '@/design/ui/progress';
import { mockInventory } from '@/data/admin';

const statusBadge: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
  in_stock: { label: 'In Stock', variant: 'secondary' },
  low_stock: { label: 'Low Stock', variant: 'outline' },
  out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
};

export default function Inventory() {
  const [search, setSearch] = useState('');
  const filtered = mockInventory.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const totalStock = mockInventory.reduce((s, i) => s + i.stock, 0);
  const totalSold = mockInventory.reduce((s, i) => s + i.sold, 0);
  const lowStockCount = mockInventory.filter((i) => i.status === 'low_stock').length;
  const outOfStockCount = mockInventory.filter((i) => i.status === 'out_of_stock').length;

  const bestSeller = [...mockInventory].sort((a, b) => b.sold - a.sold)[0];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Inventory</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Stock', value: totalStock, icon: Package, color: 'text-accent' },
          { label: 'Total Sold', value: totalSold, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-500' },
          { label: 'Out of Stock', value: outOfStockCount, icon: PackageX, color: 'text-destructive' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-serif font-semibold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Best seller */}
      <Card className="border-border/60 bg-accent/5">
        <CardContent className="p-4 flex items-center gap-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium">Best Seller: <span className="text-accent">{bestSeller.name}</span></p>
            <p className="text-xs text-muted-foreground">
              {bestSeller.sold} units sold · ₹{(bestSeller.sold * bestSeller.price).toLocaleString()} revenue
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Inventory list */}
      <div className="grid gap-3">
        {filtered.map((item, i) => {
          const stockPct = Math.min((item.stock / (item.stock + item.sold)) * 100, 100);
          const sb = statusBadge[item.status];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <Badge variant={sb.variant} className="text-[10px] shrink-0">{sb.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.category} · ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{item.stock} in stock</p>
                      <p className="text-xs text-muted-foreground">{item.sold} sold</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={stockPct}
                      className="h-1.5"
                    />
                    {item.stock <= item.lowStockThreshold && item.stock > 0 && (
                      <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Below threshold ({item.lowStockThreshold})
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
