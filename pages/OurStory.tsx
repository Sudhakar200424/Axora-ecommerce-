import React from 'react';

const OurStory: React.FC = () => {
    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-24 pb-16 px-6 transition-colors">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-4xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest mb-10 text-center">Our Story</h1>

                <div className="space-y-8 text-sm leading-loose text-neutral-600 dark:text-neutral-300 font-sans text-justify">
                    <p>
                        Founded by the visionary artisan Sudhakar in the heart of Florence, AXORA MAISON began as a modest atelier dedicated to the pursuit of perfection. Sudhakar, a master of design and fine aesthetics, believed that true luxury lies not in excess, but in the meticulous attention to detail and the soulful integrity of creation.
                    </p>
                    <p>
                        For over a century, AXORA has remained a beacon of quiet luxury. We have weathered eras of fast fashion and fleeting trends by steadfastly adhering to our founding philosophy: "Luxury is the quality of attention we give to things." Each piece in our collection is not merely manufactured; it is crafted, considered, and curated to stand the test of time.
                    </p>
                    <p>
                        Today, under the creative direction of the fourth generation of the Xora family, we continue to bridge the gap between heritage craftsmanship and modern minimalism. We source the finest silks from Como, ethically reared leather from Tuscany, and rare cashmere from Mongolia, ensuring that every touchpoint of our brand exudes an understated elegance.
                    </p>
                    <p>
                        AXORA is more than a brand; it is a legacy. A promise of permanence in a transient world. We invite you to join our story, to wear our history, and to become a custodian of true craftsmanship.
                    </p>
                </div>

                <div className="mt-16 text-center">
                    <span className="text-gold text-lg font-serif italic">"Timeless, by design."</span>
                </div>
            </div>
        </div>
    );
};

export default OurStory;
