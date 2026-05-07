import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 px-6">
            <div className="max-w-4xl mx-auto glass-card p-10 border border-primary/20">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Get In <span className="text-accent">Touch</span></h2>
                    <p className="text-text-secondary mt-2">Have any questions? Send us a message.</p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Name" className="bg-background border border-border-muted p-4 rounded-lg focus:border-primary outline-none" />
                    <input type="email" placeholder="Email" className="bg-background border border-border-muted p-4 rounded-lg focus:border-primary outline-none" />
                    <textarea placeholder="Message" className="md:col-span-2 bg-background border border-border-muted p-4 rounded-lg h-32 focus:border-primary outline-none"></textarea>
                    <button className="md:col-span-2 bg-secondary py-4 rounded-lg font-bold hover:opacity-90 transition">Send Message</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;