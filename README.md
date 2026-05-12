# UP Facial — Ilikia

Landing page do produto **UP Facial**, da Ilikia.
Objetivo: captação de lead (médicos / profissionais da estética).

## Estrutura
- `index.html` — estrutura da LP (7 seções)
- `style.css` — estilos
- `script.js` — interações (máscara de telefone, animações, form)
- `assets/images/` — imagens (fotos dos géis, logos, hero)
- `assets/fonts/` — fontes customizadas (Gotham quando disponível)
- `briefing/` — briefing original do projeto

## Rodando localmente
```bash
# qualquer servidor estático serve, por exemplo:
python3 -m http.server 8000
# ou
npx serve .
```
Depois abrir http://localhost:8000

## Pendências
- [ ] Adicionar logo da Ilikia (`assets/images/logo-ilikia.svg`)
- [ ] Adicionar logo UP Facial (`assets/images/logo-up-facial.svg`)
- [ ] Foto principal do hero
- [ ] Foto do UP Fine, UP Deep e UP Contour
- [ ] Definir destino do formulário (Formspree / e-mail / WhatsApp)
- [ ] Arquivos da fonte Gotham (opcional — usa Montserrat como fallback)
