/* ════════════════════════════════════════════════════════
   SCRIPT.JS · Matriz de São Raimundo Nonato — 150 anos
   ════════════════════════════════════════════════════════

   FUNÇÕES DESTE ARQUIVO:
   ──────────────────────
   1) Sombra no cabeçalho ao rolar a página
   2) Menu mobile (hamburguer) abrir/fechar
   3) Scroll reveal — anima elementos ao entrar na tela
   4) Copiar chave PIX para a área de transferência

   ATRIBUTOS NECESSÁRIOS NO HTML:
   ──────────────────────────────
   - #header             → cabeçalho principal
   - data-menu-toggle    → botão hamburguer
   - .nav                → elemento <nav>
   - .reveal             → qualquer elemento animado por scroll
   - #pixKey             → texto da chave PIX
   - data-copy-pix       → botão de copiar PIX
   - data-copy-feedback  → parágrafo de retorno da cópia

════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     Referências aos elementos do HTML
     Altere aqui se renomear IDs ou atributos.
  ───────────────────────────────────────────────── */
  const header      = document.getElementById('header');
  const menuToggle  = document.querySelector('[data-menu-toggle]');
  const nav         = document.querySelector('.nav');
  const copyBtn     = document.querySelector('[data-copy-pix]');
  const pixKeyEl    = document.getElementById('pixKey');
  const feedbackEl  = document.querySelector('[data-copy-feedback]');
  const reveals     = document.querySelectorAll('.reveal');


  /* ─────────────────────────────────────────────────
     1. SOMBRA NO CABEÇALHO AO ROLAR
     Adiciona a classe .scrolled quando a página
     passa de 20px de rolagem. Controlado no CSS.
  ───────────────────────────────────────────────── */
  function atualizarCabecalho() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', atualizarCabecalho, { passive: true });
  atualizarCabecalho(); // executa uma vez ao carregar


  /* ─────────────────────────────────────────────────
     2. MENU MOBILE (HAMBURGUER)
     Ao clicar, alterna as classes .open no botão
     e no <nav>. O CSS cuida da aparência.
  ───────────────────────────────────────────────── */
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const estaAberto = nav.classList.toggle('open');
      menuToggle.classList.toggle('open', estaAberto);
      menuToggle.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
    });

    /* Fecha o menu ao clicar em qualquer link dentro dele */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }


  /* ─────────────────────────────────────────────────
     3. SCROLL REVEAL
     Usa IntersectionObserver para animar elementos
     com a classe .reveal quando entram na tela.
     A animação é definida no CSS pela classe .visible.
  ───────────────────────────────────────────────── */
  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Para de observar após animar — melhora desempenho */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,    /* % do elemento visível para disparar */
        rootMargin: '0px 0px -40px 0px'  /* antecipa um pouco */
      }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  }


  /* ─────────────────────────────────────────────────
     4. COPIAR CHAVE PIX
     Lê o texto de #pixKey e copia via clipboard API.
     Exibe mensagem de sucesso ou instrução manual.

     Para mudar os textos de retorno:
     edite apenas as strings dentro do try/catch abaixo.
  ───────────────────────────────────────────────── */
  if (copyBtn && pixKeyEl && feedbackEl) {
    copyBtn.addEventListener('click', async function () {
      const chave = pixKeyEl.textContent.trim();

      try {
        await navigator.clipboard.writeText(chave);

        /* ── Mensagem de SUCESSO ─────────────────────
           Altere apenas o texto abaixo se quiser. */
        feedbackEl.textContent = '✓ Chave PIX copiada com sucesso!';

      } catch (_) {

        /* ── Mensagem de ERRO (navegador antigo) ─────
           Altere apenas o texto abaixo se quiser. */
        feedbackEl.textContent = 'Não foi possível copiar. Selecione e copie a chave manualmente acima.';
      }

      /* Limpa a mensagem automaticamente após 6 segundos */
      setTimeout(function () {
        feedbackEl.textContent = '';
      }, 6000);
    });
  }

})();
