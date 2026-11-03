import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './kanpai.module.scss';
import { setupMotion, setupProgramLayout } from './motion';

const base = '/projetos/kanpai';
const pages = {
  '': ['home', 'Início', 'Consulta individual no Tatuquara, em Curitiba. Avaliação e técnicas como massoterapia, acupuntura e fisioterapia para cuidar da dor.'],
  tratamentos: ['tratamentos', 'Tratamentos', 'Conheça as técnicas utilizadas na Kanpai e como a avaliação orienta sua combinação durante a consulta.'],
  'tratamentos/massoterapia-clinica': ['massoterapia', 'Massoterapia clínica', 'Entenda o papel da massoterapia clínica no cuidado da dor e como ela pode ser combinada a outros recursos na consulta.'],
  empresas: ['empresas', 'Para empresas', 'Ginástica laboral, SIPAT, quick massagem e palestras para empresas de Curitiba e região. Conheça os formatos e solicite uma proposta.'],
  sobre: ['sobre', 'Sobre a Kanpai', 'Conheça a história, os valores e o espaço da Kanpai.'],
  blog: ['blog', 'Blog', 'Artigos sobre dor, tratamentos e cuidado com a saúde.'],
  'blog/hernia-de-disco': ['artigo', 'Hérnia de disco', 'Entenda sintomas e possibilidades de tratamento para hérnia de disco.'],
  privacidade: ['privacidade', 'Privacidade nesta apresentação', 'Como funcionam os formulários e os links nesta apresentação de portfólio da Kanpai.'],
};
const nav = [
  ['Tratamentos', '/tratamentos'],
  ['Planos', '/#planos'],
  ['Para empresas', '/empresas'],
  ['Sobre', '/sobre'],
  ['Blog', '/blog'],
  ['Contato', '/#contato'],
];

function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback);
  Router.events.on('hashChangeComplete', callback);
  Router.events.on('routeChangeComplete', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    Router.events.off('hashChangeComplete', callback);
    Router.events.off('routeChangeComplete', callback);
  };
}

const getHash = () => window.location.hash;
const getServerHash = () => '';

function applySearch(root, query) {
  const input = root?.querySelector('[data-kanpai-search]');
  if (!input) return;
  input.value = query;
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const cards = [...root.querySelectorAll('[data-kanpai-post]')];
  let matches = 0;
  cards.forEach((card) => {
    const text = normalize(card.textContent);
    const visible = terms.every((term) => text.includes(term));
    card.hidden = !visible;
    if (visible) matches += 1;
  });
  const status = root.querySelector('[data-kanpai-search-status]');
  if (status) {
    status.hidden = !query.trim();
    status.textContent = matches ? `${matches} resultado${matches === 1 ? '' : 's'} nesta categoria.` : 'Nenhum artigo encontrado nesta categoria. Tente outro termo ou selecione Todos.';
  }
}

