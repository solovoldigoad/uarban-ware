"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, MoreVertical, Archive, Upload } from 'lucide-react';
import { Card, CardContent } from '@/design/ui/card';
import { Button } from '@/design/ui/button';
import { Input } from '@/design/ui/input';
import { Badge } from '@/design/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/design/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design/ui/dropdown-menu';
import { Label } from '@/design/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/design/ui/select';
import { Textarea } from '@/design/ui/textarea';
import { toast } from '@/hooks/useToast';
import { products as initialProducts, sizes, mensCategories, womensCategories } from '@/data/products';
import Image from 'next/image';

interface ProductForm {
  name: string;
  price: string;
  category: string;
  mensCategory: string;
  womensCategory: string;
  color: string;
  description: string;
  status: string;
  discount: string;
  sizes: string[];
}

const emptyForm: ProductForm = {
  name: '',
  price: '',
  category: 'women',
  mensCategory: '',
  womensCategory: '',
  color: '',
  description: '',
  status: 'active',
  discount: '0',
  sizes,
};

export default function Products() {
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filtered = productList.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: 'Error', description: 'Name and price are required.', variant: 'destructive' });
      return;
    }
    if (!imageFile && !editId) {
      toast({ title: 'Error', description: 'Product image is required.', variant: 'destructive' });
      return;
    }

    if (editId) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                name: form.name,
                price: parseFloat(form.price),
                category: form.category,
                mensCategory: form.category === 'men' ? form.mensCategory : '',
                womensCategory: form.category === 'women' ? form.womensCategory : '',
                color: form.color,
                description: form.description,
                sizes: form.sizes,
              }
            : p
        )
      );
      toast({ title: 'Product updated' });
      setForm(emptyForm);
      setEditId(null);
      setDialogOpen(false);
      setImageFile(null);
      return;
    }

    try {
      setIsSaving(true);
      const body = new FormData();
      body.append('name', form.name);
      body.append('price', form.price);
      body.append('category', form.category);
      body.append('mensCategory', form.category === 'men' ? form.mensCategory : '');
      body.append('womensCategory', form.category === 'women' ? form.womensCategory : '');
      body.append('color', form.color);
      body.append('description', form.description);
      body.append('status', form.status);
      body.append('discount', form.discount);
      body.append('sizes', JSON.stringify(form.sizes));
      if (imageFile) {
        body.append('image', imageFile);
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.message || 'Failed to create product';
        toast({ title: 'Error', description: message, variant: 'destructive' });
        return;
      }

      const data = await res.json();
      const created = data.product;

      const newProduct = {
        id: created._id,
        name: created.name,
        price: created.price,
        image: created.image,
        category: created.category,
        mensCategory: created.mensCategory,
        womensCategory: created.womensCategory,
        color: created.color,
        description: created.description,
        sizes: created.sizes ?? sizes,
        rating: created.rating ?? 0,
        reviews: created.reviews ?? 0,
        isNew: created.isNew ?? true,
        isTrending: created.isTrending ?? false,
      };

      setProductList((prev) => [newProduct, ...prev]);
      toast({ title: 'Product added', description: 'Product has been created successfully.' });
      setForm(emptyForm);
      setEditId(null);
      setDialogOpen(false);
      setImageFile(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create product', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (id: string) => {
    const p = productList.find((p) => p.id === id);
    if (!p) return;
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      mensCategory: (p as any).mensCategory || '',
      womensCategory: (p as any).womensCategory || '',
      color: p.color || '',
      description: p.description || '',
      status: 'active',
      discount: '0',
      sizes: Array.isArray((p as any).sizes) && (p as any).sizes.length > 0 ? (p as any).sizes : sizes,
    });
    setEditId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Product deleted' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Products</h2>
          <p className="text-sm text-muted-foreground">{productList.length} total products</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(v) => {
            setDialogOpen(v);
            if (!v) {
              setForm(emptyForm);
              setEditId(null);
              setImageFile(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-1.5">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
              </div>
                <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Discount (%)</Label>
                  <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        category: v,
                        mensCategory: v === 'men' ? form.mensCategory : '',
                        womensCategory: v === 'women' ? form.womensCategory : '',
                      })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.category === 'women' && (
                  <div className="grid gap-1.5">
                    <Label>Women's Category</Label>
                    <Select
                      value={form.womensCategory}
                      onValueChange={(v) => setForm({ ...form, womensCategory: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {womensCategories.map((c) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {form.category === 'men' && (
                  <div className="grid gap-1.5">
                    <Label>Men's Category</Label>
                    <Select
                      value={form.mensCategory}
                      onValueChange={(v) => setForm({ ...form, mensCategory: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {mensCategories.map((c) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Color</Label>
                <Input
                  placeholder="e.g. Black, Navy, Wine Red"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              {/* {!editId && (
                <div className="grid gap-1.5">
                  <Label>Product Image</Label>
                  <label
                    htmlFor="product-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-sand/30 border-sand/60 hover:bg-sand/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-taupe" />
                      <p className="mb-1 text-sm text-taupe">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-taupe">SVG, PNG, JPG, or GIF</p>
                    </div>
                    <Input
                      id="product-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                      }}
                    />
                  </label>
                </div>
              )} */}
              <div className="grid gap-1.5">
                <Label>Sizes</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {sizes.map((s) => {
                    const isSelected = (form.sizes ?? []).includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            sizes: isSelected
                              ? (form.sizes ?? []).filter((size: string) => size !== s)
                              : [...(form.sizes ?? []), s],
                          })
                        }
                        className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background border-border text-foreground hover-border-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); setForm(emptyForm); setEditId(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : editId ? 'Update' : 'Add Product'}
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="overflow-hidden border-border/60 group">
              <div className="h-48 bg-muted overflow-hidden relative">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(p.id)}>
                        <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-3.5 w-3.5 mr-2" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {p.isNew && (
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px]">NEW</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-semibold">₹{p.price}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-accent">★ {p.rating}</span>
                  <span className="text-xs text-muted-foreground">({p.reviews})</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
