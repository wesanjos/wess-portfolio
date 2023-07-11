import HeroContent from '../../molecules/HeroContent';

export default function Hero({ anchor, content, photo }) {
  return (
    <section className="hero" id="home">
      <HeroContent anchor={anchor} heroInfo={content} photoInfo={photo} />
    </section>
  );
}
