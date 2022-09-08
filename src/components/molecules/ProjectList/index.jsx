import ProjectCard from '../ProjectCard';

export default function ProjectList() {
  return (
    <div className="projectList">
      <ProjectCard
        projectImage="/assets/images/dummy.png"
        projectName="Projeto 01"
        techList={['Handlebars', 'Styles']}
      />
      <ProjectCard
        projectImage="/assets/images/dummy.png"
        projectName="Projeto 02"
        techList={['Javascript', 'Typescript']}
      />
      <ProjectCard
        projectImage="/assets/images/dummy.png"
        projectName="Projeto 03"
        techList={['Nodejs', 'Docker']}
      />
      <ProjectCard
        projectImage="/assets/images/dummy.png"
        projectName="Projeto 04"
        techList={['MySQL', 'MongoDB']}
      />
    </div>
  );
}
