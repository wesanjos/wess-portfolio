import Subtitle from '../../atoms/Subtitle';

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="sectionHeader">
      <Subtitle subtitle={subtitle} />
      <h2 className="sectionHeader__title">{title}</h2>
    </div>
  );
}
