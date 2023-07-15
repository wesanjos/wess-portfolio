import ProjectCard from '../ProjectCard';

export default function ProjectList({ workList }) {
  return (
    <div className="project-list">
      {workList.map((work) => (
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
