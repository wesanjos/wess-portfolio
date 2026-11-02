const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const reference = require('./fixtures/kanpai-reference.json');

const base = '/projetos/kanpai';
const pages = [
  ['', /dor nas costas/i],
  ['/tratamentos', /tratamento/i],
  ['/tratamentos/massoterapia-clinica', /massoterapia clínica/i],
  ['/empresas', /menos dor no trabalho, mais gente bem na equipe/i],
  ['/sobre', /cuidar de gente de verdade/i],
  ['/blog', /dor/i],
  ['/blog/hernia-de-disco', /hérnia de disco/i],
];

test('rotas conhecidas', async ({ page }) => {
  for (const [path, heading] of pages) {
    const response = await page.goto(base + path);
    expect(response.status(), path).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
  }
});

test('slugs desconhecidos', async ({ page }) => {
  for (const path of ['/tratamentos/inexistente', '/blog/inexistente']) {
    expect((await page.goto(base + path)).status()).toBe(404);
  }
});

test('menu e rodapé', async ({ page }) => {
  for (const [path] of pages) {
    await page.goto(base + path);
    await expect(page.getByRole('banner')).toBeVisible();
    const header = page.getByRole('banner');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(header.locator(':scope > div')).toHaveCSS('display', 'flex');
    await expect(header.locator('nav[aria-label="Navegação principal"]')).toHaveCSS('display', 'flex');
    await expect(footer.locator(':scope > div')).toHaveCSS('display', 'flex');
    await expect(footer.locator(':scope > div > div').first()).toHaveCSS('display', 'flex');
    await expect(header.getByRole('link', { name: /Kanpai, início/ })).toHaveAttribute('href', base);
    for (const label of ['Tratamentos', 'Planos', 'Para empresas', 'Sobre', 'Blog', 'Contato']) {
      await expect(header.getByRole('link', { name: label, exact: true })).toBeAttached();
    }
    await expect(footer).toContainText('Centro Integrado de Terapias');
    await expect(footer).toContainText('WhatsApp (41) 99597-1049');
    await expect(footer.getByRole('navigation', { name: 'Tratamentos' })).toContainText('Massoterapia clínica');
    await expect(footer.getByRole('navigation', { name: 'Kanpai' })).toContainText('Para empresas');
    const desktopLinks = await header.locator('nav[aria-label="Navegação principal"] a').evaluateAll((nodes) => nodes.map((node) => [node.textContent.trim(), node.getAttribute('href')]));
    expect(desktopLinks).toEqual([['Tratamentos', `${base}/tratamentos`], ['Planos', `${base}/#planos`], ['Para empresas', `${base}/empresas`], ['Sobre', `${base}/sobre`], ['Blog', `${base}/blog`], ['Contato', `${base}/#contato`]]);
    const treatmentLinks = await footer.getByRole('navigation', { name: 'Tratamentos' }).locator('a').evaluateAll((nodes) => nodes.map((node) => [node.textContent.trim(), node.getAttribute('href')]));
    expect(treatmentLinks).toEqual([['Massoterapia clínica', `${base}/tratamentos/massoterapia-clinica`], ['Acupuntura', `${base}/tratamentos`], ['Ventosaterapia', `${base}/tratamentos`], ['Todos os tratamentos', `${base}/tratamentos`]]);
    const footerLinks = await footer.getByRole('navigation', { name: 'Kanpai' }).locator('a').evaluateAll((nodes) => nodes.map((node) => [node.textContent.trim(), node.getAttribute('href')]));
    expect(footerLinks).toEqual([['Sobre', `${base}/sobre`], ['Planos e valores', `${base}#planos`], ['Para empresas', `${base}/empresas`], ['Blog', `${base}/blog`]]);
    if (path) {
      const section = path.startsWith('/tratamentos/') ? '/tratamentos' : path.startsWith('/blog/') ? '/blog' : path;
      await expect(header.locator('a[aria-current="page"]').first()).toHaveAttribute('href', base + section);
    }
  }
});

