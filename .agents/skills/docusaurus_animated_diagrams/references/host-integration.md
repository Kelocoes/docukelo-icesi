# Instalar el kit en otro proyecto (sitio anfitrión)

La skill es una carpeta autocontenida. Lo que necesita del proyecto anfitrión es poco y se instala con un script.

```
docusaurus_animated_diagrams/
  SKILL.md                proceso (qué dibujar y cómo)
  kit/                    COPIA MAESTRA del kit: dk-*.js y dk-*.css (JavaScript plano, sin dependencias)
  host/
    install.mjs           instala o sincroniza el kit y las piezas del anfitrión
    new-piece.mjs         crea una pieza desde una plantilla, con la ruta al kit calculada
    test-pieces.mjs       prueba de humo con un navegador real (playwright-core)
    InteractiveFrame/     componente de React (Docusaurus): incrusta la pieza + botón "Pantalla completa"
  templates/              piece (secuencia), piece-canvas (escena libre), piece-phone (simulador móvil)
  tools/dk_animate.py     anima un SVG existente (solo biblioteca estándar de Python)
  references/             kit-api, patterns, key-concepts, lessons-learned (genéricos) y docukelo-project (solo este proyecto)
```

## Instalar (3 minutos)

Desde la **raíz del proyecto anfitrión** (la skill puede estar en cualquier carpeta; aquí `<skill>`):

```bash
node <skill>/host/install.mjs --npm-scripts
npm install -D playwright-core        # lo usa la prueba de humo
```

Esto hace tres cosas:

| Qué | De dónde | A dónde (por defecto) | Si ya existe |
|---|---|---|---|
| El kit | `<skill>/kit/` | `static/interactive/_shared/` | Se sincroniza siempre (es una copia **generada**: no se edita) |
| `InteractiveFrame` | `<skill>/host/InteractiveFrame/` | `src/components/InteractiveFrame/` | Si difiere, avisa y no lo toca (`--force` lo sobrescribe) |
| La prueba de humo | `<skill>/host/test-pieces.mjs` | `scripts/test-pieces.mjs` | Igual que el componente |

`--npm-scripts` agrega a `package.json` los scripts `kit:sync`, `kit:check` y `test:pieces` (si faltan).

Opciones: `--kit-dir <ruta>`, `--frame-dir <ruta>`, `--tests-file <ruta>`, `--no-frame` (sitios que no son Docusaurus), `--no-tests`, `--force`. Con `--check` no copia nada y sale con código 1 si alguna copia no coincide (útil en CI o en un hook de pre-commit).

## Lo que el anfitrión debe cumplir

1. **Servir el kit como archivos estáticos** en la misma carpeta que las piezas (en Docusaurus, `static/` se publica tal cual). Las piezas lo cargan con rutas relativas (`../../../_shared/dk-kit.js`), así que funcionan igual en el sitio, en un servidor local y abiertas como archivo.
2. **Registrar `InteractiveFrame`** (solo si se usa): en Docusaurus, como componente MDX global en `src/theme/MDXComponents.js`:
   ```js
   import MDXComponents from '@theme-original/MDXComponents';
   import InteractiveFrame from '@site/src/components/InteractiveFrame';
   export default { ...MDXComponents, InteractiveFrame };
   ```
   Sin Docusaurus (o sin React) basta un `<iframe>` normal; se pierde el botón "Pantalla completa". Su protocolo es sencillo si quieres replicarlo: un iframe con `data-dk-fixed="true"` dentro de un diálogo; el kit detecta ese atributo y adopta la disposición `html.dk-fs`.
3. **El tema.** Las piezas siguen el tema del sitio con `dk-theme.js`, en este orden: `?theme=light|dark` en la URL, el atributo `data-theme` de `<html>` de la página que contiene el iframe (misma origen) y `prefers-color-scheme`. Si tu sitio usa otro atributo, declara antes de cargar el script: `<script>window.DK_CONFIG = { themeAttr: 'data-mode' };</script>` (el valor debe ser `light` o `dark`).
4. **La marca.** Los colores son tokens CSS (`--dk-ctl`, `--dk-ack`, `--dk-data`, `--dk-err`, `--dk-p1`..`--dk-p5`, `--dk-card`...) definidos en `dk-base.css` con variante oscura. Para otra paleta **no edites `dk-base.css`**: agrega después de él un archivo propio que redefina los tokens en `:root` y en `:root[data-dkt='dark']`, y cárgalo desde las piezas (o inclúyelo en la plantilla de tu proyecto).
5. **La prueba de humo** busca las piezas en `<static>/interactive/**/index.html` (relativa a donde corres el comando; otra carpeta con `DK_STATIC_DIR=public npm run test:pieces`). Usa Chrome, Edge o el Chromium de Playwright, sin descargar navegadores si ya tienes uno. Prueba varias piezas a la vez (`--jobs N`, por defecto la mitad de los núcleos hasta 6): 74 piezas tardan ~6 min en serie y ~1,5 min con 6 a la vez. Con `--jobs 1` corre una por una.

## Crear una pieza

```bash
node <skill>/host/new-piece.mjs piece static/interactive/mi-curso/semana-1/mi-pieza
# plantillas: piece | piece-canvas | piece-phone
```

Copia la plantilla y reemplaza la ruta al kit por la real, sin importar la profundidad. Luego se cambian **solo los datos** (actores, fases, pasos, textos). Para saber qué motor usar, mira la tabla de `SKILL.md` y `patterns.md`.

## Mantener el kit (si tu proyecto lo amplía)

- La copia maestra es `<skill>/kit/`. Si la skill vive en un repositorio compartido y varios proyectos la usan, mejora el kit **allí** y vuelve a correr `install.mjs` en cada proyecto.
- Si un proyecto necesita un cambio propio que no sirve para los demás, no edites la copia instalada (se perdería en el próximo `kit:sync`): agrégalo como un módulo `dk-<nombre>.js` aparte en el proyecto, con la misma forma que `dk-sequence.js`.
- `kit:check` (o `install.mjs --check`) en CI o en el hook de pre-commit evita que la copia instalada se desvíe de la skill.

## Lo que no viaja

- Las piezas de ejemplo que se citan en `patterns.md` y `kit-api.md` pertenecen a DocuKelo: en otro proyecto no existen. Parte de las plantillas.
- El flujo con el visor, los briefs y las decisiones del profesor son de DocuKelo (`docukelo-project.md`).
- Los textos de las piezas y de la skill están en español.
