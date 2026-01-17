
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // Electronics - Mobiles
  {
    id: 'e1',
    name: 'Apple iPhone 15 Pro (Black Titanium)',
    category: 'Electronics',
    price: 134900,
    description: 'Latest iPhone with titanium design and powerful performance.',
    images: ['https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    availability: true,
    sellerId: 'system-seller',
    featured: true
  },
  {
    id: 'e2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    price: 129999,
    description: 'High-performance Android smartphone with S-Pen.',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800'],
    sellerId: 'system-seller',
    availability: true
  },
  {
    id: 'e3',
    name: 'Google Pixel 8 Pro',
    category: 'Electronics',
    price: 106999,
    description: 'The AI-powered phone from Google.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800'],
    sellerId: 'system-seller',
    availability: true
  },


  // Electronics - Laptops
  {
    id: 'e4',
    name: 'MacBook Air M2',
    category: 'Electronics',
    price: 99900,
    description: 'Super thin and fast laptop for everyday use. Apple M2 Chip.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800'],
    availability: true
  },
  {
    id: 'e5',
    name: 'Dell XPS 13 Laptop',
    category: 'Electronics',
    price: 115000,
    description: 'Compact and powerful Windows laptop with infinity display.',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800'],
    availability: true
  },
  {
    id: 'e6',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics',
    price: 29990,
    description: 'Industry leading noise cancelling headphones.',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800'],
    availability: true
  },
  {
    id: 'e7',
    name: 'OnePlus 12 Pro',
    category: 'Electronics',
    price: 69999,
    description: 'Flagship performance with Snapdragon processor and fast charging.',
    images: ['https://i.pinimg.com/736x/45/b1/18/45b1188e6bb9dd0e4e0f9279cd703986.jpg'],
    availability: true
  },
  {
    id: 'e8',
    name: 'Xiaomi 14 Ultra',
    category: 'Electronics',
    price: 79999,
    description: 'Premium camera smartphone with Leica optics.',
    images: ['https://i.pinimg.com/736x/13/e1/88/13e18842478bc532e8287095b6623c18.jpg'],
    availability: true
  },
  {
    id: 'e9',
    name: 'Nothing Phone (2)',
    category: 'Electronics',
    price: 44999,
    description: 'Unique transparent design with Glyph interface.',
    images: ['https://i.pinimg.com/736x/bd/81/0b/bd810beeb7d2cc48f4165a0f151d704a.jpg'],
    availability: true
  },
  {
    id: 'e10',
    name: 'Vivo X100 Pro',
    category: 'Electronics',
    price: 89999,
    description: 'Professional photography smartphone with ZEISS camera.',
    images: ['https://i.pinimg.com/736x/1f/69/d1/1f69d1b2717c5be010d9787e0b30b3c1.jpg'],
    availability: true
  },
  {
    id: 'e11',
    name: 'Realme GT 6 Pro',
    category: 'Electronics',
    price: 35999,
    description: 'Powerful performance phone with high refresh rate display.',
    images: ['https://i.pinimg.com/736x/de/fe/c8/defec8a5dc3c793c53a3517181247e95.jpg'],
    availability: true
  },
  {
    id: 'e12',
    name: 'iQOO Neo 9 Pro',
    category: 'Electronics',
    price: 38999,
    description: 'Gaming-focused smartphone with fast refresh display.',
    images: ['https://i.pinimg.com/474x/d2/a0/b0/d2a0b057ac3fc9b9f640323f7eb80455.jpg'],
    availability: true
  },
  {
    id: 'e13',
    name: 'Apple AirPods Pro (2nd Generation)',
    category: 'Electronics',
    price: 24999,
    description: 'Active Noise Cancellation with spatial audio experience.',
    images: ['https://i.pinimg.com/736x/3a/71/2e/3a712e6130c1bbd2ec78b300e7e0ba0d.jpg'],
    availability: true,
    featured: true
  },
  {
    id: 'e14',
    name: 'Apple AirPods (3rd Generation)',
    category: 'Electronics',
    price: 19999,
    description: 'Immersive sound with adaptive EQ and sweat resistance.',
    images: ['https://i.pinimg.com/736x/25/de/c8/25dec894a8027ca5a661317b62bac669.jpg'],
    availability: true
  },
  {
    id: 'e15',
    name: 'OnePlus Bullets Wireless Z2',
    category: 'Electronics',
    price: 1999,
    description: 'Fast charging Bluetooth neckband with deep bass.',
    images: ['https://i.pinimg.com/736x/ae/a2/84/aea284721d75326dcfaf585875a2d0ec.jpg'],
    availability: true
  },
  {
    id: 'e16',
    name: 'Realme Buds Wireless 3',
    category: 'Electronics',
    price: 1799,
    description: 'ANC-enabled neckband with immersive audio.',
    images: ['https://i.pinimg.com/736x/58/d6/78/58d678fef4ddeb7453b4fa8a5cc37d41.jpg'],
    availability: true
  },
  {
    id: 'e17',
    name: 'JBL Flip 6 Bluetooth Speaker',
    category: 'Electronics',
    price: 9999,
    description: 'Portable waterproof speaker with powerful bass.',
    images: ['https://i.pinimg.com/736x/5d/ca/b2/5dcab206655f0a5cf1e53588dbfb561a.jpg'],
    availability: true
  },
  {
    id: 'e18',
    name: 'boAt Stone 1200 Bluetooth Speaker',
    category: 'Electronics',
    price: 3999,
    description: 'Loud stereo sound with RGB lights and deep bass.',
    images: ['https://i.pinimg.com/736x/19/7d/67/197d6784a6e1b29714f72afac8a1bc36.jpg'],
    availability: true
  },
  {
    id: 'e19',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics',
    price: 34999,
    description: 'Industry-leading noise cancellation with premium comfort.',
    images: ['https://i.pinimg.com/736x/c1/01/af/c101af9607f135093caba7e61934c632.jpg'],
    availability: true
  },
  {
    id: 'e20',
    name: 'Samsung S24 Ultra',
    category: 'Electronics',
    price: 150000,
    description: 'Affordable smartphone with Super AMOLED display and long battery life.',
    images: ['https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg'],
    availability: true
  },
  {
    id: 'e21',
    name: 'Samsung Galaxy A36 5G',
    category: 'Electronics',
    price: 27999,
    description: '5G smartphone with smooth performance and premium design.',
    images: ['https://i.pinimg.com/1200x/61/ea/9d/61ea9dda3d1bfd3d0f732599fe85e7ef.jpg'],
    availability: true
  },
  {
    id: 'e22',
    name: 'Samsung Galaxy S23 Ultra',
    category: 'Electronics',
    price: 114999,
    description: 'Ultra flagship phone with 200MP camera and S-Pen support.',
    images: ['https://i.pinimg.com/736x/bc/c2/4d/bcc24d484db99457d18aa41ec7eba24f.jpg'],
    availability: true,
    featured: true
  },
  {
    id: 'e23',
    name: 'Apple iPhone 15',
    category: 'Electronics',
    price: 79900,
    description: 'Powerful iPhone with A16 Bionic chip and advanced camera system.',
    images: ['https://i.pinimg.com/736x/47/d2/1b/47d21bcf356c6f915108e9e7cd173b17.jpg'],
    availability: true
  },
  {
    id: 'e24',
    name: 'Apple iPhone 14 Plus',
    category: 'Electronics',
    price: 69900,
    description: 'Large display iPhone with long battery life and premium build.',
    images: ['https://i.pinimg.com/1200x/b5/3e/e6/b53ee66401532fe2e09c000f1b1ed149.jpg'],
    availability: true
  },
  {
    id: 'e25',
    name: 'Apple iPhone 13',
    category: 'Electronics',
    price: 59900,
    description: 'Reliable performance with dual-camera system and OLED display.',
    images: ['https://i.pinimg.com/736x/43/de/29/43de29f649839d65036b98dd317b9325.jpg'],
    availability: true
  },
  {
    id: 'e26',
    name: 'Apple iPhone SE (3rd Generation)',
    category: 'Electronics',
    price: 49900,
    description: 'Compact iPhone with A15 Bionic chip and Touch ID.',
    images: ['https://i.pinimg.com/736x/d6/cd/68/d6cd68d511506dfcc1c1e5896d71fb4c.jpg'],
    availability: true
  },
  {
    id: 'e27',
    name: 'Dell Inspiron 15 (12th Gen Intel i5)',
    category: 'Electronics',
    price: 65999,
    description: 'Everyday performance laptop with Full HD display.',
    images: ['https://i.pinimg.com/736x/14/11/80/141180a02b32fff7f4fdacd13348c0b0.jpg'],
    availability: true
  },
  {
    id: 'e28',
    name: 'HP Pavilion 14 Laptop',
    category: 'Electronics',
    price: 62999,
    description: 'Lightweight laptop with powerful performance for work and study.',
    images: ['https://i.pinimg.com/1200x/37/a5/d9/37a5d9176469c76a0ab1453235488c55.jpg'],
    availability: true
  },
  {
    id: 'e29',
    name: 'Apple MacBook Air M2',
    category: 'Electronics',
    price: 114900,
    description: 'Ultra-thin laptop with Apple M2 chip and all-day battery life.',
    images: ['https://i.pinimg.com/1200x/c6/b4/b5/c6b4b5793e801326ea531713f7a748ca.jpg'],
    availability: true,
    featured: true
  },
  {
    id: 'e30',
    name: 'Lenovo IdeaPad Slim 5',
    category: 'Electronics',
    price: 58999,
    description: 'Sleek design laptop with AMD Ryzen processor.',
    images: ['https://i.pinimg.com/1200x/2b/37/42/2b3742b838e9b921f8f7715d7d51635b.jpg'],
    availability: true
  },
  {
    id: 'e31',
    name: 'Acer Aspire 7 Gaming Laptop',
    category: 'Electronics',
    price: 74999,
    description: 'Gaming-ready laptop with powerful graphics performance.',
    images: ['https://i.pinimg.com/736x/bd/43/2f/bd432fbe210ee5387c8fbf183240d41c.jpg'],
    availability: true
  },
  {
    id: 'e32',
    name: 'Logitech Wireless Mouse M331',
    category: 'Electronics',
    price: 1299,
    description: 'Silent-click wireless mouse for smooth productivity.',
    images: ['https://i.pinimg.com/736x/00/6d/5c/006d5ceb95c9c071b383156f6ad8e757.jpg'],
    availability: true
  },
  {
    id: 'e33',
    name: 'Logitech MK270 Wireless Keyboard & Mouse Combo',
    category: 'Electronics',
    price: 2499,
    description: 'Reliable wireless keyboard and mouse combo for daily use.',
    images: ['https://i.pinimg.com/1200x/4a/12/d5/4a12d590400942a9fb97e725eb3add6c.jpg'],
    availability: true
  },
  {
    id: 'e34',
    name: 'Redragon Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 3999,
    description: 'RGB mechanical keyboard with tactile switches.',
    images: ['https://i.pinimg.com/736x/ca/d2/10/cad210e790351a57e4f5834d83340f4e.jpg'],
    availability: true
  },
  {
    id: 'e35',
    name: 'HP Wired Optical Mouse',
    category: 'Electronics',
    price: 599,
    description: 'Ergonomic wired mouse with precise tracking.',
    images: ['https://i.pinimg.com/1200x/da/7a/e2/da7ae2fabd8d4c3776142f89771f55e7.jpg'],
    availability: true
  },

  // Home Appliances
  {
    id: 'h1',
    name: 'LG Front Load Washing Machine',
    category: 'Home',
    price: 34990,
    description: 'Efficient washing machine with steam wash and silent motor.',
    images: ['https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    availability: true
  },
  {
    id: 'h2',
    name: 'Dyson Canister Vacuum Cleaner',
    category: 'Home',
    price: 29900,
    description: 'Powerful suction for deep cleaning your home.',
    images: ['https://i.pinimg.com/736x/de/f8/8f/def88ff82ee51a02dc12ae48026ef599.jpg'],
    availability: true
  },
  {
    id: 'h3',
    name: 'Philips Air Fryer',
    category: 'Home',
    price: 8999,
    description: 'Cook healthy food with rapid air technology.',
    images: ['https://i.pinimg.com/736x/b3/8d/cd/b38dcd8ca81147a8609793908232631c.jpg'],
    availability: true
  },
  {
    id: 'h4',
    name: 'Nespresso Coffee Machine',
    category: 'Home',
    price: 14500,
    description: 'Barista quality coffee at home with one touch.',
    images: ['https://images.unsplash.com/photo-1637029436347-e33bf98a5412?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    availability: true
  },
  {
    id: 'h5',
    name: 'Samsung Double Door Refrigerator',
    category: 'Home',
    price: 42990,
    description: 'Frost-free refrigerator with digital inverter technology.',
    images: ['https://i.pinimg.com/736x/2d/ed/65/2ded6543444b1d5be9b78808db85eeba.jpg'],
    availability: true
  },
  {
    id: 'h6',
    name: 'Bosch Dishwasher',
    category: 'Home',
    price: 38990,
    description: 'Energy-efficient dishwasher with multiple wash programs.',
    images: ['https://i.pinimg.com/736x/e3/b8/a0/e3b8a08152334e5b5ccc69ee78d5cb43.jpg'],
    availability: true
  },
  {
    id: 'h7',
    name: 'IFB Microwave Oven',
    category: 'Home',
    price: 12990,
    description: 'Convection microwave oven with auto-cook menus.',
    images: ['https://i.pinimg.com/736x/8b/5e/68/8b5e68188a9e4741d03b6dd8accadafd.jpg'],
    availability: true
  },
  {
    id: 'h8',
    name: 'Kent RO Water Purifier',
    category: 'Home',
    price: 16999,
    description: 'Advanced RO + UV + UF water purification system.',
    images: ['https://i.pinimg.com/1200x/f4/bf/86/f4bf8619bcb7e0514db77f635357c648.jpg'],
    availability: true
  },
  {
    id: 'h9',
    name: 'Havells Tower Fan',
    category: 'Home',
    price: 7999,
    description: 'Slim tower fan with remote control and silent airflow.',
    images: ['https://i.pinimg.com/736x/32/7f/ee/327feeeaea7fa5126b41a26db0122b44.jpg'],
    availability: true
  },
  {
    id: 'h10',
    name: 'Prestige Induction Cooktop',
    category: 'Home',
    price: 3499,
    description: 'Energy-efficient induction cooktop with preset menus.',
    images: ['https://i.pinimg.com/736x/15/5b/1c/155b1c57c052896be3507f0bc3ed4392.jpg'],
    availability: true
  },


  // Furniture
  {
    id: 'fur1',
    name: 'Modern 3-Seater Sofa',
    category: 'Furniture',
    price: 45000,
    description: 'Comfortable grey fabric sofa for your living room.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800'],
    availability: true,
    featured: true
  },
  {
    id: 'fur2',
    name: 'Wooden Dining Table Set',
    category: 'Furniture',
    price: 32000,
    description: 'Solid wood table with 4 chairs for family dining.',
    images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800'],
    availability: true
  },
  {
    id: 'fur3',
    name: 'King Size Bed with Storage',
    category: 'Furniture',
    price: 55000,
    description: 'Spacious bed with hydraulic storage and cushioned headboard.',
    images: ['https://i.pinimg.com/736x/d1/45/75/d14575348389c647b85a9f51eaa4c664.jpg'],
    availability: true
  },
  {
    id: 'fur4',
    name: 'Queen Size Upholstered Bed',
    category: 'Furniture',
    price: 48000,
    description: 'Elegant upholstered bed with soft fabric finish.',
    images: ['https://i.pinimg.com/1200x/7d/92/97/7d929794f5f7a08d2d2b95276b707529.jpg'],
    availability: true
  },
  {
    id: 'fur5',
    name: 'Modern Wooden Sofa Set',
    category: 'Furniture',
    price: 42000,
    description: 'Premium wooden sofa with soft cushions.',
    images: ['https://i.pinimg.com/736x/8b/a6/30/8ba630ed3420b18db5b7310516bcb931.jpg'],
    availability: true
  },
  {
    id: 'fur6',
    name: '6 Seater Dining Table',
    category: 'Furniture',
    price: 38000,
    description: 'Solid wood dining table with elegant finish.',
    images: ['https://i.pinimg.com/1200x/f3/ed/03/f3ed03a71383574f35e74efd4be2e50a.jpg'],
    availability: true
  },
  {
    id: 'fur7',
    name: 'Office Study Table',
    category: 'Furniture',
    price: 12000,
    description: 'Compact study table with drawers.',
    images: ['https://i.pinimg.com/1200x/6f/2d/e6/6f2de656d8e7dfb288a74831e6a1778a.jpg'],
    availability: true
  },
  {
    id: 'fur8',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 9500,
    description: 'Comfortable chair with lumbar support.',
    images: ['https://i.pinimg.com/736x/7a/3c/5c/7a3c5ca272bf8f2e4b2ad7c0f2d97632.jpg'],
    availability: true
  },
  {
    id: 'fur9',
    name: 'Sliding Door Wardrobe',
    category: 'Furniture',
    price: 60000,
    description: 'Modern wardrobe with mirror finish.',
    images: ['https://i.pinimg.com/736x/f5/72/7e/f5727e31edf5b8876d86e277ed09d56c.jpg'],
    availability: true
  },
  {
    id: 'fur10',
    name: 'TV Entertainment Unit',
    category: 'Furniture',
    price: 18000,
    description: 'Wall-mounted TV unit with shelves.',
    images: ['https://i.pinimg.com/736x/09/2d/d0/092dd08a04be3e31bdebed561e798447.jpg'],
    availability: true
  },
  {
    id: 'fur11',
    name: 'Recliner Sofa Chair',
    category: 'Furniture',
    price: 25000,
    description: 'Single seater recliner for relaxation.',
    images: ['https://i.pinimg.com/1200x/bb/e6/94/bbe694b229fb6d97de128960413619c6.jpg'],
    availability: true
  },
  {
    id: 'fur12',
    name: 'Bookshelf Cabinet',
    category: 'Furniture',
    price: 11000,
    description: 'Open shelf bookshelf for living room.',
    images: ['https://i.pinimg.com/736x/0e/40/16/0e4016870ad2f226e54b18f435cbb041.jpg'],
    availability: true
  },
  {
    id: 'fur13',
    name: 'Coffee Table',
    category: 'Furniture',
    price: 7500,
    description: 'Minimalist coffee table design.',
    images: ['https://i.pinimg.com/1200x/15/4b/3f/154b3fa7343115ea80560b91f8acaf82.jpg'],
    availability: true
  },
  {
    id: 'fur14',
    name: 'Bedside Table',
    category: 'Furniture',
    price: 4500,
    description: 'Compact bedside table with drawer.',
    images: ['https://i.pinimg.com/1200x/d1/91/b2/d191b23e72c0ca2509f27c35016a2de2.jpg'],
    availability: true
  },
  {
    id: 'fur15',
    name: 'Wooden Shoe Rack',
    category: 'Furniture',
    price: 8000,
    description: 'Closed shoe rack with seating.',
    images: ['https://i.pinimg.com/1200x/e5/10/4e/e5104ebeb2b96200fa375d964f2b3eb6.jpg'],
    availability: true
  },
  {
    id: 'fur16',
    name: 'L-Shaped Sofa',
    category: 'Furniture',
    price: 58000,
    description: 'Large L-shaped sofa for family seating.',
    images: ['https://i.pinimg.com/736x/0d/ce/25/0dce2549de1039c61b167a9b0ce3eda3.jpg'],
    availability: true
  },
  {
    id: 'fur17',
    name: 'Dressing Table with Mirror',
    category: 'Furniture',
    price: 16000,
    description: 'Elegant dressing table with storage.',
    images: ['https://i.pinimg.com/1200x/e5/d7/90/e5d790176565c24e3019287196de8cbf.jpg'],
    availability: true
  },
  {
    id: 'fur18',
    name: 'Wall Mounted Bookshelf',
    category: 'Furniture',
    price: 6000,
    description: 'Modern floating bookshelf design.',
    images: ['https://i.pinimg.com/736x/b6/a4/9f/b6a49fe70ff22a945fa5f7af1e125343.jpg'],
    availability: true
  },

  // Apparel (Sarees & Dresses)
  {
    id: 'c1',
    name: 'Kanjeevaram Silk Saree',
    category: 'Apparel',
    price: 12999,
    description: 'Traditional silk saree with rich zari border.',
    images: ['https://i.pinimg.com/736x/71/f3/0b/71f30be75d15ebdb5994d4b6542aacf4.jpg'],
    sizes: ['Free Size'],
    availability: true,
    featured: true
  },
  {
    id: 'c2',
    name: 'Cotton Printed Kurtis (Set of 2)',
    category: 'Apparel',
    price: 1499,
    description: 'Comfortable daily wear cotton kurtis with floral prints.',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800'],
    sizes: ['M', 'L', 'XL'],
    availability: true
  },
  {
    id: 'c3',
    name: 'Men\'s Slim Fit Jeans',
    category: 'Apparel',
    price: 2499,
    description: 'Stretchable blue denim jeans for casual wear.',
    images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800'],
    sizes: ['30', '32', '34', '36'],
    availability: true
  },
  {
    id: 'c4',
    name: 'Floral Summer Dress',
    category: 'Apparel',
    price: 1800,
    description: 'Lightweight and breezy dress perfect for summer.',
    images: ['https://i.pinimg.com/474x/a8/49/93/a8499339bb231da86dd761cdadf89832.jpg'],
    sizes: ['S', 'M', 'L'],
    availability: true
  },
  {
    id: 'c5',
    name: 'Designer Banarasi Saree',
    category: 'Apparel',
    price: 15999,
    description: 'Elegant Banarasi silk saree with traditional motifs.',
    images: ['https://i.pinimg.com/1200x/f1/78/1f/f1781fe13a75f5e3fde5d2f3e159f71f.jpg'],
    sizes: ['Free Size'],
    availability: true
  },
  {
    id: 'c6',
    name: 'Women Cotton Anarkali Kurti',
    category: 'Apparel',
    price: 2199,
    description: 'Soft cotton Anarkali kurti suitable for daily and festive wear.',
    images: ['https://i.pinimg.com/736x/68/00/cd/6800cd5bb7010b697f0fc741f78df22f.jpg'],
    sizes: ['L', 'XL', 'XXL'],
    availability: true
  },
  {
    id: 'c7',
    name: 'Men Casual Checked Shirt',
    category: 'Apparel',
    price: 1699,
    description: 'Slim-fit checked shirt for casual and office wear.',
    images: ['https://i.pinimg.com/1200x/2b/f0/c9/2bf0c98bdef2f336b8dc53da641bfe9c.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    availability: true
  },
  {
    id: 'c8',
    name: 'Women Party Wear Gown',
    category: 'Apparel',
    price: 3999,
    description: 'Stylish floor-length gown perfect for special occasions.',
    images: ['https://i.pinimg.com/736x/b3/0c/73/b30c73831b28ff09554ffbba44cad83b.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    availability: true
  },
  {
    id: 'c9',
    name: 'Men Formal Trousers',
    category: 'Apparel',
    price: 2299,
    description: 'Classic formal trousers with a comfortable fit.',
    images: ['https://i.pinimg.com/1200x/50/ab/74/50ab74abcec47865ab9f0c2d546a1228.jpg'],
    sizes: ['30', '32', '34', '36', '38'],
    availability: true
  },
  {
    id: 'c10',
    name: 'Women Linen Saree',
    category: 'Apparel',
    price: 6999,
    description: 'Minimalistic linen saree with modern border design.',
    images: ['https://i.pinimg.com/1200x/d9/44/a4/d944a40a976cf6ca70d3979c8d88d641.jpg'],
    sizes: ['Free Size'],
    availability: true
  },
  {
    id: 'c11',
    name: 'Men Hooded Sweatshirt',
    category: 'Apparel',
    price: 1899,
    description: 'Warm and stylish hoodie for winter wear.',
    images: ['https://i.pinimg.com/736x/13/16/9e/13169ec94fe06d5a9fd79fd414a0655f.jpg'],
    sizes: ['L', 'XL', 'XXL', 'XXXL'],
    availability: true
  },
  {
    id: 'c12',
    name: 'Women Straight Fit Pants',
    category: 'Apparel',
    price: 1599,
    description: 'Comfortable straight-fit pants for office and casual use.',
    images: ['https://i.pinimg.com/736x/f3/f1/7a/f3f17a988446610fa00385fbda581387.jpg'],
    sizes: ['28', '30', '32', '34'],
    availability: true
  },
  {
    id: 'c13',
    name: 'Men Ethnic Kurta',
    category: 'Apparel',
    price: 2799,
    description: 'Traditional kurta suitable for festivals and functions.',
    images: ['https://i.pinimg.com/736x/e6/cd/97/e6cd97ad77989e3b3b1c07f78d1d9e48.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    availability: true
  },
  {
    id: 'c14',
    name: 'Women Embroidered Lehenga',
    category: 'Apparel',
    price: 18999,
    description: 'Heavy embroidered lehenga for weddings and receptions.',
    images: ['https://i.pinimg.com/736x/77/58/11/775811b4fb2eb0f40ac7c771bbc831b6.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    availability: true
  },
  {
    id: 'c15',
    name: 'Men Denim Jacket',
    category: 'Apparel',
    price: 3499,
    description: 'Trendy denim jacket for casual outdoor looks.',
    images: ['https://i.pinimg.com/1200x/75/2d/f3/752df33e312395a890b88304457d3fad.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: true
  },


  // Menswear/Accessories
  {
    id: 'w1',
    name: 'Analog Watch for Men',
    category: 'Timepieces',
    price: 4999,
    description: 'Classic silver watch with black dial. Water resistant.',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800'],
    availability: true
  },

  {
    id: 'w2',
    name: 'Chronograph Watch for Men',
    category: 'Timepieces',
    price: 6999,
    description: 'Stylish chronograph watch with stainless steel strap.',
    images: ['https://i.pinimg.com/736x/88/dc/1c/88dc1c3ab7fc882fd7d6e18fedb1efac.jpg'],
    availability: true
  },
  {
    id: 'w3',
    name: 'Smart Fitness Watch',
    category: 'Timepieces',
    price: 3999,
    description: 'Fitness tracking watch with heart rate and sleep monitor.',
    images: ['https://i.pinimg.com/736x/3b/7a/25/3b7a25b829711e5e20a697f55eb76f48.jpg'],
    availability: true
  },
  {
    id: 'w4',
    name: 'Luxury Leather Strap Watch',
    category: 'Timepieces',
    price: 8999,
    description: 'Premium men’s watch with leather strap and minimal dial.',
    images: ['https://i.pinimg.com/736x/49/4b/d5/494bd55295c4e790864f526baf3c4324.jpg'],
    availability: true
  },
  {
    id: 'b1',
    name: 'Leather Office Bag',
    category: 'Accessories',
    price: 3500,
    description: 'Genuine leather laptop bag with multiple compartments.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800'],
    availability: true
  },
  {
    id: 'b2',
    name: 'Men Leather Wallet',
    category: 'Accessories',
    price: 1299,
    description: 'Slim leather wallet with RFID protection.',
    images: ['https://i.pinimg.com/1200x/e8/3a/03/e83a03685675972ac8d161f3556b3841.jpg'],
    availability: true
  },
  {
    id: 'b3',
    name: 'Men Formal Belt',
    category: 'Accessories',
    price: 999,
    description: 'Classic black leather belt for formal wear.',
    images: ['https://i.pinimg.com/1200x/49/6f/79/496f791a49cf82d868e9b55ebcedc241.jpg'],
    availability: true
  },
  {
    id: 'b4',
    name: 'Sunglasses for Men',
    category: 'Accessories',
    price: 1999,
    description: 'UV-protected stylish sunglasses for daily use.',
    images: ['https://i.pinimg.com/736x/c8/bb/3e/c8bb3e36740b0b456f9e7774532c4e9f.jpg'],
    availability: true
  },
  {
    id: 'b5',
    name: 'Men Travel Backpack',
    category: 'Accessories',
    price: 2799,
    description: 'Durable backpack with laptop compartment and USB port.',
    images: ['https://i.pinimg.com/736x/49/1e/21/491e21bb2430f7dbc0956a1519853235.jpg'],
    availability: true
  }

];
