import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductBridge from './components/ProductBridge';
import Products from './components/Products';
import Approvals from './components/Approvals';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useViewportUnit } from './hooks/useDeviceProfile';

type Tab = 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact';

/**
 * Home is one continuous film:
 *   hero frame-sequence + scroll typography
 *     -> foundry story & photography
 *     -> manufacturing/product bridge
 *     -> interactive product showcase
 *     -> clients -> approvals -> contact
 * Each boundary shares a background tone with the one before it.
 */
function Home({
  setActiveTab,
  onAnimationFinishedChange,
}: {
  setActiveTab: (tab: Tab) => void;
  onAnimationFinishedChange: (finished: boolean) => void;
}) {
  return (
    <>
      <Hero
        setActiveTab={setActiveTab}
        onAnimationFinishedChange={onAnimationFinishedChange}
      />
      <About />
      <ProductBridge />
      <Products />
      <Clients />
      <Approvals />
      <Contact />
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  // Keeps --app-vh honest on iOS Safari without relayouting mid-scroll.
  useViewportUnit();

  const renderContent = () => {
    switch (activeTab) {
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
      case 'home':
      default:
        return (
          <Home
            setActiveTab={setActiveTab}
            onAnimationFinishedChange={setIsAnimationFinished}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-vm-void text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAnimationFinished={isAnimationFinished}
      />
      <main className="flex-grow">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
