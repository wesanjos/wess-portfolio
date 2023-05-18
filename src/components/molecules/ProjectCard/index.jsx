/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';
import TechList from '../TechList';

export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  projectLink,
  techList,
  freelancer,
}) {
  const { ref } = useParallax({ speed: 5, easing: 'easeInCubic' });

  return (
    <div className="projectCard" ref={ref}>
      <div className="projectCard__container">
        <Image
          className="projectCard__image"
          src={projectImage}
          alt={projectName}
          width="770"
          height="445"
        />
      </div>

      <div className="projectCard__header">
        <div className="headerCard__container">
          <h4>{projectName}</h4>
          <span>{projectDescription}</span>

          <TechList techList={techList} />
        </div>

        {projectLink !== '#' && (
          <a
            href={projectLink}
            target="_blank"
            rel="noreferrer"
            className="projectCard__link"
          >
            Visualizar site
            <img src="/assets/icons/icon-link.svg" alt="Link de visualização" />
          </a>
        )}

        {freelancer && <p className="projectCard__freelancer">Freelancer</p>}
      </div>
    </div>
  );
}
