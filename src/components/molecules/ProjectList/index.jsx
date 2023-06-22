import ProjectCard from '../ProjectCard';

export default function ProjectList() {
  return (
    <div className="project-list">
      <ProjectCard
        projectImage="/assets/images/hda_home.png"
        projectName="Honda Motos - Nova Home"
        projectDescription="Reestruturação e construção da nova página de motos."
        projectLink="https://www.honda.com.br/motos/"
      />
      <ProjectCard
        projectImage="/assets/images/project_1.png"
        projectName="Honda Store - Nova Home"
        projectDescription="Desenvolvimento de uma nova home para página de produtos da Honda"
        projectLink="https://www.honda.com.br/motos/honda-store/"
      />
      <ProjectCard
        projectImage="/assets/images/project_2.png"
        projectName="Honda Recall FAQ"
        projectDescription="Nova página de FAQ"
        projectLink="https://www.honda.com.br/recall/faq-perguntasfrequentes"
      />
      <ProjectCard
        projectImage="/assets/images/project_3.png"
        projectName="Honda Recall FAQ"
        projectDescription="Nova página de FAQ"
        projectLink="https://www.honda.com.br/recall/faq-perguntasfrequentes"
      />
    </div>
  );
}
