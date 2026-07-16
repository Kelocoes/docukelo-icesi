import React, { useState, useEffect } from 'react';
import styles from './Quiz.module.css';
import { QuizContext } from './components/QuizContext';
import { Question } from './components/Question';
import { Option } from './components/Option';
import { QuizSummary } from './components/QuizSummary';

export function Quiz({ id, children }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // maps questionIndex -> selectedOptionIndex
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Flatten children to extract only Question components
  const questions = React.Children.toArray(children).filter(
    (child) => child.type && (child.type.name === 'Question' || child.type.displayName === 'Question')
  );

  const storageKey = `docukelo-quiz-${id}`;

  // Load state from local storage on mount
  useEffect(() => {
    if (id) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAnswers(parsed.answers || {});
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
          setIsCompleted(parsed.isCompleted || false);
        }
      } catch (e) {
        console.error('Error loading quiz state from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, [id, storageKey]);

  // Save state to local storage on changes
  useEffect(() => {
    if (isLoaded && id) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ answers, currentQuestionIndex, isCompleted })
        );
      } catch (e) {
        console.error('Error saving quiz state to localStorage', e);
      }
    }
  }, [answers, currentQuestionIndex, isCompleted, id, storageKey, isLoaded]);

  if (!isLoaded) {
    return <div className={styles.loading}>Cargando cuestionario...</div>;
  }

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (answers[questionIndex] !== undefined) return; // already answered
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate results
  let correctCount = 0;
  questions.forEach((question, qIdx) => {
    const selectedIdx = answers[qIdx];
    const options = React.Children.toArray(question.props.children).filter(
      (child) => child.type && (child.type.name === 'Option' || child.type.displayName === 'Option')
    );
    if (selectedIdx !== undefined && options[selectedIdx] && options[selectedIdx].props.correct) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <QuizContext.Provider value={{ answers, handleSelectOption, currentQuestionIndex }}>
      <div className={styles.quizContainer}>
        {!isCompleted ? (
          <div>
            <div className={styles.header}>
              <span className={styles.progressText}>
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.questionWrapper}>
              {React.cloneElement(questions[currentQuestionIndex], {
                questionIndex: currentQuestionIndex,
              })}
            </div>

            <div className={styles.navigation}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={styles.navButton}
              >
                Anterior
              </button>

              <button
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === undefined}
                className={styles.navButtonPrimary}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        ) : (
          <QuizSummary
            scorePercentage={scorePercentage}
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            handleRetry={handleRetry}
          />
        )}
      </div>
    </QuizContext.Provider>
  );
}
Quiz.displayName = 'Quiz';

// Re-export nested subcomponents for global mapping in MDXComponents.js
export { Question } from './components/Question';
export { Option } from './components/Option';
