// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes, themes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkStaticBaseUrl from './src/plugins/remark-static-base-url.js';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Despliegue oficial: GitHub Pages (ver .github/workflows/deploy.yml y Dockerfile).
// El sitio vive en https://kelocoes.github.io/docukelo-icesi/, asi que el build de produccion usa
// ese baseUrl. En desarrollo (`npm start`) se sirve en la raiz. Ambos se pueden forzar con las
// variables SITE_URL y BASE_URL (por ejemplo BASE_URL=/ para probar la imagen Docker en local).
const siteUrl = process.env.SITE_URL || 'https://kelocoes.github.io';
const baseUrl =
    process.env.BASE_URL ||
    (process.env.NODE_ENV === 'production' ? '/docukelo-icesi/' : '/');

// Autor que Docusaurus muestra en "Ultima actualizacion". Por defecto es Kevin Rodriguez, salvo
// las rutas listadas aqui. Un `last_update.author` explicito en el frontmatter siempre gana.
const DEFAULT_LAST_UPDATE_AUTHOR = 'Kevin Rodriguez';
const LAST_UPDATE_AUTHOR_BY_PATH = [
    { pathIncludes: '/computacion-2/documentacion-guia-springboot/', author: 'Carol Mosquera' },
];

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Documentación',
    tagline: 'Espacio para la documentación de proyectos y temas de interés desarrollados en la Universidad Icesi',
    favicon: 'img/logo.svg',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    url: siteUrl,
    baseUrl,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Kelocoes', // Usually your GitHub org/user name.
    projectName: 'docukelo-icesi', // Usually your repo name.

    onBrokenLinks: 'throw',
    headTags: [
        {
            tagName: 'script',
            attributes: {
                type: 'text/javascript',
            },
            innerHTML: `(function(){try{if(localStorage.getItem('docukelo_focus_mode')==='true'&&window.innerWidth>996){document.documentElement.setAttribute('data-focus-mode','true');document.documentElement.classList.add('focus-mode');}}catch(e){}})();`,
        },
    ],
    markdown: {
        // Asigna el autor de "Ultima actualizacion" sin tocar el frontmatter de cada documento.
        parseFrontMatter: async (params) => {
            const result = await params.defaultParseFrontMatter(params);
            const filePath = params.filePath.replace(/\\/g, '/');
            const override = LAST_UPDATE_AUTHOR_BY_PATH.find(({ pathIncludes }) =>
                filePath.includes(pathIncludes),
            );
            result.frontMatter.last_update = {
                author: override ? override.author : DEFAULT_LAST_UPDATE_AUTHOR,
                ...result.frontMatter.last_update,
            };
            return result;
        },
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
        mermaid: true,
        mdx1Compat: {
            headingIds: true,
        },
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
    },

    stylesheets: [
        {
            href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap',
            type: 'text/css',
        },
        {
            // Debe coincidir con la version de katex instalada (la que usa rehype-katex).
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/katex.min.css',
            type: 'text/css',
            integrity:
                'sha384-nH0MfJ44wi1dd7w6jinlyBgljjS8EJAh2JBoRad8a3VDw2K69vfaaqm4WnR+gXtA',
            crossorigin: 'anonymous',
        },
    ],

    themes: ['@docusaurus/theme-mermaid'],
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                    // Cursos en desarrollo/internos ocultos durante el despliegue de producción
                    exclude:
                        process.env.NODE_ENV === 'production' &&
                        process.env.SHOW_INTERNAL_COURSES !== 'true'
                            ? ['diseno-de-software-1/**', '**/_*.{js,jsx,ts,tsx,md,mdx}']
                            : ['**/_*.{js,jsx,ts,tsx,md,mdx}'],
                    // Docusaurus agrega la ruta del archivo relativa a la raiz del repo
                    // (docs/<curso>/...), asi que este valor base es el correcto.
                    editUrl:
                        'https://github.com/Kelocoes/docukelo-icesi/tree/main/',
                    // En /en/ el enlace "Editar" lleva a la traduccion (i18n/en/...) y no al original.
                    editLocalizedFiles: true,
                    showLastUpdateTime: true,
                    showLastUpdateAuthor: true,
                    remarkPlugins: [remarkMath, [remarkStaticBaseUrl, { baseUrl }]],
                    rehypePlugins: [rehypeKatex],
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/Kelocoes/docukelo-icesi/tree/main/',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docukelo-social-card.png',
            navbar: {
                title: 'Documentación - Kelo',
                logo: {
                    alt: 'Universidad Icesi',
                    src: '/img/logo.svg',
                    srcDark: '/img/logo-dark.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        type: 'custom-focus-mode',
                        position: 'right',
                    },
                    {
                        type: 'localeDropdown',
                        position: 'right',
                    },
                    {
                        href: 'https://github.com/Kelocoes/docukelo-icesi.git',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            prism: {
                theme: prismThemes.vsDark,
                darkTheme: prismThemes.vsDark,
                additionalLanguages: ['java', 'javascript', 'python', 'bash', 'json', 'dart', 'properties', 'ini', 'groovy', 'docker', 'yaml'],
            },
            algolia: {
                // The application ID provided by Algolia
                appId: 'XMIZTZ9SYC',

                // Public API key: it is safe to commit it
                apiKey: '3396694ad776af300d9d679757047e3f',

                indexName: 'Documentation Website',

                // Optional: see doc section below
                contextualSearch: true,

                // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
                externalUrlRegex: 'external\\.com|domain\\.com',

                // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
                replaceSearchResultPathname: {
                    from: '/docs/', // or as RegExp: /\/docs\//
                    to: '/docs/',
                },

                // Optional: Algolia search parameters
                searchParameters: {},

                // Optional: path for search page that enabled by default (`false` to disable it)
                searchPagePath: 'search',

                // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
                insights: false,

                // Optional: whether you want to use the new Ask AI feature (undefined by default)
                askAi: 'YOUR_ALGOLIA_ASK_AI_ASSISTANT_ID',

                //... other Algolia params
            },
            mermaid: {
                theme: { light: 'neutral', dark: 'dark' },
            },
        }),
};

// Docusaurus configuration reloaded with Icesi 2026 brand identity
export default config;
