const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const base = '/projetos/kanpai';
const pages = [
  ['', /dor nas costas/i],
  ['/tratamentos', /uma avaliação/i],
  ['/tratamentos/massoterapia-clinica', /massoterapia clínica/i],
  ['/empresas', /saúde e bem-estar na rotina da sua equipe/i],
  ['/sobre', /um cuidado que começa com a sua história/i],
  ['/blog', /dor/i],
  ['/blog/hernia-de-disco', /hérnia de disco/i],
  ['/privacidade', /privacidade nesta apresentação/i],
];

test('mapa interativo mostra o endereço da Kanpai', async ({ page }) => {
  await page.goto(base);
  const map = page.locator('iframe[title^="Mapa da Kanpai"]');
  await expect(map).toHaveCount(1);
  await expect(map).toHaveAttribute('src', /maps\.google\.com\/maps\?q=Rua%20Alexandrina%20Thibes%20de%20Campos%2C%20423/);
  await expect(map).toHaveAttribute('loading', 'lazy');
  await expect(page.getByAltText(/Mapa com a localização da Kanpai/)).toHaveCount(0);
});

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
    const header = page.getByRole('banner');
    const footer = page.getByRole('contentinfo');
    await expect(header.getByRole('link', { name: 'Kanpai, início' })).toHaveAttribute('href', base);
    for (const label of ['Tratamentos', 'Planos', 'Para empresas', 'Sobre', 'Blog', 'Contato']) {
      await expect(header.getByRole('link', { name: label, exact: true })).toBeAttached();
    }
    const cta = header.locator('a').filter({ hasText: path === '/empresas' ? 'Solicitar proposta' : 'Agendar consulta' });
    await expect(cta).toHaveAttribute('href', path === '/empresas' ? '#proposta' : '#demonstracao');
    await expect(footer).toContainText('Centro Integrado de Terapias');
    await expect(footer).toContainText('WhatsApp (41) 99597-1049');
    await expect(footer.getByRole('link', { name: 'Privacidade nesta apresentação' })).toHaveAttribute('href', `${base}/privacidade`);
    await expect(footer.getByRole('link', { name: /Como chegar/ })).toHaveAttribute('href', /google\.com\/maps\/search/);
    if (path && path !== '/privacidade') {
      const section = path.startsWith('/tratamentos/') ? '/tratamentos' : path.startsWith('/blog/') ? '/blog' : path;
      await expect(header.locator('a[aria-current="page"]').first()).toHaveAttribute('href', base + section);
    }
  }
});

test('navegação interna mantém o documento, chega às seções e preserva o histórico', async ({ page }) => {
  await page.goto(`${base}/blog`);
  await page.evaluate(() => { window.kanpaiNavigationMarker = true; });
  const header = page.getByRole('banner');
  await header.getByRole('link', { name: 'Planos', exact: true }).click();
  await expect(page).toHaveURL(`${base}#planos`);
  await expect(header.getByRole('link', { name: 'Planos', exact: true })).toHaveAttribute('aria-current', 'location');
  expect(await page.evaluate(() => window.kanpaiNavigationMarker)).toBe(true);
  const position = await page.locator('#planos').evaluate((node) => node.getBoundingClientRect().top);
  expect(position).toBeGreaterThanOrEqual(0);
  await page.goBack();
  await expect(page).toHaveURL(`${base}/blog`);
  await expect(header.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('menu móvel fecha ao navegar para uma seção da página atual', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(base);
  const button = page.getByRole('button', { name: /menu/i });
  await button.click();
  await page.getByRole('navigation', { name: 'Menu móvel' }).getByRole('link', { name: 'Contato', exact: true }).click();
  await expect(page).toHaveURL(`${base}#contato`);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(page.getByRole('navigation', { name: 'Menu móvel' }).getByRole('link', { name: 'Contato', exact: true })).toHaveAttribute('aria-current', 'location');
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
      const clipped = await page.locator('a, button, input, select, textarea, summary').evaluateAll((nodes) => nodes.flatMap((node) => {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height || getComputedStyle(node).visibility === 'hidden') return [];
        for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          const bounds = parent.getBoundingClientRect();
          const clipsX = /^(hidden|clip)$/.test(style.overflowX) && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1);
          const clipsY = /^(hidden|clip)$/.test(style.overflowY) && (rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1);
          if (clipsX || clipsY) return [`${node.tagName}: ${node.textContent.trim().slice(0, 40)}`];
        }
        return [];
      }));
      expect(clipped, `${path} clipped at ${width}px`).toEqual([]);
      const truncated = await page.locator('a, button, summary').evaluateAll((nodes) => nodes.flatMap((node) => {
        const bounds = node.getBoundingClientRect();
        if (!bounds.width || !bounds.height || getComputedStyle(node).visibility === 'hidden') return [];
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (walker.currentNode.parentElement.closest('[aria-hidden="true"]')) continue;
          const range = document.createRange();
          range.selectNodeContents(walker.currentNode);
          if ([...range.getClientRects()].some((rect) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1)) return [`${node.tagName}: ${node.textContent.trim().slice(0, 40)}`];
        }
        return [];
      }));
      expect(truncated, `${path} text overflow at ${width}px`).toEqual([]);
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
    const mobileLinks = await page.getByRole('navigation', { name: 'Menu móvel' }).locator('a').evaluateAll((nodes) => nodes.map((node) => [node.textContent.trim(), node.getAttribute('href')]));
    expect(mobileLinks).toEqual([['Tratamentos', `${base}/tratamentos`], ['Planos', `${base}/#planos`], ['Para empresas', `${base}/empresas`], ['Sobre', `${base}/sobre`], ['Blog', `${base}/blog`], ['Contato', `${base}/#contato`], [path === '/empresas' ? 'Solicitar proposta' : 'Agendar consulta', path === '/empresas' ? '#proposta' : '#demonstracao']]);
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  }
});

