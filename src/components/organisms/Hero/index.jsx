import { useParallax } from 'react-scroll-parallax';

import HeroContent from '../../molecules/HeroContent';

export default function Hero() {
  // const { ref } = useParallax({ speed: 20, easing: 'easeOut' });

  return (
    <section className="hero" id="home">
      <HeroContent />
    </section>
  );
}
