import Image from 'next/image';

export default function ProjectCard({
  client,
  serviceType,
  projectImage,
  projectName,
  projectDescription,
  projectLink,
}) {
  return (
    <article className="project-card">
      <a href={projectLink.buttonLink}>
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
        </div>
      </a>
    </article>
  );
}
