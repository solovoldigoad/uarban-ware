// Admin Mock Data

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  date: string;
  address: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  sold: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Expense {
  id: string;
  category: 'marketing' | 'shipping' | 'procurement' | 'operations' | 'payroll';
  description: string;
  amount: number;
  date: string;
}

export interface Review {
  id: string;
  productName: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
}

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'review';
  message: string;
  time: string;
  read: boolean;
}

export const mockOrders: AdminOrder[] = [
  { id: 'ORD-001', customer: 'Sophia Laurent', email: 'sophia@email.com', items: [{ name: 'Camel Wool Coat', qty: 1, price: 895 }], total: 895, status: 'delivered', paymentStatus: 'paid', date: '2026-02-10', address: '45 Rue de Rivoli, Paris' },
  { id: 'ORD-002', customer: 'James Chen', email: 'james@email.com', items: [{ name: 'Charcoal Cashmere Sweater', qty: 2, price: 425 }], total: 850, status: 'shipped', paymentStatus: 'paid', date: '2026-02-09', address: '12 Kings Road, London' },
  { id: 'ORD-003', customer: 'Elena Rossi', email: 'elena@email.com', items: [{ name: 'Silk Ivory Blouse', qty: 1, price: 385 }, { name: 'Structured Wool Trousers', qty: 1, price: 345 }], total: 730, status: 'pending', paymentStatus: 'paid', date: '2026-02-11', address: '8 Via Montenapoleone, Milan' },
  { id: 'ORD-004', customer: 'Marcus Webb', email: 'marcus@email.com', items: [{ name: 'Wool Overcoat', qty: 1, price: 1095 }], total: 1095, status: 'processing', paymentStatus: 'paid', date: '2026-02-11', address: '221 Fifth Ave, New York' },
  { id: 'ORD-005', customer: 'Aisha Patel', email: 'aisha@email.com', items: [{ name: 'Tailored Black Blazer', qty: 1, price: 645 }], total: 645, status: 'cancelled', paymentStatus: 'refunded', date: '2026-02-08', address: '99 Orchard Road, Singapore' },
  { id: 'ORD-006', customer: 'Luca Moretti', email: 'luca@email.com', items: [{ name: 'Silk Midi Dress', qty: 1, price: 585 }], total: 585, status: 'delivered', paymentStatus: 'paid', date: '2026-02-07', address: '15 Piazza del Duomo, Florence' },
  { id: 'ORD-007', customer: 'Nina Johansson', email: 'nina@email.com', items: [{ name: 'Merino Knit Cardigan', qty: 1, price: 295 }, { name: 'Camel Wool Coat', qty: 1, price: 895 }], total: 1190, status: 'shipped', paymentStatus: 'paid', date: '2026-02-06', address: '3 Strandvägen, Stockholm' },
  { id: 'ORD-008', customer: 'David Kim', email: 'david@email.com', items: [{ name: 'Charcoal Cashmere Sweater', qty: 1, price: 425 }], total: 425, status: 'pending', paymentStatus: 'pending', date: '2026-02-11', address: '77 Gangnam-daero, Seoul' },
];

export const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Camel Wool Coat', category: 'Women', stock: 34, lowStockThreshold: 10, sold: 124, price: 895, status: 'in_stock' },
  { id: '2', name: 'Tailored Black Blazer', category: 'Women', stock: 8, lowStockThreshold: 10, sold: 89, price: 645, status: 'low_stock' },
  { id: '3', name: 'Silk Ivory Blouse', category: 'Women', stock: 45, lowStockThreshold: 15, sold: 156, price: 385, status: 'in_stock' },
  { id: '4', name: 'Charcoal Cashmere Sweater', category: 'Men', stock: 3, lowStockThreshold: 10, sold: 201, price: 425, status: 'low_stock' },
  { id: '5', name: 'Structured Wool Trousers', category: 'Women', stock: 22, lowStockThreshold: 10, sold: 78, price: 345, status: 'in_stock' },
  { id: '6', name: 'Merino Knit Cardigan', category: 'Men', stock: 0, lowStockThreshold: 10, sold: 45, price: 295, status: 'out_of_stock' },
  { id: '7', name: 'Silk Midi Dress', category: 'Women', stock: 18, lowStockThreshold: 10, sold: 92, price: 585, status: 'in_stock' },
  { id: '8', name: 'Wool Overcoat', category: 'Men', stock: 5, lowStockThreshold: 10, sold: 167, price: 1095, status: 'low_stock' },
];

