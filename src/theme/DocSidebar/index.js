import React from 'react';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';
import DocSidebarMobile from '@theme/DocSidebar/Mobile';
import {useWindowSize} from '@docusaurus/theme-common';

export default function DocSidebar(props) {
  const windowSize = useWindowSize();
  // Desktop sidebar visible on larger screens
  const shouldRenderSidebarDesktop =
    windowSize === 'desktop' || windowSize === 'ssr';
  const shouldRenderSidebarMobile = windowSize === 'mobile';
  return (
    <>
      {shouldRenderSidebarDesktop && <DocSidebarDesktop {...props} />}
      {shouldRenderSidebarMobile && <DocSidebarMobile {...props} />}
    </>
  );
}
