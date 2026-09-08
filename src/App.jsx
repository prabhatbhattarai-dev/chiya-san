import React, { useState } from 'react';
import TeaCupScene from './TeaCupScene';
import MomoSelector from './MomoSelector';
import MenuRow from './MenuRow';
import MenuImage from './MenuImage';
import Kicker from './Kicker';
import Button from './Button';
import SteamMark from './SteamMark';
import Reveal from './Reveal';

// Sample Menu Data
const momoItems = [
  {
    id: 'chicken-momo',
    name: 'Chicken Momo',
    image: '/assets/menu/chicken-momo.jpg',
    prices: { Steam: 220, Fried: 240, Kothey: 250, C-Momo: 270, Jhol: 260 }
  },
  {
    id: 'buff-momo',
    name: 'Buff Momo',
    image: '/assets/menu/buff-momo.jpg',
    prices: { Steam: 200, Fried: 220, Kothey: 230, C-Momo: 250, Jhol: 240 }
  },
  {
    id: 'veg-momo',
    name: 'Veggie & Paneer Momo',
    image: '/assets/menu/veg-momo.jpg',
    prices: { Steam: 180, Fried: 200, Kothey: 210, C-Momo: 230, Jhol: 220 }
  }
];

const specialtyTeas = [
  { name: 'Ilam Organic Gold', unit: 'Pot', note: 'Single-origin high altitude black tea', price: 180 },
  { name: 'Masala Artisan Chai', unit: 'Cup', note: 'Slow-brewed with whole cardamoms, cinnamon, and ginger', price: 120 },
  { name: 'Everest Himalayan Green', unit: 'Pot', note: 'Fresh, delicate floral notes', price: 160 },
  { name: 'Spiced Mt. Everest Milk Tea', unit: 'Cup', note: 'Rich organic CTC brewed in whole milk', price: 140 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('momos');

  return (
    <div className="bg-cream text-charcoal font-body min-h-screen selection:bg-tea selection:text-warmwhite">
      {/* Header / Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <SteamMark color="#315F4D" className="w-8 h-8" />
            <span className="font-display text-2xl font-bold tracking-tight text-deep">
              TEA & MOMOS
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-widest uppercase">
            <a href="#about" className="hover:text-tea transition-colors">Story</a>
            <a href="#menu" className="hover:text-tea transition-colors">Menu</a>
            <a href="#visit" className="hover:text-tea transition-colors">Visit Us</a>
          </div>

          <Button href="#menu" variant="primary">
            Order Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex items-center overflow-hidden">
        <div className="max-w-content mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          
          <Reveal y={40}>
            <Kicker>Artisanal Himalayan Teahouse</Kicker>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light leading-tight text-charcoal mt-4 mb-6">
              Warm Tea. <br />
              <span className="italic text-deep font-normal">Handcrafted</span> Momos.
            </h1>
            <p className="text-lg text-charcoal/80 max-w-lg mb-8 leading-relaxed">
              Step into a space designed for slow lingering. Experience authentic Himalayan flavors, slow-steeped organic teas, and freshly folded dumplings.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#menu" variant="primary">Explore Menu</Button>
              <Button href="#visit" variant="secondary">Find Our Location</Button>
            </div>
          </Reveal>

          {/* Interactive 3D Canvas */}
          <div className="h-[420px] sm:h-[500px] w-full relative">
            <TeaCupScene />
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-warmwhite border-y border-charcoal/10">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <Reveal className="lg:col-span-5">
              <Kicker>Our Ritual</Kicker>
              <h2 className="font-display text-4xl sm:text-5xl text-charcoal mt-3 mb-6">
                Made slowly, shared warmly.
              </h2>
              <p className="text-charcoal/70 mb-4 leading-relaxed">
                Every plate of momos is rolled, filled, and pleated fresh daily using locally sourced ingredients and traditional spices.
              </p>
              <p className="text-charcoal/70 leading-relaxed">
                Paired with direct-trade teas sourced straight from high-altitude estates, we invite you to take a breath and enjoy the moment.
              </p>
            </Reveal>

            <Reveal className="lg:col-span-7 grid grid-cols-2 gap-4">
              <MenuImage 
                src="/assets/menu/tea-prep.jpg" 
                alt="Teahouse Ambiance" 
                tone="wood" 
                className="w-full h-80 rounded-sm shadow-sm"
              />
              <MenuImage 
                src="/assets/menu/momo-plate.jpg" 
                alt="Fresh Steam Momos" 
                tone="terracotta" 
                className="w-full h-80 rounded-sm shadow-sm mt-8"
              />
            </Reveal>

          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="py-24 max-w-content mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <Kicker className="justify-center">Craft Menu</Kicker>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal mt-3">
            Freshly Prepared Daily
          </h2>
        </Reveal>

        {/* Menu Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('momos')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wider uppercase transition-all ${
              activeTab === 'momos'
                ? 'bg-deep text-warmwhite shadow-md'
                : 'bg-warmwhite text-charcoal/70 border border-charcoal/15 hover:border-charcoal/40'
            }`}
          >
            Signature Momos
          </button>
          <button
            onClick={() => setActiveTab('teas')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wider uppercase transition-all ${
              activeTab === 'teas'
                ? 'bg-deep text-warmwhite shadow-md'
                : 'bg-warmwhite text-charcoal/70 border border-charcoal/15 hover:border-charcoal/40'
            }`}
          >
            Organic Teas
          </button>
        </div>

        {/* Dynamic Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'momos' ? (
            <Reveal key="momos-panel">
              <div className="divide-y divide-charcoal/10">
                {momoItems.map((item) => (
                  <MomoSelector key={item.id} item={item} />
                ))}
              </div>
            </Reveal>
          ) : (
            <Reveal key="teas-panel" className="bg-warmwhite p-8 rounded-lg border border-charcoal/10">
              <h3 className="font-display text-2xl text-deep mb-6">Loose Leaf & Brews</h3>
              <div className="space-y-4">
                {specialtyTeas.map((tea, idx) => (
                  <MenuRow key={idx} item={tea} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Location / Visit Section */}
      <section id="visit" className="bg-charcoal text-warmwhite py-24">
        <div className="max-w-content mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <Reveal>
            <Kicker dark>Location & Hours</Kicker>
            <h2 className="font-display text-4xl sm:text-5xl mt-3 mb-8">
              Come share a pot with us.
            </h2>

            <div className="space-y-6 text-warmwhite/80">
              <div>
                <h4 className="text-tea uppercase tracking-wider text-xs font-bold mb-1">Address</h4>
                <p className="text-lg">108 Peace Heritage Lane, Patan</p>
              </div>

              <div>
                <h4 className="text-tea uppercase tracking-wider text-xs font-bold mb-1">Hours</h4>
                <p>Tuesday – Sunday: 11:00 AM – 9:00 PM</p>
                <p className="text-warmwhite/50 text-sm">Closed on Mondays</p>
              </div>

              <div>
                <h4 className="text-tea uppercase tracking-wider text-xs font-bold mb-1">Contact & Orders</h4>
                <p>+977 1 555 0192</p>
                <p>hello@teamomos.com</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="bg-deep/30 p-8 border border-warmwhite/10 rounded-sm">
            <h3 className="font-display text-2xl text-warmwhite mb-4">Reserve a Table</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Reservation submitted!'); }} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warmwhite/70 mb-1">Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-charcoal/80 border border-warmwhite/20 px-4 py-3 text-warmwhite focus:outline-none focus:border-tea transition-colors" 
                  placeholder="Your Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warmwhite/70 mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-charcoal/80 border border-warmwhite/20 px-4 py-3 text-warmwhite focus:outline-none focus:border-tea transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-warmwhite/70 mb-1">Guests</label>
                  <select className="w-full bg-charcoal/80 border border-warmwhite/20 px-4 py-3 text-warmwhite focus:outline-none focus:border-tea transition-colors">
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6+ Guests</option>
                  </select>
                </div>
              </div>

              <Button variant="light" className="w-full justify-center mt-4">
                Confirm Booking
              </Button>
            </form>
          </Reveal>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-warmwhite/10 py-8 text-warmwhite/40 text-xs">
        <div className="max-w-content mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Tea & Momos. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-warmwhite transition-colors">Instagram</a>
            <a href="#" className="hover:text-warmwhite transition-colors">Facebook</a>
            <a href="#" className="hover:text-warmwhite transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
