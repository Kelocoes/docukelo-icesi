import React from 'react';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Layout from '@theme/DocCard/Layout';
import { FolderIcon, DocumentIcon } from '@site/src/components/IcesiIcons';

function stripLeadingEmoji(str) {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim();
}

function getSvgIcon(item) {
  if (item.type === 'category') {
    return <FolderIcon className="icesiDocCardIcon" size={20} />;
  }
  return <DocumentIcon className="icesiDocCardIcon" size={20} />;
}

function getIconTitleProps(item) {
  const cleanTitle = stripLeadingEmoji(item.label || '');
  return {
    icon: getSvgIcon(item),
    title: cleanTitle || item.label,
  };
}
function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      description={item.description ?? categoryItemsPlural(item.items.length)}
      {...getIconTitleProps(item)}
    />
  );
}
function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}
export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
