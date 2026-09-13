import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Capability from './components/Capability';
import VisionMission from './components/VisionMission';
import { ManufacturingProcess, QualityAssurance } from './components/ManufacturingProcess';
import Products from './components/Products';
import Approvals from './components/Approvals';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useViewportUnit } from './hooks/useDeviceProfile';

export default function App() {
  useViewportUnit();

  return (
    <div className="min-h-screen bg-vm-paper text-vm-ink">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Capability />
        <VisionMission />
        <ManufacturingProcess />
        <QualityAssurance />
        <Products />
        <Approvals />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