test('larguras', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of pages) {
      await page.goto(base + path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const overflow = await page.locator('a, button, input, select, textarea').evaluateAll((nodes) => nodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && (rect.left < -1 || rect.right > innerWidth + 1);
      }).map((node) => `${node.tagName}: ${node.textContent.trim().slice(0, 60)}`));
      expect(overflow, `${path} at ${width}px`).toEqual([]);
    }
  }
});

test('menu móvel', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(base);
  const menu = page.getByRole('button', { name: /menu/i });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Menu móvel' })).toHaveCSS('display', 'flex');
  await expect(page.getByRole('navigation', { name: 'Menu móvel' })).toHaveCSS('flex-direction', 'column');
  await expect(page.getByText('WhatsApp (41) 99597-1049', { exact: true }).first()).toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  for (const [path] of pages) {
    await page.goto(base + path);
    const trigger = page.getByRole('button', { name: /menu/i });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  }
});

test('links internos', async ({ page, request }) => {
  for (const [path] of pages) {
    await page.goto(base + path);
    const links = await page.locator('a[href^="/projetos/kanpai"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href').split('#')[0]));
    for (const link of new Set(links)) expect((await request.get(link)).status(), link).toBe(200);
    const mainAnchors = await page.locator('main a[href]').evaluateAll((nodes) => nodes.map((node) => ({ href: node.getAttribute('href'), text: node.textContent.replace(/\s+/g, ' ').trim() })));
    const routes = { 'Home-v7-ntj6.dc.html': base, 'Tratamentos.dc.html': `${base}/tratamentos`, 'Tratamento-Massoterapia.dc.html': `${base}/tratamentos/massoterapia-clinica`, 'Empresas.dc.html': `${base}/empresas`, 'Sobre.dc.html': `${base}/sobre`, 'Blog.dc.html': `${base}/blog`, 'Artigo.dc.html': `${base}/blog/hernia-de-disco`, 'Agendamento.dc.html': '#demonstracao' };
    for (const item of reference[path].anchors) {
      const [file, fragment] = item.href.split('#');
      let expected = (routes[file] || file) + (fragment ? `#${fragment}` : '');
      if (file === 'Artigo.dc.html' && !/hérnia/i.test(item.text)) expected = '#demonstracao';
      if (file === 'Blog.dc.html' && /Ver trilha/i.test(item.text)) expected = '#demonstracao';
      if (path === '' && item.text.startsWith('Leia: Hérnia')) expected = `${base}/blog/hernia-de-disco`;
      if (path === '' && item.text.startsWith('Leia: Dor muscular')) expected = '#demonstracao';
      expect(mainAnchors.some((anchor) => anchor.text === item.text && anchor.href === expected), `${path}: ${item.text} -> ${expected}`).toBe(true);
    }
    const anchors = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    for (const href of new Set(anchors)) {
      if (!href.includes('#') || href === '#demonstracao') continue;
      const [url, fragment] = href.split('#');
      if (!fragment) continue;
      const response = await request.get(url || base + path);
      expect(response.status(), href).toBe(200);
      expect(await response.text(), href).toContain(`id="${fragment}"`);
    }
  }
  await page.goto(`${base}/tratamentos`);
  await expect(page.getByRole('link', { name: /ver tratamento/i }).first()).toHaveAttribute('href', `${base}/tratamentos/massoterapia-clinica`);
  await page.goto(`${base}/blog`);
  await expect(page.getByRole('link', { name: /hérnia de disco/i }).first()).toHaveAttribute('href', `${base}/blog/hernia-de-disco`);
});

test('home do portfólio', async ({ page }) => {
  expect((await page.goto('/')).status()).toBe(200);
});

