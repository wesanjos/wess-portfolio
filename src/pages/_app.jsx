import Head from 'next/head';
import Script from 'next/script';

import '../scss/main.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wesley Anjos | Desenvolvedor Front-end</title>
        <meta name="title" content="Wesley Anjos | Desenvolvedor Front-end" />
        <meta
          name="description"
          content="Desenvolvedor Front-end especializado em interfaces e soluções eficazes, comprometido em aprimorar a experiência do usuário."
        />

        <meta property="og:locale" content="pt-BR" />
        <meta content="website" property="og:type" />
        <meta property="og:url" content="https://www.wessanjos.dev/" />
        <meta
          property="og:title"
          content="Wesley Anjos | Desenvolvedor Front-end"
        />
        <meta
          property="og:description"
          content="Desenvolvedor Front-end especializado em interfaces e soluções eficazes, comprometido em aprimorar a experiência do usuário."
        />
        <meta
          property="og:image"
          content="https://www.wessanjos.dev/assets/images/share.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.wessanjos.dev/" />
        <meta
          property="twitter:title"
          content="Wesley Anjos | Desenvolvedor Front-end"
        />
        <meta
          property="twitter:description"
          content="Desenvolvedor Front-end especializado em interfaces e soluções eficazes, comprometido em aprimorar a experiência do usuário."
        />
        <meta
          property="twitter:image"
          content="https://www.wessanjos.dev/assets/images/share.png"
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
