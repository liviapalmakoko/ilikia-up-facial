(function () {
  'use strict';

  // ============ ANO DINÂMICO NO FOOTER ============
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // ============ HOVER SLIDER (Seção 4 — Linha UP) ============
  const titles = document.querySelectorAll('.slide-title');
  if (titles.length) {
    const images = document.querySelectorAll('.slide-image');
    const infos = document.querySelectorAll('.slide-info');

    titles.forEach(btn => {
      const stagger = btn.querySelector('.slide-stagger');
      if (!stagger) return;
      const text = stagger.textContent;
      stagger.innerHTML = '';
      [...text].forEach((char, i) => {
        const wrap = document.createElement('span');
        wrap.className = 'char-wrap';
        const original = document.createElement('span');
        original.className = 'char-original';
        original.textContent = char === ' ' ? ' ' : char;
        original.style.transitionDelay = `${i * 25}ms`;
        const duplicate = document.createElement('span');
        duplicate.className = 'char-duplicate';
        duplicate.textContent = char === ' ' ? ' ' : char;
        duplicate.style.transitionDelay = `${i * 25}ms`;
        wrap.appendChild(original);
        wrap.appendChild(duplicate);
        stagger.appendChild(wrap);
      });
    });

    const setActive = (idx) => {
      titles.forEach((el, i) => el.dataset.active = i === idx ? 'true' : 'false');
      images.forEach((el, i) => el.dataset.active = i === idx ? 'true' : 'false');
      infos.forEach((el, i) => el.dataset.active = i === idx ? 'true' : 'false');
    };

    titles.forEach((btn, i) => {
      btn.addEventListener('mouseenter', () => setActive(i));
      btn.addEventListener('focus', () => setActive(i));
      btn.addEventListener('click', () => setActive(i));
    });
  }

  // ============ REVEAL ON SCROLL ============
  const revealEls = document.querySelectorAll('.reveal, .stagger');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealEls.length && 'IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ============ WAVE-TEXT (Seção 3, hover por palavra) ============
  const pqText = document.querySelector('.pq-text');
  if (pqText && !prefersReduced) {
    const walker = document.createTreeWalker(pqText, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let wordIndex = 0;
    textNodes.forEach(node => {
      const parent = node.parentNode;
      const fragment = document.createDocumentFragment();
      const tokens = node.textContent.split(/(\s+)/);
      tokens.forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          fragment.appendChild(document.createTextNode(token));
        } else {
          const span = document.createElement('span');
          span.className = 'pq-word';
          span.style.setProperty('--i', wordIndex++);
          span.textContent = token;
          fragment.appendChild(span);
        }
      });
      parent.replaceChild(fragment, node);
    });
  }

  // ============ MÁSCARA DE TELEFONE BR ============
  const tel = document.getElementById('f-tel');
  if (tel) {
    tel.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/(\d{0,2}).*/, '($1');
      }
      e.target.value = v;
    });
  }

  // ============================================
  // Lead form — RD Station Marketing v1.3 + tracking
  // (padrão compartilhado com nanogen + upfull, conta Ilikia)
  // ============================================
  const RD_PUBLIC_TOKEN = '61d98fcb65995325460b68f98e0995fe';
  const RD_IDENTIFIER   = 'upfacial-lp-koko';
  const RD_ENDPOINT     = 'https://www.rdstation.com.br/api/1.3/conversions';

  const TRACKING_KEY = 'upfacial_tracking_v1';
  const TRACKING_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  const UTM_KEYS  = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const CLICK_IDS = ['gclid', 'fbclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid'];

  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function readTrackingFromStorage() {
    try {
      const raw = localStorage.getItem(TRACKING_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed._ts) return null;
      if (Date.now() - parsed._ts > TRACKING_TTL_MS) {
        localStorage.removeItem(TRACKING_KEY);
        return null;
      }
      return parsed;
    } catch (_) { return null; }
  }

  function captureTracking() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const stored = readTrackingFromStorage() || {};

    const incoming = {};
    UTM_KEYS.concat(CLICK_IDS).forEach((k) => {
      const v = params.get(k);
      if (v) incoming[k] = v;
    });

    const hasNewAttribution = Object.keys(incoming).some((k) => UTM_KEYS.includes(k) || CLICK_IDS.includes(k));

    const merged = Object.assign({}, stored);
    if (hasNewAttribution) {
      UTM_KEYS.concat(CLICK_IDS).forEach((k) => { delete merged[k]; });
      Object.assign(merged, incoming);
    }

    if (!merged.first_seen) merged.first_seen = Date.now();
    merged.landing_page = merged.landing_page || window.location.href;
    merged.landing_path = merged.landing_path || window.location.pathname;
    merged.referrer     = merged.referrer     || document.referrer || '';
    merged.user_agent   = merged.user_agent   || navigator.userAgent || '';
    merged._ts = Date.now();

    try { localStorage.setItem(TRACKING_KEY, JSON.stringify(merged)); } catch (_) {}
    return merged;
  }

  window.UpfacialTracking = {
    get: readTrackingFromStorage,
    capture: captureTracking,
    clear: () => { try { localStorage.removeItem(TRACKING_KEY); } catch (_) {} },
  };

  window.dataLayer = window.dataLayer || [];
  const _trackingNow = captureTracking();
  window.dataLayer.push({
    event: 'page_view_enriched',
    page_location: window.location.href,
    page_path: window.location.pathname,
    referrer: _trackingNow.referrer || '',
    utm_source:   _trackingNow.utm_source   || '',
    utm_medium:   _trackingNow.utm_medium   || '',
    utm_campaign: _trackingNow.utm_campaign || '',
    utm_term:     _trackingNow.utm_term     || '',
    utm_content:  _trackingNow.utm_content  || '',
    gclid:   _trackingNow.gclid   || '',
    fbclid:  _trackingNow.fbclid  || '',
    gbraid:  _trackingNow.gbraid  || '',
    wbraid:  _trackingNow.wbraid  || '',
    msclkid: _trackingNow.msclkid || '',
    ttclid:  _trackingNow.ttclid  || '',
  });

  function showFormError(message) {
    const el = document.getElementById('formError');
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
  }
  function clearFormError() {
    const el = document.getElementById('formError');
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  }
  function showSuccessState() {
    const formDefault = document.getElementById('formDefault');
    const formSuccess = document.getElementById('formSuccess');
    if (formDefault) formDefault.hidden = true;
    if (formSuccess) {
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn  = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    clearFormError();

    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    const data = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      crm: form.crm.value.trim(),
      estado: form.estado.value,
      especialidade: form.especialidade.value,
      consent: form.consent.checked,
    };

    window.dataLayer.push({
      event: 'lead_form_submit',
      form_id: RD_IDENTIFIER,
      form_name: 'upfacial-acesso-profissional',
    });

    submitBtn.disabled = true;
    submitText.textContent = 'Enviando…';

    const t = readTrackingFromStorage() || {};

    const payload = {
      token_rdstation: RD_PUBLIC_TOKEN,
      identificador: RD_IDENTIFIER,
      email: data.email,
      nome: data.nome,
      telefone: data.telefone,
      estado: data.estado,
      cf_crm: data.crm,
      cf_especialidade: data.especialidade,
      tags: [
        'upfacial-landing',
        'lp-koko',
        `especialidade-${slugify(data.especialidade)}`,
        `estado-${slugify(data.estado)}`,
      ],
      available_for_mailing: data.consent,

      utm_source:   t.utm_source   || '',
      utm_medium:   t.utm_medium   || '',
      utm_campaign: t.utm_campaign || '',
      utm_term:     t.utm_term     || '',
      utm_content:  t.utm_content  || '',
      gclid:  t.gclid  || '',
      fbclid: t.fbclid || '',

      client_id: getCookie('_rdtrk') || '',
      traffic_source:  t.referrer     || '',
      conversion_url:  window.location.href,
      landing_page:    t.landing_page || window.location.href,
    };

    try {
      const res = await fetch(RD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let body = ''; try { body = await res.text(); } catch (_) {}
        throw new Error(`RD ${res.status} ${body}`);
      }
      window.dataLayer.push({
        event: 'generate_lead',
        form_id: RD_IDENTIFIER,
        form_name: 'upfacial-acesso-profissional',
        lead_email: data.email,
      });
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'upfacial-acesso-profissional',
          content_category: 'profissional-saude',
        });
      }
      showSuccessState();
    } catch (err) {
      console.error('[UPFACIAL] Erro ao enviar lead pro RD Station:', err);
      window.dataLayer.push({
        event: 'lead_form_error',
        form_id: RD_IDENTIFIER,
        error_message: String(err && err.message || err),
      });
      showFormError('Não foi possível enviar agora. Tente novamente em instantes ou nos contate por outro canal.');
      submitBtn.disabled = false;
      submitText.textContent = 'Solicitar acesso';
    }
    return false;
  }
  window.submitForm = submitForm;

})();
