import React from 'react';
import styles from '../Quiz.module.css';

export function Question({ title, questionIndex, children }) {
  // Extract and filter Option child nodes
  const options = React.Children.toArray(children).filter(
    (child) => child.type && (child.type.name === 'Option' || child.type.displayName === 'Option')
  );

  return (
    <div className={styles.questionBox}>
      <h4 className={styles.questionTitle}>{title}</h4>
      <div className={styles.optionsList}>
        {options.map((option, idx) =>
          React.cloneElement(option, {
            optionIndex: idx,
            questionIndex: questionIndex,
          })
        )}
      </div>
    </div>
  );
}
Question.displayName = 'Question';
