import HeroVideo from './HeroVideo';

interface HeroProps {
  setActiveTab?: (tab: 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact') => void;
  onAnimationFinishedChange?: (finished: boolean) => void;
}

export default function Hero({ setActiveTab, onAnimationFinishedChange }: HeroProps) {
  return (
    <HeroVideo setActiveTab={setActiveTab} onAnimationFinishedChange={onAnimationFinishedChange} />
  );
}