test('links internos têm páginas e âncoras reais', async ({ page, request }) => {
  const checked = new Map();
  for (const [path] of pages) {
    await page.goto(base + path);
    const anchors = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    for (const href of new Set(anchors)) {
      if (href === '#demonstracao' || /^https?:/.test(href)) continue;
      expect(href).not.toBe('#');
      const [url, fragment] = href.split('#');
      const target = url || base + path;
      if (!checked.has(target)) {
        const response = await request.get(target);
        expect(response.status(), href).toBe(200);
        checked.set(target, await response.text());
      }
      if (fragment) expect(checked.get(target), href).toContain(`id="${fragment}"`);
    }
  }
});

test('home do portfólio', async ({ page }) => {
  expect((await page.goto('/')).status()).toBe(200);
});

test('metadados exclusivos e sem identidade do portfólio', async ({ page }) => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path] of pages) {
    await page.goto(base + path);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title).toMatch(/Kanpai/);
    expect(description.length).toBeGreaterThan(30);
    const social = await page.locator('meta[property^="og:"], meta[property^="twitter:"], meta[name^="twitter:"]').evaluateAll((nodes) => nodes.map((node) => node.content).join(' '));
    expect(social).not.toMatch(/Wesley Anjos|wessanjos\.dev/i);
    titles.add(title);
    descriptions.add(description);
  }
  expect(titles.size).toBe(pages.length);
  expect(descriptions.size).toBe(pages.length);
});

test('a home apresenta abordagem e confiança antes dos planos', async ({ page }) => {
  await page.goto(base);
  const ids = await page.locator('main section[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(ids).toEqual(['inicio', 'para-quem', 'avaliacao', 'tratamentos', 'sobre', 'depoimentos', 'planos', 'blog', 'duvidas', 'contato']);
  for (const section of ['inicio', 'para-quem', 'avaliacao']) {
    await expect(page.locator(`#${section}`)).not.toContainText('R$');
  }
  await expect(page.locator('#avaliacao')).toContainText('Você não precisa escolher uma técnica');
  await expect(page.locator('#planos')).toContainText('Consulta avulsa, 1 sessão');
  await expect(page.locator('#planos')).toContainText('sem contratar um pacote');
  await expect(page.locator('#planos')).toContainText('R$ 399,90');
  await expect(page.locator('#planos')).toContainText('R$ 749,90');
  await expect(page.locator('#planos .kp-plan-inclusions h3')).toHaveCount(3);
  await expect(page.locator('#planos')).toContainText('Economize R$ 99,60 no total');
  await expect(page.locator('#planos')).toContainText('Economize R$ 249,10 no total');
  const planCards = page.locator('#planos .kp-plan-card');
  await expect(planCards.nth(1)).toContainText('Válido por 90 dias a partir da 1ª sessão');
  await expect(planCards.nth(2)).toContainText('Válido por 180 dias a partir da 1ª sessão');
  await expect(page.locator('#planos')).not.toContainText(/R\$\s*(79,98|74,99) por sessão/);
  await expect(page.locator('#planos')).not.toContainText(/Mensal|recomendado para tratar uma dor/);
  const techniques = page.locator('#tratamentos details');
  await expect(techniques.locator('summary h3')).toHaveText([
    'Massoterapia clínica', 'Acupuntura', 'Ventosaterapia', 'Massagem terapêutica',
    'Massagem relaxante', 'Moxaterapia', 'Ajustes de coluna', 'Fotobiomodulação',
    'Reflexologia podal', 'Fisioterapia', 'Outras técnicas',
  ]);
  for (const technique of await techniques.all()) {
    if (!(await technique.evaluate((node) => node.open))) await technique.locator('summary').click();
    await expect(technique.locator('p')).toBeVisible();
    expect((await technique.locator('p').innerText()).length).toBeGreaterThan(60);
  }
  await expect(page.locator('#tratamentos')).toContainText('Auriculoterapia');
  for (const path of ['', '/tratamentos', '/tratamentos/massoterapia-clinica', '/sobre']) {
    await page.goto(base + path);
    await expect(page.locator('main')).not.toContainText(/EM BREVE|graduação em andamento|cursa Fisioterapia|tratar a causa da dor/);
    expect(await page.locator('main a').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringMatching(/Agendar (acupuntura|massoterapia|ventosaterapia)/i)]));
  }
});

