export default function useDocusaurusContext() {
    return { siteConfig: {}, i18n: { currentLocale: globalThis.__locale || 'es' } };
}
