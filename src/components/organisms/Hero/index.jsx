import ExperienceList from '../../molecules/ExperienceList';
import FloatingSocial from '../../molecules/FloatingSocial';
import HeroText from '../../molecules/HeroText';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <HeroText />
        <ExperienceList />
      </div>

      <FloatingSocial/>
    </section>
  );
}
