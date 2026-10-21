import React, { useCallback, useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { PROGRESS_EVENT, clearAllProgress, countCompletedByPrefix } from '@site/src/utils/readingProgress';
import styles from './styles.module.css';

const TEXT = {
    es: {
        weeks: (n) => (n === 1 ? '1 semana' : `${n} semanas`),
        docs: (n) => (n === 1 ? '1 documento' : `${n} documentos`),
        progress: (done, total) => `${done} de ${total} leídos`,
        open: 'Explorar el curso',
        reset: 'Borrar mi progreso',
        confirm: '¿Borrar las marcas de lectura de todos los cursos en este navegador?',
        note: 'Tu progreso se guarda solo en este navegador.',
    },
    en: {
        weeks: (n) => (n === 1 ? '1 week' : `${n} weeks`),
        docs: (n) => (n === 1 ? '1 document' : `${n} documents`),
        progress: (done, total) => `${done} of ${total} read`,
        open: 'Explore the course',
        reset: 'Clear my progress',
        confirm: 'Clear the read marks of all courses in this browser?',
        note: 'Your progress is stored only in this browser.',
    },
};

function CourseCard({ course, docsBase, text, completed: rawCompleted }) {
    // Marcas de paginas que ya no existen (renombradas o borradas) no deben superar el total
    const completed = Math.min(rawCompleted, course.docs);
    const percent = course.docs > 0 ? Math.round((completed / course.docs) * 100) : 0;
    return (
        <Link to={course.path} className={styles.card}>
            <h3 className={styles.title}>{course.label}</h3>
            {course.description && <p className={styles.description}>{course.description}</p>}
            <p className={styles.meta}>
                {course.weeks > 0 && <span>{text.weeks(course.weeks)}</span>}
                <span>{text.docs(course.docs)}</span>
            </p>
            {completed > 0 && (
                <div className={styles.progress}>
                    <div
                        className={styles.progressTrack}
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={text.progress(completed, course.docs)}>
                        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                    </div>
                    <span className={styles.progressLabel}>{text.progress(completed, course.docs)}</span>
                </div>
            )}
            <span className={styles.cta}>{text.open} &rarr;</span>
        </Link>
    );
}

export default function CourseCards() {
    const { i18n } = useDocusaurusContext();
    const text = TEXT[i18n.currentLocale] ?? TEXT.es;
    const data = usePluginData('docukelo-courses');
    const docsBase = useBaseUrl('/docs/');
    const courses = data?.courses ?? [];
    const [counts, setCounts] = useState({});

    const refresh = useCallback(() => {
        const next = {};
        for (const course of courses) next[course.id] = countCompletedByPrefix(`${docsBase}${course.id}/`);
        setCounts(next);
    }, [courses, docsBase]);

    useEffect(() => {
        refresh();
        window.addEventListener(PROGRESS_EVENT, refresh);
        window.addEventListener('storage', refresh);
        return () => {
            window.removeEventListener(PROGRESS_EVENT, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, [refresh]);

    const anyProgress = Object.values(counts).some((n) => n > 0);

    const resetProgress = () => {
        if (!window.confirm(text.confirm)) return;
        clearAllProgress();
    };

    return (
        <div>
            <div className={styles.grid}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        docsBase={docsBase}
                        text={text}
                        completed={counts[course.id] ?? 0}
                    />
                ))}
            </div>
            <p className={styles.note}>
                {text.note}
                {anyProgress && (
                    <>
                        {' '}
                        <button type="button" className={styles.resetButton} onClick={resetProgress}>
                            {text.reset}
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}
