import fs from 'node:fs';
import path from 'node:path';
import Kanpai from '../../../components/kanpai';

const paths = [
  [],
  ['tratamentos'],
  ['tratamentos', 'massoterapia-clinica'],
  ['empresas'],
  ['sobre'],
  ['blog'],
  ['blog', 'hernia-de-disco'],
];

export default function KanpaiPage({ page, content, css, footer }) {
  return <Kanpai page={page} content={content} css={css} footer={footer} />;
}

KanpaiPage.kanpai = true;

export function getStaticPaths() {
  return { paths: paths.map((slug) => ({ params: { slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  const page = (params.slug || []).join('/');
  const name = { '': 'home', tratamentos: 'tratamentos', 'tratamentos/massoterapia-clinica': 'massoterapia', empresas: 'empresas', sobre: 'sobre', blog: 'blog', 'blog/hernia-de-disco': 'artigo' }[page];
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/components/kanpai/reference.json'), 'utf8'));
  const entries = Object.entries(data).filter(([key]) => key === name || key.startsWith(`${name}:`));
  const initial = entries[0][1].html;
  const variants = Object.fromEntries(entries.map(([key, value]) => {
    const html = value.html;
    let start = 0;
    while (start < initial.length && start < html.length && initial[start] === html[start]) start += 1;
    let end = 0;
    while (end < initial.length - start && end < html.length - start && initial[initial.length - 1 - end] === html[html.length - 1 - end]) end += 1;
    return [key, { start, end, middle: html.slice(start, html.length - end) }];
  }));
  return { props: { page, content: { initial, variants }, css: entries[0][1].css, footer: data.footer } };
}