test('metadados', async ({ page }) => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path] of pages) {
    await page.goto(base + path);
    const title = await page.title();
    const expectedTitles = { '': 'Início', '/tratamentos': 'Tratamentos', '/tratamentos/massoterapia-clinica': 'Massoterapia clínica', '/empresas': 'Para empresas', '/sobre': 'Sobre a Kanpai', '/blog': 'Blog', '/blog/hernia-de-disco': 'Hérnia de disco' };
    expect(title).toBe(`${expectedTitles[path]} | Kanpai`);
    const social = await page.locator('meta[property^="og:"], meta[property^="twitter:"], meta[name^="twitter:"]').evaluateAll((nodes) => nodes.map((node) => node.content).join(' '));
    expect(social).not.toMatch(/Wesley Anjos|wessanjos\.dev/i);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title).toMatch(/kanpai/i);
    const expectedDescriptions = { '': 'Tratamentos para dor e bem-estar na Kanpai, em Curitiba.', '/tratamentos': 'Conheça os tratamentos e encontre cuidados para sua dor.', '/tratamentos/massoterapia-clinica': 'Conheça a massoterapia clínica e como funciona a sessão.', '/empresas': 'Programas de saúde e bem-estar para empresas e equipes.', '/sobre': 'Conheça a história, os valores e o espaço da Kanpai.', '/blog': 'Artigos sobre dor, tratamentos e cuidado com a saúde.', '/blog/hernia-de-disco': 'Entenda sintomas e possibilidades de tratamento para hérnia de disco.' };
    expect(description).toBe(expectedDescriptions[path]);
    expect(await page.locator('meta[property^="og:"], meta[property^="twitter:"]').evaluateAll((nodes) => nodes.map((node) => node.content).join(' '))).not.toMatch(/Wesley Anjos|wessanjos\.dev/i);
    titles.add(title);
    descriptions.add(description);
  }
  expect(titles.size).toBe(7);
  expect(descriptions.size).toBe(7);
});

