import React from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';

export function StepByStep({ children }) {
    return (
        <div className={styles.timelineContainer}>
            {children}
        </div>
    );
}

StepByStep.propTypes = {
    children: PropTypes.node.isRequired,
};

export function Step({ title, number, children }) {
    const hasTitleProp = Boolean(title);
    return (
        <div className={`${styles.timelineItem} ${!hasTitleProp ? styles.timelineItemHeading : ''}`}>
            {hasTitleProp ? (
                <div className={styles.timelineHeader}>
                    <div className={styles.timelineBadge}>
                        {number}
                    </div>
                    <h3 className={styles.timelineTitle}>{title}</h3>
                </div>
            ) : (
                <div className={styles.timelineBadge}>
                    {number}
                </div>
            )}
            <div className={styles.timelineBody}>
                {children}
            </div>
        </div>
    );
}

Step.propTypes = {
    title: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.node.isRequired,
};
