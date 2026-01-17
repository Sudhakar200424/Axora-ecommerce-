import React from 'react';

const BespokeServices: React.FC = () => {
    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-24 pb-16 px-6 transition-colors">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest mb-4">Bespoke Services</h1>
                    <p className="text-xs text-gold uppercase tracking-[0.3em]">Exclusively Yours</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-neutral-600 dark:text-neutral-300 font-sans">
                    <div className="bg-white dark:bg-clay p-10 shadow-sm border border-gold/10 hover:border-gold/30 transition-all group">
                        <h3 className="text-xl font-serif text-charcoal dark:text-offwhite mb-4">Made to Measure</h3>
                        <p className="text-xs leading-loose mb-6">
                            Experience the ultimate luxury of a garment crafted solely for you. Our master tailors will guide you through a private consultation, selecting from our archive of rare fabrics to create a silhouette that perfectly complements your form.
                        </p>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-gold group-hover:text-charcoal dark:group-hover:text-white transition-colors">Request Appointment →</button>
                    </div>

                    <div className="bg-white dark:bg-clay p-10 shadow-sm border border-gold/10 hover:border-gold/30 transition-all group">
                        <h3 className="text-xl font-serif text-charcoal dark:text-offwhite mb-4">Personal Styling</h3>
                        <p className="text-xs leading-loose mb-6">
                            Whether curating a seasonal wardrobe or finding the perfect ensemble for a gala, our styling concierge offers impeccable advice tailored to your personal aesthetic and lifestyle needs.
                        </p>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-gold group-hover:text-charcoal dark:group-hover:text-white transition-colors">Contact Stylist →</button>
                    </div>

                    <div className="bg-white dark:bg-clay p-10 shadow-sm border border-gold/10 hover:border-gold/30 transition-all group md:col-span-2">
                        <h3 className="text-xl font-serif text-charcoal dark:text-offwhite mb-4">Corporate Gifting</h3>
                        <p className="text-xs leading-loose mb-6">
                            Leave a lasting impression with gifts that speak of refinement and taste. We offer volume gifting solutions with custom packaging and monogramming options for your distinguished clients and partners.
                        </p>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-gold group-hover:text-charcoal dark:group-hover:text-white transition-colors">Download Catalogue →</button>
                    </div>
                </div>

                <div className="mt-16 text-center border-t border-gold/20 pt-10">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">For immediate inquiries</p>
                    <p className="text-xl font-serif text-charcoal dark:text-offwhite">concierge@axoramaison.com</p>
                </div>
            </div>
        </div>
    );
};

export default BespokeServices;
