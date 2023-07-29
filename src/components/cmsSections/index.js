import Header from '../organisms/Header';
import Hero from '../organisms/Hero';
import Portfolio from '../organisms/Portfolio';
import Footer from '../organisms/Footer';
import MoreProjects from '../organisms/MoreProjects';

export const cmsSections = {
  ComponentMenuRecord: (props) => <Header {...props} />,
  ComponentHeroRecord: (props) => <Hero {...props} />,
  ComponentWorkRecord: (props) => <Portfolio {...props} />,
  ComponentMoreProjectRecord: (props) => <MoreProjects {...props} />,
  ComponentFooterRecord: (props) => <Footer {...props} />,
};