test('movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  for (const [path] of pages) {
    await page.goto(base + path);
    await page.getByRole('contentinfo').getByRole('link', { name: 'Agendar consulta' }).click();
    await page.getByRole('button', { name: /menu/i }).click();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    const motions = await page.locator('html').evaluate((root) => [root, ...root.querySelectorAll('*')].flatMap((element) => [null, '::before', '::after'].flatMap((pseudo) => {
      const style = getComputedStyle(element, pseudo);
      return [style.animationDuration, style.transitionDuration].flatMap((value) => value.split(',').map((duration) => duration.trim()));
    })));
    expect(motions.every((duration) => parseFloat(duration) <= (duration.endsWith('ms') ? 0.01 : 0.00001))).toBe(true);
  }
});

test('ações demonstrativas não enviam dados nem prometem reserva', async ({ page }) => {
  const submissions = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && (request.url().startsWith('http://127.0.0.1:3100') || request.postData()?.includes('Kanpai-formulario-teste-123'))) submissions.push(request.url());
  });
  for (const path of ['', '/tratamentos/massoterapia-clinica', '/empresas']) {
    await page.goto(base + path);
    await expect(page.getByText('Projeto demonstrativo · agendamentos e propostas não são enviados.')).toBeVisible();
    if (path === '/empresas') {
      await page.getByLabel('Seu nome').fill('Kanpai-formulario-teste-123');
      await page.getByRole('button', { name: 'Enviar pedido de proposta' }).click();
    } else {
      await page.getByRole('banner').getByRole('link', { name: 'Agendar consulta' }).click();
    }
    const notice = page.getByRole('status');
    await expect(notice).toContainText('Nenhum dado foi enviado');
    await expect(notice).toContainText('nenhum horário foi reservado');
    await notice.getByRole('button', { name: 'Fechar' }).click();
    await expect(notice).toHaveCount(0);
  }
  expect(submissions).toEqual([]);
});

test('falha de imagem', async ({ page }) => {
  await page.route(/\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i, (route) => route.abort());
  for (const [path] of pages.filter(([path]) => path !== '/privacidade')) {
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
    await expect(page.locator('main article h2')).toHaveText(names);
    expect((await page.locator('main article').allTextContents()).join(' ')).not.toMatch(/EM BREVE/);
  }
  await page.goto(`${base}/blog`);
  for (const [label, count] of [['Todos', 6], ['Coluna e ciático', 3], ['Massoterapia', 1], ['Dor crônica', 1], ['Técnicas', 1]]) {
    const button = page.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-kanpai-post]')).toHaveCount(count);
  }
  await page.goto(`${base}/empresas`);
  await page.getByLabel('Seu nome').fill('Pessoa do RH');
  await page.getByLabel('Empresa', { exact: true }).fill('Equipe exemplo');
  await page.getByLabel('Nº de colaboradores').selectOption({ label: 'Mais de 150' });
  for (const [name, duration] of [['SIPAT', '1 a 5 dias'], ['Quick massagem', '10 a 15 min por pessoa'], ['Palestras', '45 a 60 min'], ['Ginástica laboral', '10 a 15 min por sessão']]) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await expect(page.getByRole('tab', { name: new RegExp(name) })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText(duration);
    await expect(page.getByLabel('Seu nome')).toHaveValue('Pessoa do RH');
    await expect(page.getByLabel('Empresa', { exact: true })).toHaveValue('Equipe exemplo');
    await expect(page.getByLabel('Nº de colaboradores')).toHaveValue('Mais de 150');
    await page.getByRole('tabpanel').getByRole('link', { name: `Pedir proposta de ${name}` }).click();
    await expect(page.locator('input[name="programas"]:checked')).toHaveCount(1);
    await expect(page.locator('input[name="programas"]:checked')).toHaveValue(name);
  }
});

