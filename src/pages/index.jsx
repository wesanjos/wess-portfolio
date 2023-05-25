import { cmsService } from '../infra/cms/cmsService';
import { CMSSectionRender } from '../infra/cms/CMSSectionRender';
import { pageHOC } from '../context/pageHOC';

import queryPageHome from '../infra/graphql/queries/queryPageHome';

export const getStaticProps = async () => {
  const { data: cmsContent } = await cmsService({ query: queryPageHome });

  return {
    props: {
      cmsContent,
    },
  };
};

function HomeScreen() {
  return <CMSSectionRender pageName="pageHome" />;
}

export default pageHOC(HomeScreen);
