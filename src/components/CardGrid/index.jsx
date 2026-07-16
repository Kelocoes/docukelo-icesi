import React from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';

export function CardGrid({ children, cols = 2 }) {
    const gridStyle = {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    };
    return (
        <div className={styles.cardGrid} style={gridStyle}>
            {children}
        </div>
    );
}

CardGrid.propTypes = {
    children: PropTypes.node.isRequired,
    cols: PropTypes.number,
};

export function Card({ title, description, link }) {
    const CardWrapper = link ? 'a' : 'div';
    const linkProps = link 
        ? { href: link, className: `${styles.card} ${styles.cardLink}` } 
        : { className: styles.card };

    return (
        <CardWrapper {...linkProps}>
            <div className={styles.cardContent}>
                <div>
                    <h4 className={styles.cardTitle}>{title}</h4>
                    {description && <p className={styles.cardDescription}>{description}</p>}
                </div>
            </div>
        </CardWrapper>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.string,
};
