
import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const CATEGORY_IMAGES: Record<string, string> = {
  'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=500',
  'Apparel': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500',
  'Home': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=500',
  'Timepieces': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=500',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500',
  'Accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
  'Footwear': 'https://i.pinimg.com/736x/e2/9a/cf/e29acf8f97b73d45c258ca040a603a0f.jpg',
  'Fragrance': 'https://i.pinimg.com/1200x/a6/1b/a6/a61ba625b404644e6c7056e6b552206c.jpg',
  'Bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=500'
};

const DEFAULT_CAT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500';

const Home: React.FC = () => {
  const { products } = useShop();

  const luxuryCategories = React.useMemo(() => {
    // Show all predefined categories to maintain high-end boutique feel
    return Object.keys(CATEGORY_IMAGES).map(cat => ({
      name: cat,
      img: CATEGORY_IMAGES[cat]
    }));
  }, []);

  const featured = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-4 transition-colors">
      {/* High-End Category Strip */}
      <div className="bg-white dark:bg-clay py-6 shadow-sm overflow-x-auto no-scrollbar border-b border-gold/10">
        <div className="container mx-auto px-6 flex items-center justify-between gap-12 min-w-[800px]">
          {luxuryCategories.map(cat => (
            <Link key={cat.name} to={`/catalog?q=${cat.name}`} className="flex flex-col items-center gap-3 group">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold transition-all duration-500 shadow-xl">
                <img src={cat.img} alt={cat.name} className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-700" />
              </div>
              <span className="text-[10px] font-bold text-charcoal dark:text-offwhite uppercase tracking-widest group-hover:text-gold transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="container mx-auto px-6 py-6 md:py-8">
        <div className="relative h-[400px] md:h-[450px] overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000" className="w-full h-full object-cover" alt="Elite Season" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16">
            <span className="text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] mb-4">Curated Heritage</span>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 tracking-wide">The Season of Gold</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Link to="/catalog" className="bg-gold text-charcoal px-8 py-3 md:px-10 md:py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all text-center">Shop The Collection</Link>
              <Link to="/catalog" className="border border-white text-white px-8 py-3 md:px-10 md:py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-charcoal transition-all text-center">Atelier News</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Boutique Rows */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 border-b border-gold/10 pb-6">
          <div>
            <h2 className="text-3xl font-serif dark:text-offwhite mb-2">Exquisite Selections</h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">Handpicked items for the connoisseur</p>
          </div>
          <Link to="/catalog" className="text-[10px] font-bold uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-charcoal dark:hover:text-offwhite transition-colors">Browse All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {products.slice(0, 50).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="bg-charcoal text-offwhite py-24 mt-12">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8 block">Legacy Since 1924</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-relaxed italic">"Luxury is the quality of attention we give to things."</h2>
          <div className="w-20 h-px bg-gold/50 mx-auto"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