test('ordem e acesso por teclado em todas as telas', async ({ page }) => {
  test.setTimeout(180000);
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of pages) {
      await page.goto(base + path);
      const visualOrder = await page.evaluate(() => {
        const selector = 'a[href], button, input, select, textarea, summary';
        function visibleControl(node) {
          const controls = [node, ...node.querySelectorAll(selector)].filter((item) => item.matches(selector));
          return controls.some((item) => {
            for (let parent = item.parentElement; parent; parent = parent.parentElement) {
              if (parent.tagName === 'DETAILS' && !parent.open && !parent.querySelector(':scope > summary')?.contains(item)) return false;
            }
            const rect = item.getBoundingClientRect();
            return item.tabIndex >= 0 && !item.disabled && rect.width > 0 && rect.height > 0 && getComputedStyle(item).visibility !== 'hidden';
          });
        }
        const errors = [];
        for (const group of document.querySelectorAll('body *')) {
          const style = getComputedStyle(group);
          if (!['flex', 'inline-flex', 'grid', 'inline-grid'].includes(style.display)) continue;
          const children = [...group.children].filter((child) => {
            const childStyle = getComputedStyle(child);
            const rect = child.getBoundingClientRect();
            return !['absolute', 'fixed'].includes(childStyle.position) && rect.width > 0 && rect.height > 0 && childStyle.visibility !== 'hidden' && visibleControl(child);
          });
          for (let index = 1; index < children.length; index += 1) {
            const previous = children[index - 1].getBoundingClientRect();
            const next = children[index].getBoundingClientRect();
            const vertical = style.flexDirection.startsWith('column') && style.display.includes('flex');
            const nowrapRow = style.display.includes('flex') && style.flexDirection.startsWith('row') && style.flexWrap === 'nowrap';
            const sameRow = Math.abs(next.top - previous.top) < 12 || (Math.min(previous.bottom, next.bottom) - Math.max(previous.top, next.top)) > Math.min(previous.height, next.height) * 0.75;
            if ((vertical && next.top < previous.top - 2) || (nowrapRow && next.left < previous.left - 2) || (!vertical && !nowrapRow && ((sameRow && next.left < previous.left - 2) || (!sameRow && next.top < previous.top - 2)))) {
              errors.push(`${group.tagName.toLowerCase()}.${group.className}: ${index - 1} -> ${index}`);
            }
          }
        }
        return errors;
      });
      expect(visualOrder, `${path} at ${width}: visual order differs from DOM`).toEqual([]);
      const unfocusable = await page.locator('a[href], button, input, select, textarea, summary').evaluateAll((nodes) => nodes.filter((node) => node.type !== 'hidden' && (node.disabled || node.tabIndex !== 0)).map((node) => node.getAttribute('aria-label') || node.textContent.trim() || node.tagName));
      expect(unfocusable, `${path} at ${width}: controls removed from keyboard order`).toEqual([]);
      const expected = await page.evaluate(() => {
        const candidates = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')];
        return candidates.filter((node) => {
          const style = getComputedStyle(node);
          const bounds = node.getBoundingClientRect();
          for (let parent = node.parentElement; parent; parent = parent.parentElement) {
            if (parent.tagName === 'DETAILS' && !parent.open && !parent.querySelector(':scope > summary')?.contains(node)) return false;
          }
          return node.tabIndex >= 0 && !node.disabled && node.type !== 'hidden' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0;
        }).map((node, index) => {
          node.dataset.testTabOrder = String(index);
          return { index: String(index), label: node.getAttribute('aria-label') || node.textContent.trim() || node.getAttribute('name') || node.tagName };
        });
      });
      expect(expected.length, `${path} at ${width}`).toBeGreaterThan(0);
      for (const control of expected) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.dataset.testTabOrder);
        expect(focused, `${path} at ${width}: ${control.label}`).toBe(control.index);
      }
      const details = page.locator('main details');
      for (let index = 0; index < await details.count(); index += 1) {
        const detail = details.nth(index);
        const summary = detail.locator(':scope > summary');
        await summary.focus();
        if (!(await detail.evaluate((node) => node.open))) await page.keyboard.press('Enter');
        await expect(detail).toHaveJSProperty('open', true);
        const children = detail.locator('a[href], button, input, select, textarea');
        for (let child = 0; child < await children.count(); child += 1) {
          if (!(await children.nth(child).isVisible())) continue;
          await page.keyboard.press('Tab');
          await expect(children.nth(child)).toBeFocused();
        }
      }
      if (width === 320) {
        const trigger = page.getByRole('button', { name: /menu/i });
        await trigger.focus();
        await page.keyboard.press('Enter');
        const links = page.getByRole('navigation', { name: 'Menu móvel' }).locator('a');
        await expect(links).toHaveCount(7);
        for (let index = 0; index < await links.count(); index += 1) {
          await page.keyboard.press('Tab');
          await expect(links.nth(index)).toBeFocused();
        }
      }
    }
  }
});