test('conteúdo da referência', async ({ page }) => {
  const sections = [
    ['', ['Se a dor já faz parte da semana', 'Antes de tratar, a gente entende você', 'Técnicas que se somam', 'Quem cuida de você é o Ronaldo', 'Dor de meses', 'Entenda a sua dor', 'Antes de agendar', 'Você não precisa se acostumar']],
    ['/tratamentos', ['Por dentro das sessões', 'Não sabe por onde começar', 'Compare lado a lado', 'Dúvidas sobre tratamentos']],
    ['/tratamentos/massoterapia-clinica', ['O que é massoterapia clínica', 'Para quem é indicada', 'Como é a sessão', 'Combina bem com', 'Depoimento', 'Dúvidas sobre massoterapia clínica', 'Leia antes da sua sessão', 'Você não precisa se acostumar']],
    ['/empresas', ['Programas para cada momento da empresa', 'O que muda na rotina', 'Como funciona para a sua empresa', 'Peça uma proposta', 'Dúvidas de quem contrata']],
    ['/sobre', ['Uma história construída sessão a sessão', 'Prazer, sou o Ronaldo', 'No que acreditamos', 'Conheça o espaço', 'Vamos conversar sobre a sua dor']],
    ['/blog', ['Hérnia de disco', 'Comece por aqui', 'Todos os artigos', 'Um artigo por mês']],
    ['/blog/hernia-de-disco', ['O que é hérnia de disco', 'Sintomas mais comuns', 'Quando procurar um médico com urgência', 'Possibilidades de tratamento', 'Como as terapias manuais podem ajudar', 'Continue lendo']],
  ];
  for (const [path, headings] of sections) {
    await page.goto(base + path);
    const actual = await page.locator('h2').allTextContents();
    let last = -1;
    for (const heading of headings) {
      const index = actual.findIndex((text, i) => i > last && text.includes(heading));
      expect(index, `${path}: ${heading}`).toBeGreaterThan(last);
      last = index;
    }
    const expected = reference[path];
    const sections = page.locator('main section');
    await expect(sections).toHaveCount(expected.sections.length);
    for (let i = 0; i < expected.sections.length; i += 1) {
      const section = sections.nth(i);
      const spec = expected.sections[i];
      if (spec.id) await expect(section).toHaveAttribute('id', spec.id);
      for (const [tag, count] of Object.entries(spec.elements)) {
        expect(await section.locator(tag).count(), `${path} section ${i} ${tag}`).toBeGreaterThanOrEqual(count);
      }
      const layout = await section.locator('*').evaluateAll((elements) => elements.map((element) => ({
        tag: element.tagName.toLowerCase(),
        display: getComputedStyle(element).display,
        columns: (element.getAttribute('style')?.match(/grid-template-columns\s*:\s*([^;]+)/i) || [])[1]?.trim() || '',
        direction: element.style.flexDirection,
        wrap: element.style.flexWrap,
      })));
      const expectedLayouts = new Map();
      for (const item of spec.layout) {
        const adjusted = { ...item, columns: item.columns.replace('minmax(320px, 1fr)', 'minmax(min(100%, 320px), 1fr)').replace('minmax(300px, 1fr)', 'minmax(min(100%, 300px), 1fr)') };
        const key = JSON.stringify(adjusted);
        expectedLayouts.set(key, (expectedLayouts.get(key) || 0) + 1);
      }
      for (const [key, count] of expectedLayouts) {
        const item = JSON.parse(key);
        const matching = layout.filter((node) => node.tag === item.tag && node.display === item.display && node.columns === item.columns && node.direction === item.direction && node.wrap === item.wrap);
        expect(matching.length, `${path} section ${i} layout ${key}`).toBeGreaterThanOrEqual(count);
      }
      const alts = await section.locator('img').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('alt')));
      for (const alt of new Set(spec.images)) {
        expect(alts.filter((value) => value === alt).length, `${path} section ${i} image ${alt}`).toBeGreaterThanOrEqual(spec.images.filter((value) => value === alt).length);
      }
    }
    // The desktop reference gives each screen a concrete grid or two-column composition.
    const composition = {
      '': [1, 'div[style*="display: grid"]', 'grid'],
      '/tratamentos': [1, 'div[style*="display: grid"]', 'grid'],
      '/tratamentos/massoterapia-clinica': [4, 'div[style*="display: grid"]', 'grid'],
      '/empresas': [5, 'form', 'grid'],
      '/sobre': [4, 'div[style*="grid-auto-rows"]', 'grid'],
      '/blog': [3, 'div[style*="display: grid"]', 'grid'],
      '/blog/hernia-de-disco': [null, 'nav[aria-label="Neste artigo"]', 'flex'],
    };
    const [sectionIndex, selector, display] = composition[path];
    const container = sectionIndex === null ? page.locator('main') : sections.nth(sectionIndex);
    const region = container.locator(selector).first();
    await expect(region).toHaveCSS('display', display);
    if (display === 'grid') {
      const columns = await region.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length);
      expect(columns, `${path} desktop columns`).toBeGreaterThanOrEqual(2);
    } else {
      await expect(region).toHaveCSS('flex-direction', 'column');
      await expect(region.locator('..')).toHaveCSS('display', 'flex');
    }
    if (path === '/sobre') {
      await expect(region).toHaveCSS('grid-auto-rows', '220px');
      expect(await region.locator('img').count()).toBe(4);
    }
    const images = await page.locator('main img').evaluateAll((nodes) => nodes.map((node) => {
      const path = [];
      for (let element = node; element && element.tagName.toLowerCase() !== 'main'; element = element.parentElement) path.unshift(element.tagName.toLowerCase());
      return { alt: node.getAttribute('alt'), path: path.join('>') };
    }));
    let imageCursor = 0;
    for (const image of expected.allImages) {
      const found = images.findIndex((actual, index) => index >= imageCursor && actual.alt === image.alt && actual.path === image.path);
      expect(found, `${path} imagem ${image.alt}`).toBeGreaterThanOrEqual(imageCursor);
      imageCursor = found + 1;
    }
    const actualNodes = await page.locator('main').evaluate((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const result = [];
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.replace(/\s+/g, ' ').trim();
        if (text) {
          const path = [];
          let element = walker.currentNode.parentElement;
          while (element && element !== root) {
            path.unshift(element.tagName.toLowerCase());
            element = element.parentElement;
          }
          result.push({ tag: walker.currentNode.parentElement.tagName.toLowerCase(), text, path: path.join('>') });
        }
      }
      return result;
    });
    let cursor = 0;
    for (const item of expected.allText) {
      const found = actualNodes.findIndex((node, i) => i >= cursor && node.tag === item.tag && node.path === item.path && node.text.includes(item.text));
      expect(found, `${path}: ${item.tag} ${item.text}`).toBeGreaterThanOrEqual(cursor);
      cursor = found + 1;
    }
  }
});

