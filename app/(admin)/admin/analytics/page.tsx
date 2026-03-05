"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/design/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import {
  monthlySalesData, topProductsData, customerGrowthData, mockExpenses,
} from '@/data/admin';

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 6,
  fontSize: 12,
};

const expenseByCategory = mockExpenses.reduce<Record<string, number>>((acc, e) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {});

const expenseData = Object.entries(expenseByCategory).map(([cat, amt]) => ({
  category: cat.charAt(0).toUpperCase() + cat.slice(1),
  amount: amt,
}));

const thisMonth = monthlySalesData[monthlySalesData.length - 1];
const lastMonth = monthlySalesData[monthlySalesData.length - 2];
const revenueChange = ((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue * 100).toFixed(1);
const profitChange = ((thisMonth.profit - lastMonth.profit) / lastMonth.profit * 100).toFixed(1);

const totalExpenses = mockExpenses.reduce((s, e) => s + e.amount, 0);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Analytics() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <h2 className="font-serif text-2xl">Revenue & Profit Analytics</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This Month Revenue', value: `₹${(thisMonth.revenue / 1000).toFixed(1)}k`, change: `${revenueChange}%`, up: parseFloat(revenueChange) > 0, icon: DollarSign },
          { label: 'This Month Profit', value: `₹${(thisMonth.profit / 1000).toFixed(1)}k`, change: `${profitChange}%`, up: parseFloat(profitChange) > 0, icon: TrendingUp },
          { label: 'Total Expenses', value: `₹${(totalExpenses / 1000).toFixed(1)}k`, change: 'This month', up: false, icon: TrendingDown },
          { label: 'Customer Base', value: customerGrowthData[customerGrowthData.length - 1].customers, change: 'Total active', up: true, icon: Users },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className="h-4 w-4 text-accent" />
                </div>
                <p className="text-2xl font-serif font-semibold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profit vs Expenses chart */}
      <motion.div variants={item}>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-sans font-medium">Profit vs Expenses (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(36 40% 57%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(36 40% 57%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(36 40% 57%)" fill="url(#profitGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="hsl(0 0% 65%)" fill="hsl(0 0% 65% / 0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expenses breakdown */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-sans font-medium">Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={90} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="amount" fill="hsl(36 40% 57%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer growth */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-sans font-medium">Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="customers" stroke="hsl(36 40% 57%)" strokeWidth={2} dot={{ fill: 'hsl(36 40% 57%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top products revenue */}
      <motion.div variants={item}>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-sans font-medium">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProductsData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: `${(p.revenue / topProductsData[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                  <p className="text-sm font-semibold">₹{p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
