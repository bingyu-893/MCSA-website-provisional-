/* MCSA homepage mascot. The existing CMS and its API stay in charge of content. */
(() => {
  'use strict';

  if (window.MCSAMascot) return;
  const script = document.currentScript;
  const imageUrl = new URL('../images/panda-welcome.png', script.src).href;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const maxSize = 300;
  let current = null;
  let userPaused = false;
  let resizeFrame = 0;

  // The forearm turns around its shoulder; the rest of the illustration stays still.
  const armOutline = 'M 423 927 C 408 912 388 901 365 887 C 324 866 293 834 275 808 C 256 783 249 765 232 746 C 213 728 209 707 217 684 C 223 663 239 644 264 633 C 286 622 323 623 344 637 C 366 650 373 670 373 693 C 374 716 403 743 425 762 C 440 776 447 787 447 805 C 449 829 463 851 477 866 L 472 912 Z';

  const artwork = `
    <svg class="mcsa-mascot__art" viewBox="0 0 1254 1254" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="mcsa-panda-arm"><path d="${armOutline}"/></clipPath>
        <clipPath id="mcsa-panda-body"><path clip-rule="evenodd"
          d="M0 0H1254V1254H0Z ${armOutline}"/></clipPath>
        <linearGradient id="mcsa-dragon-skin" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#ffdc7b"/><stop offset="1" stop-color="#ffd16b"/>
        </linearGradient>
      </defs>
      <ellipse class="mcsa-mascot__shadow" cx="660" cy="1159" rx="300" ry="24" fill="#65091b" opacity=".18"/>
      <g class="mcsa-mascot__body">
        <image width="1254" height="1254" clip-path="url(#mcsa-panda-body)"/>
        <path d="M433 851Q467 856 483 888L449 935L417 917Z" fill="#171b20"/>
        <g class="mcsa-mascot__arm">
          <image width="1254" height="1254" clip-path="url(#mcsa-panda-arm)"/>
        </g>
        <g class="mcsa-mascot__blink">
          <path d="M477 326Q491 293 558 281Q568 310 543 332Q513 345 477 333Z" fill="url(#mcsa-dragon-skin)"/>
          <path d="M488 319Q520 331 548 300" fill="none" stroke="#151618" stroke-width="7" stroke-linecap="round"/>
        </g>
      </g>
    </svg>`;

  function motionAllowed() {
    if (reducedMotion.matches) return false;
    try {
      return JSON.parse(localStorage.getItem('mcsa-preferences') || '{}').motion !== false;
    } catch {
      return true;
    }
  }

  function labels() {
    const language = document.documentElement.lang.toLowerCase();
    if (language.startsWith('en')) return ['Pause mascot animation', 'Play mascot animation'];
    if (language.includes('hant')) return ['暫停熊貓動畫', '播放熊貓動畫'];
    return ['暂停熊猫动画', '播放熊猫动画'];
  }

  function updateMotion() {
    if (!current) return;
    const { element, button, inView } = current;
    const allowed = motionAllowed();
    element.dataset.still = String(!allowed);
    element.dataset.paused = String(userPaused || !inView || document.hidden);
    button.hidden = !allowed;
    button.setAttribute('aria-pressed', String(userPaused));
    button.setAttribute('aria-label', labels()[userPaused ? 1 : 0]);
    button.title = button.getAttribute('aria-label');
    button.textContent = userPaused ? '▶' : 'Ⅱ';
  }

  function positionMascot() {
    resizeFrame = 0;
    if (!current?.element.isConnected) return;
    const { host, card, element } = current;
    const viewportWidth = document.documentElement.clientWidth;
    const cardBox = card.getBoundingClientRect();
    const freeSpace = viewportWidth - cardBox.right - 28;
    const besideCard = viewportWidth >= 1200 && freeSpace >= 210;
    host.classList.toggle('mcsa-mascot-below', !besideCard);

    if (besideCard) {
      const width = Math.min(maxSize, freeSpace - 24);
      const hostBox = host.getBoundingClientRect();
      const gap = Math.min(45, (freeSpace - width) / 2);
      element.style.setProperty('--mascot-size', `${width}px`);
      element.style.setProperty('--mascot-left', `${cardBox.right - hostBox.left + gap}px`);
    } else {
      element.style.removeProperty('--mascot-size');
      element.style.removeProperty('--mascot-left');
    }
  }

  function schedulePosition() {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(positionMascot);
  }

  function cleanup() {
    if (!current) return;
    current.resizeObserver?.disconnect();
    current.intersectionObserver?.disconnect();
    current.host.classList.remove('mcsa-mascot-below');
    current.element.remove();
    current = null;
  }

  function mount() {
    const host = document.querySelector('#hero .hero-art');
    if (host && current?.host === host) {
      updateMotion();
      schedulePosition();
      return;
    }
    cleanup();
    if (!host) return;
    const card = host.querySelector('.hero-seal');
    if (!card) return;

    const element = document.createElement('div');
    element.className = 'mcsa-mascot';
    element.innerHTML = artwork;
    element.querySelectorAll('image').forEach(image => image.setAttribute('href', imageUrl));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mcsa-mascot__toggle';
    button.addEventListener('click', () => {
      userPaused = !userPaused;
      updateMotion();
    });
    element.append(button);
    host.append(element);
    current = { host, card, element, button, inView: true };

    if ('ResizeObserver' in window) {
      current.resizeObserver = new ResizeObserver(schedulePosition);
      current.resizeObserver.observe(card);
      current.resizeObserver.observe(host);
    }
    if ('IntersectionObserver' in window) {
      current.intersectionObserver = new IntersectionObserver(([entry]) => {
        if (current?.element !== entry.target) return;
        current.inView = entry.isIntersecting;
        updateMotion();
      });
      current.intersectionObserver.observe(element);
    }
    updateMotion();
    positionMascot();
  }

  // app.js dispatches this event after initial loading and each language change.
  window.addEventListener('mcsa-render', mount);
  window.addEventListener('resize', schedulePosition, { passive: true });
  window.addEventListener('pageshow', mount);
  document.addEventListener('visibilitychange', updateMotion);
  reducedMotion.addEventListener('change', updateMotion);
  window.MCSAMascot = { refresh: mount };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
