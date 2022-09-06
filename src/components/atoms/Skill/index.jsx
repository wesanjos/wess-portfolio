import Image from 'next/image';

export default function Skill({ skillName, srcIcon }) {
  return (
    <div className="skill">
      <Image
        className="skill__icon"
        alt={skillName}
        src={srcIcon}
        width="48"
        height="48"
      />
      <span>{skillName}</span>
    </div>
  );
}
