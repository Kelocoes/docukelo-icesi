// Configuracion de Tailwind 3 + daisyUI 4 para <DaisyPreview>. Genera static/css/daisy-preview.css con SOLO las clases
// que usan los ejemplos de src/components/DaisyPreview/index.jsx (npm run build:daisy-preview), en lugar de cargar el CDN
// de Tailwind (que compila en el navegador) y el CSS completo de daisyUI en cada vista previa.
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['src/components/DaisyPreview/index.jsx'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                'icesi-blue': '#5454e9',
                'icesi-yellow': '#e4eb60',
                'icesi-green': '#4cb979',
                'icesi-purple': '#865cf0',
                'icesi-orange': '#e9683b',
                'icesi-gray-1': '#88898c',
                'icesi-gray-2': '#cecfd4',
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        logs: false,
        themes: [
            {
                icesi: {
                    primary: '#5454e9',
                    'primary-content': '#ffffff',
                    secondary: '#865cf0',
                    'secondary-content': '#ffffff',
                    accent: '#4cb979',
                    'accent-content': '#ffffff',
                    neutral: '#1e1e2f',
                    'neutral-content': '#ffffff',
                    'base-100': '#ffffff',
                    'base-200': '#f8f9fc',
                    'base-300': '#cecfd4',
                    'base-content': '#1a1a24',
                    info: '#5454e9',
                    'info-content': '#ffffff',
                    success: '#4cb979',
                    'success-content': '#ffffff',
                    warning: '#e4eb60',
                    'warning-content': '#1a1a24',
                    error: '#e9683b',
                    'error-content': '#ffffff',
                },
            },
        ],
    },
};
