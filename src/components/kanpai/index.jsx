import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from './kanpai.module.scss';

const base = '/projetos/kanpai';
const pages = {
  '': ['home', 'Início', 'Tratamentos para dor e bem-estar na Kanpai, em Curitiba.'],
  tratamentos: ['tratamentos', 'Tratamentos', 'Conheça os tratamentos e encontre cuidados para sua dor.'],
  'tratamentos/massoterapia-clinica': ['massoterapia', 'Massoterapia clínica', 'Conheça a massoterapia clínica e como funciona a sessão.'],
  empresas: ['empresas', 'Para empresas', 'Programas de saúde e bem-estar para empresas e equipes.'],
  sobre: ['sobre', 'Sobre a Kanpai', 'Conheça a história, os valores e o espaço da Kanpai.'],
  blog: ['blog', 'Blog', 'Artigos sobre dor, tratamentos e cuidado com a saúde.'],
  'blog/hernia-de-disco': ['artigo', 'Hérnia de disco', 'Entenda sintomas e possibilidades de tratamento para hérnia de disco.'],
};
const nav = [
  ['Tratamentos', '/tratamentos'],
  ['Planos', '/#planos'],
  ['Para empresas', '/empresas'],
  ['Sobre', '/sobre'],
  ['Blog', '/blog'],
  ['Contato', '/#contato'],
];

function Header({ onDemo }) {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  useEffect(() => {
    function close(event) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menu.current?.focus();
      }
    }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.brand} href={base} aria-label="Kanpai, início"><img src="/assets/kanpai/363effc9-7804-4d02-a50d-1a95d89284ac.png" alt="" />KANPAI</a>
        <nav className={styles.desktop} aria-label="Navegação principal">
          {nav.map(([label, href]) => <a key={href} href={base + href}>{label}</a>)}
        </nav>
        <a className={styles.cta} href="#demonstracao" onClick={onDemo}>Agendar avaliação</a>
        <button ref={menu} className={styles.menuButton} type="button" aria-expanded={open} aria-controls="kanpai-menu" onClick={() => setOpen(!open)}>☰ Menu</button>
        {open && <nav id="kanpai-menu" className={styles.panel} aria-label="Menu móvel">
          {nav.map(([label, href]) => <a key={href} href={base + href}>{label}</a>)}
          <a href="#demonstracao" onClick={onDemo}>Agendar avaliação</a>
        </nav>}
      </div>
    </header>
  );
}

export default function Kanpai({ page, content: pagesContent, css, footer }) {
  const [demo, setDemo] = useState(false);
  const [filter, setFilter] = useState('todos');
  const [category, setCategory] = useState('todos');
  const [program, setProgram] = useState('0');
  const activeControl = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    if (!activeControl.current) return;
    const { action, value } = activeControl.current;
    const buttons = contentRef.current?.querySelectorAll('[data-kanpai-action]') || [];
    [...buttons].find((button) => button.dataset.kanpaiAction === action && button.dataset.kanpaiValue === value)?.focus();
    activeControl.current = null;
  }, [filter, category, program]);
  const [id, title, description] = pages[page];
  const variant = id === 'tratamentos' ? filter : id === 'blog' ? category : id === 'empresas' ? program : null;
  const patch = pagesContent.variants[variant === null ? id : `${id}:${variant}`];
  const content = pagesContent.initial.slice(0, patch.start) + patch.middle + (patch.end ? pagesContent.initial.slice(-patch.end) : '');
  function showDemo(event) {
    event.preventDefault();
    setDemo(true);
  }
  function handleContentClick(event) {
    const link = event.target.closest('a');
    const button = event.target.closest('button');
    if (button?.dataset.kanpaiAction) {
      const { kanpaiAction, kanpaiValue } = button.dataset;
      activeControl.current = { action: kanpaiAction, value: kanpaiValue };
      if (kanpaiAction === 'tratamentos') setFilter(kanpaiValue);
      if (kanpaiAction === 'blog') setCategory(kanpaiValue);
      if (kanpaiAction === 'empresas') setProgram(String(['Ginástica laboral', 'SIPAT', 'Quick massagem', 'Palestras'].indexOf(kanpaiValue)));
      return;
    }
    if (button?.type === 'submit') return;
    if (button || (link && (link.getAttribute('href') === '#demonstracao' || link.getAttribute('href') === '#'))) {
      showDemo(event);
    }
  }
  return (
    <>
      <Head>
        <title>{title} | Kanpai</title>
        <meta name="title" content={`${title} | Kanpai`} />
        <meta name="description" content={description} />
        <style dangerouslySetInnerHTML={{ __html: css + footer.css }} />
      </Head>
      <div className={styles.site}>
        <Header onDemo={showDemo} />
        {demo && <div role="status" className={styles.notice}>Esta função é demonstrativa e está indisponível nesta apresentação. <button type="button" onClick={() => setDemo(false)}>Fechar</button></div>}
        <main ref={contentRef} onClick={handleContentClick} onSubmit={showDemo} dangerouslySetInnerHTML={{ __html: content }} />
        <div onClick={handleContentClick} dangerouslySetInnerHTML={{ __html: footer.html }} />
        {id === 'home' && <a className={styles.whatsapp} href="#demonstracao" aria-label="Falar no WhatsApp" onClick={showDemo}>✆</a>}
      </div>
    </>
  );
}
