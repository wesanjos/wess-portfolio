/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';
import TechList from '../TechList';

export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  techList,
}) {
  const { ref } = useParallax({ speed: 5, easing: 'easeInCubic' });

  return (
    <div className="projectCard" ref={ref}>
      <div className="projectCard__container">
        <Image
          className="projectCard__image"
          src={projectImage}
          width="430"
          height="650"
          objectFit="contain"
        />
      </div>

      <div className="projectCard__header">
        <div className="headerCard__container">
          <h4>{projectName}</h4>
          <span>{projectDescription}</span>

          <TechList techList={techList} />
        </div>

        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="projectCard__link"
        >
          Visualizar site
          <img src="/assets/icons/icon-link.svg" alt="Link de visualização" />
        </a>
      </div>
    </div>
  );
}
