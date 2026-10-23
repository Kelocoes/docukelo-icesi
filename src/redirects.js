// Redirecciones de URLs que cambiaron cuando se normalizaron los nombres de archivo (NN-kebab-case en minusculas)
// o se movieron documentos entre carpetas. Formato: [ruta anterior, ruta actual], sin el baseUrl.
// Para agregar una: cuando renombres o muevas un documento publicado, anade aqui su ruta vieja.
export const OLD_URLS = [
    ['/docs/computacion-2/congratulations', '/docs/computacion-2/intro'],
    ['/docs/computacion-2/documentacion-guia-springboot/Guia_spring_boot', '/docs/computacion-2/documentacion-guia-springboot/guia-spring-boot'],
    ['/docs/computacion-2/semana-2/comandos-linux', '/docs/computacion-2/semana-1/comandos-linux'],
    ['/docs/computacion-2/semana-2/tomcat-commands', '/docs/computacion-2/semana-1/tomcat-commands'],
    ['/docs/computacion-2/semana-2/tomcat-config', '/docs/computacion-2/semana-1/tomcat-config'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/Demo_Landing_con_Astro', '/docs/computacion-3/exposiciones-de-cursos/2025-02/demo-landing-con-astro'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/FastAPI', '/docs/computacion-3/exposiciones-de-cursos/2025-02/fastapi'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/Guía_Completa_API_REST_con_Go_desde_Cero', '/docs/computacion-3/exposiciones-de-cursos/2025-02/guia-completa-api-rest-con-go-desde-cero'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/Project_Report_Expert_System_for_Sports_Betting_Advice', '/docs/computacion-3/exposiciones-de-cursos/2025-02/project-report-expert-system-for-sports-betting-advice'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/ToDoVueJS', '/docs/computacion-3/exposiciones-de-cursos/2025-02/todovuejs'],
    ['/docs/computacion-3/exposiciones-de-cursos/2025-02/react_native_camera_guide', '/docs/computacion-3/exposiciones-de-cursos/2025-02/react-native-camera-guide'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/Angular', '/docs/computacion-3/exposiciones-de-cursos/2026-02/angular'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/HTMX', '/docs/computacion-3/exposiciones-de-cursos/2026-02/htmx'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/Keycloak', '/docs/computacion-3/exposiciones-de-cursos/2026-02/keycloak'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/Offline_First', '/docs/computacion-3/exposiciones-de-cursos/2026-02/offline-first'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/gRPC', '/docs/computacion-3/exposiciones-de-cursos/2026-02/grpc'],
    ['/docs/computacion-3/exposiciones-de-cursos/2026-02/tRPC', '/docs/computacion-3/exposiciones-de-cursos/2026-02/trpc'],
    ['/docs/computacion-3/semana-2/nodejs_event_loop', '/docs/computacion-3/semana-2/nodejs-event-loop'],
    ['/docs/computacion-3/semana-4/deploy-express', '/docs/computacion-3/semana-3/deploy-express'],
    ['/docs/computacion-3/semana-4/intro-express-pt2', '/docs/computacion-3/semana-3/intro-express-pt2'],
    ['/docs/computacion-3/semana-4/intro-express-pt3', '/docs/computacion-3/semana-3/intro-express-pt3'],
    ['/docs/computacion-3/semana-4/jest-express-ts', '/docs/computacion-3/semana-3/jest-express-ts'],
    ['/docs/computacion-3/semana-5/deploy-express', '/docs/computacion-3/semana-3/deploy-express'],
    ['/docs/computacion-3/semana-5/jest-express-ts', '/docs/computacion-3/semana-3/jest-express-ts'],
    ['/docs/computacion-3/semana-7/Demo_Landing_con_Astro', '/docs/computacion-3/exposiciones-de-cursos/2025-02/demo-landing-con-astro'],
    ['/docs/computacion-3/semana-7/FastAPI', '/docs/computacion-3/exposiciones-de-cursos/2025-02/fastapi'],
    ['/docs/computacion-3/semana-7/Guía_Completa_API_REST_con_Go_desde_Cero', '/docs/computacion-3/exposiciones-de-cursos/2025-02/guia-completa-api-rest-con-go-desde-cero'],
    ['/docs/computacion-3/semana-7/Project_Report_Expert_System_for_Sports_Betting_Advice', '/docs/computacion-3/exposiciones-de-cursos/2025-02/project-report-expert-system-for-sports-betting-advice'],
    ['/docs/computacion-3/semana-7/ToDoVueJS', '/docs/computacion-3/exposiciones-de-cursos/2025-02/todovuejs'],
    ['/docs/computacion-3/semana-7/react_native_camera_guide', '/docs/computacion-3/exposiciones-de-cursos/2025-02/react-native-camera-guide'],
    ['/docs/desarrollo-entornos-digitales-web/semana-11/ejercicios-componentes-reutilizables-daisyui', '/docs/desarrollo-entornos-digitales-web/semana-12/actividad-componentes-daisyui'],
    ['/docs/desarrollo-entornos-digitales-web/semana-12/tailwind', '/docs/desarrollo-entornos-digitales-web/semana-12/tailwind-css'],
    ['/docs/disenando-con-algoritmos/semana-10/react-router-changes copy', '/docs/disenando-con-algoritmos/semana-10/react-router-changes'],
    ['/docs/disenando-con-algoritmos/semana-4/jest', '/docs/disenando-con-algoritmos/semana-5/jest'],
    ['/docs/disenando-con-algoritmos/semana-7/intro', '/docs/disenando-con-algoritmos/semana-7/react-slides'],
];

// El plugin falla si la redireccion cae sobre un archivo que ya existe. En Windows y macOS (sistemas de archivos
// que no distinguen mayusculas) '/FastAPI' y '/fastapi' son el mismo archivo, asi que las redirecciones que solo
// cambian en mayusculas se activan solo en Linux (Render, Docker y GitHub Actions); en local se omiten.
const CASE_SENSITIVE_FS = process.platform === 'linux';

export const redirects = OLD_URLS
    .filter(([from, to]) => CASE_SENSITIVE_FS || from.toLowerCase() !== to.toLowerCase())
    .map(([from, to]) => ({ from, to }));
