import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';

export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  projectLink
}) {
  // const { ref } = useParallax({ speed: 5, easing: 'easeInCubic' });

  return (
    <article className="project-card">
      <a href={projectLink}>
        <div className="project-card__container">
          <div className="project-card__image">
            <Image
              src={projectImage}
              alt={projectName}
              width={736}
              height={426}
            />
          </div>

          <div className="project-card__content">
            <span className="subtitle">Site</span>
            <h3 className="project-name">
              <b className="client">Client</b>
              {projectName}
            </h3>
            <p className="description">{projectDescription}</p>
          </div>
        </div>
      </a>
    </article>
  );
}
