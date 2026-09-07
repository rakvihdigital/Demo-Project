'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Interfaces for E-Commerce Data
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  rating: number;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  icon: string;
  status: 'Active' | 'Inactive';
}

interface SubCategoryItem {
  id: string;
  name: string;
  parentCategory: string;
  itemCount: number;
  status: 'Active' | 'Inactive';
}

interface SubSubCategoryItem {
  id: string;
  name: string;
  parentSubCategory: string;
  parentCategory: string;
  itemCount: number;
  status: 'Active' | 'Inactive';
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minPurchase: number;
  validTill: string;
  usageCount: number;
  status: 'Active' | 'Expired';
}

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  itemsCount: number;
  items?: { name: string; sku: string; qty: number; price: number }[];
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface PosCartItem {
  product: Product;
  quantity: number;
}

interface PosTransaction {
  id: string;
  receiptNo: string;
  date: string;
  cashier: string;
  customer: string;
  itemsCount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  items: { name: string; qty: number; price: number }[];
}

interface EcommerceVideo {
  id: string;
  title: string;
  productName: string;
  duration: string;
  views: number;
  thumbnail: string;
  videoUrl: string;
  dateAdded: string;
}

export default function EcommerceAdminPanel() {
  const router = useRouter();

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab and Dropdown States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-product' | 'product-list' | 'category' | 'sub-category' | 'sub-sub-category' | 'coupons' | 'orders' | 'pos-terminal' | 'pos-history' | 'videos' | 'reports'>('dashboard');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p-1',
      name: 'Wireless Noise-Cancelling Headphones Pro',
      sku: 'WNC-HP-01',
      barcode: '8901234567890',
      category: 'Electronics',
      subCategory: 'Audio & Sound',
      price: 14999,
      stock: 45,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      rating: 4.8,
    },
    {
      id: 'p-2',
      name: 'Ultra Slim Smartwatch Series 7',
      sku: 'SMRT-WT-07',
      barcode: '8909876543211',
      category: 'Wearables',
      subCategory: 'Smartwatches',
      price: 21999,
      stock: 8,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      rating: 4.6,
    },
    {
      id: 'p-3',
      name: 'Ergonomic Mechanical Keyboard RGB',
      sku: 'MEC-KB-99',
      barcode: '8904561237894',
      category: 'Computing',
      subCategory: 'Keyboards & Mice',
      price: 7499,
      stock: 62,
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      rating: 4.9,
    },
    {
      id: 'p-4',
      name: 'Minimalist Matte Leather Backpack',
      sku: 'LTHR-BP-04',
      barcode: '8907894561230',
      category: 'Fashion & Bags',
      subCategory: 'Backpacks',
      price: 4999,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
      rating: 4.5,
    },
  ]);

  // Product Modals & Forms
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Barcode Modals
  const [isGenerateBarcodeModalOpen, setIsGenerateBarcodeModalOpen] = useState(false);
  const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);
  const [barcodeGenStatus, setBarcodeGenStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [barcodePrintStatus, setBarcodePrintStatus] = useState<'idle' | 'printing' | 'success'>('idle');
  const [activeBarcodeProduct, setActiveBarcodeProduct] = useState<Product | null>(null);

  const [isMultiProductModalOpen, setIsMultiProductModalOpen] = useState(false);
  const [multiProductInput, setMultiProductInput] = useState('');

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdSubCategory, setNewProdSubCategory] = useState('Audio & Sound');
  const [newProdSubSubCategory, setNewProdSubSubCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Categories Hierarchy State
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'c-1', name: 'Electronics', slug: 'electronics', itemCount: 124, icon: '⚡', status: 'Active' },
    { id: 'c-2', name: 'Wearables', slug: 'wearables', itemCount: 48, icon: '⌚', status: 'Active' },
    { id: 'c-3', name: 'Computing', slug: 'computing', itemCount: 86, icon: '💻', status: 'Active' },
    { id: 'c-4', name: 'Fashion & Bags', slug: 'fashion-bags', itemCount: 210, icon: '👜', status: 'Active' },
    { id: 'c-5', name: 'Home & Kitchen', slug: 'home-kitchen', itemCount: 95, icon: '☕', status: 'Inactive' },
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');

  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([
    { id: 'sc-1', name: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 42, status: 'Active' },
    { id: 'sc-2', name: 'Smartphones', parentCategory: 'Electronics', itemCount: 60, status: 'Active' },
    { id: 'sc-3', name: 'Smartwatches', parentCategory: 'Wearables', itemCount: 28, status: 'Active' },
    { id: 'sc-4', name: 'Fitness Bands', parentCategory: 'Wearables', itemCount: 20, status: 'Active' },
    { id: 'sc-5', name: 'Keyboards & Mice', parentCategory: 'Computing', itemCount: 35, status: 'Active' },
    { id: 'sc-6', name: 'Backpacks', parentCategory: 'Fashion & Bags', itemCount: 85, status: 'Active' },
  ]);
  const [newSubCatName, setNewSubCatName] = useState('');
  const [newSubCatParent, setNewSubCatParent] = useState('Electronics');

  const [subSubCategories, setSubSubCategories] = useState<SubSubCategoryItem[]>([
    { id: 'ssc-1', name: 'Over-Ear Headphones', parentSubCategory: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 18, status: 'Active' },
    { id: 'ssc-2', name: 'In-Ear TWS Earbuds', parentSubCategory: 'Audio & Sound', parentCategory: 'Electronics', itemCount: 24, status: 'Active' },
    { id: 'ssc-3', name: 'Mechanical RGB Keyboards', parentSubCategory: 'Keyboards & Mice', parentCategory: 'Computing', itemCount: 15, status: 'Active' },
    { id: 'ssc-4', name: 'Waterproof Laptop Backpacks', parentSubCategory: 'Backpacks', parentCategory: 'Fashion & Bags', itemCount: 32, status: 'Active' },
  ]);
  const [newSubSubCatName, setNewSubSubCatName] = useState('');
  const [newSubSubCatSubParent, setNewSubSubCatSubParent] = useState('Audio & Sound');
  const [newSubSubCatParent, setNewSubSubCatParent] = useState('Electronics');

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 'cp-1', code: 'MEGAFEST20', discountType: 'Percentage', discountValue: 20, minPurchase: 1999, validTill: '2026-09-30', usageCount: 142, status: 'Active' },
    { id: 'cp-2', code: 'WELCOME500', discountType: 'Fixed', discountValue: 500, minPurchase: 2500, validTill: '2026-12-31', usageCount: 389, status: 'Active' },
    { id: 'cp-3', code: 'EARLYBIRD', discountType: 'Percentage', discountValue: 15, minPurchase: 999, validTill: '2026-08-15', usageCount: 65, status: 'Expired' },
  ]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponMin, setNewCouponMin] = useState('1000');
  const [newCouponDate, setNewCouponDate] = useState('2026-10-31');

  // Orders State
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ord-101', orderNumber: 'ORD-98214', customerName: 'Aarav Mehta', email: 'aarav.m@example.com', date: '2026-08-26', total: 14999, itemsCount: 1, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }], paymentMethod: 'UPI', paymentStatus: 'Paid', orderStatus: 'Processing' },
    { id: 'ord-102', orderNumber: 'ORD-98213', customerName: 'Priya Sundaram', email: 'priya.s@example.com', date: '2026-08-25', total: 29498, itemsCount: 2, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }, { name: 'Logitech MX Master 3', sku: 'LGT-MX3', qty: 1, price: 14499 }], paymentMethod: 'Credit Card', paymentStatus: 'Paid', orderStatus: 'Shipped' },
    { id: 'ord-103', orderNumber: 'ORD-98212', customerName: 'Vikram Joshi', email: 'v.joshi@example.com', date: '2026-08-25', total: 4999, itemsCount: 1, items: [{ name: 'Minimalist Matte Leather Backpack', sku: 'LTHR-BP-04', qty: 1, price: 4999 }], paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Processing' },
    { id: 'ord-104', orderNumber: 'ORD-98211', customerName: 'Ananya Roy', email: 'ananya.roy@example.com', date: '2026-08-24', total: 21999, itemsCount: 1, items: [{ name: 'Sony Noise Cancelling Headphones', sku: 'SNY-WH1000', qty: 1, price: 14999 }, { name: 'Logitech MX Master 3', sku: 'LGT-MX3', qty: 1, price: 7000 }], paymentMethod: 'Net Banking', paymentStatus: 'Paid', orderStatus: 'Delivered' },
  ]);
  const [selectedOrderForView, setSelectedOrderForView] = useState<OrderItem | null>(null);

  // POS State
  const [posCart, setPosCart] = useState<PosCartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 1 },
  ]);
  const [posSearchTerm, setPosSearchTerm] = useState('');
  const [posCustomerName, setPosCustomerName] = useState('Walk-in Customer');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [posReceiptModal, setPosReceiptModal] = useState<PosTransaction | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeTx, setExchangeTx] = useState<PosTransaction | null>(null);
  const [posManualTotal, setPosManualTotal] = useState<string>('');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerFormName, setNewCustomerFormName] = useState('');

  const [posHistory, setPosHistory] = useState<PosTransaction[]>([
    {
      id: 'tx-1',
      receiptNo: 'REC-2026-8091',
      date: '2026-08-26 03:45 PM',
      cashier: 'John Cashier (Reg #01)',
      customer: 'Siddharth Rao',
      itemsCount: 2,
      total: 22498,
      paymentMethod: 'UPI',
      items: [
        { name: 'Wireless Headphones Pro', qty: 1, price: 14999 },
        { name: 'Ergonomic Keyboard RGB', qty: 1, price: 7499 },
      ],
    },
    {
      id: 'tx-2',
      receiptNo: 'REC-2026-8090',
      date: '2026-08-26 01:15 PM',
      cashier: 'Sarah Jenkins (Reg #02)',
      customer: 'Walk-in Customer',
      itemsCount: 1,
      total: 21999,
      paymentMethod: 'Card',
      items: [
        { name: 'Ultra Slim Smartwatch Series 7', qty: 1, price: 21999 },
      ],
    },
    {
      id: 'tx-3',
      receiptNo: 'REC-2026-8089',
      date: '2026-08-25 06:20 PM',
      cashier: 'John Cashier (Reg #01)',
      customer: 'Rahul Nair',
      itemsCount: 1,
      total: 4999,
      paymentMethod: 'Cash',
      items: [
        { name: 'Minimalist Matte Leather Backpack', qty: 1, price: 4999 },
      ],
    },
  ]);

  // Videos State
  const [videos, setVideos] = useState<EcommerceVideo[]>([
    {
      id: 'vid-1',
      title: 'Unboxing & Sound Test: Wireless Headphones Pro',
      productName: 'Wireless Noise-Cancelling Headphones Pro',
      duration: '01:45',
      views: 12450,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-20',
    },
    {
      id: 'vid-2',
      title: 'Water Resistance & Fitness Tracking Test',
      productName: 'Ultra Slim Smartwatch Series 7',
      duration: '00:58',
      views: 8930,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-18',
    },
    {
      id: 'vid-3',
      title: 'Mechanical Switch Sound Profile & Typing ASMR',
      productName: 'Ergonomic Mechanical Keyboard RGB',
      duration: '02:15',
      views: 24100,
      thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      dateAdded: '2026-08-10',
    },
  ]);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidProduct, setNewVidProduct] = useState('Wireless Noise-Cancelling Headphones Pro');
  const [newVidDuration, setNewVidDuration] = useState('01:30');
  const [newVidThumbnail, setNewVidThumbnail] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400');

  // Helper Functions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const prod: Product = {
      id: `p-${Date.now()}`,
      name: newProdName,
      sku: newProdSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: newProdBarcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: newProdCategory,
      subCategory: newProdSubCategory,
      subSubCategory: newProdSubSubCategory,
      price: parseFloat(newProdPrice),
      stock: parseInt(newProdStock) || 10,
      status: parseInt(newProdStock) > 10 ? 'In Stock' : parseInt(newProdStock) > 0 ? 'Low Stock' : 'Out of Stock',
      image: newProdImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400',
      rating: 5.0,
    };
    setProducts([prod, ...products]);
    setNewProdName('');
    setNewProdSku('');
    setNewProdBarcode('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdImage('');
    setActiveTab('product-list');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleTriggerScanner = (product?: Product) => {
    setIsScannerModalOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedProduct(product || products[0]);
    }, 1500);
  };

  const handleBulkAddSubmit = () => {
    if (!multiProductInput.trim()) return;
    const lines = multiProductInput.split('\n');
    const newItems: Product[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        newItems.push({
          id: `p-bulk-${Date.now()}-${idx}`,
          name: parts[0].trim(),
          sku: parts[1]?.trim() || `BULK-${idx + 100}`,
          barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          category: parts[2]?.trim() || 'Electronics',
          subCategory: 'General',
          price: parseFloat(parts[3]?.trim()) || 999,
          stock: parseInt(parts[4]?.trim()) || 25,
          status: 'In Stock',
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400',
          rating: 4.5,
        });
      }
    });
    if (newItems.length > 0) {
      setProducts([...newItems, ...products]);
      setMultiProductInput('');
      setIsMultiProductModalOpen(false);
    }
  };

  const handleSaveProductEdit = () => {
    if (!currentEditProduct) return;
    setProducts(products.map((p) => (p.id === currentEditProduct.id ? currentEditProduct : p)));
    setIsEditProductModalOpen(false);
    setCurrentEditProduct(null);
  };

  // POS Helper Functions
  const addToPosCart = (product: Product) => {
    const existing = posCart.find((item) => item.product.id === product.id);
    if (existing) {
      setPosCart(
        posCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setPosCart([...posCart, { product, quantity: 1 }]);
    }
  };

  const updatePosQty = (productId: string, delta: number) => {
    setPosCart(
      posCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[]
    );
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const posTax = Math.round(posSubtotal * 0.18);
  const posCalculatedTotal = posSubtotal + posTax;
  const posTotal = posManualTotal !== '' ? parseFloat(posManualTotal) || 0 : posCalculatedTotal;

  const handleCompletePosOrder = () => {
    if (posCart.length === 0) return;
    const newTx: PosTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      cashier: 'Admin POS Terminal #01',
      customer: posCustomerName,
      itemsCount: posCart.reduce((acc, cur) => acc + cur.quantity, 0),
      total: posTotal,
      paymentMethod: posPaymentMethod,
      items: posCart.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
      })),
    };
    setPosHistory([newTx, ...posHistory]);
    setPosReceiptModal(newTx);
    setPosCart([]);
  };

  // Login handler
  const handleLogin = () => {
    if (loginEmail === 'shop@admin.com' && loginPassword === 'shop123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 antialiased"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20 mb-5">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Demo Hub</h1>
            <p className="text-[13px] text-[#86868b] font-semibold mt-1">E-Commerce Admin Control Suite</p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#e5e5ea] rounded-[32px] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1d1d1f] mb-6">Sign in to Admin Panel</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="shop@admin.com"
                  className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold placeholder:text-[#c7c7cc]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••"
                  className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold placeholder:text-[#c7c7cc]"
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-[13px] font-bold bg-red-50 px-4 py-2.5 rounded-xl">{loginError}</p>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[14px] rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>

            {/* Credentials Hint */}
            <div
              onClick={() => {
                setLoginEmail('shop@admin.com');
                setLoginPassword('shop123');
                setLoginError('');
              }}
              className="mt-6 p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-transparent hover:border-[#ea580c]/30 rounded-2xl cursor-pointer transition-all group"
            >
              <p className="text-[11px] font-extrabold text-[#86868b] group-hover:text-[#ea580c] uppercase tracking-wider mb-2 transition-colors">Demo Credentials</p>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#6e6e73]">Email: <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c]">shop@admin.com</span></p>
                <p className="text-[13px] font-semibold text-[#6e6e73]">Password: <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c]">shop123</span></p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-[13px] font-bold text-[#86868b] hover:text-[#ea580c] transition-colors"
            >
              ← Back to Portal Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex antialiased selection:bg-orange-100 selection:text-[#ea580c]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation - Clean Inline, No Section Titles */}
      <aside className={`w-[280px] min-w-[280px] bg-white border-r border-[#e5e5ea] flex flex-col justify-between h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-transform duration-300 ${isMobileSidebarOpen ? 'fixed top-0 bottom-0 left-0 translate-x-0' : 'fixed top-0 bottom-0 left-0 -translate-x-full md:translate-x-0 md:sticky md:top-0'
        }`}>
        <div className="space-y-2 overflow-y-auto px-4 pt-8 pb-4 custom-scrollbar">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center pb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20 mb-3 transform hover:scale-105 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#1d1d1f]">Commerce Hub</h2>
            <p className="text-[10px] text-[#86868b] mt-0.5 font-extrabold uppercase tracking-[0.2em]">
              Admin Control Suite
            </p>
          </div>

          <nav className="space-y-1 text-[14px]">
            {/* Dashboard */}
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all duration-300 flex justify-between items-center ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg></span>
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Products Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg></span>
                  <span>Products</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isProductsDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  <button
                    onClick={() => { setActiveTab('add-product'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === 'add-product'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></span>
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('product-list'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center justify-between ${activeTab === 'product-list'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg></span>
                      <span>Product List</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'product-list' ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{products.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg></span>
                  <span>Categories</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isCategoriesDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  {[
                    { id: 'category', label: 'Category', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
                    { id: 'sub-category', label: 'Sub Category', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /><path d="M2 10h20" /></svg> },
                    { id: 'sub-sub-category', label: 'Sub Sub Categories', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setIsMobileSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                        : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                        }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center opacity-70">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Coupons */}
            <button
              onClick={() => { setActiveTab('coupons'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'coupons'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg></span>
                <span>Coupons</span>
              </div>
              {activeTab === 'coupons' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg></span>
                <span>Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#fff2e8] text-[#ea580c]'}`}>{orders.length}</span>
            </button>

            {/* POS Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsPosDropdownOpen(!isPosDropdownOpen)}
                className="w-full text-left px-5 py-3 rounded-full text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg></span>
                  <span>POS Terminal</span>
                </div>
                <span className={`text-[12px] text-[#86868b] transition-transform duration-200 ${isPosDropdownOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
              </button>

              {isPosDropdownOpen && (
                <div className="pl-6 space-y-1 pt-1 border-l-2 border-[#e5e5ea] ml-5">
                  <button
                    onClick={() => { setActiveTab('pos-terminal'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center gap-2.5 ${activeTab === 'pos-terminal'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg></span>
                    <span>Live Register</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('pos-history'); setIsMobileSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-full text-[13px] transition-all flex items-center justify-between ${activeTab === 'pos-history'
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-sm'
                      : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 flex items-center justify-center opacity-70"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></span>
                      <span>POS History</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'pos-history' ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{posHistory.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Videos */}
            <button
              onClick={() => { setActiveTab('videos'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'videos'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg></span>
                <span>Videos & Reels</span>
              </div>
              {activeTab === 'videos' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setIsMobileSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-full transition-all flex justify-between items-center ${activeTab === 'reports'
                ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold shadow-md shadow-[#ea580c]/20'
                : 'text-[#6e6e73] font-semibold hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center opacity-70"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg></span>
                <span>Reports</span>
              </div>
              {activeTab === 'reports' && <span className="text-white/80 text-lg leading-none">•</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Exit */}
        <div className="p-4 border-t border-[#e5e5ea] bg-white">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full py-3 px-4 bg-white hover:bg-[#fff2e8] text-[#ea580c] font-bold rounded-full text-[13px] transition-all text-center border border-[#e5e5ea] hover:border-[#ea580c] flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Log Out Securely</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 pt-16 md:pt-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="fixed top-4 left-4 z-20 md:hidden w-10 h-10 bg-white border border-[#e5e5ea] rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileSidebarOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Header Breadcrumb */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5e5ea]">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mb-1">
                <span>E-Commerce</span>
                <span>/</span>
                <span className="text-[#ea580c] capitalize">{activeTab.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1d1d1f] capitalize">
                {activeTab === 'dashboard'
                  ? 'Commerce Overview'
                  : activeTab === 'pos-terminal'
                    ? 'POS Cash Register'
                    : activeTab === 'reports'
                      ? 'Reports & Analytics'
                      : activeTab.replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white border border-[#e5e5ea] text-[#1d1d1f] rounded-full text-[13px] font-bold shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Store Live
              </span>
              {/* Only show Quick Scan for Products and POS */}
              {(activeTab === 'product-list' || activeTab === 'pos-terminal') && (
                <button
                  onClick={() => handleTriggerScanner()}
                  className="px-5 py-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-[13px] rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg></span>
                  <span>Quick Scan</span>
                </button>
              )}
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 1. DASHBOARD TAB */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: '₹4,82,450', sub: '+18.4% this month', color: 'text-[#10b981]', icon: '💰' },
                  { label: 'Active Orders', value: orders.length.toString(), sub: '4 require dispatch', color: 'text-[#ea580c]', icon: '📦' },
                  { label: 'Total Products', value: products.length.toString(), sub: 'Across 5 categories', color: 'text-[#1d1d1f]', icon: '🏷️' },
                  { label: 'Low Stock Alerts', value: products.filter(p => p.stock < 10).length.toString(), sub: 'Restock recommended', color: 'text-[#ef4444]', icon: '⚠️' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e5e5ea] p-7 rounded-[32px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider">{stat.label}</p>
                      <span className="text-xl p-2 bg-[#f5f5f7] rounded-xl">{stat.icon}</span>
                    </div>
                    <p className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                    <p className="text-[12px] text-[#6e6e73] font-semibold mt-2">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-white border border-[#e5e5ea] rounded-[36px] p-8 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-[#ea580c] text-[13px] font-bold hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-[#ea580c] text-[13px]">{ord.orderNumber}</span>
                            <span className="text-[#86868b]">•</span>
                            <span className="font-bold text-[#1d1d1f] text-[14px]">{ord.customerName}</span>
                          </div>
                          <p className="text-[12px] text-[#6e6e73] font-semibold mt-1">
                            {ord.itemsCount} item(s) via {ord.paymentMethod}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-[#1d1d1f] text-[15px]">₹{ord.total.toLocaleString()}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Catalog Actions */}
                <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 space-y-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-4">Quick Operations</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('add-product')}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">➕</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Add Single Product
                            </span>
                            <span className="text-[11px] text-[#86868b]">New inventory item form</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('product-list');
                          setIsMultiProductModalOpen(true);
                        }}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📑</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Bulk Multi-Product Add
                            </span>
                            <span className="text-[11px] text-[#86868b]">Import multiple items</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('pos-terminal')}
                        className="w-full p-4 bg-[#f5f5f7] hover:bg-[#fff2e8] border border-[#e5e5ea] hover:border-[#ea580c] rounded-2xl text-left transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🖥️</span>
                          <div>
                            <span className="font-bold text-[#1d1d1f] group-hover:text-[#ea580c] block text-[14px]">
                              Open POS Terminal
                            </span>
                            <span className="text-[11px] text-[#86868b]">In-store checkout & receipt</span>
                          </div>
                        </div>
                        <span className="text-[#86868b] group-hover:text-[#ea580c]">→</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50/60 border border-orange-200/60 rounded-2xl text-center">
                    <p className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">Coupon Discount Active</p>
                    <p className="text-[13px] font-black text-[#1d1d1f] mt-0.5">MEGAFEST20 (20% OFF)</p>
                  </div>
                </div>
              </div>

              {/* Sales Performance Chart */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Sales Performance</h3>
                    <p className="text-[13px] text-[#86868b] font-semibold mt-1">Revenue over the last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-extrabold text-[#ea580c] uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black text-[#1d1d1f]">₹4,82,450</p>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-2 px-2 mt-4">
                  {[45, 60, 35, 80, 50, 95, 75].map((h, i) => (
                    <div key={i} className="w-full bg-[#f5f5f7] rounded-t-xl relative group h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#ea580c] to-[#f97316] rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[11px] font-extrabold text-[#86868b] uppercase tracking-wider px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ADD PRODUCT TAB */}
          {/* ========================================================================= */}
          {activeTab === 'add-product' && (
            <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 md:p-10 shadow-sm w-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e5e5ea]">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">Add New Product</h3>
                  <p className="text-[14px] text-[#6e6e73] font-medium mt-1">
                    Fill in the details below to publish an item to the e-commerce inventory.
                  </p>
                </div>
                <button
                  onClick={() => setIsMultiProductModalOpen(true)}
                  className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] rounded-full text-[12px] font-extrabold border border-[#e5e5ea] transition-all"
                >
                  ⚡ Bulk Add Multiple
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Wireless Noise-Cancelling Headphones"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2 flex justify-between">
                      <span>SKU Code</span>
                      <button
                        type="button"
                        onClick={() => setNewProdSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`)}
                        className="text-[#ea580c] hover:underline font-bold text-[11px]"
                      >
                        Auto-Generate
                      </button>
                    </label>
                    <input
                      type="text"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      placeholder="e.g. WNC-HP-01"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transitioion-all font-semibold font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Category *
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Sub Category
                    </label>
                    <select
                      value={newProdSubCategory}
                      onChange={(e) => setNewProdSubCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      {subCategories
                        .filter((sc) => sc.parentCategory === newProdCategory)
                        .map((sc) => (
                          <option key={sc.id} value={sc.name}>
                            {sc.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Sub-Sub-Category */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Sub Sub Category
                    </label>
                    <select
                      value={newProdSubSubCategory}
                      onChange={(e) => setNewProdSubSubCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                    >
                      <option value="">None</option>
                      {subSubCategories
                        .filter((ssc) => ssc.parentSubCategory === newProdSubCategory)
                        .map((ssc) => (
                          <option key={ssc.id} value={ssc.name}>
                            {ssc.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 14999"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold"
                    />
                  </div>

                  {/* Image URL Placeholder */}
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-extrabold uppercase tracking-widest text-[#86868b] mb-2 pl-2">
                      Product Image URL (Demo)
                    </label>
                    <input
                      type="text"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-6 py-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-black text-[14px] rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider"
                  >
                    Save & Publish Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('product-list')}
                    className="px-8 py-4 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#6e6e73] font-bold text-[14px] rounded-full transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. PRODUCT LIST TAB (With Scanner, Multi-Add, Edit, Delete) */}
          {/* ========================================================================= */}
          {activeTab === 'product-list' && (
            <div className="space-y-6">
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[28px] border border-[#e5e5ea] shadow-sm">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Inventory Catalog</h3>
                  <p className="text-[13px] text-[#86868b] font-semibold">
                    {products.length} products currently active in store
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsMultiProductModalOpen(true)}
                    className="px-5 py-2.5 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] border border-[#e5e5ea] rounded-full text-[13px] font-extrabold transition-all flex items-center gap-2"
                  >
                    <span>📑</span>
                    <span>Add Multiple Products</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-full text-[13px] font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>➕</span>
                    <span>New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[14px]">
                    <thead className="text-[#86868b] border-b border-[#e5e5ea]">
                      <tr>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Product</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">SKU</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Category</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Price</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Stock</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Status</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5ea]">
                      {products.map((prod) => (
                        <tr key={prod.id} className="group hover:bg-[#f5f5f7]/60 transition-colors">
                          {/* Image & Title */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-[#e5e5ea] shadow-sm bg-white"
                              />
                              <div>
                                <span className="font-bold text-[#1d1d1f] block text-[14px] leading-tight max-w-xs">
                                  {prod.name}
                                </span>
                                <span className="text-[11px] text-[#86868b] font-semibold">⭐ {prod.rating}</span>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-4 px-4 font-mono text-[12px]">
                            <span className="font-bold text-[#1d1d1f] block">{prod.sku}</span>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#1d1d1f] block">{prod.category}</span>
                            <span className="text-[12px] text-[#86868b]">
                              {prod.subCategory} {prod.subSubCategory && `> ${prod.subSubCategory}`}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 font-black text-[#1d1d1f] text-[15px]">
                            ₹{prod.price.toLocaleString()}
                          </td>

                          {/* Stock */}
                          <td className="py-4 px-4 font-bold text-[#1d1d1f]">
                            {prod.stock} units
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${prod.status === 'In Stock'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : prod.status === 'Low Stock'
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                  : 'bg-red-100 text-red-700 border border-red-200'
                                }`}
                            >
                              {prod.status}
                            </span>
                          </td>

                          {/* Actions: Scanner, Edit, Delete */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Barcode Actions */}
                              <div className="flex bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl overflow-hidden shadow-sm">
                                <button
                                  onClick={() => {
                                    setActiveBarcodeProduct(prod);
                                    setBarcodeGenStatus('idle');
                                    setIsGenerateBarcodeModalOpen(true);
                                  }}
                                  className="px-3 py-2 text-[11px] font-bold text-[#ea580c] hover:bg-[#fff2e8] transition-colors border-r border-[#e5e5ea] flex items-center gap-1.5"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg>
                                  Generate
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveBarcodeProduct(prod);
                                    setBarcodePrintStatus('idle');
                                    setIsPrintBarcodeModalOpen(true);
                                  }}
                                  title="Print Barcode"
                                  className="px-2.5 py-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#e5e5ea] transition-colors flex items-center justify-center"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                                </button>
                              </div>

                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setCurrentEditProduct(prod);
                                  setIsEditProductModalOpen(true);
                                }}
                                title="Edit Product"
                                className="p-2.5 bg-[#f5f5f7] hover:bg-blue-50 text-blue-600 hover:border-blue-300 border border-[#e5e5ea] rounded-xl transition-all shadow-sm"
                              >
                                ✏️
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                title="Delete Product"
                                className="p-2.5 bg-[#f5f5f7] hover:bg-red-50 text-red-600 hover:border-red-300 border border-[#e5e5ea] rounded-xl transition-all shadow-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CATEGORY TAB */}
          {/* ========================================================================= */}
          {activeTab === 'category' && (
            <div className="space-y-8">
              {/* Add Category Form Card */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm max-w-2xl">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-2">Create New Category</h3>
                <p className="text-[13px] text-[#86868b] font-semibold mb-6">Define top-level product classifications.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Category Name (e.g. Footwear & Shoes)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-6 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Icon (e.g. 👟)"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-24 px-4 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-center text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold"
                  />
                  <button
                    onClick={() => {
                      if (!newCatName) return;
                      setCategories([
                        ...categories,
                        {
                          id: `c-${Date.now()}`,
                          name: newCatName,
                          slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
                          itemCount: 0,
                          icon: newCatIcon || '📦',
                          status: 'Active',
                        },
                      ]);
                      setNewCatName('');
                    }}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white border border-[#e5e5ea] p-7 rounded-[32px] shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl p-3 bg-[#f5f5f7] rounded-2xl">{cat.icon}</span>
                      <div>
                        <h4 className="font-bold text-[#1d1d1f] text-[16px]">{cat.name}</h4>
                        <span className="text-[12px] text-[#86868b] font-semibold">{cat.itemCount} Products</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCategories(
                            categories.map((c) =>
                              c.id === cat.id
                                ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
                                : c
                            )
                          )
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${cat.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {cat.status}
                      </button>
                      <button
                        onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. SUB CATEGORY TAB */}
          {/* ========================================================================= */}
          {activeTab === 'sub-category' && (
            <div className="space-y-8">
              {/* Add Sub Category Form */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm max-w-3xl">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-2">Create Sub Category</h3>
                <p className="text-[13px] text-[#86868b] font-semibold mb-6">Map sub-categories under parent category groups.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Sub-Category Name"
                    value={newSubCatName}
                    onChange={(e) => setNewSubCatName(e.target.value)}
                    className="sm:col-span-1 px-6 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                  />
                  <select
                    value={newSubCatParent}
                    onChange={(e) => setNewSubCatParent(e.target.value)}
                    className="sm:col-span-1 px-6 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        Parent: {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!newSubCatName) return;
                      setSubCategories([
                        ...subCategories,
                        {
                          id: `sc-${Date.now()}`,
                          name: newSubCatName,
                          parentCategory: newSubCatParent,
                          itemCount: 0,
                          status: 'Active',
                        },
                      ]);
                      setNewSubCatName('');
                    }}
                    className="sm:col-span-1 px-6 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Save Sub Category
                  </button>
                </div>
              </div>

              {/* Sub Categories Table */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm overflow-hidden">
                <table className="w-full text-left text-[14px]">
                  <thead className="text-[#86868b] border-b border-[#e5e5ea]">
                    <tr>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Sub Category</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Parent Category</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Product Count</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Status</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5ea]">
                    {subCategories.map((sc) => (
                      <tr key={sc.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#1d1d1f]">{sc.name}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[12px] font-extrabold text-[#ea580c] shadow-sm">
                            {sc.parentCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#6e6e73]">{sc.itemCount} items</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-wider">
                            {sc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSubCategories(subCategories.filter((s) => s.id !== sc.id))}
                            className="text-red-500 hover:text-red-700 text-[13px] font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SUB SUB CATEGORIES TAB */}
          {/* ========================================================================= */}
          {activeTab === 'sub-sub-category' && (
            <div className="space-y-8">
              {/* Add Sub Sub Category Form */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm max-w-4xl">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-2">Create Sub Sub Category (Level 3)</h3>
                <p className="text-[13px] text-[#86868b] font-semibold mb-6">
                  Niche classification (e.g. Electronics → Audio & Sound → Over-Ear Headphones).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Sub Sub Category Name"
                    value={newSubSubCatName}
                    onChange={(e) => setNewSubSubCatName(e.target.value)}
                    className="sm:col-span-1 px-6 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-semibold"
                  />
                  <select
                    value={newSubSubCatParent}
                    onChange={(e) => setNewSubSubCatParent(e.target.value)}
                    className="sm:col-span-1 px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        Main: {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newSubSubCatSubParent}
                    onChange={(e) => setNewSubSubCatSubParent(e.target.value)}
                    className="sm:col-span-1 px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] transition-all font-bold cursor-pointer"
                  >
                    {subCategories
                      .filter((sc) => sc.parentCategory === newSubSubCatParent)
                      .map((sc) => (
                        <option key={sc.id} value={sc.name}>
                          Sub: {sc.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!newSubSubCatName) return;
                      setSubSubCategories([
                        ...subSubCategories,
                        {
                          id: `ssc-${Date.now()}`,
                          name: newSubSubCatName,
                          parentCategory: newSubSubCatParent,
                          parentSubCategory: newSubSubCatSubParent,
                          itemCount: 0,
                          status: 'Active',
                        },
                      ]);
                      setNewSubSubCatName('');
                    }}
                    className="sm:col-span-1 px-6 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Add Level 3
                  </button>
                </div>
              </div>

              {/* Sub Sub Categories Table */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm overflow-hidden">
                <table className="w-full text-left text-[14px]">
                  <thead className="text-[#86868b] border-b border-[#e5e5ea]">
                    <tr>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Sub Sub Category</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Hierarchy Path</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Product Count</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Status</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5ea]">
                    {subSubCategories.map((ssc) => (
                      <tr key={ssc.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#1d1d1f]">{ssc.name}</td>
                        <td className="py-4 px-4 text-[13px]">
                          <span className="font-semibold text-[#6e6e73]">{ssc.parentCategory}</span>
                          <span className="text-[#86868b] mx-1.5">→</span>
                          <span className="font-bold text-[#ea580c]">{ssc.parentSubCategory}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#6e6e73]">{ssc.itemCount} items</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-wider">
                            {ssc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSubSubCategories(subSubCategories.filter((s) => s.id !== ssc.id))}
                            className="text-red-500 hover:text-red-700 text-[13px] font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. COUPONS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-[28px] border border-[#e5e5ea] shadow-sm">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Discount Coupons</h3>
                  <p className="text-[13px] text-[#86868b] font-semibold">Manage promo codes and checkout discounts</p>
                </div>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-full text-[13px] font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🎟️</span>
                  <span>Create Coupon</span>
                </button>
              </div>

              {/* Coupons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((cp) => (
                  <div
                    key={cp.id}
                    className="bg-white border border-[#e5e5ea] rounded-[32px] p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3.5 py-1.5 bg-[#fff2e8] text-[#ea580c] border border-orange-200 font-mono font-black rounded-xl text-[14px]">
                          {cp.code}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${cp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                          {cp.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-3xl font-black text-[#1d1d1f]">
                          {cp.discountType === 'Percentage' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} FLAT`}
                        </p>
                        <p className="text-[13px] text-[#6e6e73] font-semibold mt-1">
                          Min. Purchase: <span className="font-bold text-[#1d1d1f]">₹{cp.minPurchase}</span>
                        </p>
                      </div>

                      <div className="pt-2 text-[12px] text-[#86868b] font-semibold space-y-1">
                        <p>Valid Until: {cp.validTill}</p>
                        <p>Used: {cp.usageCount} times</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#e5e5ea] mt-4 flex justify-between items-center">
                      <button
                        onClick={() =>
                          setCoupons(
                            coupons.map((c) =>
                              c.id === cp.id
                                ? { ...c, status: c.status === 'Active' ? 'Expired' : 'Active' }
                                : c
                            )
                          )
                        }
                        className="text-[12px] font-bold text-[#6e6e73] hover:text-[#1d1d1f]"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => setCoupons(coupons.filter((c) => c.id !== cp.id))}
                        className="text-[12px] font-bold text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. ORDERS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Pending', count: orders.filter(o => o.orderStatus === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
                  { label: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg> },
                  { label: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> },
                  { label: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
                ].map((status, i) => (
                  <div key={i} className={`${status.bg} border ${status.border} rounded-[24px] p-5 transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${status.color} opacity-70`}>{status.icon}</span>
                    </div>
                    <p className={`text-3xl font-black tracking-tight ${status.color}`}>{status.count}</p>
                    <p className="text-[12px] font-extrabold text-[#86868b] uppercase tracking-wider mt-1">{status.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-[28px] border border-[#e5e5ea] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Customer Orders</h3>
                  <p className="text-[13px] text-[#86868b] font-semibold">Track fulfillment and dispatch statuses</p>
                </div>
                <div className="flex gap-2 text-[12px] font-extrabold">
                  <span className="px-3 py-1.5 bg-[#fff2e8] text-[#ea580c] rounded-full border border-orange-200">
                    Total: {orders.length} Orders
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[14px]">
                    <thead className="text-[#86868b] border-b border-[#e5e5ea]">
                      <tr>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Order No.</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Customer</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Date</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Total</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Payment</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Fulfillment</th>
                        <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5ea]">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-[#ea580c]">{ord.orderNumber}</td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#1d1d1f] block">{ord.customerName}</span>
                            <span className="text-[12px] text-[#86868b]">{ord.email}</span>
                          </td>
                          <td className="py-4 px-4 text-[#6e6e73] font-semibold">{ord.date}</td>
                          <td className="py-4 px-4 font-black text-[#1d1d1f]">₹{ord.total.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="font-semibold block text-[13px]">{ord.paymentMethod}</span>
                            <span
                              className={`text-[11px] font-black uppercase ${ord.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                                }`}
                            >
                              ● {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) =>
                                setOrders(
                                  orders.map((o) =>
                                    o.id === ord.id ? { ...o, orderStatus: e.target.value as any } : o
                                  )
                                )
                              }
                              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border cursor-pointer ${ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ord.orderStatus === 'Shipped'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderForView(ord)}
                              className="px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#fff2e8] text-[#ea580c] border border-[#e5e5ea] rounded-full text-[12px] font-extrabold transition-all"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. POS TERMINAL (Live Point of Sale Register) */}
          {/* ========================================================================= */}
          {activeTab === 'pos-terminal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product Grid on Left */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-[32px] border border-[#e5e5ea] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Catalog Selector</h3>
                    <button
                      onClick={() => handleTriggerScanner()}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-full text-[12px] font-extrabold shadow-sm flex items-center gap-1.5"
                    >
                      <span className="flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg></span>
                      <span>Scan Barcode</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search product by title, SKU, or category..."
                    value={posSearchTerm}
                    onChange={(e) => setPosSearchTerm(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] font-semibold"
                  />
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(posSearchTerm.toLowerCase()) ||
                        p.sku.toLowerCase().includes(posSearchTerm.toLowerCase()) ||
                        p.category.toLowerCase().includes(posSearchTerm.toLowerCase())
                    )
                    .map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-[#e5e5ea] rounded-[28px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex gap-4 items-start">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-[#e5e5ea] bg-white flex-shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-black text-[#ea580c] uppercase tracking-wider block">
                              {prod.category}
                            </span>
                            <h4 className="font-bold text-[#1d1d1f] text-[14px] leading-snug line-clamp-2">
                              {prod.name}
                            </h4>
                            <span className="font-black text-[#1d1d1f] text-[16px] block mt-1">
                              ₹{prod.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-[#e5e5ea] flex justify-between items-center">
                          <span className="text-[11px] text-[#86868b] font-semibold">Stock: {prod.stock}</span>
                          <button
                            onClick={() => addToPosCart(prod)}
                            disabled={prod.stock <= 0}
                            className={`px-4 py-2 rounded-full text-[12px] font-black transition-all ${prod.stock > 0
                              ? 'bg-[#f5f5f7] hover:bg-[#fff2e8] text-[#ea580c] hover:border-[#ea580c] border border-[#e5e5ea]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            + Add to Bill
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Live Cart / Billing Slip on Right */}
              <div className="lg:col-span-5 bg-white border border-[#e5e5ea] rounded-[36px] p-7 shadow-sm flex flex-col justify-between sticky top-6">
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-[#e5e5ea]">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Current Bill</h3>
                      <p className="text-[12px] text-[#86868b] font-semibold">Terminal #01 • Walk-in Sale</p>
                    </div>
                    {posCart.length > 0 && (
                      <button
                        onClick={() => setPosCart([])}
                        className="text-[12px] text-red-500 hover:text-red-700 font-bold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Customer Input */}
                  <div className="my-4">
                    <div className="flex justify-between items-center mb-1.5 pl-2 pr-1">
                      <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#86868b]">
                        Customer Name
                      </label>
                      <div className="flex gap-3">
                        <button className="text-[10px] font-bold text-[#ea580c] hover:underline" onClick={() => alert('Looking up customer...')}>Lookup</button>
                        <button className="text-[10px] font-bold text-[#ea580c] hover:underline" onClick={() => setIsNewCustomerModalOpen(true)}>New Reg</button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      placeholder="Walk-in Customer"
                      className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-semibold text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c]"
                    />
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 my-4">
                    {posCart.length === 0 ? (
                      <div className="py-12 text-center text-[#86868b] text-[13px] font-semibold">
                        Cart is currently empty. Click &quot;+ Add to Bill&quot; from catalog.
                      </div>
                    ) : (
                      posCart.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3.5 bg-[#f5f5f7] rounded-2xl flex justify-between items-center"
                        >
                          <div className="max-w-[170px]">
                            <span className="font-bold text-[#1d1d1f] text-[13px] block truncate">
                              {item.product.name}
                            </span>
                            <span className="text-[12px] text-[#ea580c] font-black mt-0.5">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updatePosQty(item.product.id, -1)}
                              className="w-7 h-7 rounded-full bg-white border border-[#e5e5ea] font-black text-[13px] hover:bg-[#fff2e8] flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-black text-[14px] w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updatePosQty(item.product.id, 1)}
                              className="w-7 h-7 rounded-full bg-white border border-[#e5e5ea] font-black text-[13px] hover:bg-[#fff2e8] flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Calculation Summary & Payment */}
                <div className="pt-4 border-t border-[#e5e5ea] space-y-4">
                  <div className="space-y-2 text-[13px] font-semibold text-[#6e6e73]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1d1d1f]">₹{posSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST / Tax (18%)</span>
                      <span className="font-bold text-[#1d1d1f]">₹{posTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[17px] font-black text-[#1d1d1f] pt-2 border-t border-[#e5e5ea]">
                      <span>Grand Total</span>
                      <div className="flex items-center text-[#ea580c]">
                        <span>₹</span>
                        <input
                          type="number"
                          value={posManualTotal !== '' ? posManualTotal : posCalculatedTotal}
                          onChange={(e) => setPosManualTotal(e.target.value)}
                          className="w-24 bg-transparent outline-none border-b-2 border-transparent focus:border-[#ea580c] ml-1 text-right py-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['Cash', 'Card', 'UPI'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPosPaymentMethod(method)}
                        className={`py-2 rounded-xl text-[12px] font-black border transition-all ${posPaymentMethod === method
                          ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white border-transparent shadow-sm'
                          : 'bg-[#f5f5f7] text-[#6e6e73] border-[#e5e5ea] hover:bg-white'
                          }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCompletePosOrder}
                    disabled={posCart.length === 0}
                    className={`w-full py-4 rounded-full font-black text-[14px] uppercase tracking-wider transition-all shadow-md ${posCart.length > 0
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Complete Checkout (₹{posTotal.toLocaleString()})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. POS HISTORY TAB */}
          {/* ========================================================================= */}
          {activeTab === 'pos-history' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[28px] border border-[#e5e5ea] shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">POS In-Store Register History</h3>
                  <p className="text-[13px] text-[#86868b] font-semibold">Audit trail of completed counter sales</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#f5f5f7] border border-[#e5e5ea] hover:bg-[#e5e5ea] text-[#1d1d1f] font-extrabold text-[12px] rounded-full flex items-center gap-1.5 transition-all shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    Bulk Upload
                  </button>
                  <span className="px-4 py-1.5 bg-[#fff2e8] text-[#ea580c] font-black text-[13px] rounded-full border border-orange-200">
                    {posHistory.length} Receipts Logged
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm overflow-hidden">
                <table className="w-full text-left text-[14px]">
                  <thead className="text-[#86868b] border-b border-[#e5e5ea]">
                    <tr>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Receipt No.</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Date & Time</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Customer</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Cashier / Reg</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Payment</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider">Total Paid</th>
                      <th className="pb-4 pt-2 px-4 font-extrabold uppercase text-[11px] tracking-wider text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5ea]">
                    {posHistory.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-[#ea580c]">{tx.receiptNo}</td>
                        <td className="py-4 px-4 text-[#6e6e73] font-semibold text-[13px]">{tx.date}</td>
                        <td className="py-4 px-4 font-bold text-[#1d1d1f]">{tx.customer}</td>
                        <td className="py-4 px-4 text-[13px] text-[#6e6e73] font-medium">{tx.cashier}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] rounded-full text-[11px] font-black">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-[#1d1d1f] text-[15px]">
                          ₹{tx.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setExchangeTx(tx);
                                setIsExchangeModalOpen(true);
                              }}
                              className="px-4 py-1.5 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] rounded-full text-[12px] font-bold transition-all shadow-sm"
                            >
                              Exchange
                            </button>
                            <button
                              onClick={() => setPosReceiptModal(tx)}
                              className="px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#fff2e8] text-[#ea580c] border border-[#e5e5ea] rounded-full text-[12px] font-extrabold transition-all"
                            >
                              Print Receipt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. VIDEOS TAB (E-Commerce Product Reels & Video Marketing) */}
          {/* ========================================================================= */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {/* Header Toolbar */}
              <div className="bg-white p-6 rounded-[28px] border border-[#e5e5ea] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Product Video Marketing</h3>
                  <p className="text-[13px] text-[#86868b] font-semibold">Upload customer demo reels, unboxings & feature reviews</p>
                </div>
                <button
                  onClick={() => setIsUploadVideoModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-full text-[13px] font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>📹</span>
                  <span>Upload New Video</span>
                </button>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white border border-[#e5e5ea] rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    {/* Thumbnail & Video Preview simulation */}
                    <div className="relative h-48 bg-[#1d1d1f] overflow-hidden">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#ea580c] flex items-center justify-center font-black text-xl shadow-lg pl-1">
                          ▶
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 text-white rounded-lg text-[11px] font-mono font-bold">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-6 space-y-3">
                      <span className="px-3 py-1 bg-[#fff2e8] text-[#ea580c] rounded-full text-[11px] font-black uppercase tracking-wider border border-orange-200">
                        Linked: {vid.productName}
                      </span>
                      <h4 className="font-bold text-[#1d1d1f] text-[15px] leading-snug">{vid.title}</h4>
                      <div className="flex justify-between items-center text-[12px] text-[#86868b] font-semibold pt-2 border-t border-[#e5e5ea]">
                        <span>👀 {vid.views.toLocaleString()} views</span>
                        <span>{vid.dateAdded}</span>
                      </div>
                    </div>

                    <div className="px-6 pb-5 pt-1 flex justify-end gap-3">
                      <button
                        onClick={() => alert(`Previewing Video URL: ${vid.videoUrl}`)}
                        className="text-[12px] text-[#ea580c] font-black hover:underline"
                      >
                        Play Demo
                      </button>
                      <button
                        onClick={() => setVideos(videos.filter((v) => v.id !== vid.id))}
                        className="text-[12px] text-red-500 font-bold hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. REPORTS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Summary Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Total Revenue', value: `₹${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}`, change: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
                  { title: 'Total Orders', value: orders.length.toString(), change: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> },
                  { title: 'Products Listed', value: products.length.toString(), change: '+3.1%', color: 'text-purple-600', bg: 'bg-purple-50', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
                  { title: 'POS Transactions', value: posHistory.length.toString(), change: '+15.7%', color: 'text-orange-600', bg: 'bg-orange-50', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-[#e5e5ea] rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`w-11 h-11 rounded-2xl ${card.bg} flex items-center justify-center ${card.color}`}>{card.icon}</span>
                      <span className={`text-[12px] font-extrabold ${card.color} ${card.bg} px-2.5 py-1 rounded-full`}>{card.change}</span>
                    </div>
                    <p className="text-[11px] text-[#86868b] font-bold uppercase tracking-wider mb-1">{card.title}</p>
                    <p className="text-2xl font-black text-[#1d1d1f] tracking-tight">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Sales by Category */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-6">Sales by Category</h3>
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const catProducts = products.filter(p => p.category === cat.name);
                    const catRevenue = catProducts.reduce((sum, p) => sum + p.price * p.stock, 0);
                    const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
                    const percentage = totalRevenue > 0 ? Math.round((catRevenue / totalRevenue) * 100) : 0;
                    return (
                      <div key={cat.id} className="flex items-center gap-4">
                        <div className="w-32 text-[13px] font-bold text-[#1d1d1f] truncate">{cat.name}</div>
                        <div className="flex-1 bg-[#f5f5f7] rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-16 text-right text-[13px] font-extrabold text-[#ea580c]">{percentage}%</div>
                        <div className="w-28 text-right text-[12px] font-bold text-[#86868b]">₹{catRevenue.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inventory & Order Report Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm">
                  <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4">Top Products by Stock Value</h3>
                  <div className="space-y-3">
                    {[...products]
                      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                      .slice(0, 5)
                      .map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 bg-[#f5f5f7] rounded-2xl">
                          <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white flex items-center justify-center text-[11px] font-black">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#1d1d1f] truncate">{p.name}</p>
                            <p className="text-[11px] text-[#86868b] font-semibold">{p.stock} units × ₹{p.price.toLocaleString()}</p>
                          </div>
                          <span className="text-[13px] font-black text-[#ea580c]">₹{(p.price * p.stock).toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Orders Summary */}
                <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-6 shadow-sm">
                  <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-2xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#1d1d1f]">{order.customerName}</p>
                          <p className="text-[11px] text-[#86868b] font-semibold">{order.date} • {order.paymentMethod}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700'
                            : order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700'
                              : order.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>{order.orderStatus}</span>
                          <span className="text-[13px] font-black text-[#1d1d1f]">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Hierarchy Overview */}
              <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 shadow-sm">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-6">Category Hierarchy Map</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="border border-[#e5e5ea] rounded-[24px] p-5 bg-[#fafafa]">
                      <p className="text-[14px] font-black text-[#1d1d1f] mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316]"></span>
                        {cat.name}
                      </p>
                      <div className="pl-4 space-y-2">
                        {subCategories.filter(sc => sc.parentCategory === cat.name).map((sc) => (
                          <div key={sc.id}>
                            <p className="text-[12px] font-bold text-[#6e6e73] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#86868b]"></span>
                              {sc.name}
                            </p>
                            <div className="pl-4 mt-1 space-y-1">
                              {subSubCategories.filter(ssc => ssc.parentCategory === cat.name && ssc.parentSubCategory === sc.name).map((ssc) => (
                                <p key={ssc.id} className="text-[11px] font-semibold text-[#86868b] flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
                                  {ssc.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: SCANNER ACTION MODAL (Barcode / QR Scanner Simulation) */}
      {/* ========================================================================= */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">Barcode & Product Scanner</h3>
                <p className="text-[12px] text-[#86868b] font-semibold">Camera Viewfinder Active</p>
              </div>
              <button
                onClick={() => setIsScannerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Viewfinder */}
            <div className="h-56 bg-neutral-900 rounded-[28px] relative overflow-hidden flex flex-col items-center justify-center text-white border-2 border-dashed border-[#ea580c]/50 p-6">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[13px] font-bold text-orange-400">Scanning Barcode...</span>
                  <div className="w-48 h-0.5 bg-red-500 shadow-[0_0_8px_red] animate-pulse"></div>
                </div>
              ) : scannedProduct ? (
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-black uppercase">
                    Barcode Matched!
                  </span>
                  <p className="font-mono text-lg font-black text-white">{scannedProduct.barcode}</p>
                  <p className="text-[13px] font-bold text-neutral-300">{scannedProduct.name}</p>
                </div>
              ) : (
                <div className="text-center text-neutral-400 text-sm">
                  Point barcode at center of frame
                </div>
              )}
            </div>

            {/* Product Details Result */}
            {scannedProduct && !isScanning && (
              <div className="p-4 bg-[#f5f5f7] rounded-2xl flex items-center justify-between border border-[#e5e5ea]">
                <div>
                  <span className="text-[11px] text-[#86868b] font-extrabold uppercase">Current Stock</span>
                  <p className="text-lg font-black text-[#1d1d1f]">{scannedProduct.stock} Units</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#86868b] font-extrabold uppercase">Unit Price</span>
                  <p className="text-lg font-black text-[#ea580c]">₹{scannedProduct.price.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => setIsScanning(false), 1200);
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md"
              >
                Scan Another Item
              </button>
              <button
                onClick={() => setIsScannerModalOpen(false)}
                className="px-6 py-3.5 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#1d1d1f] font-extrabold text-[13px] rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BULK ADD MULTIPLE PRODUCTS */}
      {/* ========================================================================= */}
      {isMultiProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">Bulk Add Multiple Products</h3>
                <p className="text-[12px] text-[#86868b] font-semibold">
                  Paste comma-separated rows: Name, SKU, Category, Price, Stock
                </p>
              </div>
              <button
                onClick={() => setIsMultiProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={6}
              value={multiProductInput}
              onChange={(e) => setMultiProductInput(e.target.value)}
              placeholder={`Example:\nWireless Mouse Pro, WMS-01, Computing, 1999, 40\nSmart Fitness Band, FTB-99, Wearables, 2499, 20\nUSB-C Fast Charger 65W, CHG-65, Electronics, 1499, 100`}
              className="w-full p-5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-[24px] font-mono text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#ea580c] resize-none"
            ></textarea>

            <div className="flex gap-4">
              <button
                onClick={handleBulkAddSubmit}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md hover:shadow-lg"
              >
                Import & Add to Catalog
              </button>
              <button
                onClick={() => setIsMultiProductModalOpen(false)}
                className="px-6 py-3.5 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#6e6e73] font-bold text-[13px] rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isEditProductModalOpen && currentEditProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Edit Product Details</h3>
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={currentEditProduct.name}
                  onChange={(e) => setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-semibold text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={currentEditProduct.price}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={currentEditProduct.stock}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold text-[#1d1d1f]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveProductEdit}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="px-6 py-3.5 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#6e6e73] font-bold text-[13px] rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE COUPON MODAL */}
      {/* ========================================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Generate New Coupon</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. FLASH30"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-mono font-bold text-[#1d1d1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">Value</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Min Purchase Amount (₹)
                </label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!newCouponCode || !newCouponValue) return;
                  setCoupons([
                    {
                      id: `cp-${Date.now()}`,
                      code: newCouponCode,
                      discountType: newCouponType,
                      discountValue: parseFloat(newCouponValue),
                      minPurchase: parseFloat(newCouponMin) || 0,
                      validTill: newCouponDate,
                      usageCount: 0,
                      status: 'Active',
                    },
                    ...coupons,
                  ]);
                  setIsCouponModalOpen(false);
                  setNewCouponCode('');
                  setNewCouponValue('');
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md"
              >
                Create Coupon
              </button>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="px-6 py-3.5 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#6e6e73] font-bold text-[13px] rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: POS RECEIPT SLIP MODAL */}
      {/* ========================================================================= */}
      {posReceiptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center font-mono">
            <div className="space-y-1">
              <span className="text-2xl">🛍️</span>
              <h3 className="text-lg font-black text-[#1d1d1f]">COMMERCE HUB</h3>
              <p className="text-[11px] text-[#86868b]">Receipt: {posReceiptModal.receiptNo}</p>
              <p className="text-[10px] text-[#86868b]">{posReceiptModal.date}</p>
            </div>

            <div className="border-t border-b border-dashed border-[#e5e5ea] py-4 text-left text-[12px] space-y-2">
              <p>Customer: {posReceiptModal.customer}</p>
              <p>Cashier: {posReceiptModal.cashier}</p>
              <p>Method: {posReceiptModal.paymentMethod}</p>

              <div className="pt-2 border-t border-dashed border-[#e5e5ea] space-y-1">
                {posReceiptModal.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      <span className="block font-bold">{it.name}</span>
                      <span className="block text-[10px] text-[#86868b] font-medium tracking-wide">Qty: {it.qty}</span>
                    </span>
                    <span className="font-bold">₹{(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-black text-[#1d1d1f]">
              <span>TOTAL PAID</span>
              <span className="text-[#ea580c]">₹{posReceiptModal.total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setPosReceiptModal(null)}
              className="w-full py-3 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white rounded-full font-bold text-[13px] shadow-md"
            >
              Close & Print
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL X: POS EXCHANGE MODAL */}
      {/* ========================================================================= */}
      {isExchangeModalOpen && exchangeTx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">Process Exchange</h3>
                <p className="text-[12px] text-[#86868b] mt-1 font-mono font-semibold">{exchangeTx.receiptNo}</p>
              </div>
              <button onClick={() => setIsExchangeModalOpen(false)} className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <p className="text-[13px] font-bold text-[#1d1d1f]">Select items to exchange or return:</p>
              {exchangeTx.items.map((it, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl cursor-pointer hover:border-[#ea580c]/50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-[#ea580c] rounded border-[#e5e5ea] focus:ring-[#ea580c]" />
                  <div className="flex-1">
                    <span className="text-[13px] font-bold text-[#1d1d1f] block">{it.name}</span>
                    <span className="text-[11px] text-[#86868b] font-semibold">Qty: {it.qty}</span>
                  </div>
                  <span className="text-[13px] font-black text-[#ea580c]">₹{(it.price * it.qty).toLocaleString()}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Successfully processed exchange for ${exchangeTx.customer}'s order!`);
                  setIsExchangeModalOpen(false);
                }}
                className="w-full py-4 bg-[#1d1d1f] hover:bg-black text-white font-extrabold text-[14px] rounded-full shadow-md transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Confirm Exchange
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: UPLOAD PRODUCT VIDEO */}
      {/* ========================================================================= */}
      {isUploadVideoModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Upload Product Video</h3>
              <button
                onClick={() => setIsUploadVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unboxing & Review"
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-semibold text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Linked Product
                </label>
                <select
                  value={newVidProduct}
                  onChange={(e) => setNewVidProduct(e.target.value)}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#86868b] mb-1 pl-2">
                  Duration (MM:SS)
                </label>
                <input
                  type="text"
                  value={newVidDuration}
                  onChange={(e) => setNewVidDuration(e.target.value)}
                  className="w-full px-5 py-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[13px] font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!newVidTitle) return;
                  setVideos([
                    {
                      id: `vid-${Date.now()}`,
                      title: newVidTitle,
                      productName: newVidProduct,
                      duration: newVidDuration || '01:30',
                      views: 0,
                      thumbnail: newVidThumbnail,
                      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
                      dateAdded: 'Today',
                    },
                    ...videos,
                  ]);
                  setIsUploadVideoModalOpen(false);
                  setNewVidTitle('');
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-[13px] rounded-full shadow-md"
              >
                Publish Video
              </button>
              <button
                onClick={() => setIsUploadVideoModalOpen(false)}
                className="px-6 py-3.5 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#6e6e73] font-bold text-[13px] rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ORDER INVOICE VIEW */}
      {/* ========================================================================= */}
      {selectedOrderForView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col h-[90vh]">
            <div className="flex justify-between items-center p-4 bg-[#f5f5f7] border-b border-[#e5e5ea]">
              <h3 className="font-bold text-[#1d1d1f]">Invoice Preview</h3>
              <button
                onClick={() => setSelectedOrderForView(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#e5e5ea] flex items-center justify-center text-sm font-bold shadow-sm"
              >
                ✕
              </button>
            </div>

            {/* A4 Invoice Container */}
            <div className="flex-1 overflow-y-auto p-12 bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h1 className="text-[42px] font-black tracking-tighter text-[#1d1d1f] leading-none mb-2">INVOICE</h1>
                    <p className="text-[#1d1d1f] font-bold text-[14px]">#{selectedOrderForView.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-[20px] font-black text-[#1d1d1f]">Demo collection</h2>
                    <h2 className="text-[20px] font-black text-[#1d1d1f]">STORE</h2>
                    <p className="text-[#86868b] text-[13px] mt-1">Premium Quality Essentials</p>
                  </div>
                </div>

                <div className="border-t border-[#e5e5ea] pt-8 mb-12 flex justify-between">
                  <div>
                    <h4 className="text-[11px] font-extrabold uppercase text-[#86868b] tracking-wider mb-2">Billed To:</h4>
                    <p className="text-[16px] font-black text-[#1d1d1f] mb-1">{selectedOrderForView.customerName}</p>
                    <p className="text-[#1d1d1f] text-[14px] leading-relaxed max-w-[250px]">
                      412, Radhakrishna Nilaya, 4th main road,<br />
                      3rd cross, KHB Badavane, Satyamangala<br />
                      Near hokkaligara boys hostel road<br />
                      Hassan, Karnataka - 573201
                    </p>
                    <p className="text-[#1d1d1f] text-[14px] mt-2 font-medium">Phone: 9380651970</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[11px] font-extrabold uppercase text-[#86868b] tracking-wider mb-2">Order Summary:</h4>
                    <p className="text-[#1d1d1f] text-[14px] mb-1">Date: <span className="font-semibold">{selectedOrderForView.date}</span></p>
                    <p className="text-[#1d1d1f] text-[14px] mb-1">Payment: <span className="font-semibold uppercase">{selectedOrderForView.paymentMethod}</span></p>
                    <p className="text-[#1d1d1f] text-[14px]">Status: <span className="font-semibold uppercase text-[#ea580c]">{selectedOrderForView.paymentStatus}</span></p>
                  </div>
                </div>

                <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b border-[#e5e5ea]">
                      <th className="text-left py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#1d1d1f]">Item Description</th>
                      <th className="text-center py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#1d1d1f]">Qty</th>
                      <th className="text-right py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#1d1d1f]">Price</th>
                      <th className="text-right py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#1d1d1f]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrderForView.items || []).map((item, idx) => (
                      <tr key={idx} className="border-b border-[#f5f5f7]">
                        <td className="py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#f5f5f7] rounded-lg border border-[#e5e5ea] overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=150" alt="product" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                            </div>
                            <div>
                              <p className="font-bold text-[#1d1d1f] text-[14px]">{item.name}</p>
                              <p className="text-[11px] text-[#86868b]">SKU: {item.sku} <br />Standard</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-center text-[14px] text-[#1d1d1f]">{item.qty}</td>
                        <td className="py-5 text-right text-[14px] text-[#1d1d1f]">₹{item.price.toFixed(2)}</td>
                        <td className="py-5 text-right text-[14px] font-bold text-[#1d1d1f]">₹{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-16">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-[14px] text-[#1d1d1f]">
                      <span>Subtotal</span>
                      <span>₹{(selectedOrderForView.total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[14px] text-[#1d1d1f] italic">
                      <span>GST (18%)</span>
                      <span>+ ₹{(selectedOrderForView.total - (selectedOrderForView.total / 1.18)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[14px] text-[#1d1d1f]">
                      <span>Shipping Fees</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="border-t border-[#e5e5ea] pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[22px] font-black text-[#ea580c]">Grand Total</span>
                        <span className="text-[22px] font-black text-[#ea580c]">₹{selectedOrderForView.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[#86868b] text-[12px]">
                  Thank you for shopping with Bangalore Collective Store!
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex justify-end gap-3">
              <button className="px-6 py-2.5 bg-white border border-[#e5e5ea] hover:bg-[#e5e5ea] text-[#1d1d1f] font-bold text-[13px] rounded-full transition-colors" onClick={() => setSelectedOrderForView(null)}>Close</button>
              <button className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#f97316] text-white font-bold text-[13px] rounded-full transition-colors shadow-sm" onClick={() => window.print()}>Print Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* POS NEW CUSTOMER MODAL */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e5ea] rounded-[36px] p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-4">New Registration</h3>
            <input
              type="text"
              placeholder="Customer Name"
              value={newCustomerFormName}
              onChange={(e) => setNewCustomerFormName(e.target.value)}
              className="w-full px-5 py-3 mb-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#ea580c]"
            />
            <button
              onClick={() => {
                if (!newCustomerFormName) return;
                setPosCustomerName(newCustomerFormName);
                setIsNewCustomerModalOpen(false);
                setNewCustomerFormName('');
                alert(`Successfully registered ${newCustomerFormName}!`);
              }}
              className="w-full py-3.5 bg-[#1d1d1f] hover:bg-black text-white font-extrabold text-[13px] rounded-full shadow-md"
            >
              Register & Select
            </button>
          </div>
        </div>
      )}
      {/* GENERATE BARCODE MODAL */}
      {isGenerateBarcodeModalOpen && activeBarcodeProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[36px] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsGenerateBarcodeModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] rounded-full transition-colors text-[#1d1d1f]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <h2 className="text-2xl font-black text-[#1d1d1f] tracking-tight mb-2">Barcode Scanner</h2>
            <p className="text-[14px] text-[#6e6e73] font-semibold mb-6">Scanning product <span className="text-[#1d1d1f] font-bold">{activeBarcodeProduct.name}</span>...</p>

            <div className="flex flex-col items-center justify-center py-8">
              {barcodeGenStatus === 'idle' ? (
                <button
                  onClick={() => {
                    setBarcodeGenStatus('generating');
                    setTimeout(() => setBarcodeGenStatus('success'), 1500);
                  }}
                  className="px-8 py-4 bg-[#ea580c] hover:bg-[#f97316] text-white rounded-full font-black text-[15px] shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg>
                  Scan & Generate Code
                </button>
              ) : barcodeGenStatus === 'generating' ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 border-4 border-[#ea580c]/20 border-t-[#ea580c] rounded-full animate-spin"></div>
                  <p className="text-[13px] font-bold text-[#ea580c] animate-pulse">Scanning database...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="text-center w-full bg-[#f5f5f7] p-6 rounded-3xl border border-[#e5e5ea]">
                    <p className="text-[11px] font-extrabold text-[#86868b] uppercase tracking-wider mb-2">Generated Barcode</p>
                    <svg className="w-full h-16 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h2v14H3z M7 5h1v14H7z M11 5h2v14h-2z M15 5h1v14h-1z M19 5h2v14h-2z" /></svg>
                    <p className="text-2xl font-mono font-black tracking-[0.25em] text-[#1d1d1f]">{activeBarcodeProduct.barcode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRINT BARCODE MODAL */}
      {isPrintBarcodeModalOpen && activeBarcodeProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[36px] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsPrintBarcodeModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] rounded-full transition-colors text-[#1d1d1f]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <h2 className="text-2xl font-black text-[#1d1d1f] tracking-tight mb-2">Print Tags</h2>
            <p className="text-[14px] text-[#6e6e73] font-semibold mb-6">Send to thermal printer</p>

            <div className="flex flex-col items-center justify-center py-6">
              {barcodePrintStatus === 'idle' ? (
                <button
                  onClick={() => {
                    setBarcodePrintStatus('printing');
                    setTimeout(() => setBarcodePrintStatus('success'), 2000);
                  }}
                  className="px-8 py-4 bg-[#1d1d1f] hover:bg-black text-white rounded-full font-black text-[15px] shadow-lg shadow-black/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                  Start Printing
                </button>
              ) : barcodePrintStatus === 'printing' ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl flex items-center justify-center animate-bounce">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                  </div>
                  <p className="text-[13px] font-bold text-[#1d1d1f] animate-pulse">Connecting to printer...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1d1d1f]">Print Successful!</h3>
                  <p className="text-[13px] text-[#6e6e73] font-medium text-center">Your labels have been sent to the thermal printer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
