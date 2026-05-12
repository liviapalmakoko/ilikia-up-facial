// ============ ANO DINÂMICO NO FOOTER ============
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

// ============ REVEAL ON SCROLL ============
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ============ HERO PARTICLES (efeito starfield igual upmax) ============
(function () {
  function initHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    if (reduceMotion) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const count = isMobile ? 200 : 480;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'p';
      const yPct = Math.random() * 100;
      const sizeFactor = 0.5 + (yPct / 100) * 1.3;
      const size = (0.8 + Math.random() * 1.6) * sizeFactor;
      const left = Math.random() * 100;
      const twinkleDur = 2.5 + Math.random() * 4.5;
      const delay = -Math.random() * twinkleDur;
      const omin = 0.05 + Math.random() * 0.25;
      const omax = 0.45 + Math.random() * 0.55;
      const driftRange = 60 + sizeFactor * 120;
      const dx = ((Math.random() - 0.5) * 2 * driftRange).toFixed(1);
      const dy = ((Math.random() - 0.5) * 2 * driftRange).toFixed(1);
      const moveDur = 2.5 + Math.random() * 4;
      const moveDelay = -Math.random() * moveDur;

      p.style.cssText =
        'width:' + size.toFixed(2) + 'px;height:' + size.toFixed(2) + 'px;' +
        'left:' + left.toFixed(2) + '%;top:' + yPct.toFixed(2) + '%;' +
        '--d:' + twinkleDur.toFixed(2) + 's;--delay:' + delay.toFixed(2) + 's;' +
        '--omin:' + omin.toFixed(2) + ';--omax:' + omax.toFixed(2) + ';' +
        '--dx:' + dx + 'px;--dy:' + dy + 'px;' +
        '--md:' + moveDur.toFixed(2) + 's;--mdelay:' + moveDelay.toFixed(2) + 's;';
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroParticles);
  } else {
    initHeroParticles();
  }
})();

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
    const submitText = document.getElementById('submitText');
    if (submitText) submitText.textContent = 'Enviando...';

    // TODO: trocar por integração real (Formspree, e-mail, CRM, etc.)
    const dados = Object.fromEntries(new FormData(form).entries());
    console.log('Lead capturado:', dados);

    setTimeout(() => {
      form.querySelectorAll('.form-row, .btn-submit, .form-disclaimer').forEach(el => {
        el.style.display = 'none';
      });
      document.getElementById('formSuccess').classList.add('show');
    }, 600);
  });
}
