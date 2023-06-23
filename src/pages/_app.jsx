import Head from 'next/head';
import Script from 'next/script';

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
        <meta
          property="og:image"
          content="https://www.wessanjos.dev/assets/images/wess-anjos.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.wessanjos.dev/" />
        <meta property="twitter:title" content="WessAnjos - Dev FrontEnd" />
        <meta
          property="twitter:description"
          content="Prazer Wesley Anjos, sou desenvolvedor web e entusiasta em desenvolver projetos modernos de forma eficiente e simples."
        />
        <meta
          property="twitter:image"
          content="https://www.wessanjos.dev/assets/images/wess-anjos.png"
        />
      </Head>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','G-LSBHEPQ51C');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
