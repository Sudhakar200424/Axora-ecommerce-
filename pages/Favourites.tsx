import React from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Favourites: React.FC = () => {
    const { favourites } = useShop();

    if (favourites.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-offwhite dark:bg-charcoal text-charcoal dark:text-offwhite">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 text-gold opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-2xl font-serif mb-4">You haven't saved any items yet.</h2>
                <p className="text-neutral-400 mb-8 text-center max-w-md">Start your collection by tapping the heart icon on any product.</p>
                <Link to="/catalog" className="px-8 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-8 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b border-neutral-200 dark:border-neutral-700 pb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-charcoal dark:text-gold mb-2">My Wishlist</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-serif italic">{favourites.length} items saved specially for you</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {favourites.map(product => (
                        <div key={product.id} className="h-[500px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favourites;
