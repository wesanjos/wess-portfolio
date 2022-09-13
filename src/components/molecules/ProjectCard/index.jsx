import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';
import TechList from '../TechList';

/* eslint-disable jsx-a11y/alt-text */
export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  techList,
}) {
  const { ref } = useParallax({ speed: 5, easing: 'easeInCubic' });

  return (
    <div className="projectCard" ref={ref}>
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
