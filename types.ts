
export interface Product {
  id: string;
  name: string;
  category: 'Apparel' | 'Accessories' | 'Timepieces' | 'Fragrance' | 'Electronics' | 'Home' | 'Furniture' | 'Footwear';
  price: number;
  description: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  availability: boolean;
  featured?: boolean;
  sellerId?: string;
  returnPolicy?: 'No Returns' | 'Returns Available';
  returnPeriod?: number; // Days
  codAvailable?: boolean;
}

export interface CartItem extends Product {
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export type PaymentMethod = 'Credit/Debit Card' | 'Net Banking' | 'UPI' | 'Cash on Delivery';

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  orderHistory: Order[];
  savedAddress?: Address;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  estimatedDelivery: string;
  sellerId?: string;
}
