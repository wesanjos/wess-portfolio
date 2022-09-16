import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link
          rel="shortcut icon"
          href="/assets/img/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/img/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/img/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/assets/img/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;600;700&family=Raleway:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
