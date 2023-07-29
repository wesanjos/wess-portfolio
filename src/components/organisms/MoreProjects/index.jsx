import Button from '../../molecules/Button';
import ListOtherProjects from '../../molecules/ListOtherProjects';

export default function MoreProjects({ cta, moreProject }) {
  return (
    <section className="more-projects">
      <div className="more-projects__container">
        <Button btnInfo={cta} />
        <ListOtherProjects listProjects={moreProject} />
      </div>
    </section>
  );
}
