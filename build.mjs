import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const outputDirectory = join(root, '_site');
const notices = JSON.parse(readFileSync(join(root, 'notices.json'), 'utf8'));

if (!Array.isArray(notices)) {
  throw new Error('notices.json must contain a JSON array.');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderNotice(notice) {
  if (!notice.category || !notice.title) {
    throw new Error('Every notice needs category and title fields.');
  }
  if (!['open', 'closed'].includes(notice.status)) {
    throw new Error(`Notice "${notice.title}" must have status "open" or "closed".`);
  }

  const parts = [
    '<article class="notice-entry">',
    `  <p class="tag">${escapeHtml(notice.category)}</p>`,
    `  <h3>${escapeHtml(notice.title)}</h3>`,
  ];

  if (notice.date) {
    if (!notice.date.label || !notice.date.text) {
      throw new Error(`Notice "${notice.title}" has an incomplete date.`);
    }
    parts.push(`  <p class="notice-date"><span>${escapeHtml(notice.date.label)}</span>${escapeHtml(notice.date.text)}</p>`);
  }

  for (const paragraph of notice.paragraphs ?? []) {
    parts.push(`  <p>${escapeHtml(paragraph)}</p>`);
  }

  if (notice.details?.length) {
    parts.push('  <dl class="event-details">');
    for (const detail of notice.details) {
      if (!detail.label || !detail.text) {
        throw new Error(`Notice "${notice.title}" has an incomplete detail row.`);
      }
      parts.push(`    <div><dt>${escapeHtml(detail.label)}</dt><dd>${escapeHtml(detail.text)}</dd></div>`);
    }
    parts.push('  </dl>');
  }

  if (notice.contactText || notice.email) {
    if (!notice.contactText || !notice.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notice.email)) {
      throw new Error(`Notice "${notice.title}" has an invalid contact.`);
    }
    parts.push(`  <p>${escapeHtml(notice.contactText)}<br><a href="mailto:${escapeHtml(notice.email)}">${escapeHtml(notice.email)}</a></p>`);
  }

  if (notice.signature) {
    parts.push(`  <p class="notice-signature">${escapeHtml(notice.signature)}</p>`);
  }

  parts.push('</article>');
  return parts.join('\n');
}

function renderTemplate(templateName, markerName, entries, emptyMessage) {
  const template = readFileSync(join(root, templateName), 'utf8');
  const marker = new RegExp(`<!-- ${markerName}:start -->([\\s\\S]*?)<!-- ${markerName}:end -->`);
  if (!marker.test(template)) {
    throw new Error(`${templateName} is missing the ${markerName} markers.`);
  }
  const content = entries.length
    ? entries.map(renderNotice).join('\n\n')
    : `<p class="archive-empty">${escapeHtml(emptyMessage)}</p>`;
  return template.replace(marker, `<!-- ${markerName}:start -->\n${content}\n        <!-- ${markerName}:end -->`);
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

const homeNotices = notices.filter((notice) => notice.showOnHome === true);
const archivedNotices = notices.filter((notice) => notice.status === 'closed');
writeFileSync(
  join(outputDirectory, 'index.html'),
  renderTemplate('index.html', 'notices', homeNotices, '現在掲載中のお知らせはありません。'),
);
writeFileSync(
  join(outputDirectory, 'archive.html'),
  renderTemplate('archive.html', 'archived-notices', archivedNotices, '過去のお知らせはありません。'),
);
copyFileSync(join(root, 'styles.css'), join(outputDirectory, 'styles.css'));
copyFileSync(join(root, 'script.js'), join(outputDirectory, 'script.js'));

console.log(`Built ${homeNotices.length} home notices and ${archivedNotices.length} archived notices in _site/.`);
