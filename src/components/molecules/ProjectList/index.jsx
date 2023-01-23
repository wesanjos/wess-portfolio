import ProjectCard from '../ProjectCard';

export default function ProjectList() {
  return (
    <div className="projectList">
      <ProjectCard
        projectImage="/assets/images/hda_home.png"
        projectName="Honda Motos - Nova Home"
        projectDescription="Reestruturação e construção da nova página de motos."
        projectLink="https://www.honda.com.br/motos/"
        techList={['Twig', 'Stylus', 'Javascript', 'jQuery', 'Drupal']}
      />
      <ProjectCard
        projectImage="/assets/images/project_1.png"
        projectName="Honda Store - Nova Home"
        projectDescription="Desenvolvimento de uma nova home para página de produtos da Honda"
        projectLink="https://www.honda.com.br/motos/honda-store/"
        techList={['Twig', 'Stylus', 'Javascript']}
      />
      <ProjectCard
        projectImage="/assets/images/project_2.png"
        projectName="Honda Recall FAQ"
        projectDescription="Nova página de FAQ"
        projectLink="https://www.honda.com.br/recall/faq-perguntasfrequentes"
        techList={['Twig', 'SASS', 'Javascript']}
      />
      <ProjectCard
        projectImage="/assets/images/project_3.png"
        projectName="Sistema de O.S"
        projectDescription="Gerenciamento de ordem de serviços para equipamentos de refrigeração. Cadastro de cliente, equipamentos, marcas, termos e controle de O.S até etapa de faturamento."
        projectLink="#"
        techList={[
          'React',
          'Express',
          'Node',
          'MongoDB',
          'Mongoose',
          'CSS3',
          'Ant Design',
          'JWT',
        ]}
        freelancer
      />
      <ProjectCard
        projectImage="/assets/images/project_4.png"
        projectName="Bradesco - Câmbio no App"
        projectDescription="LP para informar sobre o uso e funcionalidades do Bradesco Net Empresa."
        projectLink="https://banco.bradesco/cambionoapp/"
        techList={['HTML5', 'CSS3', 'JavaScript']}
      />
      <ProjectCard
        projectImage="/assets/images/project_5.png"
        projectName="Honda - Nova NC 750X "
        projectDescription="Site com comportamento de vídeo interativo. Realizado interação de Honda Store e contribuição no desenvolvimento de outras interações."
        projectLink="https://www.honda.com.br/motos/nc-750x-video/"
        techList={['Handlebars', 'Stylus', 'Atomic Design', 'JavaScript']}
      />
      <ProjectCard
        projectImage="/assets/images/project_6.png"
        projectName="Club Social e Heavy Baile"
        projectDescription="Realizado desenvolvimento da LP para divulgação dos participantes da campanha."
        projectLink="#"
        techList={['HTML5', 'Stylus', 'Atomic Design']}
      />
      <ProjectCard
        projectImage="/assets/images/project_7.png"
        projectName="Bradesco - Blog Saber para crescer"
        projectDescription="Realizado reorganização e modificação do layout."
        projectLink="https://blogsaberparacrescer.com.br/"
        techList={['Wordpress', 'CSS3']}
      />
      <ProjectCard
        projectImage="/assets/images/project_8.png"
        projectName="Bradesco - Crédito Consignado"
        projectDescription="LP para divulgação de promoção e premiação para crédito consignado do Bradesco."
        projectLink="#"
        techList={['HTML5', 'CSS3', 'Javascript']}
      />
    </div>
  );
}
