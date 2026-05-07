import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Contact from '../components/home/Contact';
import Footer from '../components/layout/Footer';
import About from '../components/home/About';


const Home = () => {
    return (
        <main className="scroll-smooth">
            <div id="home">
                <Hero />
            </div>
            <HowItWorks />

            <About />
            <Contact />
            <Footer />
        </main>
    );
};

export default Home;