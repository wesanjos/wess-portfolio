const { test, expect } = require('@playwright/test');

const base = '/projetos/kanpai';

test('program updates keep headings, panel height and scroll stable', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/empresas`);
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('#programas');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const read = () => section.evaluate((node) => ({
      heading: node.querySelector('h2').getBoundingClientRect().top,
      panel: node.querySelector('[role="tabpanel"]').getBoundingClientRect().height,
      scroll: window.scrollY,
    }));
    const initial = await read();
    for (const label of ['SIPAT', 'Quick massagem', 'Palestras', 'Ginástica laboral']) {
      await page.getByRole('tab', { name: new RegExp(label) }).evaluate((button) => button.click());
      await expect(page.getByRole('tab', { name: new RegExp(label) })).toHaveAttribute('aria-selected', 'true');
      expect(await read()).toEqual(initial);
      expect(await page.locator('main h1, #programas h2').evaluateAll((nodes) => nodes.flatMap((node) => node.getAnimations()).length)).toBe(0);
    }
  }
});

test('accordions animate opening, closing and switching treatments', async ({ page }) => {
  for (const path of ['', '/tratamentos', '/tratamentos/massoterapia-clinica', '/empresas']) {
    await page.goto(base + path);
    const detail = page.locator('main details').last();
    // Wait for hydration and motion setup before interacting with native markup.
    await expect(page.locator('main details[name]')).toHaveCount(0);
    const samples = await detail.evaluate(async (element) => {
      const settle = () => Promise.all(element.getAnimations().map((animation) => animation.finished));
      const height = () => element.getBoundingClientRect().height;
      const summary = element.querySelector('summary');
      const closed = height();
      summary.click();
      const openingAnimation = element.getAnimations()[0];
      openingAnimation.pause();
      openingAnimation.currentTime = 120;
      const opening = height();
      openingAnimation.play();
      await settle();
      const opened = height();
      summary.click();
      const closingAnimation = element.getAnimations()[0];
      closingAnimation.pause();
      closingAnimation.currentTime = 120;
      const closing = height();
      closingAnimation.play();
      await settle();
      return { closed, opening, opened, closing, end: height(), open: element.open };
    });
    expect(samples.opening, path).toBeGreaterThan(samples.closed);
    expect(samples.opening, path).toBeLessThan(samples.opened);
    expect(samples.closing, path).toBeGreaterThan(samples.closed);
    expect(samples.closing, path).toBeLessThan(samples.opened);
    expect(samples.end, path).toBeCloseTo(samples.closed);
    expect(samples.open, path).toBe(false);
  }

  await page.goto(base);
  const treatments = page.locator('#tratamentos details');
  await expect(treatments.first()).not.toHaveAttribute('name');
  await treatments.nth(1).locator('summary').click();
  await expect.poll(() => treatments.evaluateAll((nodes) => nodes.filter((node) => node.getAnimations().length).length)).toBe(2);
  await expect(treatments.first()).toHaveJSProperty('open', false);
  await expect(treatments.nth(1)).toHaveJSProperty('open', true);
});

test('rapid keyboard toggles and reduced motion leave accordions usable', async ({ page }) => {
  await page.goto(base);
  const detail = page.locator('#tratamentos details').nth(1);
  await expect(detail).not.toHaveAttribute('name');
  await detail.locator('summary').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(detail).toHaveJSProperty('open', true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => detail.evaluate((node) => node.getAnimations().length)).toBe(0);
  await page.keyboard.press('Enter');
  await expect(detail).toHaveJSProperty('open', false);
  await expect.poll(() => detail.evaluate((node) => node.getAnimations().length)).toBe(0);
});

test('section headings and cards reveal without persistent hover movement', async ({ page }) => {
  await page.goto(base);
  const heading = page.locator('#tratamentos h2');
  await heading.scrollIntoViewIfNeeded();
  await expect.poll(() => heading.evaluate((node) => node.getAnimations().length)).toBeGreaterThan(0);
  await page.goto(`${base}/blog`);
  const card = page.locator('main a:has(h3)').first();
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.evaluate((node) => node.getAnimations().length)).toBeGreaterThan(0);
  await card.evaluate((node) => Promise.all(node.getAnimations().map((animation) => animation.finished)));
  await expect.poll(() => card.evaluate((node) => getComputedStyle(node).transform)).toBe('none');
  const read = () => card.evaluate((node) => {
    const style = getComputedStyle(node);
    const transform = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
    return { shadow: style.boxShadow, y: transform.m42 };
  });
  const initial = await read();
  await card.hover();
  await expect.poll(read).toEqual(initial);
  expect(initial.y).toBe(0);
});

test('hero and cards respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await expect(page.locator('main details[name]')).toHaveCount(0);
  const card = page.locator('#para-quem article').first();
  await card.scrollIntoViewIfNeeded();
  expect(await page.locator('main h1, #para-quem article, #para-quem h2').evaluateAll(
    (nodes) => nodes.flatMap((node) => node.getAnimations()).length,
  )).toBe(0);
});
