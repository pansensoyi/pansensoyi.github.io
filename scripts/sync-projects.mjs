#!/usr/bin/env node
// Regenerates the "Open source" cards in index.html from the project repos' own
// metadata (package.json / pyproject.toml), so the site never drifts from the source.
//
//   node scripts/sync-projects.mjs [path-to-folder-containing-the-repos]
//
// The folder defaults to this repo's parent directory.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'pansensoyi';
const REPOS = [
  'adobe-analytics-toolkit',
  'braze-toolkit',
  'adtech-kit',
  'attribution-params',
  'consent-mode-bridge',
  'braze-canvas-testkit',
];

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reposRoot = resolve(process.argv[2] ?? join(siteRoot, '..'));
const START = '<!-- projects:start';
const END = '<!-- projects:end -->';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readProject(repo) {
  const dir = join(reposRoot, repo);
  const pkgPath = join(dir, 'package.json');
  const pyPath = join(dir, 'pyproject.toml');

  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return {
      repo,
      name: String(pkg.name ?? repo).replace(/^@[^/]+\//, ''),
      description: pkg.description ?? '',
      language: existsSync(join(dir, 'tsconfig.json')) ? 'TypeScript' : 'JavaScript',
    };
  }
  if (existsSync(pyPath)) {
    const toml = readFileSync(pyPath, 'utf8');
    const field = (key) => toml.match(new RegExp(`^${key}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'm'))?.[1];
    return {
      repo,
      name: field('name') ?? repo,
      description: (field('description') ?? '').replace(/\\"/g, '"'),
      language: 'Python',
    };
  }
  throw new Error(`No package.json or pyproject.toml found in ${dir}`);
}

const card = ({ repo, name, description, language }) => `          <li class="project">
            <a href="https://github.com/${OWNER}/${repo}" rel="noopener">
              <span class="project-top">
                <span class="lang lang-${language.toLowerCase()}">${language}</span>
                <span class="project-arrow" aria-hidden="true">↗</span>
              </span>
              <h3>${escapeHtml(name)}</h3>
              <p>${escapeHtml(description)}</p>
            </a>
          </li>`;

const indexPath = join(siteRoot, 'index.html');
const html = readFileSync(indexPath, 'utf8');
const startAt = html.indexOf(START);
const endAt = html.indexOf(END);
if (startAt === -1 || endAt === -1) throw new Error('Project markers not found in index.html');

const startLineEnd = html.indexOf('\n', startAt);
const projects = REPOS.map(readProject);
const next =
  html.slice(0, startLineEnd + 1) +
  projects.map(card).join('\n') +
  '\n          ' +
  html.slice(endAt);

writeFileSync(indexPath, next);
console.log(`Synced ${projects.length} projects from ${reposRoot}`);
for (const p of projects) console.log(`  ${p.name} (${p.language})`);
