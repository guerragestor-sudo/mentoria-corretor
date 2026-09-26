/* =========================================================
   Jornada do Corretor · interações (sem bibliotecas)
   ========================================================= */
(() => {
  /* ============ EDITE AQUI ============
     Deixe vazio ('') para mostrar o texto padrão:
     "Vagas limitadas", "Início em breve" e
     "com dia e horário informados no WhatsApp". */
  const CONFIG = {
    vagas: '',    // ex.: '20'                → "Apenas 20 vagas"
    inicio: '',   // ex.: '13/10'             → "Início em 13/10"
    horario: '',  // ex.: 'às terças, às 20h' → "Encontros ao vivo às terças, às 20h."
  };
  /* ==================================== */

  window.__rgReady = true;

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasIO = 'IntersectionObserver' in window;

  // Vagas, início e horário
  const fill = (key, text) => {
    if (text) $$(`[data-${key}]`).forEach((el) => (el.textContent = text));
  };
  const clean = (v) => String(v ?? '').trim();
  fill('vagas', clean(CONFIG.vagas) && `Apenas ${clean(CONFIG.vagas)} vagas`);
  fill('inicio', clean(CONFIG.inicio) && `Início em ${clean(CONFIG.inicio)}`);
  fill('horario', clean(CONFIG.horario));

  // Ano no rodapé
  $$('.js-year').forEach((el) => (el.textContent = new Date().getFullYear()));

  // Revelação suave ao rolar (e etapas da jornada acendendo)
  const revealables = $$('.reveal, .stop');
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  // Barra fixa de CTA: aparece depois do botão do topo,
  // some na seção de preço, na chamada final e no rodapé
  const bar = $('.sticky-cta');
  const heroCta = $('#cta-topo');
  if (bar && heroCta && hasIO) {
    let pastHero = false;
    const zones = new Map();

    const update = () => {
      const show = pastHero && ![...zones.values()].some(Boolean);
      bar.classList.toggle('is-visible', show);
      bar.toggleAttribute('inert', !show);
      bar.setAttribute('aria-hidden', String(!show));
    };

    new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    }).observe(heroCta);

    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => zones.set(entry.target, entry.isIntersecting));
      update();
    });
    $$('[data-hide-sticky]').forEach((el) => zoneObserver.observe(el));
  }
})();
