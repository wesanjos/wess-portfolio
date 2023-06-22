import ProjectList from '../../molecules/ProjectList';
import SectionHeader from '../../molecules/SectionHeader';

export default function Portfolio() {
  return (
    <section className="portfolio" id="works">
      <SectionHeader title="Meus trabalhos" subtitle="Portfólio" />

      <div className="portfolio__container">
        <ProjectList />
      </div>
    </section>
  );
}
