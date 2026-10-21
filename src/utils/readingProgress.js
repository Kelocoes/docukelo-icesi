// Progreso de lectura: el sidebar guarda en localStorage una clave por pagina marcada como
// completada (docukelo-page-completed-<href>). Estas utilidades las leen para mostrar el avance
// en las tarjetas de curso y en las categorias del menu.

export const STORAGE_PREFIX = 'docukelo-page-completed-';
export const PROGRESS_EVENT = 'docukelo-progress';

export function isCompleted(href) {
    try {
        return window.localStorage.getItem(STORAGE_PREFIX + href) === 'true';
    } catch {
        return false;
    }
}

// Cuantas paginas con ese prefijo de ruta estan marcadas como completadas
export function countCompletedByPrefix(prefix) {
    let count = 0;
    try {
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX + prefix) && window.localStorage.getItem(key) === 'true') {
                count += 1;
            }
        }
    } catch {
        // localStorage no disponible (modo privado): sin progreso
    }
    return count;
}

export function clearAllProgress() {
    try {
        const keys = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
        }
        keys.forEach((key) => window.localStorage.removeItem(key));
    } catch {
        // nada que borrar
    }
    notifyProgressChanged();
}

export function notifyProgressChanged() {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
}

// Enlaces (hrefs) de las paginas con casilla dentro de una lista de items del sidebar. Se omiten las
// paginas indice de las categorias (semanas y carpetas): no tienen casilla, asi que contarlas haria
// que "n/m" nunca pudiera llegar a completarse.
export function collectLinkHrefs(items, out = []) {
    for (const item of items ?? []) {
        if (item.type === 'link' && item.href) out.push(item.href);
        else if (item.type === 'category') collectLinkHrefs(item.items, out);
    }
    return out;
}
