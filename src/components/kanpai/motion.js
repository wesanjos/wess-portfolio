import { animate } from 'motion';

// Enhance native disclosures without wrappers or per-frame React updates.
export function setupMotion(root) {
  if (!root || !Element.prototype.animate) return undefined;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disclosures = new Map();
  const revealAnimations = new Set();

  root.querySelectorAll('details').forEach((detail) => {
    disclosures.set(detail, {
      expanded: detail.open,
      group: detail.getAttribute('name'),
      animation: null,
      overflow: detail.style.overflow,
      boxSizing: detail.style.boxSizing,
    });
    // Manage groups here so the closing sibling can finish its animation.
    detail.removeAttribute('name');
  });

  function finish(detail, state) {
    state.animation?.cancel();
    state.animation = null;
    detail.open = state.expanded;
    detail.style.overflow = state.overflow;
    detail.style.boxSizing = state.boxSizing;
    delete detail.dataset.kanpaiExpanded;
    detail.querySelector('summary').removeAttribute('aria-expanded');
  }

  function transition(detail, expanded) {
    const state = disclosures.get(detail);
    const start = detail.getBoundingClientRect().height;
    state.animation?.cancel();
    state.expanded = expanded;
    if (reducedMotion.matches) {
      finish(detail, state);
      return;
    }
    const summary = detail.querySelector('summary');
    const style = getComputedStyle(detail);
    const closedHeight = summary.getBoundingClientRect().height
      + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    detail.open = true;
    detail.dataset.kanpaiExpanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    detail.style.overflow = 'hidden';
    detail.style.boxSizing = 'border-box';
    const end = expanded ? detail.getBoundingClientRect().height : closedHeight;
    const animation = detail.animate(
      [{ height: `${start}px` }, { height: `${end}px` }],
      { duration: 320, easing: 'cubic-bezier(.2, .7, .2, 1)' },
    );
    state.animation = animation;
    animation.onfinish = () => {
      state.animation = null;
      finish(detail, state);
    };
  }

  function onClick(event) {
    const summary = event.target.closest('summary');
    const detail = summary?.parentElement;
    if (!disclosures.has(detail) || event.target.closest('a, button')) return;
    event.preventDefault();
    const state = disclosures.get(detail);
    const expanded = !state.expanded;
    if (expanded && state.group) {
      disclosures.forEach((siblingState, sibling) => {
        if (sibling !== detail && siblingState.group === state.group && siblingState.expanded) {
          transition(sibling, false);
        }
      });
    }
    transition(detail, expanded);
  }

  function reveal(target, delay = 0) {
    if (reducedMotion.matches) return;
    const opacity = target.style.opacity;
    const transform = target.style.transform;
    const animation = animate(target,
      { opacity: [.45, 1], transform: ['translateY(10px)', 'translateY(0px)'] },
      { duration: .48, delay, ease: [.2, .7, .2, 1] },
    );
    const restore = () => {
      target.style.opacity = opacity;
      target.style.transform = transform;
      revealAnimations.delete(cancel);
    };
    const cancel = () => {
      animation.cancel();
      restore();
    };
    revealAnimations.add(cancel);
    animation.then(restore);
  }

  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      const siblings = [...target.parentElement.children].filter((element) => cards.has(element));
      const delay = cards.has(target) ? (siblings.indexOf(target) % 3) * .09 : 0;
      reveal(target, delay);
    });
  }, { threshold: .2 });
  const cards = new Set(root.querySelectorAll('section article, .kp-plan-card, .kp-editorial-feature, .kp-editorial-suggestion, [data-kanpai-post], .kp-evaluation__steps > li, .kp-sage:has(> h3), .kp-sand:has(> h3)'));
  if (!root.dataset.kanpaiUpdated) {
    const hero = root.querySelector('h1');
    if (hero) {
      reveal(hero);
      const description = hero.parentElement.querySelector('p');
      if (description) reveal(description, .08);
    }
    root.querySelectorAll('section h2').forEach((heading) => observer?.observe(heading));
    cards.forEach((card) => observer?.observe(card));
  }

  function onMotionChange() {
    if (!reducedMotion.matches) return;
    disclosures.forEach((state, detail) => finish(detail, state));
    revealAnimations.forEach((cancel) => cancel());
    revealAnimations.clear();
  }

  root.addEventListener('click', onClick);
  reducedMotion.addEventListener('change', onMotionChange);
  return () => {
    root.removeEventListener('click', onClick);
    reducedMotion.removeEventListener('change', onMotionChange);
    observer?.disconnect();
    revealAnimations.forEach((cancel) => cancel());
    disclosures.forEach((state, detail) => {
      finish(detail, state);
      if (state.group !== null) detail.setAttribute('name', state.group);
    });
  };
}

export function setupProgramLayout(root, content) {
  if (!root?.querySelector('#programas [role="tabpanel"]')) return undefined;
  let previousWidth = 0;
  const panels = Object.entries(content.variants)
    .filter(([key]) => key.startsWith('empresas:'))
    .map(([, patch]) => {
      const template = document.createElement('template');
      template.innerHTML = content.initial.slice(0, patch.start) + patch.middle
        + (patch.end ? content.initial.slice(-patch.end) : '');
      return template.content.querySelector('#programas [role="tabpanel"]');
    });

  function measure() {
    const panel = root.querySelector('#programas [role="tabpanel"]');
    const width = panel.getBoundingClientRect().width;
    if (!width || width === previousWidth) return;
    previousWidth = width;
    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.inert = true;
    container.style.cssText = `position: absolute; visibility: hidden; pointer-events: none; width: ${width}px; top: 0; left: 0;`;
    const samples = panels.map((source) => {
      const sample = source.cloneNode(true);
      sample.style.minHeight = '0';
      sample.style.boxSizing = 'border-box';
      sample.style.width = '100%';
      sample.querySelector('h3').style.minHeight = '0';
      container.append(sample);
      return sample;
    });
    panel.parentElement.append(container);
    const headingHeight = Math.max(...samples.map((sample) => sample.querySelector('h3').getBoundingClientRect().height));
    samples.forEach((sample) => { sample.querySelector('h3').style.minHeight = `${headingHeight}px`; });
    const height = Math.max(...samples.map((sample) => sample.getBoundingClientRect().height));
    container.remove();
    root.style.setProperty('--kanpai-program-height', `${height}px`);
    root.style.setProperty('--kanpai-program-heading-height', `${headingHeight}px`);
  }

  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  document.fonts.ready.then(() => {
    if (!root.isConnected) return;
    previousWidth = 0;
    measure();
  });
  return () => observer.disconnect();
}
