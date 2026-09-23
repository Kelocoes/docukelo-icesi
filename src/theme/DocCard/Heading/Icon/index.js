import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import { FolderIcon, DocumentIcon } from '@site/src/components/IcesiIcons';
import styles from './styles.module.css';

export default function DocCardHeadingIcon({icon}) {
  const isFolder = typeof icon === 'string' && (icon.includes('🗃') || icon.includes('📁') || icon.includes('📂') || icon.includes('category'));

  return (
    <span
      className={clsx(ThemeClassNames.docs.docCard.icon, styles.cardTitleIcon)}>
      {typeof icon === 'object' && React.isValidElement(icon) ? (
        icon
      ) : isFolder ? (
        <FolderIcon className="icesiDocCardIcon" size={20} />
      ) : (
        <DocumentIcon className="icesiDocCardIcon" size={20} />
      )}
    </span>
  );
}
