(function () {
  var KEY = 'md_transicao';
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function criar(x, y) {
    var d = document.createElement('div');
    d.className = 'md-transicao';
    d.style.setProperty('--x', x + 'px');
    d.style.setProperty('--y', y + 'px');
    d.innerHTML = '<div class="md-logo"><img src="logo.png" alt=""></div>';
    document.body.appendChild(d);
    return d;
  }

  // Chegada: a cor cobre a tela e se recolhe, revelando a página
  var salvo = null;
  try { salvo = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
  if (salvo && !reduz) {
    var p = JSON.parse(salvo), ov = criar(p.x, p.y);
    ov.classList.add('cheio');
    document.documentElement.classList.remove('md-chegando');
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('saindo'); }); });
    setTimeout(function () { ov.remove(); }, 1100);
  }
  document.documentElement.classList.remove('md-chegando');

  // Saída: ao clicar, o círculo cresce a partir do clique e então abre a página
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-transicao]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    var href = a.href;
    if (reduz) { location.href = href; return; }
    var r = a.getBoundingClientRect();
    var x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    try { sessionStorage.setItem(KEY, JSON.stringify({ x: x, y: y })); } catch (er) {}
    var ov = criar(x, y);
    requestAnimationFrame(function () { ov.classList.add('cobrir'); });
    setTimeout(function () { location.href = href; }, 700);
  });

  // Voltar do navegador: remove qualquer cobertura que ficou na tela
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.querySelectorAll('.md-transicao').forEach(function (o) { o.remove(); });
  });
})();
