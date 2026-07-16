import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import styles from '../Quiz.module.css';

export function Option({ children, correct, optionIndex, questionIndex }) {
  const { answers, handleSelectOption } = useContext(QuizContext);

  const selectedIndex = answers[questionIndex];
  const isAnswered = selectedIndex !== undefined;
  const isSelected = selectedIndex === optionIndex;

  let optionClass = styles.optionBtn;
  if (isAnswered) {
    if (correct) {
      optionClass = `${styles.optionBtn} ${styles.correct}`;
    } else if (isSelected) {
      optionClass = `${styles.optionBtn} ${styles.incorrect}`;
    } else {
      optionClass = `${styles.optionBtn} ${styles.disabled}`;
    }
  } else {
    optionClass = `${styles.optionBtn} ${styles.interactive}`;
  }

  return (
    <button
      onClick={() => handleSelectOption(questionIndex, optionIndex)}
      disabled={isAnswered}
      className={optionClass}
    >
      <span className={styles.optionLetter}>
        {String.fromCharCode(65 + optionIndex)}.
      </span>
      <span className={styles.optionText}>{children}</span>
      {isAnswered && correct && (
        <span className={styles.feedbackIcon} aria-label="Correcta">✓</span>
      )}
      {isAnswered && isSelected && !correct && (
        <span className={styles.feedbackIcon} aria-label="Incorrecta">✗</span>
      )}
    </button>
  );
}
Option.displayName = 'Option';
