import Footer from '../organisms/Footer';
import Header from '../organisms/Header';
import Hero from '../organisms/Hero';
import Portfolio from '../organisms/Portfolio';

export const cmsSections = {
  ComponentMenuRecord: (props) => <Header {...props} />,
  ComponentHeroRecord: (props) => <Hero {...props} />,
  ComponentWorkRecord: (props) => <Portfolio {...props} />,
  // ComponentFooterRecord: <Footer />,
};
