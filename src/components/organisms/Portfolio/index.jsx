import ProjectList from '../../molecules/ProjectList';
import SectionHeader from '../../molecules/SectionHeader';

export default function Portfolio() {
  return (
    <section className="portfolio" id="portfolio">
      <SectionHeader title="Portfólio" subtitle="Meus trabalhos" />

      <div className="portfolio__container">
        <ProjectList />
      </div>
    </section>
  );
}
