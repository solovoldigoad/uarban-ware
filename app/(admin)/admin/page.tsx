"use client"

import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design/ui/card';
import { Badge } from '@/design/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {
  mockOrders, mockInventory, monthlySalesData, dailySalesData,
  topProductsData, categoryDistribution,
} from '@/data/admin';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const totalRevenue = monthlySalesData.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter((o) => o.status === 'pending').length;
  const thisMonth = monthlySalesData[monthlySalesData.length - 1];
  const lastMonth = monthlySalesData[monthlySalesData.length - 2];
  const growthPct = (((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1);
  const lowStockItems = mockInventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: `₹${(totalRevenue / 1000).toFixed(0)}k`,
            sub: `+${growthPct}% from last month`,
            icon: DollarSign,
            up: true,
          },
          { label: 'Total Orders', value: totalOrders, sub: 'All time', icon: ShoppingCart, up: true },
          { label: 'Pending Orders', value: pendingOrders, sub: 'Needs attention', icon: Clock, up: false },
          {
            label: 'This Month',
            value: `₹${(thisMonth.revenue / 1000).toFixed(1)}k`,
            sub: `Profit ₹${(thisMonth.profit / 1000).toFixed(1)}k`,
            icon: TrendingUp,
            up: true,
          },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
                  <div className="h-8 w-8 rounded-md bg-accent/10 flex items-center justify-center">
                    <kpi.icon className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-serif font-semibold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {kpi.up ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-amber-500" />
                  )}
                  {kpi.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue vs Expenses */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-sans font-medium">Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="revenue" fill="hsl(36 40% 57%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(0 0% 75%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category split */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-sans font-medium">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {categoryDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily sales + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-sans font-medium">Daily Sales (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 12 }} />
                    <Line type="monotone" dataKey="sales" stroke="hsl(36 40% 57%)" strokeWidth={2} dot={{ fill: 'hsl(36 40% 57%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base font-sans font-medium">Low Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <Badge variant={p.stock === 0 ? 'destructive' : 'outline'} className="text-xs">
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div variants={item}>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-sans font-medium">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Order</th>
                    <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 font-medium text-muted-foreground">Total</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">₹{order.total.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top products */}
      <motion.div variants={item}>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-sans font-medium">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProductsData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-accent h-1.5 rounded-full"
                        style={{ width: `${(p.sales / topProductsData[0].sales) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{p.sales} sold</p>
                    <p className="text-xs text-muted-foreground">₹{p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
