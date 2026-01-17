import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-offwhite dark:bg-charcoal pt-24 pb-16 px-6 transition-colors">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-3xl font-serif text-charcoal dark:text-offwhite uppercase tracking-widest mb-10">Privacy Policy</h1>

                <div className="space-y-8 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
                    <p className="italic">At AXORA MAISON, we respect your privacy and represent a commitment to protecting your personal data.</p>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">1. Data Collection</h2>
                        <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">2. Use of Information</h2>
                        <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you and screen our orders for potential risk or fraud.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">3. Sharing of Data</h2>
                        <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site.</p>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase text-gold mb-4 tracking-widest">4. Security</h2>
                        <p>To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.</p>
                    </section>

                    <p className="pt-8 border-t border-neutral-200 dark:border-neutral-700">For privacy concerns, please contact: privacy@axoramaison.com</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
