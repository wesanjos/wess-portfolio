import ExperienceTitle from '../../atoms/ExperienceTitle';

export default function ExperienceList() {
  return (
    <div className="experienceList">
      <ul className="experienceList__container">
        <li>
          <ExperienceTitle experienceName="70% Desenvolvedor Front-end" />
        </li>
        <li>
          <ExperienceTitle experienceName="30% UI & UX Design" />
        </li>
        <li>
          <ExperienceTitle experienceName="10% Desenvolvedor Back-end" />
        </li>
      </ul>
    </div>
  );
}
