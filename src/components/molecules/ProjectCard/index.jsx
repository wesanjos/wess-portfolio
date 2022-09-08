import Image from 'next/image';
import TechList from '../TechList';

/* eslint-disable jsx-a11y/alt-text */
export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  techList,
}) {
  return (
    <div className="projectCard">
      <div className="projectCard__overlay" />

      <div className="projectCard__container">
        <Image
          src={projectImage}
          width="430"
          height="650"
          objectFit="contain"
        />

        <div className="projectCard__header">
          <h4>{projectName}</h4>
          <span>{projectDescription}</span>

          <TechList techList={techList} />
        </div>
      </div>
    </div>
  );
}
