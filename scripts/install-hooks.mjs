#!/usr/bin/env node
// Activa los hooks de git del repo (.githooks/) apuntando core.hooksPath. Se ejecuta solo con
// `npm install` (script "prepare"). No hace nada, y nunca falla, si no hay un repositorio git
// (por ejemplo dentro del build de Docker).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (fs.existsSync(path.join(root, '.git')) && fs.existsSync(path.join(root, '.githooks'))) {
    try {
        execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: root, stdio: 'ignore' });
    } catch {
        // sin git instalado: se omite
    }
}
