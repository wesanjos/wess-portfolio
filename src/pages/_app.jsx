import Head from 'next/head';
import { ParallaxProvider } from 'react-scroll-parallax';

import '../scss/main.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WessAnjos - Dev FrontEnd</title>
      </Head>
      <ParallaxProvider>
        <Component {...pageProps} />
      </ParallaxProvider>
    </>
  );
}

export default MyApp;