test('movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  for (const [path] of pages) {
    await page.goto(base + path);
    await page.getByRole('contentinfo').getByRole('link', { name: 'Agendar avaliação' }).click();
    await page.getByRole('button', { name: /menu/i }).click();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    const motions = await page.locator('html').evaluate((root) => [root, ...root.querySelectorAll('*')].flatMap((element) => [null, '::before', '::after'].flatMap((pseudo) => {
      const style = getComputedStyle(element, pseudo);
      return [style.animationDuration, style.transitionDuration].flatMap((value) => value.split(',').map((duration) => duration.trim()));
    })));
    expect(motions.every((duration) => parseFloat(duration) <= (duration.endsWith('ms') ? 0.01 : 0.00001))).toBe(true);
  }
});

test('ações demonstrativas', async ({ page }) => {
  await page.goto(base);
  await page.getByRole('link', { name: /agendar avaliação/i }).first().click();
  await expect(page.getByText(/demonstração|demonstrativa/i).first()).toBeVisible();
  for (const [path] of pages) {
    await page.goto(base + path);
    const actions = page.locator('a[href="#demonstracao"]');
    const count = await actions.count();
    for (let index = 0; index < count; index += 1) {
      const action = actions.nth(index);
      if (!(await action.isVisible())) continue;
      await action.click();
      await expect(page.getByRole('status')).toContainText('demonstrativa');
      await expect(page.getByRole('status')).not.toContainText(/enviado|sucesso/i);
      await page.getByRole('status').getByRole('button', { name: 'Fechar' }).click();
    }
    const buttons = page.locator('main button:not([data-kanpai-action]):not([type="submit"])');
    const buttonCount = await buttons.count();
    for (let index = 0; index < buttonCount; index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible())) continue;
      await button.click();
      await expect(page.getByRole('status')).toContainText('demonstrativa');
      await expect(page.getByRole('status')).not.toContainText(/enviado|sucesso/i);
      await page.getByRole('status').getByRole('button', { name: 'Fechar' }).click();
    }
  }
  await page.goto(`${base}/blog`);
  await page.getByLabel('Seu e-mail').fill('teste@example.com');
  await page.getByRole('button', { name: 'Quero receber' }).click();
  await expect(page.getByRole('status')).toContainText('demonstrativa');
  await expect(page.getByRole('status')).not.toContainText(/enviado|sucesso/i);
  await page.goto(`${base}/empresas`);
  await page.getByRole('button', { name: /Enviar pedido de proposta/i }).click();
  await expect(page.getByRole('status')).toContainText('demonstrativa');
  await expect(page.getByRole('status')).not.toContainText(/enviado|sucesso/i);
  await page.goto(`${base}/blog`);
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('status')).toContainText('demonstrativa');
});

