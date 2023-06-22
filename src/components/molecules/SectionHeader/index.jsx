import Subtitle from '../../atoms/Subtitle';

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <Subtitle subtitle={subtitle} />
      <h3 className="section-header__title">{title}</h3>
    </div>
  );
}
