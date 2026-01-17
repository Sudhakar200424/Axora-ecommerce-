import React from 'react';

const Accessibility: React.FC = () => {
    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-24 pb-16 px-6 transition-colors">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-3xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest mb-10">Accessibility Statement</h1>

                <div className="space-y-8 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
                    <p>
                        AXORA MAISON is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
                    </p>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">Conformance Status</h2>
                        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. AXORA MAISON is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">Feedback</h2>
                        <p>We welcome your feedback on the accessibility of AXORA MAISON. Please let us know if you encounter accessibility barriers on AXORA MAISON:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>E-mail: concierge@axoramaison.com</li>
                            <li>E-mail: accessibility@axoramaison.com</li>
                            <li>Postal Address: 124 Luxury Lane, Chennai, India</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">Technical Specifications</h2>
                        <p>Accessibility of AXORA MAISON relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>HTML</li>
                            <li>WAI-ARIA</li>
                            <li>CSS</li>
                            <li>JavaScript</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Accessibility;
