import Head from 'next/head';
import { ParallaxProvider } from 'react-scroll-parallax';

import '../scss/main.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WessAnjos - Dev FrontEnd</title>
        <meta name="title" content="WessAnjos - Dev FrontEnd" />
        <meta
          name="description"
          content="Prazer Wesley Anjos, sou desenvolvedor web e entusiasta em desenvolver projetos modernos de forma eficiente e simples."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.wessanjos.dev/" />
        <meta property="og:title" content="WessAnjos - Dev FrontEnd" />
        <meta
          property="og:description"
          content="Prazer Wesley Anjos, sou desenvolvedor web e entusiasta em desenvolver projetos modernos de forma eficiente e simples."
        />
        <meta property="og:image" content="https://www.wessanjos.dev/assets/images/wess-anjos.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.wessanjos.dev/" />
        <meta property="twitter:title" content="WessAnjos - Dev FrontEnd" />
        <meta
          property="twitter:description"
          content="Prazer Wesley Anjos, sou desenvolvedor web e entusiasta em desenvolver projetos modernos de forma eficiente e simples."
        />
        <meta property="twitter:image" content="https://www.wessanjos.dev/assets/images/wess-anjos.png" />
      </Head>
      <ParallaxProvider>
        <Component {...pageProps} />
      </ParallaxProvider>
    </>
  );
}

export default MyApp;
