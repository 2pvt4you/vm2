import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Approvals from './components/Approvals';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact'>('home');
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  // Simple Router based on hash or state
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero setActiveTab={setActiveTab} onAnimationFinishedChange={setIsAnimationFinished} />
            <Products />
            <About />
            <Approvals />
            <Clients />
            <Contact />
          </>
        );
      case 'about':
        return <About />;
      case 'products':
        return <Products />;
      case 'approvals':
        return <Approvals />;
      case 'clients':
        return <Clients />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero setActiveTab={setActiveTab} onAnimationFinishedChange={setIsAnimationFinished} />
            <Products />
            <About />
            <Approvals />
            <Clients />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAnimationFinished={isAnimationFinished} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
