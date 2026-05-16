// ============ ANO DINÂMICO NO FOOTER ============
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

// ============ HOVER SLIDER (Seção 4 — Linha UP) ============
const titles = document.querySelectorAll('.slide-title');
if (titles.length) {
  const images = document.querySelectorAll('.slide-image');
  const infos = document.querySelectorAll('.slide-info');

  // Split de cada título em char-wraps (original + duplicate) para o efeito de roll
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
      original.textContent = char === ' ' ? ' ' : char;
      original.style.transitionDelay = `${i * 25}ms`;
      const duplicate = document.createElement('span');
      duplicate.className = 'char-duplicate';
      duplicate.textContent = char === ' ' ? ' ' : char;
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

// ============ WAVE-TEXT (Seção 3 — Pullquote, hover por palavra) ============
const pqText = document.querySelector('.pq-text');
if (pqText && !prefersReduced) {
  const walker = document.createTreeWalker(pqText, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let wordIndex = 0;
  textNodes.forEach(node => {
    const parent = node.parentNode;
    const fragment = document.createDocumentFragment();
    // split capturando whitespace para preservar espaços como text nodes
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

// ============ FORM SUBMIT ============
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // TODO: trocar por integração real (Formspree, e-mail, CRM, etc.)
    const dados = Object.fromEntries(new FormData(form).entries());
    console.log('Lead capturado:', dados);

    form.querySelectorAll('.form-row, .btn-submit, .form-disclaimer').forEach(el => {
      el.style.display = 'none';
    });
    document.getElementById('formSuccess').classList.add('show');
  });
}
