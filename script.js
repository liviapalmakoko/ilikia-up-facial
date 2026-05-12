// ============ ANO DINÂMICO NO FOOTER ============
document.getElementById('ano').textContent = new Date().getFullYear();

// ============ MÁSCARA DE TELEFONE BR ============
const whatsapp = document.getElementById('whatsapp');
if (whatsapp) {
  whatsapp.addEventListener('input', (e) => {
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

// ============ ANIMAÇÃO ON-SCROLL ============
const animatedEls = document.querySelectorAll('.beneficio, .produto-card');

if ('IntersectionObserver' in window) {
  animatedEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => io.observe(el));
}

// ============ FORM (placeholder de envio) ============
// Quando definirmos o destino (Formspree, e-mail, CRM, etc.), trocamos esta lógica.
const form = document.getElementById('form-lead');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Por enquanto, apenas coleta os dados e mostra feedback.
    // Substituir por integração real depois (Formspree / e-mail / API).
    const dados = Object.fromEntries(new FormData(form).entries());
    console.log('Lead capturado:', dados);

    feedback.hidden = false;
    feedback.textContent = 'Obrigado! Em breve entraremos em contato.';
    feedback.className = 'form-feedback success';
    form.reset();
  });
}
