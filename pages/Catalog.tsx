
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const Catalog: React.FC = () => {
  const { products } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [category, setCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    // Show all luxury departments to maintain brand image
    const order = ['All', 'Apparel', 'Footwear', 'Accessories', 'Timepieces', 'Fragrance', 'Bags', 'Electronics', 'Home', 'Furniture'];
    const existingCats = products.map(p => p.category);
    const allUnique = [...new Set([...order, ...existingCats])];

    return allUnique.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => category === 'All' || p.category === category)
      .filter(p => {
        if (!query) return true;
        const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
        const productText = `${p.name} ${p.category} ${p.description}`.toLowerCase();

        return keywords.every(word => {
          // 1. Exact match
          if (productText.includes(word)) return true;

          // 2. Singular match (simple plural removal)
          if (word.endsWith('s') && productText.includes(word.slice(0, -1))) return true;

          // 3. Smart Category Mappings
          // Handle "mobiles", "phones"
          if (['mobile', 'mobiles', 'phone', 'phones', 'smartphone', 'smartphones'].includes(word) && p.category === 'Electronics') {
            // Heuristic: If it's Electronics but NOT clearly another known type, assume it's a mobile/phone
            const isNonPhone = productText.includes('laptop') ||
              productText.includes('watch') ||
              productText.includes('speaker') ||
              productText.includes('headphone') ||
              productText.includes('earbud') ||
              productText.includes('mouse') ||
              productText.includes('keyboard') ||
              productText.includes('television') ||
              productText.includes('tv');
            return !isNonPhone;
          }

          // Handle "laptops"
          if (['laptop', 'laptops', 'computer', 'computers'].includes(word) && p.category === 'Electronics') {
            return productText.includes('laptop') || productText.includes('macbook') || productText.includes('notebook');
          }

          // Handle "watches" (Timepieces or Smart Watches)
          if (['watch', 'watches'].includes(word)) {
            return p.category === 'Timepieces' || productText.includes('watch');
          }

          return false;
        });
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [products, category, sortBy, query]);

  return (
    <div className="bg-offwhite dark:bg-charcoal min-h-screen py-6 md:py-10 transition-colors">
      <div className="container mx-auto px-6">

        {/* Mobile Filter Toggle & Sort Header */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-charcoal dark:text-offwhite border border-neutral-300 dark:border-neutral-700 px-4 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            Refine
          </button>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-gold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-charcoal dark:text-offwhite p-0 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileFiltersOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-white dark:bg-clay shadow-2xl z-50 transform transition-transform duration-500 ease-out lg:static lg:transform-none lg:w-72 lg:bg-transparent lg:shadow-none lg:z-auto ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="h-full overflow-y-auto p-8 lg:p-0 lg:overflow-visible">
            <div className="flex justify-between items-center mb-8 lg:hidden">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-charcoal dark:text-offwhite">Refine Selection</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="text-neutral-400 hover:text-charcoal dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-white dark:bg-clay lg:p-8 lg:shadow-xl lg:border-t-2 lg:border-gold lg:sticky lg:top-28">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-4 hidden lg:block">Filters</h2>

              <div className="mb-10">
                <h3 className="text-[10px] font-bold uppercase text-gold mb-6 tracking-widest">Collections</h3>
                <div className="space-y-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        // Clear search query when explicitly navigating categories
                        if (query) navigate('/catalog');
                        setIsMobileFiltersOpen(false); // Close drawer on selection
                      }}
                      className={`block w-full text-left text-[11px] uppercase tracking-widest transition-all ${category === cat ? 'text-charcoal dark:text-offwhite font-bold pl-4 border-l-2 border-gold' : 'text-neutral-400 hover:text-gold'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Collection Grid */}
          <div className="flex-grow">
            {/* Desktop Sort Header */}
            <div className="hidden lg:flex flex-wrap items-center justify-between mb-10 gap-6 bg-white dark:bg-clay p-6 shadow-sm border-b border-gold/10">
              <p className="text-xs uppercase tracking-[0.15em] font-medium text-neutral-500">
                Showcasing {filteredProducts.length} results {query && `for "${query}"`}
              </p>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gold">Sort:</span>
                {['Relevance', 'Price-Low', 'Price-High'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt.toLowerCase())}
                    className={`transition-colors ${sortBy === opt.toLowerCase() ? 'text-charcoal dark:text-offwhite border-b border-gold' : 'text-neutral-400 hover:text-gold'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Result Count */}
            <p className="lg:hidden text-[10px] uppercase tracking-[0.15em] font-medium text-neutral-500 mb-6 text-center">
              {filteredProducts.length} styles found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white dark:bg-clay shadow-sm mt-8">
                <h3 className="text-2xl font-serif text-charcoal dark:text-offwhite mb-4 italic">No such desire found.</h3>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Please refine your exploration criteria</p>
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default Catalog;
