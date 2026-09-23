import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';
function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();
  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      <div className={styles.sidebarFooter}>
        <a href="https://www.icesi.edu.co" target="_blank" rel="noopener noreferrer" className={styles.poweredByLink} title="Universidad Icesi">
          <img src="/img/powered-by-icesi-light.svg" className={styles.poweredByLogoLight} alt="Powered by Icesi" />
          <img src="/img/powered-by-icesi-dark.svg" className={styles.poweredByLogoDark} alt="Powered by Icesi" />
        </a>
      </div>
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
export default React.memo(DocSidebarDesktop);
