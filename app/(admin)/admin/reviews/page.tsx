"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, CheckCircle, Flag, Clock } from 'lucide-react';
import { Card, CardContent } from '@/design/ui/card';
import { Input } from '@/design/ui/input';
import { Badge } from '@/design/ui/badge';
import { Button } from '@/design/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/design/ui/select';
import { toast } from '@/hooks/useToast';
import { mockReviews, Review } from '@/data/admin';

const statusConfig: Record<string, { icon: typeof Star; color: string; label: string }> = {
  published: { icon: CheckCircle, color: 'text-emerald-600', label: 'Published' },
  pending: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
  flagged: { icon: Flag, color: 'text-red-600', label: 'Flagged' },
};

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = reviews.filter((r) => {
    const matchSearch = r.productName.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const updateStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ title: `Review ${status}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Reviews & Ratings</h2>
        <p className="text-sm text-muted-foreground">Average rating: <span className="text-accent font-semibold">{avgRating}</span> / 5 · {reviews.length} reviews</p>
      </div>

      {/* Rating distribution */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = (count / reviews.length) * 100;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-12 flex items-center gap-1">
                    {star} <Star className="h-3 w-3 fill-accent text-accent" />
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review cards */}
      <div className="grid gap-3">
        {filtered.map((review, i) => {
          const sc = statusConfig[review.status];
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{review.productName}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${s < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        by {review.customer} · {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-[10px] gap-1 ${sc.color}`}>
                        <sc.icon className="h-3 w-3" /> {sc.label}
                      </Badge>
                      {review.status === 'pending' && (
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateStatus(review.id, 'published')}>
                          Approve
                        </Button>
                      )}
                      {review.status !== 'flagged' && (
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => updateStatus(review.id, 'flagged')}>
                          Flag
                        </Button>
                      )}
                    </div>
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
