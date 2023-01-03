import Footer from '../components/organisms/Footer';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import Introduction from '../components/organisms/Introduction';
import Portfolio from '../components/organisms/Portfolio';
import Skills from '../components/organisms/Skills';

export default function Home() {
  return (
    <>
      <main>
        <Header />
        <Hero />
        <Introduction />
        <Skills />
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
