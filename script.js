// ============ ANO DINÂMICO NO FOOTER ============
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

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
