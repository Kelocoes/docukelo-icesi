import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {extractLeadingEmoji} from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';
import { FolderIcon, DocumentIcon } from '@site/src/components/IcesiIcons';
import styles from './styles.module.css';

function stripLeadingEmoji(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim();
}

export default function DocCardHeading({item, icon, title}) {
  const cleanTitle = stripLeadingEmoji(title || item?.label || '');

  return (
    <Heading
      as="h2"
      className={clsx(ThemeClassNames.docs.docCard.heading, styles.cardTitle)}
      title={cleanTitle || title}
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      {icon}
      <span className={clsx('text--truncate', styles.cardTitleText)}>
        {cleanTitle || title}
      </span>
    </Heading>
  );
}
