import { getCmsContent } from './CMSProvider';

export default function CMSSectionRender({ pageName }) {
  const getAllSection = getCmsContent(`${pageName}.pageContent[0].section`);
}
