import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-24 pb-16 px-6 transition-colors">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-3xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest mb-10">Terms & Conditions</h1>

                <div className="space-y-8 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">1. General Overview</h2>
                        <p>Welcome to AXORA MAISON. By accessing our website and purchasing our products, you verify that you agree to be bound by the following terms and conditions. These terms apply to all users of the site, including browsers, vendors, customers, merchants, and contributors of content.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">2. Detailed Service Policy</h2>
                        <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">3. Product Accuracy</h2>
                        <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to limit the sales of our products or Services to any person, geographic region or jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">4. Pricing & Payment</h2>
                        <p>All prices are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">5. Governing Law</h2>
                        <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.</p>
                    </section>

                    <p className="pt-8 border-t border-neutral-200 dark:border-neutral-700">Last Updated: January 2026</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
