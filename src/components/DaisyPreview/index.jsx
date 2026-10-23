import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// El CSS (Tailwind 3 + daisyUI 4 con el tema "icesi", solo las clases que usan los ejemplos) se genera con
// `npm run build:daisy-preview` (scripts/daisy-preview/) y vive en static/css/daisy-preview.css. Si agregas o cambias
// clases en COMPONENTS_HTML, vuelve a generarlo y sube el CSS. Ya no se carga el CDN de Tailwind ni el CSS completo de daisyUI.
const buildHead = (cssUrl) => `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <link href="${cssUrl}" rel="stylesheet" type="text/css" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 1.25rem;
      background: #f8f9fc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
  </style>
`;

const COMPONENTS_HTML = {
  1: `<div class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#cecfd4] shadow-sm max-w-lg w-full justify-start pr-6">
  <button class="btn btn-primary gap-2 rounded-xl shadow-sm hover:shadow-md transition-all text-xs font-semibold px-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Descargar Guía Lab
    <span class="badge badge-secondary badge-sm text-[10px] font-bold">PDF</span>
  </button>
  <button class="btn btn-outline btn-primary rounded-xl text-xs font-semibold px-4">
    <span class="loading loading-spinner loading-xs text-[#5454e9]"></span>
    Procesando
  </button>
</div>`,

  2: `<div class="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-[#cecfd4] shadow-sm max-w-md w-full justify-center">
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#edf8f2] text-[#2e7d50] border border-[#b7e3ca]">
    <span class="w-2 h-2 rounded-full bg-[#4cb979] animate-pulse"></span>
    Matriculado Activo
  </div>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4f0fd] text-[#5527be] border border-[#d5c3fa]">
    <span class="w-2 h-2 rounded-full bg-[#865cf0]"></span>
    En Revisión Previa
  </div>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#fdf0eb] text-[#b33a15] border border-[#f5c2b0]">
    <span class="w-2 h-2 rounded-full bg-[#e9683b]"></span>
    Requisito Pendiente
  </div>
</div>`,

  3: `<div class="alert alert-info bg-[#f0f0fd] text-[#1c1c7a] border border-[#cecfd4] rounded-2xl shadow-sm p-4 max-w-lg w-full">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-[#5454e9] shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <div class="flex-1">
    <h3 class="font-bold text-sm text-[#1c1c7a]">Período de Adición y Cancelación</h3>
    <div class="text-xs text-[#5454e9]/90">Recuerda que el sistema Banner cerrará inscripciones el viernes a las 18:00 hrs.</div>
  </div>
  <button class="btn btn-xs btn-outline border-[#5454e9] text-[#5454e9] hover:bg-[#5454e9] hover:text-white rounded-lg">Ver Calendario</button>
</div>`,

  4: `<div class="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#cecfd4] shadow-sm max-w-md w-full">
  <div class="avatar online">
    <div class="w-14 rounded-full ring-2 ring-[#5454e9] ring-offset-2 ring-offset-base-100">
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Avatar Usuario" />
    </div>
  </div>
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2">
      <span class="font-bold text-sm text-slate-900 truncate">Valeria Cifuentes</span>
      <span class="badge badge-primary badge-xs text-[10px] font-bold px-1.5 py-0.5">MONITORA</span>
    </div>
    <p class="text-xs text-slate-500 truncate">Ingeniería Telemática • 7mo Semestre</p>
    <span class="text-[11px] text-[#4cb979] font-medium">● Disponible en Sala C-201</span>
  </div>
</div>`,

  5: `<div class="flex items-center justify-between p-3.5 bg-white border border-[#cecfd4] rounded-xl shadow-sm max-w-md w-full">
  <span class="text-xs font-medium text-slate-600">Abrir Paleta de Comandos Next.js</span>
  <div class="flex items-center gap-1">
    <kbd class="kbd kbd-sm bg-[#f8f9fc] border-[#cecfd4] text-slate-700 shadow-sm font-semibold">⌘ Cmd</kbd>
    <span class="text-slate-400 text-xs">+</span>
    <kbd class="kbd kbd-sm bg-[#f8f9fc] border-[#cecfd4] text-slate-700 shadow-sm font-semibold">K</kbd>
  </div>
</div>`,

  6: `<div class="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#cecfd4] shadow-sm max-w-md w-full justify-center">
  <div class="rating rating-sm rating-half">
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-1" checked disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-2" disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-1" checked disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-2" disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-1" checked disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-2" disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-1" checked disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-2" disabled />
    <input type="radio" name="rating-1" class="bg-[#e9683b] mask mask-star-2 mask-half-1" checked disabled />
    <input type="radio" name="rating-1" class="bg-[#cecfd4] mask mask-star-2 mask-half-2" disabled />
  </div>
  <span class="text-sm font-bold text-slate-800">4.8</span>
  <span class="text-xs text-slate-500 font-medium">(142 evaluaciones docentes)</span>
</div>`,

  7: `<div class="stat bg-white rounded-2xl border border-[#cecfd4] p-5 shadow-sm max-w-md w-full">
  <div class="stat-figure text-[#5454e9]">
    <div class="w-10 h-10 rounded-xl bg-[#5454e9]/10 flex items-center justify-center text-[#5454e9]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    </div>
  </div>
  <div class="stat-title text-xs font-semibold text-slate-500 uppercase tracking-wide">Promedio Ponderado Acumulado</div>
  <div class="stat-value text-[#5454e9] font-bold text-3xl my-1">4.62 <span class="text-sm font-normal text-slate-400">/ 5.0</span></div>
  <div class="stat-desc flex items-center gap-1 text-[#4cb979] font-semibold text-xs">
    <span>↗ +0.18</span>
    <span class="text-slate-400 font-normal">respecto al semestre anterior</span>
  </div>
</div>`,

  8: `<div class="card bg-white border border-[#cecfd4] shadow-sm rounded-2xl overflow-hidden hover:border-[#5454e9] transition-all max-w-lg w-full">
  <div class="h-2 bg-gradient-to-r from-[#5454e9] to-[#865cf0]"></div>
  <div class="card-body p-5">
    <div class="flex justify-between items-start">
      <span class="badge badge-outline border-[#cecfd4] text-xs font-mono font-bold text-slate-600">DEDW-301</span>
      <span class="badge badge-secondary badge-sm text-[11px] font-bold">3 Créditos</span>
    </div>
    <h2 class="card-title text-base font-bold text-slate-900 mt-1">Desarrollo de Entornos Digitales Web</h2>
    <p class="text-xs text-slate-500">Prof. Santiago Restrepo • Grupo 01 • Salón 304B</p>
    
    <div class="mt-4">
      <div class="flex justify-between text-xs font-semibold mb-1">
        <span class="text-slate-600">Avance de Semestre</span>
        <span class="text-[#5454e9] font-bold">68%</span>
      </div>
      <progress class="progress progress-primary w-full h-2 bg-slate-100" value="68" max="100"></progress>
    </div>
    
    <div class="card-actions justify-end mt-4 pt-3 border-t border-slate-100">
      <button class="btn btn-sm btn-ghost text-slate-600 hover:text-[#5454e9]">Silabo</button>
      <button class="btn btn-sm btn-primary rounded-xl">Entrar al Aula</button>
    </div>
  </div>
</div>`,

  9: `<div class="stats stats-horizontal shadow-sm border border-[#cecfd4] bg-white rounded-2xl w-full max-w-lg">
  <div class="stat p-4">
    <div class="stat-figure text-[#5454e9]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <div class="stat-title text-[11px] text-slate-500 font-semibold uppercase">Créditos Aprobados</div>
    <div class="stat-value text-2xl font-bold text-slate-900">118 <span class="text-xs text-slate-400 font-normal">/ 160</span></div>
    <div class="stat-desc text-[11px] text-[#4cb979] font-semibold">74% de carrera</div>
  </div>
  
  <div class="stat p-4 border-l border-slate-100">
    <div class="stat-figure text-[#865cf0]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div class="stat-title text-[11px] text-slate-500 font-semibold uppercase">Sprints Completados</div>
    <div class="stat-value text-2xl font-bold text-[#865cf0]">11 <span class="text-xs text-slate-400 font-normal">/ 14</span></div>
    <div class="stat-desc text-[11px] text-slate-500">Semana 11 en curso</div>
  </div>
</div>`,

  10: `<div class="alert alert-success bg-white border border-[#4cb979]/40 text-slate-800 shadow-md rounded-2xl p-4 flex items-center justify-between max-w-md w-full">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full bg-[#4cb979]/15 flex items-center justify-center text-[#4cb979] shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>
    <div>
      <div class="text-xs font-bold text-slate-900">Entrega de Taller Confirmada</div>
      <div class="text-[11px] text-slate-500">Commit #7fa12 registrado en repositorio GitHub.</div>
    </div>
  </div>
  <button class="btn btn-xs btn-ghost text-slate-400 hover:text-slate-600">✕</button>
</div>`,

  11: `<div class="space-y-3 bg-white p-4 rounded-2xl border border-[#cecfd4] max-w-lg w-full shadow-sm">
  <div class="chat chat-start">
    <div class="chat-image avatar">
      <div class="w-8 rounded-full ring-1 ring-slate-300">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Avatar Estudiante" />
      </div>
    </div>
    <div class="chat-header text-[11px] text-slate-500 font-semibold mb-0.5">
      Sara Lozano <time class="text-[10px] text-slate-400 font-normal">10:42 AM</time>
    </div>
    <div class="chat-bubble bg-[#f8f9fc] text-slate-800 text-xs shadow-sm border border-[#cecfd4]">
      Profesor, ¿la directiva 'use client' es necesaria si solo uso Tailwind y no tengo hooks?
    </div>
  </div>
  
  <div class="chat chat-end">
    <div class="chat-image avatar">
      <div class="w-8 rounded-full ring-1 ring-[#5454e9]">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Avatar Docente" />
      </div>
    </div>
    <div class="chat-header text-[11px] text-slate-500 font-semibold mb-0.5">
      Prof. Santiago Restrepo (Docente) <time class="text-[10px] text-slate-400 font-normal">10:45 AM</time>
    </div>
    <div class="chat-bubble chat-bubble-primary text-xs text-white shadow-sm">
      ¡No! Tailwind se procesa en tiempo de compilación. Mantén el componente en el servidor (RSC) para evitar JavaScript extra en el cliente.
    </div>
    <div class="chat-footer text-[10px] text-slate-400 mt-0.5">Entregado ✓✓</div>
  </div>
</div>`,

  12: `<div class="overflow-x-auto bg-white border border-[#cecfd4] rounded-xl shadow-sm max-w-lg w-full">
  <table class="table table-sm">
    <tbody>
      <tr class="hover:bg-slate-50 transition-colors">
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-squircle w-9 h-9">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" alt="Estudiante" />
              </div>
            </div>
            <div>
              <div class="font-bold text-xs text-slate-900">Mateo Barona Gómez</div>
              <div class="text-[10px] text-slate-400">Código: A00389120</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge badge-ghost text-xs text-slate-600 font-medium">Ing. de Sistemas</span>
        </td>
        <td>
          <span class="badge badge-sm bg-[#edf8f2] text-[#2e7d50] border-[#b7e3ca] font-bold text-[10px]">Activo</span>
        </td>
        <td class="text-right">
          <button class="btn btn-ghost btn-xs text-[#5454e9] font-bold">Ver Notas</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,

  13: `<div class="p-4 bg-white border border-[#cecfd4] rounded-2xl shadow-sm max-w-lg w-full">
  <ul class="steps steps-horizontal w-full text-xs">
    <li class="step step-primary font-semibold text-[11px]" data-content="✓">Propuesta</li>
    <li class="step step-primary font-semibold text-[11px]" data-content="✓">Sprint 1</li>
    <li class="step step-primary font-semibold text-[11px]" data-content="3">Sprint 2 (Hoy)</li>
    <li class="step font-semibold text-slate-400 text-[11px]" data-content="4">Demo Final</li>
  </ul>
</div>`,

  14: `<div class="p-4 bg-white border border-[#cecfd4] rounded-2xl shadow-sm max-w-lg w-full">
  <span class="text-xs font-bold text-slate-700 block mb-2">Filtros de Asignatura:</span>
  <div class="flex flex-wrap gap-2">
    <label class="cursor-pointer">
      <input type="checkbox" class="hidden peer" checked />
      <span class="badge badge-lg py-3 px-3 text-xs font-semibold border border-[#5454e9] bg-[#5454e9] text-white peer-checked:bg-[#5454e9] peer-checked:text-white transition-all">
        ✓ Server Components
      </span>
    </label>
    <label class="cursor-pointer">
      <input type="checkbox" class="hidden peer" checked />
      <span class="badge badge-lg py-3 px-3 text-xs font-semibold border border-[#5454e9] bg-[#5454e9] text-white peer-checked:bg-[#5454e9] peer-checked:text-white transition-all">
        ✓ Tailwind CSS
      </span>
    </label>
    <label class="cursor-pointer">
      <input type="checkbox" class="hidden peer" />
      <span class="badge badge-lg py-3 px-3 text-xs font-semibold border border-[#cecfd4] bg-white text-slate-600 hover:border-slate-300 transition-all">
        + DaisyUI Themes
      </span>
    </label>
    <label class="cursor-pointer">
      <input type="checkbox" class="hidden peer" />
      <span class="badge badge-lg py-3 px-3 text-xs font-semibold border border-[#cecfd4] bg-white text-slate-600 hover:border-slate-300 transition-all">
        + Server Actions
      </span>
    </label>
  </div>
</div>`,

  15: `<div class="card bg-white border border-[#cecfd4] shadow-sm rounded-2xl p-5 max-w-lg w-full">
  <div class="flex justify-between items-center mb-3">
    <span class="badge badge-primary font-bold text-xs">HACKATHON ICESI 2026</span>
    <span class="text-xs text-[#e9683b] font-semibold">● 14 cupos restantes</span>
  </div>
  <h3 class="font-bold text-base text-slate-900">Next.js & DaisyUI Dev Challenge</h3>
  <p class="text-xs text-slate-500 mb-4">Auditorio Varela • Viernes 24 de Octubre • 14:00 - 18:00 hrs</p>
  
  <div class="bg-[#f8f9fc] border border-[#cecfd4] rounded-xl p-3 flex justify-around items-center text-center mb-4">
    <div>
      <span class="countdown font-mono text-2xl font-bold text-[#5454e9]">04</span>
      <span class="block text-[10px] text-slate-400 uppercase font-semibold">Días</span>
    </div>
    <span class="text-slate-300 font-mono text-xl">:</span>
    <div>
      <span class="countdown font-mono text-2xl font-bold text-[#5454e9]">12</span>
      <span class="block text-[10px] text-slate-400 uppercase font-semibold">Horas</span>
    </div>
    <span class="text-slate-300 font-mono text-xl">:</span>
    <div>
      <span class="countdown font-mono text-2xl font-bold text-[#5454e9]">45</span>
      <span class="block text-[10px] text-slate-400 uppercase font-semibold">Min</span>
    </div>
  </div>
  
  <button class="btn btn-primary w-full rounded-xl shadow-sm">Inscribir mi Equipo</button>
</div>`,

  16: `<div class="navbar bg-white border border-[#cecfd4] rounded-2xl shadow-sm px-4 max-w-xl w-full">
  <div class="flex-1 items-center gap-2">
    <div class="w-7 h-7 rounded-lg bg-[#5454e9] flex items-center justify-center text-white font-bold text-xs">U</div>
    <span class="font-bold text-sm text-slate-900">Portal DEDW</span>
    <span class="badge badge-sm badge-outline text-[10px] border-[#cecfd4] text-slate-500">2026-2</span>
  </div>
  <div class="flex-none gap-2">
    <button class="btn btn-ghost btn-circle btn-sm text-slate-500">
      <div class="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="badge badge-xs badge-secondary indicator-item">3</span>
      </div>
    </button>
    <div class="avatar online">
      <div class="w-8 rounded-full ring-1 ring-[#5454e9]">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Avatar" />
      </div>
    </div>
  </div>
</div>`,

  17: `<div class="card bg-white border border-[#cecfd4] rounded-2xl p-5 shadow-sm max-w-md w-full">
  <h3 class="font-bold text-sm text-slate-900 mb-1">Agendar Asesoría Técnica</h3>
  <p class="text-xs text-slate-500 mb-4">Selecciona el módulo y describe brevemente el bloqueo.</p>
  
  <div class="space-y-3">
    <div>
      <label class="label p-0 mb-1"><span class="label-text text-xs font-bold text-slate-700">Tema del Bloqueo</span></label>
      <select class="select select-bordered select-sm w-full rounded-xl text-xs bg-[#f8f9fc] focus:bg-white focus:border-[#5454e9]">
        <option>Next.js 15: Server vs Client Boundaries</option>
        <option>Tailwind & DaisyUI Theme Configuration</option>
        <option>Estructura de Componentes Reutilizables</option>
      </select>
    </div>
    <div>
      <label class="label p-0 mb-1"><span class="label-text text-xs font-bold text-slate-700">Descripción breve</span></label>
      <textarea class="textarea textarea-bordered textarea-sm w-full rounded-xl text-xs bg-[#f8f9fc] focus:bg-white focus:border-[#5454e9] h-16" placeholder="Ej: No me carga el estado en el componente hijo..."></textarea>
    </div>
    <button class="btn btn-primary btn-sm w-full rounded-xl font-bold mt-2">Enviar Solicitud</button>
  </div>
</div>`,

  18: `<div class="modal-box bg-white border border-[#cecfd4] shadow-xl rounded-2xl p-5 max-w-md w-full">
  <div class="flex items-center gap-3 mb-2">
    <div class="w-9 h-9 rounded-full bg-[#fdf0eb] flex items-center justify-center text-[#e9683b]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <h3 class="font-bold text-sm text-slate-900">¿Confirmar entrega definitiva?</h3>
  </div>
  <p class="text-xs text-slate-600 my-2">
    Estás a punto de enviar el entregable <strong class="text-slate-900">Taller 02: Componentes RSC</strong>. Una vez confirmado no podrás modificar los archivos.
  </p>
  <div class="modal-action mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
    <button class="btn btn-sm btn-ghost rounded-xl text-slate-500">Cancelar</button>
    <button class="btn btn-sm btn-primary rounded-xl font-bold">Sí, Enviar Entrega</button>
  </div>
</div>`,

  19: `<div class="card bg-white border border-[#cecfd4] rounded-2xl shadow-sm overflow-hidden max-w-md w-full">
  <div class="p-5 flex items-center gap-4">
    <div class="avatar">
      <div class="w-16 h-16 rounded-2xl ring-2 ring-[#5454e9] ring-offset-2">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Profesor" />
      </div>
    </div>
    <div>
      <h3 class="font-bold text-base text-slate-900">Dr. Carlos Alberto Domínguez</h3>
      <p class="text-xs text-[#5454e9] font-semibold">Profesor Titular • DEDW</p>
      <p class="text-xs text-slate-400">Dpto. de Tecnologías de Información</p>
    </div>
  </div>
  
  <div class="px-5">
    <div class="tabs tabs-boxed bg-slate-100 p-1 rounded-xl text-xs">
      <a class="tab tab-active bg-white text-[#5454e9] font-bold shadow-sm rounded-lg">Asignaturas</a>
      <a class="tab text-slate-500">Horario Asesoría</a>
      <a class="tab text-slate-500">Publicaciones</a>
    </div>
    <div class="p-3 my-2 bg-[#f8f9fc] rounded-xl border border-slate-100 text-xs text-slate-600">
      Martes y Jueves de 15:00 a 17:00 hrs en Laboratorio IasLab (Edificio L).
    </div>
  </div>
  
  <div class="p-4 bg-[#f8f9fc] border-t border-slate-100 flex justify-end">
    <button class="btn btn-xs btn-outline btn-primary rounded-lg">Contactar Docente</button>
  </div>
</div>`,

  20: `<div class="join join-vertical w-full border border-[#cecfd4] rounded-2xl bg-white shadow-sm overflow-hidden max-w-lg">
  <div class="collapse collapse-arrow join-item border-b border-[#cecfd4]">
    <input type="radio" name="sprint-accordion" checked /> 
    <div class="collapse-title text-xs font-bold text-slate-800 flex items-center justify-between pr-8">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary badge-sm font-bold">Sprint 1</span>
        <span>Arquitectura Base y Componentes Atómicos</span>
      </div>
      <span class="badge badge-success badge-xs text-[10px] font-bold text-white">Completado</span>
    </div>
    <div class="collapse-content text-xs text-slate-600 space-y-1 pt-1 bg-[#f8f9fc]">
      <p>✓ Configuración de Next.js 15 y App Router.</p>
      <p>✓ Integración de Tailwind CSS y temas de DaisyUI.</p>
      <p>✓ Creación de átomos reutilizables (Botones, Badges, Kbd).</p>
    </div>
  </div>
  <div class="collapse collapse-arrow join-item">
    <input type="radio" name="sprint-accordion" /> 
    <div class="collapse-title text-xs font-bold text-slate-800 flex items-center justify-between pr-8">
      <div class="flex items-center gap-2">
        <span class="badge badge-outline border-[#cecfd4] badge-sm font-bold text-slate-600">Sprint 2</span>
        <span>Integración de Server Actions y Formularios</span>
      </div>
      <span class="badge badge-warning badge-xs text-[10px] font-bold text-[#1a1a24]">En Progreso</span>
    </div>
    <div class="collapse-content text-xs text-slate-600 space-y-1 pt-1 bg-[#f8f9fc]">
      <p>⏳ Implementación de validación con Zod en RSC.</p>
      <p>⏳ Manejo de pending state con useActionState.</p>
    </div>
  </div>
</div>`
};

const DEFAULT_HEIGHTS = {
  1: '140px',
  2: '130px',
  3: '140px',
  4: '140px',
  5: '120px',
  6: '120px',
  7: '190px',
  8: '270px',
  9: '180px',
  10: '130px',
  11: '250px',
  12: '130px',
  13: '130px',
  14: '150px',
  15: '290px',
  16: '130px',
  17: '310px',
  18: '230px',
  19: '290px',
  20: '240px'
};

export default function DaisyPreview({ id, height }) {
  // Ruta con baseUrl (no absoluta: site.url apunta a GitHub Pages y no al origen real). Un srcDoc resuelve las rutas
  // que empiezan con / contra la pagina que lo contiene, asi que funciona en local, en Render y en GitHub Pages.
  const cssUrl = useBaseUrl('/css/daisy-preview.css');
  const compId = Number(id);
  const rawHtml = COMPONENTS_HTML[compId] || '<p>Componente no encontrado</p>';
  const finalHeight = height || DEFAULT_HEIGHTS[compId] || '200px';

  const fullDoc = `<!DOCTYPE html>
<html lang="es" data-theme="icesi">
<head>
  <meta charset="UTF-8">
  ${buildHead(cssUrl)}
</head>
<body>
  ${rawHtml}
</body>
</html>`;

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #cecfd4',
      background: '#ffffff',
      boxShadow: '0 4px 20px -2px rgba(84, 84, 233, 0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#f8f9fc',
        borderBottom: '1px solid #cecfd4',
        fontSize: '11px',
        fontWeight: '600',
        color: '#88898c'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e9683b' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e4eb60' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4cb979' }}></span>
          <span style={{ marginLeft: '6px', color: '#1a1a24' }}>Componente Interactivo #{compId < 10 ? '0' + compId : compId}</span>
        </div>
        <span style={{
          background: 'rgba(84, 84, 233, 0.1)',
          color: '#5454e9',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: '700'
        }}>
          DaisyUI + Tailwind (Icesi 2026)
        </span>
      </div>
      <iframe
        srcDoc={fullDoc}
        title={`Componente Interactivo ${id}`}
        style={{
          width: '100%',
          height: finalHeight,
          border: 'none',
          display: 'block',
          background: '#f8f9fc'
        }}
        sandbox=""
      />
    </div>
  );
}
