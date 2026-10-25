import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ownership = JSON.parse(readFileSync(resolve(root, 'docs/responsables.json'), 'utf8'));
const textExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.json',
  '.html',
  '.md',
  '.svg',
  '.yml',
  '.yaml',
]);

export function resolveOwner(file, rules = ownership.rules) {
  const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '');
  const matches = rules.filter(({ path }) => {
    if (path === '') return true;
    return path.endsWith('/') ? normalized.startsWith(path) : normalized === path;
  });

  matches.sort((a, b) => b.path.length - a.path.length);

  if (!matches.length) throw new Error(`No se definió responsable para ${normalized}.`);
  return matches[0].owner;
}

export function getViolations(role, files) {
  if (!Object.hasOwn(ownership.roles, role)) {
    throw new Error(`Responsable desconocido: ${role}.`);
  }

  // La coordinación permite integrar cambios de varias áreas en un PR acordado.
  if (role === 'coordinacion') return [];

  return files
    .filter((file) => resolveOwner(file) !== role)
    .map((file) => ({ file, owner: resolveOwner(file) }));
}

function git(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function splitPaths(output) {
  return output.split('\0').filter(Boolean);
}

function changedFiles(base) {
  if (!base || base.startsWith('-')) throw new Error('La referencia base no es válida.');

  let commonBase;

  try {
    commonBase = git(['merge-base', base, 'HEAD']).trim();
  } catch {
    throw new Error(
      `No se pudo comparar con ${base}. Actualiza las referencias con git fetch origin ` +
        'o indica una referencia existente mediante --base.',
    );
  }

  // Los renombrados se comprueban como eliminación y alta: se revisan ambos propietarios.
  const tracked = splitPaths(git(['diff', '--name-only', '--no-renames', '-z', commonBase]));
  const untracked = splitPaths(git(['ls-files', '--others', '--exclude-standard', '-z']));

  return [...new Set([...tracked, ...untracked])].sort();
}

function printViolations(violations) {
  console.error('Hay archivos fuera del área asignada:');
  for (const { file, owner } of violations) {
    console.error(`  ${JSON.stringify(file)} → ${ownership.roles[owner]}`);
  }
  console.error(
    'Separa estos cambios o acuerda un PR de coordinación. No se modificó ningún archivo.',
  );
}

function formatFiles(files, checkOnly) {
  const prettier = resolve(root, 'frontend/node_modules/prettier/bin/prettier.cjs');

  if (!existsSync(prettier)) {
    throw new Error('Instala las dependencias con npm.cmd ci --prefix frontend.');
  }

  const candidates = files.filter(
    (file) =>
      existsSync(resolve(root, file)) &&
      textExtensions.has(extname(file)) &&
      !file.endsWith('package-lock.json'),
  );

  if (!candidates.length) {
    console.log('No hay archivos de texto modificados que necesiten formato.');
    return;
  }

  for (let offset = 0; offset < candidates.length; offset += 40) {
    const result = spawnSync(
      process.execPath,
      [
        prettier,
        checkOnly ? '--check' : '--write',
        '--ignore-path',
        '.prettierignore',
        '--',
        ...candidates.slice(offset, offset + 40),
      ],
      { cwd: root, stdio: 'inherit', shell: false },
    );

    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error('La comprobación o aplicación de formato no terminó correctamente.');
  }
}

function main() {
  const [command, role, ...options] = process.argv.slice(2);

  if (!['check', 'format', 'list'].includes(command) || !Object.hasOwn(ownership.roles, role)) {
    console.log(
      'Uso: node scripts/team-workflow.mjs <check|format|list> <responsable> [--base origin/main] [--check]',
    );
    console.log('Responsables: ' + Object.keys(ownership.roles).join(', '));
    process.exitCode = 1;
    return;
  }

  if (command === 'list') {
    if (options.length) throw new Error('list no acepta opciones adicionales.');
    const paths = [
      ...new Set([
        ...splitPaths(git(['ls-files', '-z'])),
        ...splitPaths(git(['ls-files', '--others', '--exclude-standard', '-z'])),
      ]),
    ];
    for (const file of paths.filter((file) => resolveOwner(file) === role).sort()) {
      console.log(JSON.stringify(file));
    }
    return;
  }

  let base = 'origin/main';
  let checkOnly = false;

  for (let index = 0; index < options.length; index++) {
    if (options[index] === '--base' && options[index + 1]) {
      base = options[++index];
    } else if (options[index] === '--check' && command === 'format') {
      checkOnly = true;
    } else {
      throw new Error(`Opción desconocida o incompleta: ${options[index]}.`);
    }
  }

  const files = changedFiles(base);
  const violations = getViolations(role, files);

  if (violations.length) {
    printViolations(violations);
    process.exitCode = 1;
    return;
  }

  console.log(`${ownership.roles[role]}: ${files.length} archivo(s) dentro del alcance permitido.`);

  if (command === 'format') formatFiles(files, checkOnly);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
