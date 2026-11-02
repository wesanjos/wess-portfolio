const { test, expect } = require('@playwright/test');

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
    await expect(page.getByRole('contentinfo')).toBeVisible();
  }
});

test('larguras', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of pages) {
      await page.goto(base + path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
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
});

test('links internos', async ({ page, request }) => {
  for (const [path] of pages) {
    await page.goto(base + path);
    const links = await page.locator('a[href^="/projetos/kanpai"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href').split('#')[0]));
    for (const link of new Set(links)) expect((await request.get(link)).status(), link).toBe(200);
  }
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
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title).toMatch(/kanpai/i);
    expect(description).toBeTruthy();
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
  }
});

test('movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('ações demonstrativas', async ({ page }) => {
  await page.goto(base);
  await page.getByRole('link', { name: /agendar avaliação/i }).first().click();
  await expect(page.getByText(/demonstração|demonstrativa/i).first()).toBeVisible();
});

test('falha de imagem', async ({ page }) => {
  await page.route(/\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i, (route) => route.abort());
  await page.goto(base);
  await expect(page.locator('img[alt]:not([alt=""])').first()).toBeAttached();
  await expect(page.getByRole('navigation').first()).toBeVisible();
});

test('sem CMS', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  for (const [path] of pages) await page.goto(base + path);
  expect(requests.filter((url) => /datocms/i.test(url))).toEqual([]);
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
