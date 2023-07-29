import { useContext } from 'react';
import { ProjectCard } from '../ProjectCard';
import { AppContext } from '../../../infra/cms/CMSProvider';

export default function ListOtherProjects({ listProjects }) {
  const { viewProjects } = useContext(AppContext);
  return (
    <div className={`list-other-projects ${viewProjects ? '--active' : ''}`}>
      {viewProjects
        && listProjects.map((work) => (


          <ProjectCard
            key={work.id}
            serviceType={work.serviceType}
            client={work.client}
            projectImage={work.projectImage}
            projectName={work.projectTitle}
            projectDescription={work.projectDescription}
            projectLink={work.projectLink}
          />
        ))}
    </div>
  );
}
