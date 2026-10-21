// Docusaurus antepone el baseUrl a los enlaces y a las imagenes de Markdown, pero no a los
// atributos de elementos JSX escritos a mano en MDX (<iframe src="/interactive/...">,
// <PdfViewer src="/files/...">). Con el sitio publicado en /docukelo-icesi/ esas rutas
// absolutas apuntarian a la raiz del dominio y darian 404.
//
// Este plugin antepone el baseUrl a esos atributos para que los .md sigan escribiendose
// con rutas simples (/interactive/..., /files/..., /img/...). Con baseUrl '/' no hace nada.
// Las etiquetas <img> se omiten porque Docusaurus ya las resuelve por su cuenta.

const STATIC_PATH = /^\/(img|files|interactive)\//;
const URL_ATTRIBUTES = new Set(['src', 'href', 'url']);
const SKIPPED_ELEMENTS = new Set(['img']);

export default function remarkStaticBaseUrl({ baseUrl = '/' } = {}) {
    const prefix = baseUrl.replace(/\/+$/, '');
    if (!prefix) {
        return () => {};
    }

    function visit(node) {
        const isJsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
        if (isJsx && !SKIPPED_ELEMENTS.has(node.name)) {
            for (const attribute of node.attributes ?? []) {
                if (
                    attribute.type === 'mdxJsxAttribute' &&
                    URL_ATTRIBUTES.has(attribute.name) &&
                    typeof attribute.value === 'string' &&
                    STATIC_PATH.test(attribute.value)
                ) {
                    attribute.value = prefix + attribute.value;
                }
            }
        }
        node.children?.forEach(visit);
    }

    return (tree) => visit(tree);
}
