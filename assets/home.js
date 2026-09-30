/* Homepage components. Content comes from the CMS; this file owns presentation. */
(() => {
  'use strict';
  let stopDepartmentMotion = () => {};
  let selectedDepartment = null;

  function pills(text, escape) {
    return String(text).split(/[|｜]/).filter(Boolean)
      .map(tag => `<span>${escape(tag.trim())}</span>`).join('');
  }

  function hero(context) {
    const {
      data,
      t,
      ui,
      esc,
      image,
      a,
      paragraphs
    } = context;
    const title = esc(t(data.pages.home.title))
      .replace(/Chinese/g, '<span class="red-word">Chinese</span>').replace(/\n/g, '<br>');
    return `
      <section class="hero" id="hero">
        <div class="hero-copy">
          <span class="eyebrow welcome">${ui('欢迎来到 MCSA','WELCOME TO MCSA','歡迎來到 MCSA')}</span>
          <h1>${title}</h1>
          <div class="hero-description">${paragraphs(data.pages.home.paragraphs)}</div>
          <div class="actions">
            ${a('#about', ui('了解我们','About us','瞭解我們'),'button primary')}
            ${a('latest-events.html',ui('查看活动','Explore events','查看活動'),'button')}
          </div>
        </div>
        <div class="hero-art">
          <div class="hero-cut" aria-hidden="true"></div>
          <div class="hero-seal">
            ${image(data.settings.heroLogo || data.settings.logo, 'MCSA', null, 'hero-brand-image')}
            <strong>MCSA</strong>
            <p>${esc(t(data.settings.heroBlurb))}</p>
          </div>
        </div>
      </section>`;
  }

  function carousel(context) {
    const {
      data,
      t,
      ui,
      esc,
      image,
      a,
      linkedHeading,
      paragraphs
    } = context;
    const cards = data.team.map((person, index) => `
      <article class="president-slide" aria-label="${index+1} / ${data.team.length}">
        <div class="president-image">
          ${person.url ? a(person.url,image(person.image,t(person.name))) : image(person.image,t(person.name))}
        </div>
        <div class="president-copy">
          <span class="pill">${ui('MCSA 现任主席团','Current MCSA Presidium','MCSA 現任主席團')}</span>
          <strong class="role">${esc(t(person.role))}</strong>
          <h3>${esc(t(person.name))}</h3>
          <p>${esc(t(person.description))}</p>
        </div>
      </article>`).join('');
    const dots = data.team.map((_, index) => `
      <button data-slide="${index}" aria-label="${ui('切换到成员','Go to member','切換到成員')} ${index+1}" aria-current="${index===0}"></button>`).join('');
    return `
      <section class="section presidium" id="presidents">
        ${linkedHeading(ui('现任主席团','Current presidium','現任主席團'),'presidents.html',paragraphs(data.pages.presidents.paragraphs))}
        <div class="carousel" role="region" aria-label="${ui('现任主席团','Current presidium','現任主席團')}">
          <div class="carousel-window" tabindex="0"><div class="carousel-track">${cards}</div></div>
          <div class="carousel-controls">
            <div>
              <button class="round prev" aria-label="${ui('上一张','Previous','上一張')}">‹</button>
              <button class="round next" aria-label="${ui('下一张','Next','下一張')}">›</button>
              <button class="pause" aria-pressed="false">${ui('暂停','Pause','暫停')}</button>
            </div>
            <div class="dots">${dots}</div>
          </div>
        </div>
      </section>`;
  }

  function departmentDetail(context, department) {
    const {
      data,
      t,
      ui,
      esc,
      a
    } = context;
    const settings = data.settings;
    const name = department ? t(department.name) : '';
    const template = t(settings.departmentButton);
    const label = template.includes('{name}')
      ? template.replaceAll('{name}', name)
      : ui(`查看${name}详情`, `Explore ${name}`, `查看${name}詳情`);
    // The navigation reads this same URL from the department record.
    const detailLink = !department ? '' : department.url
      ? a(department.url, esc(label) + ' →', 'button primary department-link')
      : `<button class="button primary department-link" type="button" disabled
          title="${ui('请在后台设置此部门的超链接','Add this department’s link in the CMS','請在後台設定此部門的超連結')}">${esc(label)} →</button>`;
    return `
      <span class="detail-kicker">${department ? ui('部门详情','DEPARTMENT DETAIL','部門詳情') : ui('蒙纳士中国学生会','MCSA · OUR TEAMS','蒙納士中國學生會')}</span>
      <h3>${esc(t(department?.name || settings.departmentOverviewTitle))}</h3>
      <p>${esc(t(department?.intro || settings.departmentOverview))}</p>
      <div class="department-pills">${pills(t(department?.keywords || settings.departmentOverviewTags),esc)}</div>
      ${detailLink}`;
  }

  function departments(context) {
    const {
      data,
      t,
      ui,
      esc
    } = context;
    const item = (department, duplicate) => `
      <button class="department-choice" type="button" data-department="${esc(department.id)}"
        ${duplicate ? 'tabindex="-1" aria-hidden="true"' : 'aria-pressed="false"'}>
        <span class="department-choice-title">${esc(t(department.name))}</span>
        <span class="department-choice-summary">${esc(t(department.keywords)).replace(/[|｜]/g,' · ')}</span>
        <span class="department-choice-arrow" aria-hidden="true">→</span>
      </button>`;
    selectedDepartment = null;
    return `
      <div class="department-explorer">
        <article class="department-detail" id="department-detail" aria-live="polite" aria-atomic="true">
          ${departmentDetail(context,null)}
        </article>
        <div class="department-list-side">
          <div class="department-scroll" tabindex="0" role="region" aria-label="${ui('部门列表，可拖动或滚动','Departments, drag or scroll','部門列表，可拖動或滾動')}">
            <div class="department-track">
              ${[-1,0,1].map(copy=>`<div class="department-copy" ${copy?'aria-hidden="true"':''}>${data.departments.map(d=>item(d,copy!==0)).join('')}</div>`).join('')}
            </div>
          </div>
          <div class="department-list-controls">
            <span>${ui('拖动列表，探索六个部门','Drag to explore our teams','拖動列表，探索六個部門')}</span>
            <button class="department-pause" type="button" aria-pressed="false">${ui('暂停滚动','Pause scrolling','暫停滾動')}</button>
          </div>
        </div>
      </div>`;
  }

  function contacts(context) {
    const {
      data,
      t,
      ui,
      esc,
      image,
      a,
      heading,
      paragraphs,
      postGridOptional
    } = context;
    const qrPlatforms = data.socials.filter(item => item.placement === 'qr');
    const accounts = data.socials.filter(item => item.placement === 'account');
    const cards = qrPlatforms.map(platform => {
      const code = platform.image ?
        image(platform.image, t(platform.name), platform.crop) :
        `<div class="qr-pending"><span aria-hidden="true">＋</span><small>${ui('二维码待补充','QR code coming soon','二維碼待補充')}</small></div>`;
      return `
        <article class="social-card">
          <div class="qr-frame">${platform.url ? a(platform.url,code) : code}</div>
          <h3>${esc(t(platform.name))}</h3>
          <p>${esc(platform.account)}</p>
        </article>`;
    }).join('');
    return `
      <section id="contact" class="section contact-section">
        ${heading(t(data.pages.contact.title),paragraphs(data.pages.contact.paragraphs))}
        <div class="social-grid">${cards}</div>
        <div class="social-accounts">
          ${accounts.map(platform=>`<p><strong>${esc(t(platform.name))}</strong> ${platform.url?a(platform.url,esc(platform.account)):esc(platform.account)}</p>`).join('')}
          <p><strong>${ui('技术支持邮箱','Technical support','技術支持郵箱')}</strong> <a href="mailto:${esc(data.settings.email)}">${esc(data.settings.email)}</a></p>
        </div>
        ${postGridOptional('contact')}
      </section>`;
  }

  function applyLayout(layout) {
    const root = document.documentElement;
    const values = {
      '--content-width': layout.contentWidth + 'px',
      '--base-font': layout.baseFontSize + 'px',
      '--section-space': layout.sectionSpacing + 'px',
      '--card-radius': layout.cardRadius + 'px',
      '--red': layout.primaryColor,
      '--background-wash': layout.backgroundColor,
      '--hero-card-width': layout.heroCardWidth + 'px',
      '--hero-slope': layout.heroSlope + '%',
      '--president-share': layout.presidentImageShare + '%',
      '--president-height': layout.presidentHeight + 'px',
      '--department-height': layout.departmentHeight + 'px',
      '--qr-size': layout.contactQrSize + 'px',
      '--contact-columns': layout.contactColumns
    };
    Object.entries(values).forEach(([key, value]) => root.style.setProperty(key, value));
  }

  function bindDepartments(context, reducedMotion) {
    stopDepartmentMotion();
    const viewport = document.querySelector('.department-scroll');
    if (!viewport) return;
    const {
      data,
      ui
    } = context;
    const copies = viewport.querySelectorAll('.department-copy');
    if (!data.departments.length) return;
    let distance = copies[0].offsetHeight;
    viewport.scrollTop = distance;
    let manualPause = !data.layout.departmentAutoplay || reducedMotion;
    let dragging = false,
      moved = false,
      lastY = 0,
      startedY = 0;
    let nextAutoTime = 0,
      previousTime = performance.now(),
      frame;
    const pause = document.querySelector('.department-pause');

    function updatePause() {
      pause.textContent = manualPause ? ui('继续滚动', 'Resume scrolling', '繼續滾動') : ui('暂停滚动', 'Pause scrolling', '暫停滾動');
      pause.setAttribute('aria-pressed', String(manualPause));
    }

    function normalize() {
      if (!distance) return;
      if (viewport.scrollTop < distance * 0.5) viewport.scrollTop += distance;
      if (viewport.scrollTop >= distance * 1.5) viewport.scrollTop -= distance;
    }

    function select(id) {
      selectedDepartment = data.departments.find(item => item.id === id) || null;
      document.querySelector('#department-detail').innerHTML = departmentDetail(context, selectedDepartment);
      viewport.querySelectorAll('[data-department]').forEach(button => {
        const active = button.dataset.department === id;
        button.classList.toggle('selected', active);
        if (!button.hasAttribute('aria-hidden')) button.setAttribute('aria-pressed', String(active));
      });
      nextAutoTime = performance.now() + 3500;
    }
    viewport.addEventListener('click', event => {
      if (moved) {
        event.preventDefault();
        return;
      }
      const button = event.target.closest('[data-department]');
      if (button) select(button.dataset.department);
    });
    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      moved = false;
      lastY = startedY = event.clientY;
    });

    function onMove(event) {
      if (!dragging) return;
      if (Math.abs(event.clientY - startedY) > 6) {
        moved = true;
        viewport.classList.add('dragging');
      }
      if (moved) {
        viewport.scrollTop += lastY - event.clientY;
        normalize();
        event.preventDefault();
      }
      lastY = event.clientY;
    }

    function onEnd() {
      dragging = false;
      viewport.classList.remove('dragging');
      nextAutoTime = performance.now() + 2500;
      // Keep click suppression until the synthetic click from pointerup has run.
      setTimeout(() => {
        moved = false;
      }, 0);
    }
    window.addEventListener('pointermove', onMove, {
      passive: false
    });
    window.addEventListener('pointerup', onEnd);
    viewport.addEventListener('touchstart', () => {
      nextAutoTime = Infinity;
    }, {
      passive: true
    });
    viewport.addEventListener('touchend', () => {
      nextAutoTime = performance.now() + 2500;
    }, {
      passive: true
    });
    viewport.addEventListener('touchcancel', () => {
      nextAutoTime = performance.now() + 2500;
    }, {
      passive: true
    });
    viewport.addEventListener('wheel', () => {
      nextAutoTime = performance.now() + 1800;
    }, {
      passive: true
    });
    viewport.addEventListener('scroll', normalize, {
      passive: true
    });
    viewport.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        viewport.scrollTop += event.key === 'ArrowDown' ? 90 : -90;
        nextAutoTime = performance.now() + 4000;
      }
    });
    pause.onclick = () => {
      manualPause = !manualPause;
      updatePause();
    };
    updatePause();
    const resize = new ResizeObserver(() => {
      distance = copies[0].offsetHeight;
      normalize();
    });
    resize.observe(copies[0]);
    // Fractional pixels are accumulated: scrollTop rounding must not stall slow motion.
    let remainder = 0;

    function animate(now) {
      const elapsed = Math.min(now - previousTime, 50) / 1000;
      previousTime = now;
      if (!manualPause && !dragging && !document.hidden && now > nextAutoTime && !viewport.matches(':hover,:focus-within')) {
        remainder += elapsed * data.layout.departmentSpeed;
        if (remainder >= 1) {
          viewport.scrollTop += Math.floor(remainder) * (data.layout.departmentDirection === 'down' ? -1 : 1);
          remainder %= 1;
          normalize();
        }
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    stopDepartmentMotion = () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
    };
  }

  window.MCSAHome = {
    hero,
    carousel,
    departments,
    contacts,
    applyLayout,
    bindDepartments,
    cleanup: () => stopDepartmentMotion()
  };
})();
