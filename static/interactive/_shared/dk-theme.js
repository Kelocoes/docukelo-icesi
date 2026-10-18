// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-theme.js: hace que una pieza interactiva (iframe) siga el tema claro/oscuro de DocuKelo.
 *
 * Pone en <html> el atributo data-dkt="light|dark". Orden de prioridad:
 *   1. ?theme=light|dark en la URL, o un mensaje postMessage({ dkTheme: 'dark' }) (lo usa el visor del sandbox)
 *   2. data-theme de <html> de la pagina que contiene el iframe (Docusaurus, mismo origen), observado en vivo
 *   3. prefers-color-scheme del sistema (cuando la pieza se abre sola)
 * Uso en CSS: :root[data-dkt='dark'] { --bg: #1b1b1d; ... }
 */
(function () {
  var root = document.documentElement;
  var forced = (/[?&]theme=(light|dark)/.exec(location.search) || [])[1] || null;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function parentTheme() {
    try {
      if (window.parent === window) return null;
      var t = window.parent.document.documentElement.getAttribute('data-theme');
      return t === 'dark' || t === 'light' ? t : null;
    } catch (e) { return null; } // otro origen: no se puede leer
  }
  function apply(theme) { root.setAttribute('data-dkt', theme === 'dark' ? 'dark' : 'light'); }
  function resolve() { return forced || parentTheme() || (mq && mq.matches ? 'dark' : 'light'); }

  apply(resolve());

  try {
    if (window.parent !== window) {
      new MutationObserver(function () { if (!forced) apply(resolve()); })
        .observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  } catch (e) { /* sin acceso al padre */ }

  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (!forced) apply(resolve()); });

  window.addEventListener('message', function (e) {
    if (e.data && (e.data.dkTheme === 'dark' || e.data.dkTheme === 'light')) { forced = e.data.dkTheme; apply(forced); }
  });
})();
