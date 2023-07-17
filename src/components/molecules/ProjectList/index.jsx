import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { ProjectCard } from '../ProjectCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectList({ workList }) {
  const refs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = gsap.matchMedia();
      const sections = gsap.utils.toArray(refs.current);

      isDesktop.add('(min-width: 998px)', () => {
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: '.portfolio',
            start: '-100px top',
            pin: true,
            scrub: 0.5,
            end: () => `+=${sections[0].offsetWidth}`,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="project-list">
      {workList.map((work, index) => (
        <ProjectCard
          ref={(element) => {
            refs.current[index] = element;
          }}
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