test('falha de imagem', async ({ page }) => {
  await page.route(/\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i, (route) => route.abort());
  for (const [path] of pages) {
    await page.goto(base + path);
    const img = page.locator('img[alt]:not([alt=""])').first();
    await expect(img).toBeAttached();
    expect(await img.getAttribute('alt')).not.toBe('');
    await expect.poll(() => img.evaluate((element) => element.complete && element.naturalWidth === 0)).toBe(true);
    const nav = page.getByRole('banner').getByRole('link', { name: 'Tratamentos', exact: true });
    await nav.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${base}/tratamentos`);
  }
});

test('sem CMS', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  for (const [path] of pages) await page.goto(base + path);
  expect(requests.filter((url) => /datocms/i.test(url))).toEqual([]);
  const routeSource = fs.readFileSync('src/pages/projetos/kanpai/[[...slug]].jsx', 'utf8');
  expect(routeSource).not.toMatch(/datocms|cmsService|fetch\(|https?:/i);
  expect(routeSource).toMatch(/readFileSync\(path\.join\(process\.cwd\(\), 'src\/components\/kanpai\/reference\.json'\)/);
});

test('filtros de tratamentos e artigos e programas de empresas', async ({ page }) => {
  await page.goto(`${base}/tratamentos`);
  await page.getByRole('button', { name: 'Estresse e tensão' }).click();
  await expect(page.getByRole('button', { name: 'Estresse e tensão' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Reflexologia podal' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ajustes de coluna' })).toHaveCount(0);

  await page.goto(`${base}/blog`);
  await page.getByRole('button', { name: 'Dor crônica' }).click();
  await expect(page.getByRole('button', { name: 'Dor crônica' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: /fibromialgia/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /síndrome do piriforme/i })).toHaveCount(0);

  await page.goto(`${base}/empresas`);
  await page.getByRole('tab', { name: /SIPAT/ }).click();
  await expect(page.getByRole('tab', { name: /SIPAT/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('1 a 5 dias')).toBeVisible();
});

test('filtros preservam foco de teclado', async ({ page }) => {
  await page.goto(`${base}/tratamentos`);
  const filter = page.getByRole('button', { name: 'Estresse e tensão' });
  await filter.focus();
  await page.keyboard.press('Enter');
  await expect(filter).toBeFocused();
  await page.goto(`${base}/empresas`);
  const tab = page.getByRole('tab', { name: /SIPAT/ });
  await tab.focus();
  await page.keyboard.press('Enter');
  await expect(tab).toBeFocused();
});

test('todos os filtros e programas preservam seus estados', async ({ page }) => {
  await page.goto(`${base}/tratamentos`);
  const treatments = {
    'Ver todos': ['Massoterapia clínica', 'Acupuntura', 'Ventosaterapia', 'Ajustes de coluna', 'Fotobiomodulação', 'Reflexologia podal', 'Massagem relaxante', 'Moxaterapia', 'Fisioterapia'],
    'Dor lombar e ciático': ['Massoterapia clínica', 'Acupuntura', 'Ajustes de coluna', 'Fotobiomodulação', 'Moxaterapia', 'Fisioterapia'],
    'Pescoço e ombros': ['Massoterapia clínica', 'Ventosaterapia', 'Ajustes de coluna', 'Fisioterapia'],
    'Estresse e tensão': ['Acupuntura', 'Reflexologia podal', 'Massagem relaxante'],
    'Cansaço muscular': ['Ventosaterapia', 'Fotobiomodulação', 'Massagem relaxante', 'Fisioterapia'],
  };
  for (const [label, names] of Object.entries(treatments)) {
    const button = page.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/tratamentos costumam ajudar|Mostrando todos os/)).toContainText(String(names.length));
    await expect(page.locator('main article h2')).toHaveText(names);
    const cards = page.locator('main article');
    for (let index = 0; index < names.length; index += 1) {
      const href = names[index] === 'Massoterapia clínica' ? `${base}/tratamentos/massoterapia-clinica` : names[index] === 'Fisioterapia' ? `${base}#contato` : '#demonstracao';
      await expect(cards.nth(index).locator('a')).toHaveAttribute('href', href);
    }
    const demoAction = page.locator('main article a[href="#demonstracao"]').first();
    if (await demoAction.count()) {
      await demoAction.click();
      await expect(page.getByRole('status')).toContainText('demonstrativa');
      await page.getByRole('status').getByRole('button', { name: 'Fechar' }).click();
    }
  }
  await page.goto(`${base}/blog`);
  const posts = {
    'Todos': ['Quiropraxia', 'Dor muscular', 'Síndrome do piriforme', 'Fibromialgia', 'Liberação miofascial', 'Hérnia de disco'],
    'Coluna e ciático': ['Quiropraxia', 'Síndrome do piriforme', 'Hérnia de disco'],
    'Massoterapia': ['Dor muscular'], 'Dor crônica': ['Fibromialgia'], 'Técnicas': ['Liberação miofascial'],
  };
  for (const [label, names] of Object.entries(posts)) {
    const button = page.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    const cards = page.locator('main section').nth(3).locator('a:has(h3)');
    await expect(cards).toHaveCount(names.length);
    for (let index = 0; index < names.length; index += 1) {
      await expect(cards.nth(index).locator('h3')).toContainText(names[index]);
      await expect(cards.nth(index)).toHaveAttribute('href', names[index] === 'Hérnia de disco' ? `${base}/blog/hernia-de-disco` : '#demonstracao');
    }
    const demoAction = page.locator('main section').nth(3).locator('a[href="#demonstracao"]').first();
    if (await demoAction.count()) {
      await demoAction.click();
      await expect(page.getByRole('status')).toContainText('demonstrativa');
      await page.getByRole('status').getByRole('button', { name: 'Fechar' }).click();
    }
  }
  await page.goto(`${base}/empresas`);
  for (const [name, duration] of [['Ginástica laboral', '10 a 15 min por sessão'], ['SIPAT', '1 a 5 dias'], ['Quick massagem', '10 a 15 min por pessoa'], ['Palestras', '45 a 60 min']]) {
    const button = page.getByRole('tab', { name: new RegExp(name, 'i') });
    await button.click();
    await expect(button).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText(duration, { exact: true })).toBeVisible();
    await expect(page.locator('#programas').getByRole('link', { name: new RegExp(`Pedir proposta de ${name}`, 'i') })).toHaveAttribute('href', '#proposta');
    const descriptions = {
      'Ginástica laboral': 'Exercícios simples, seguros e adaptados à rotina de trabalho, conduzidos por profissionais capacitados. Ajudam a reduzir dores musculares, aliviar tensões, melhorar a postura e aumentar a disposição ao longo do dia.',
      'SIPAT': 'Programa completo para a Semana Interna de Prevenção de Acidentes do Trabalho, com palestras, vivências práticas e atividades sobre saúde física, prevenção de lesões, estresse e sedentarismo.',
      'Quick massagem': 'Sessões curtas de massagem em cadeira própria, para aliviar a tensão de pescoço, ombros e costas sem tirar a pessoa da rotina.',
      'Palestras': 'Conversas práticas sobre postura, ergonomia, prevenção de dores e autocuidado, com linguagem simples e exemplos do dia a dia da equipe.',
    };
    await expect(page.locator('#programas')).toContainText(descriptions[name]);
    const details = {
      'Ginástica laboral': ['No local, em grupo', 'A partir de R$ 80', 'Alongamento guiado', 'Exercícios de mobilidade', 'Orientação postural', 'Turmas por setor'],
      'SIPAT': ['Personalizado por empresa', 'Sob proposta', 'Palestras de ergonomia', 'Ginástica laboral guiada', 'Quick massagem', 'Demonstrações de autocuidado'],
      'Quick massagem': ['No local, individual', 'Sob proposta', 'Cadeira de quick massagem', 'Agenda por horário', 'Ações pontuais ou recorrentes'],
      'Palestras': ['Presencial', 'Sob proposta', 'Ergonomia no posto de trabalho', 'Dor nas costas', 'Estresse e sono'],
    };
    for (const text of details[name]) await expect(page.locator('#programas')).toContainText(text);
  }
});
