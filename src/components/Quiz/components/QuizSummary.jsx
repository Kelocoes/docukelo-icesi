import React from 'react';
import styles from '../Quiz.module.css';

export function QuizSummary({ scorePercentage, correctCount, totalQuestions, handleRetry }) {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div className={styles.summaryContainer}>
      <h3>Cuestionario Finalizado</h3>
      <div className={styles.scoreSection}>
        <div className={styles.circularProgressWrapper}>
          <svg width="120" height="120" viewBox="0 0 120 120" className={styles.svgCircle}>
            <circle
              cx="60"
              cy="60"
              r={radius}
              className={styles.circleBg}
              strokeWidth={strokeWidth}
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className={scorePercentage >= 60 ? styles.circleProgressSuccess : styles.circleProgressFail}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.percentageText}>{scorePercentage}%</div>
        </div>
        <p className={styles.scoreFraction}>
          Obtuviste <strong>{correctCount}</strong> de <strong>{totalQuestions}</strong> respuestas correctas.
        </p>
        <p className={styles.feedbackMessage}>
          {scorePercentage >= 80
            ? '¡Excelente trabajo! Has dominado este tema.'
            : scorePercentage >= 60
            ? '¡Buen intento! Has aprobado, pero puedes mejorar.'
            : 'Sigue estudiando. Te recomendamos volver a repasar la teoría y reintentar.'}
        </p>
      </div>
      <button onClick={handleRetry} className={styles.retryButton}>
        Reintentar
      </button>
    </div>
  );
}
QuizSummary.displayName = 'QuizSummary';
