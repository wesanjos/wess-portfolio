import Image from 'next/image';

export default function ProjectCard({
  projectImage,
  projectName,
  projectDescription,
  projectLink,
}) {
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
              <span className="underline">
                <b className="client">Client</b>
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
