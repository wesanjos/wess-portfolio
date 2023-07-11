import { cmsSections } from '../../components/cmsSections';
import { getCmsContent } from './CMSProvider';

export default function CMSSectionRender({ pageName }) {
  const getAllSection = getCmsContent(`${pageName}.pageContent[0].section`);

  return getAllSection.map((section) => {
    const Component = cmsSections[section.componentName];

    if (!Component) return null;

    return <Component key={section.id} {...section} />;
  });
}
