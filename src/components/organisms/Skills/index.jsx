import SectionHeader from '../../molecules/SectionHeader';
import SkillsList from '../../molecules/SkillsList';

export default function Skills() {
  return (
    <section className="skills">
      <SectionHeader title="Skills" />

      <div className="skills__container">
        <SkillsList />
      </div>
    </section>
  );
}
