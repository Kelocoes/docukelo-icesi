import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import styles from './styles.module.css';

function LinkLabel({label}) {
  return <span className={styles.linkLabel}>{label}</span>;
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  const [isCompleted, setIsCompleted] = useState(false);
  const storageKey = `docukelo-page-completed-${href}`;

  useEffect(() => {
    if (isInternalLink && href) {
      try {
        const saved = localStorage.getItem(storageKey);
        setIsCompleted(saved === 'true');
      } catch (e) {
        console.error('Error reading completion state from localStorage', e);
      }
    }
  }, [href, isInternalLink, storageKey]);

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      if (nextState) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.error('Error saving completion state to localStorage', e);
    }
  };

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {isInternalLink && (
          <span
            role="checkbox"
            aria-checked={isCompleted}
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                handleToggle(e);
              }
            }}
            className={clsx(styles.customCheckbox, {
              [styles.customCheckboxChecked]: isCompleted,
            })}
          >
            {isCompleted ? (
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="var(--ifm-color-primary, #2563eb)" stroke="var(--ifm-color-primary, #2563eb)" />
                <polyline points="16.5 8.5 10.5 14.5 7.5 11.5" stroke="#ffffff" strokeWidth="2.5" />
              </svg>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
              </svg>
            )}
          </span>
        )}
        <LinkLabel label={label} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