export const mockExpenses: Expense[] = [
  { id: 'EXP-001', category: 'marketing', description: 'Instagram Ad Campaign', amount: 4500, date: '2026-02-01' },
  { id: 'EXP-002', category: 'shipping', description: 'DHL Express Shipments', amount: 2800, date: '2026-02-03' },
  { id: 'EXP-003', category: 'procurement', description: 'Italian Wool Fabric', amount: 12000, date: '2026-02-05' },
  { id: 'EXP-004', category: 'operations', description: 'Warehouse Rent', amount: 3500, date: '2026-02-01' },
  { id: 'EXP-005', category: 'payroll', description: 'Staff Salaries', amount: 18000, date: '2026-02-01' },
  { id: 'EXP-006', category: 'marketing', description: 'Influencer Collaboration', amount: 6000, date: '2026-02-08' },
  { id: 'EXP-007', category: 'shipping', description: 'Packaging Materials', amount: 1200, date: '2026-02-10' },
  { id: 'EXP-008', category: 'procurement', description: 'Cashmere Supply', amount: 8500, date: '2026-02-07' },
];

export const mockReviews: Review[] = [
  { id: 'REV-001', productName: 'Camel Wool Coat', customer: 'Sophia L.', rating: 5, comment: 'Absolutely stunning quality. The fabric feels incredible.', date: '2026-02-10', status: 'published' },
  { id: 'REV-002', productName: 'Charcoal Cashmere Sweater', customer: 'James C.', rating: 5, comment: 'Best cashmere I have ever owned. Worth every penny.', date: '2026-02-09', status: 'published' },
  { id: 'REV-003', productName: 'Silk Ivory Blouse', customer: 'Elena R.', rating: 4, comment: 'Beautiful piece but runs slightly large.', date: '2026-02-08', status: 'published' },
  { id: 'REV-004', productName: 'Wool Overcoat', customer: 'Marcus W.', rating: 5, comment: 'Impeccable tailoring. A true statement piece.', date: '2026-02-07', status: 'pending' },
  { id: 'REV-005', productName: 'Tailored Black Blazer', customer: 'Aisha P.', rating: 3, comment: 'Good quality but the sizing chart was inaccurate.', date: '2026-02-06', status: 'flagged' },
  { id: 'REV-006', productName: 'Silk Midi Dress', customer: 'Nina J.', rating: 5, comment: 'Ethereal. I felt like a goddess at the gala.', date: '2026-02-05', status: 'published' },
];

export const mockNotifications: Notification[] = [
  { id: 'N-001', type: 'order', message: 'New order #ORD-003 from Elena Rossi — ₹730', time: '2 min ago', read: false },
  { id: 'N-002', type: 'stock', message: 'Charcoal Cashmere Sweater is critically low (3 left)', time: '15 min ago', read: false },
  { id: 'N-003', type: 'order', message: 'New order #ORD-004 from Marcus Webb — ₹1,095', time: '30 min ago', read: false },
  { id: 'N-004', type: 'review', message: 'New 5-star review on Wool Overcoat by Marcus W.', time: '1 hr ago', read: true },
  { id: 'N-005', type: 'stock', message: 'Merino Knit Cardigan is now out of stock', time: '2 hrs ago', read: true },
  { id: 'N-006', type: 'order', message: 'Order #ORD-002 has been shipped', time: '3 hrs ago', read: true },
];

// Chart data
export const monthlySalesData = [
  { month: 'Aug', revenue: 28400, expenses: 18200, profit: 10200 },
  { month: 'Sep', revenue: 35600, expenses: 21500, profit: 14100 },
  { month: 'Oct', revenue: 42100, expenses: 24800, profit: 17300 },
  { month: 'Nov', revenue: 58900, expenses: 32100, profit: 26800 },
  { month: 'Dec', revenue: 72400, expenses: 38500, profit: 33900 },
  { month: 'Jan', revenue: 45200, expenses: 26700, profit: 18500 },
  { month: 'Feb', revenue: 52800, expenses: 29300, profit: 23500 },
];

export const dailySalesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 3900 },
  { day: 'Thu', sales: 6200 },
  { day: 'Fri', sales: 7400 },
  { day: 'Sat', sales: 8900 },
  { day: 'Sun', sales: 5100 },
];

export const topProductsData = [
  { name: 'Cashmere Sweater', sales: 201, revenue: 85425 },
  { name: 'Wool Overcoat', sales: 167, revenue: 182865 },
  { name: 'Silk Blouse', sales: 156, revenue: 60060 },
  { name: 'Wool Coat', sales: 124, revenue: 110980 },
  { name: 'Midi Dress', sales: 92, revenue: 53820 },
];

export const categoryDistribution = [
  { name: 'Women', value: 62, fill: 'hsl(36 40% 57%)' },
  { name: 'Men', value: 38, fill: 'hsl(0 0% 20%)' },
];

export const customerGrowthData = [
  { month: 'Aug', customers: 120 },
  { month: 'Sep', customers: 185 },
  { month: 'Oct', customers: 240 },
  { month: 'Nov', customers: 380 },
  { month: 'Dec', customers: 520 },
  { month: 'Jan', customers: 610 },
  { month: 'Feb', customers: 745 },
];
