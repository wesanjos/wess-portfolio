import { cmsService } from '../infra/cms/cmsService';
// import { CMSSectionRender } from '../infra/cms/CMSSectionRender';
import { pageHOC } from '../context/pageHOC';

import queryPageHome from '../infra/graphql/queries/queryPageHome';

import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import Portfolio from '../components/organisms/Portfolio';
import Footer from '../components/organisms/Footer';

export const getStaticProps = async () => {
  const { data: cmsContent } = await cmsService({ query: queryPageHome });

  return {
    props: {
      cmsContent,
    },
  };
};

function HomeScreen() {
  // return <CMSSectionRender pageName="pageHome" />;

  return (
    <main>
      <Header />
      <Hero />
      <Portfolio />
      <Footer />
    </main>
  );
}

export default pageHOC(HomeScreen);