function Header({ onDemo, page }) {
  const [open, setOpen] = useState(false);
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const menu = useRef(null);
  const isBusiness = page === 'empresas';
  const ctaLabel = isBusiness ? 'Solicitar proposta' : 'Agendar consulta';
  function current(href) {
    if (href.startsWith('/#')) return !page && hash === href.slice(1) ? 'location' : undefined;
    return page && (`/${page}` === href || `/${page}`.startsWith(`${href}/`)) ? 'page' : undefined;
  }
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
        <Link className={styles.brand} href={base} aria-label="Kanpai, início" onNavigate={() => setOpen(false)}>
          <img src="/assets/kanpai/logo-kanpai.png" alt="" />
          KANPAI
        </Link>
        <nav className={styles.desktop} aria-label="Navegação principal">
          {nav.map(([label, href]) => <Link key={href} href={base + href} aria-current={current(href)}>{label}</Link>)}
        </nav>
        <div className={styles.end}>
          <a className={styles.cta} href={isBusiness ? '#proposta' : '#demonstracao'} onClick={isBusiness ? undefined : onDemo}>{ctaLabel}</a>
          <button ref={menu} className={styles.menuButton} type="button" aria-expanded={open} aria-controls="kanpai-menu" onClick={() => setOpen(!open)}>{open ? 'Fechar menu' : '☰ Menu'}</button>
          {open && (
          <nav id="kanpai-menu" className={styles.panel} aria-label="Menu móvel">
            {nav.map(([label, href]) => <Link key={href} href={base + href} aria-current={current(href)} onNavigate={() => setOpen(false)}>{label}</Link>)}
            <a href={isBusiness ? '#proposta' : '#demonstracao'} onClick={(event) => { setOpen(false); if (!isBusiness) onDemo(event); }}>{ctaLabel}</a>
          </nav>
          )}
        </div>
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
  const proposalDraft = useRef([]);
  const searchQuery = useRef('');
  useEffect(() => {
    if (!activeControl.current) return;
    const { action, value } = activeControl.current;
    const buttons = contentRef.current?.querySelectorAll('[data-kanpai-action]') || [];
    [...buttons].find((button) => (
      button.dataset.kanpaiAction === action && button.dataset.kanpaiValue === value
    ))?.focus({ preventScroll: true });
    activeControl.current = null;
  }, [filter, category, program]);
  const [id, title, description] = pages[page];
  const variant = { tratamentos: filter, blog: category, empresas: program }[id] || null;
  const patch = pagesContent.variants[variant === null ? id : `${id}:${variant}`];
  const content = (pagesContent.initial.slice(0, patch.start) + patch.middle + (patch.end ? pagesContent.initial.slice(-patch.end) : ''))
    .replace(/<img\b[^>]*alt="Mapa com a localização da Kanpai[^\"]*"[^>]*>/, '<iframe title="Mapa da Kanpai na Rua Alexandrina Thibes de Campos, 423, Tatuquara, Curitiba" src="https://maps.google.com/maps?q=Rua%20Alexandrina%20Thibes%20de%20Campos%2C%20423%2C%20Tatuquara%2C%20Curitiba%2C%20PR&amp;output=embed" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="width: 100%; height: 260px; border: 0; border-radius: 20px; display: block" allowfullscreen></iframe>');
  useEffect(() => {
    proposalDraft.current.forEach(({ fieldId, value, checked }) => {
      const field = contentRef.current?.querySelector(`#${fieldId}`);
      if (!field) return;
      field.value = value;
      field.checked = checked;
    });
    if (id === 'blog') applySearch(contentRef.current, searchQuery.current);
  }, [content, id]);
  useEffect(() => setupMotion(contentRef.current), [content]);
  useEffect(() => setupProgramLayout(contentRef.current, pagesContent), [pagesContent]);
  function showDemo(event) {
    event.preventDefault();
    setDemo(true);
  }
  function handleContentClick(event) {
    const link = event.target.closest('a');
    const button = event.target.closest('button');
    if (button?.dataset.kanpaiAction) {
      if (button.dataset.kanpaiAction === 'buscar') {
        searchQuery.current = contentRef.current.querySelector('[data-kanpai-search]').value;
        applySearch(contentRef.current, searchQuery.current);
        return;
      }
      contentRef.current.dataset.kanpaiUpdated = 'true';
      const { kanpaiAction, kanpaiValue } = button.dataset;
      activeControl.current = { action: kanpaiAction, value: kanpaiValue };
      if (kanpaiAction === 'tratamentos') setFilter(kanpaiValue);
      if (kanpaiAction === 'blog') setCategory(kanpaiValue);
      if (kanpaiAction === 'empresas') {
        proposalDraft.current = [...contentRef.current.querySelectorAll('#proposta input, #proposta select, #proposta textarea')]
          .map((field) => ({ fieldId: field.id, value: field.value, checked: field.checked }));
        setProgram(String(['Ginástica laboral', 'SIPAT', 'Quick massagem', 'Palestras'].indexOf(kanpaiValue)));
      }
      return;
    }
    if (link?.closest('[role="tabpanel"]') && link.getAttribute('href') === '#proposta') {
      const selected = ['Ginástica laboral', 'SIPAT', 'Quick massagem', 'Palestras'][Number(program)];
      contentRef.current.querySelectorAll('input[name="programas"]').forEach((field) => {
        field.checked = field.value === selected;
      });
    }
    if (button?.type === 'submit') return;
    if (button || (link && (link.getAttribute('href') === '#demonstracao' || link.getAttribute('href') === '#'))) {
      showDemo(event);
    }
  }
  function handleSubmit(event) {
    if (event.target.querySelector('[data-kanpai-search]')) {
      event.preventDefault();
      searchQuery.current = event.target.querySelector('[data-kanpai-search]').value;
      applySearch(contentRef.current, searchQuery.current);
      return;
    }
    showDemo(event);
  }
  return (
    <>
      <Head>
        <title>
          {title}
          {' '}
          | Kanpai
        </title>
        <meta name="title" content={`${title} | Kanpai`} />
        <meta name="description" content={description} />
        <style dangerouslySetInnerHTML={{ __html: `${css}${footer.css}@media (prefers-reduced-motion: reduce) { html:root { scroll-behavior: auto !important; } }` }} />
      </Head>
      <div className={styles.site}>
        {/* The callbacks delegate events from native links and buttons in the reference. */}
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Header onDemo={showDemo} page={page} />
        <p className={styles.presentation}>Projeto demonstrativo. Agendamentos e propostas não são enviados.</p>
        {demo && (
        <div role="status" className={styles.notice}>
          Esta ação é demonstrativa. Nenhum dado foi enviado e nenhum horário foi reservado.
          <button type="button" onClick={() => setDemo(false)}>Fechar</button>
        </div>
        )}
        {/* Native controls retain keyboard handling; events bubble to these containers. */}
        {/* eslint-disable jsx-a11y/click-events-have-key-events */}
        {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
        <main
          key={page}
          ref={contentRef}
          onClick={handleContentClick}
          onSubmit={handleSubmit}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div onClick={handleContentClick} dangerouslySetInnerHTML={{ __html: footer.html }} />
        {/* eslint-enable jsx-a11y/click-events-have-key-events */}
        {/* eslint-enable jsx-a11y/no-static-element-interactions */}

      </div>
    </>
  );
}
