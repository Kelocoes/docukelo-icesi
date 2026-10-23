import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = (p) => fileURLToPath(new URL(p, import.meta.url));

// Pruebas de los componentes React de src/components (npm test). Los modulos propios de Docusaurus (@docusaurus/*) se
// sustituyen por mocks sencillos en tests/mocks; los CSS Modules conservan el nombre de la clase.
export default defineConfig({
    esbuild: { jsx: 'automatic' },
    resolve: {
        alias: {
            '@site': root('.'),
            '@docusaurus/router': root('tests/mocks/docusaurus-router.js'),
            '@docusaurus/useDocusaurusContext': root('tests/mocks/docusaurus-context.js'),
        },
    },
    css: { modules: { classNameStrategy: 'non-scoped' } },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['tests/setup.js'],
        include: ['tests/components/**/*.test.{js,jsx}'],
    },
});