test('tabela de recursos tem semântica e inclui fisioterapia disponível', async ({ page }) => {
  await page.goto(`${base}/tratamentos`);
  const table = page.getByRole('table');
  await expect(table).toHaveCount(1);
  await expect(table.getByRole('columnheader')).toHaveText(['Tratamento', 'Foco do cuidado', 'Como é usado', 'Incluído no atendimento']);
  await expect(table.getByRole('rowheader', { name: 'Fisioterapia', exact: true })).toBeVisible();
  await expect(table).not.toContainText('1 hora');
  await expect(page.locator('sc-raw-table, sc-raw-select')).toHaveCount(0);
});

test('busca do blog funciona com acentos, teclado, categorias e nenhum resultado', async ({ page }) => {
  await page.goto(`${base}/blog`);
  const search = page.getByRole('searchbox');
  await search.fill('hernia');
  await search.press('Enter');
  await expect(page.locator('[data-kanpai-post]:visible')).toHaveCount(1);
  await expect(page.locator('[data-kanpai-search-status]')).toContainText('1 resultado');
  await page.getByRole('button', { name: 'Dor crônica', exact: true }).click();
  await expect(search).toHaveValue('hernia');
  await expect(page.locator('[data-kanpai-post]:visible')).toHaveCount(0);
  await expect(page.locator('[data-kanpai-search-status]')).toContainText('Nenhum artigo');
  await search.fill('fibromialgia');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.locator('[data-kanpai-post]:visible')).toHaveCount(1);
  await expect(page.locator('[data-kanpai-post]:visible')).toContainText('Conteúdo em preparação');
  await search.fill('');
  await search.press('Enter');
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(page.locator('[data-kanpai-post]:visible')).toHaveCount(6);
  await expect(page.locator('[data-kanpai-post] a[href="#demonstracao"], a[data-kanpai-post][href="#demonstracao"]')).toHaveCount(0);
});

test('fontes e privacidade têm destinos identificáveis', async ({ page }) => {
  await page.goto(`${base}/blog/hernia-de-disco`);
  await expect(page.getByRole('link', { name: 'NHS: hérnia de disco (em inglês)' })).toHaveAttribute('href', 'https://www.nhs.uk/conditions/slipped-disc/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacidade nesta apresentação' }).click();
  await expect(page).toHaveURL(`${base}/privacidade`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacidade nesta apresentação');
  await expect(page.locator('main')).toContainText('não enviam nem salvam os dados');
});


test('sugestões de leitura preservam a composição da home', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    const blog = page.locator('#blog');
    await blog.scrollIntoViewIfNeeded();
    const suggestions = blog.locator('.kp-editorial-suggestion');
    await expect(suggestions).toHaveCount(5);
    await expect(blog.locator('.kp-editorial-feature a')).toHaveAttribute('href', `${base}/blog/hernia-de-disco`);
    for (const suggestion of await suggestions.all()) {
      await expect(suggestion.locator('h3')).toBeVisible();
      await expect(suggestion).toContainText('Conteúdo em preparação');
      await expect(suggestion.locator('a')).toHaveCount(0);
      await suggestion.scrollIntoViewIfNeeded();
      await expect.poll(() => suggestion.locator('img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    if (width > 960) {
      const feature = await blog.locator('.kp-editorial-feature').boundingBox();
      const list = await blog.locator('.kp-editorial-suggestions').boundingBox();
      expect(Math.abs(feature.y - list.y)).toBeLessThan(2);
      expect(list.x).toBeGreaterThan(feature.x + feature.width);
      expect(Math.abs(feature.height - list.height)).toBeLessThan(150);
    }
  }
});
