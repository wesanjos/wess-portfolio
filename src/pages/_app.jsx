import { ParallaxProvider } from 'react-scroll-parallax';

import '../scss/main.scss';

function MyApp({ Component, pageProps }) {
  return (
    <ParallaxProvider>
      <Component {...pageProps} />
    </ParallaxProvider>
  );
}

export default MyApp;
