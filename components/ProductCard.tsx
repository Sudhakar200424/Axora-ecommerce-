
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleFavourite, favourites, user } = useShop();
  const isFavourite = favourites.some(p => p.id === product.id);

  const originalPrice = Math.round(product.price * 1.35);
  const discount = 35;

  return (
    <Link to={`/product/${product.id}`} className="group bg-white dark:bg-clay p-4 flex flex-col h-full border border-transparent hover:border-gold/20 transition-all duration-500 hover:shadow-2xl">
      <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-pearl">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-charcoal text-gold text-[8px] font-bold px-3 py-1 uppercase tracking-widest">Atelier Pick</span>
          )}
          <span className="bg-gold text-charcoal text-[8px] font-bold px-3 py-1 uppercase tracking-widest">-{discount}% Off</span>
        </div>
        {(!user || user.role === 'buyer') && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavourite(product);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavourite ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-charcoal'}`} viewBox="0 0 24 24" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest line-clamp-2 dark:text-offwhite pr-4">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-gold">4.8</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-gold" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" /></svg>
          </div>
        </div>

        <p className="text-[10px] text-neutral-400 font-serif italic mb-4">{product.category}</p>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold dark:text-offwhite tracking-tight">₹ {product.price.toLocaleString()}</span>
          <span className="text-[10px] text-neutral-400 line-through">₹ {originalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-full bg-charcoal dark:bg-offwhite text-offwhite dark:text-charcoal py-2 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-gold dark:hover:bg-gold hover:text-charcoal transition-colors">
          View Detail
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
