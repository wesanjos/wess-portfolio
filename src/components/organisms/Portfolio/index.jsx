import ProjectList from '../../molecules/ProjectList';
import SectionHeader from '../../molecules/SectionHeader';

export default function Portfolio({ workHeader, workList }) {
  return (
    <section className="portfolio" id="work">
      <SectionHeader title={`${workHeader.title}`} subtitle={`${workHeader.subtitle}`} />

      <div className="portfolio__container">
        <ProjectList workList={workList} />
      </div>
    </section>
  );
}
