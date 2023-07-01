/* eslint-disable react/no-danger */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LSBHEPQ51C"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-LSBHEPQ51C');
            `,
          }}
        />

        <link
          rel="shortcut icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/images/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/images/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/assets/images/apple-touch-icon.png"
          sizes="180x180"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<iframe src="https://www.googletagmanager.com/ns.html?id=G-LSBHEPQ51C" height="0" width="0" style="display: none; visibility: hidden;" />',
          }}
        />
      </body>
    </Html>
  );
}
