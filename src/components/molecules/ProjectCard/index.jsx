import Image from 'next/image';
import { forwardRef } from 'react';

export const ProjectCard = forwardRef(
  (
    {
      client,
      serviceType,
      projectImage,
      projectName,
      projectDescription,
      projectLink,
    },
    ref,
  ) => (
    <article className="project-card" ref={ref}>
      <a
        href={projectLink.buttonLink}
        className={projectLink.buttonLink === '#' ? 'withoutLink' : ''}
      >
        <div className="project-card__container">
          <div className="project-card__image">
            <Image
              src={projectImage.url}
              alt={projectImage.alt}
              width={projectImage.width}
              height={projectImage.height}
              loading="lazy"
            />
          </div>

          <div className="project-card__content">
            <div className="wrapper">
              <span className="subtitle">{serviceType}</span>
              <h3 className="project-name">
                <span className="underline">
                  <b className="client">{client}</b>
                  <br />
                  {projectName}
                </span>
              </h3>
              <p className="description">{projectDescription}</p>
            </div>

            <div className="project-card__link">
              {projectLink.buttonLink === '#' ? (
                ''
              ) : (
                <>
                  <Image
                    src="assets/icons/icon-preview.svg"
                    alt="Visualizar projeto"
                    width={42}
                    height={42}
                  />
                  <span className="text">Ver projeto</span>
                </>
              )}
            </div>
          </div>
        </div>
      </a>
    </article>
  ),
);
