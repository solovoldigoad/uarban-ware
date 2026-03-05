"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, Search, User, LogOut, Settings } from 'lucide-react';
import { useCartStore } from '@/app/componets/store/cartStore';
import { useWishlistStore } from '@/app/componets/store/wishlistStoer';
import { useSession, signOut } from 'next-auth/react';
import { BRAND_NAME } from '@/lib/brand';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Women', path: '/shop?category=women' },
  { name: 'Men', path: '/shop?category=men' },
  { name: 'Orders', path: '/orders' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggleCart, openCart, itemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (searchParams.get('cart') === 'open') {
      openCart();
    }
  }, [searchParams, openCart]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentNavLinks = isAdmin 
    ? [...navLinks, { name: 'Admin', path: '/admin' }]
    : navLinks;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass shadow-subtle' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-serif font-medium tracking-wide">
              {BRAND_NAME}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {currentNavLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium tracking-wider uppercase link-underline transition-colors ${
                    pathname === link.path
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="hidden md:block p-2 hover:bg-secondary rounded-full transition-colors">
                <Search size={20} />
              </button>
              
              <div className="relative">
                {session ? (
                  <>
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-all overflow-hidden border border-border"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image} 
                          alt="User" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white text-xs font-bold uppercase">
                          {session.user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                          >
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                            </div>
                            
                            <Link 
                              href="/profile" 
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User size={16} />
                              Profile
                            </Link>

                            {isAdmin && (
                              <Link 
                                href="/admin" 
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Settings size={16} />
                                Admin Dashboard
                              </Link>
                            )}
                            
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 pt-3"
                            >
                              <LogOut size={16} />
                              Sign Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link 
                    href="/logIn" 
                    className="p-2 hover:bg-secondary rounded-full transition-colors inline-block"
                  >
                    <User size={20} />
                  </Link>
                )}
              </div>

              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <Heart size={20} />
                {isMounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <ShoppingBag size={20} />
                {isMounted && itemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {itemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background" />
            <div className="relative pt-24 px-6">
              <div className="flex flex-col gap-6">
                {currentNavLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      className="text-2xl font-serif font-medium"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
