import { getCmsContent } from './CMSProvider';

export function CMSSectionRender({ pageName }) {
  const getAllSection = getCmsContent(`${pageName}.pageContent[0].section`);
}
