'use client';

import { useState, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/app/componets/store/productGride';
import { products, categories, sizes, colors, priceRanges, mensCategories, womensCategories } from '@/data/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const setSearchParams = (params: URLSearchParams | Record<string, string>) => {
    const newParams = new URLSearchParams(params);
    window.history.replaceState(null, '', `${window.location.pathname}?${newParams.toString()}`);
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['category', 'price']);

  // Get filter values from URL
  const activeCategory = searchParams.get('category') || 'all';
  const activePrice = searchParams.get('price') || 'all';
  const activeMensCategory = searchParams.get('mensCategory') || '';
  const activeWomensCategory = searchParams.get('womensCategory') || '';
  const activeColor = searchParams.get('color') || '';
  const activeSize = searchParams.get('size') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'new') {
        result = result.filter((p) => p.isNew);
      } else if (activeCategory === 'trending') {
        result = result.filter((p) => p.isTrending);
      } else {
        result = result.filter((p) => p.category === activeCategory);
      }
    }

    // Women subcategory filter
    if (activeWomensCategory && activeCategory === 'women') {
      result = result.filter(
        (p) => p.category === 'women' && (p as any).womensCategory === activeWomensCategory
      );
    }

    // Men subcategory filter
    if (activeMensCategory && activeCategory === 'men') {
      result = result.filter((p) => p.category === 'men' && p.mensCategory === activeMensCategory);
    }

    // Price filter
    if (activePrice !== 'all') {
      const priceRange = priceRanges.find((p) => p.id === activePrice);
      if (priceRange) {
        result = result.filter((p) => p.price >= priceRange.min && p.price < priceRange.max);
      }
    }

    // Color filter
    if (activeColor) {
      result = result.filter((p) => p.color?.toLowerCase() === activeColor.toLowerCase());
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // newest - keep original order (assuming newest first)
        break;
    }

    return result;
  }, [activeCategory, activePrice, activeMensCategory, activeWomensCategory, activeColor, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const activeFiltersCount = [
    activeCategory !== 'all' ? 1 : 0,
    activePrice !== 'all' ? 1 : 0,
    activeColor ? 1 : 0,
    activeSize ? 1 : 0,
    activeMensCategory ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Header */}
      <section className="pt-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-headline">Shop All</h1>
          </motion.div>
        </div>
      </section>

      <section className=" pt-2 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-64 shrink-0"
            >
              <div className="sticky top-32 space-y-8">
                {/* Category */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('category')}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <h3 className="text-subhead text-muted-foreground">Category</h3>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedFilters.includes('category') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFilters.includes('category') && (
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const isMen = cat.id === 'men';
                        const isWomen = cat.id === 'women';
                        const isActive = activeCategory === cat.id;
                        return (
                          <div key={cat.id} className="space-y-1">
                            <button
                              onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('category', cat.id);
                                if (!isMen) {
                                  newParams.delete('mensCategory');
                                }
                                if (!isWomen) {
                                  newParams.delete('womensCategory');
                                }
                                setSearchParams(newParams);
                              }}
                              className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                                isActive
                                  ? 'text-foreground font-medium'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <span>{cat.name}</span>
                              {(isMen || isWomen) && (
                                <ChevronDown
                                  size={14}
                                  className={`ml-1 transition-transform ${
                                    isActive ? 'rotate-180' : ''
                                  }`}
                                />
                              )}
                            </button>
                            {isWomen && isActive && (
                              <div className="ml-4 space-y-1">
                                {womensCategories.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      const newParams = new URLSearchParams(searchParams);
                                      if (activeWomensCategory === sub.name) {
                                        newParams.delete('womensCategory');
                                      } else {
                                        newParams.set('category', 'women');
                                        newParams.set('womensCategory', sub.name);
                                        newParams.delete('mensCategory');
                                      }
                                      setSearchParams(newParams);
                                    }}
                                    className={`block w-full text-left py-1 text-xs transition-colors ${
                                      activeWomensCategory === sub.name
                                        ? 'text-foreground font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            )}
                            {isMen && isActive && (
                              <div className="ml-4 space-y-1">
                                {mensCategories.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      const newParams = new URLSearchParams(searchParams);
                                      if (activeMensCategory === sub.name) {
                                        newParams.delete('mensCategory');
                                      } else {
                                        newParams.set('category', 'men');
                                        newParams.set('mensCategory', sub.name);
                                        newParams.delete('womensCategory');
                                      }
                                      setSearchParams(newParams);
                                    }}
                                    className={`block w-full text-left py-1 text-xs transition-colors ${
                                      activeMensCategory === sub.name
                                        ? 'text-foreground font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('price')}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <h3 className="text-subhead text-muted-foreground">Price</h3>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedFilters.includes('price') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFilters.includes('price') && (
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => updateFilter('price', range.id)}
                          className={`block w-full text-left py-1.5 text-sm transition-colors ${
                            activePrice === range.id
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {range.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('color')}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <h3 className="text-subhead text-muted-foreground">Color</h3>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedFilters.includes('color') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFilters.includes('color') && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() =>
                            updateFilter('color', activeColor === color.id ? '' : color.id)
                          }
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            activeColor === color.id
                              ? 'border-foreground scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Size */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('size')}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <h3 className="text-subhead text-muted-foreground">Size</h3>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedFilters.includes('size') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFilters.includes('size') && (
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => updateFilter('size', activeSize === size ? '' : size)}
                          className={`w-10 h-10 border rounded text-sm font-medium transition-colors ${
                            activeSize === size
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border hover:border-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 text-sm font-medium"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="bg-transparent border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setIsFilterOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-serif font-medium">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Filter content - same as sidebar */}
            <div className="space-y-8">
              {/* Category */}
              <div>
                <h3 className="text-subhead text-muted-foreground mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        updateFilter('category', cat.id);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 text-sm transition-colors ${
                        activeCategory === cat.id
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-subhead text-muted-foreground mb-4">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        updateFilter('price', range.id);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 text-sm transition-colors ${
                        activePrice === range.id
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  clearFilters();
                  setIsFilterOpen(false);
                }}
                className="mt-8 w-full py-3 border border-foreground rounded font-medium"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
