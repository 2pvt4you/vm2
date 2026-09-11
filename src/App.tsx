import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Approvals from './components/Approvals';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Grain, SectionThemeSpy } from './components/ui/Atmosphere';

type TabId = 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero
              setActiveTab={setActiveTab}
              onAnimationFinishedChange={setIsAnimationFinished}
            />
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
            <Hero
              setActiveTab={setActiveTab}
              onAnimationFinishedChange={setIsAnimationFinished}
            />
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
    <div className="min-h-screen bg-ivory text-ink flex flex-col">
      <SectionThemeSpy />
      <Grain />
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAnimationFinished={isAnimationFinished}
      />
      <main className="flex-grow">{renderContent()}</main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
