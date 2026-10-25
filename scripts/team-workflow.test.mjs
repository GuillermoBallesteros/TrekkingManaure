import test from 'node:test';
import assert from 'node:assert/strict';
import { getViolations, resolveOwner } from './team-workflow.mjs';

test('los archivos de presentación e integración visual pertenecen a Santiago', () => {
  for (const file of [
    'frontend/src/sections/Galeria/Galeria.tsx',
    'frontend/src/pages/Home/Home.tsx',
    'frontend/src/styles/global.css',
    'frontend/package-lock.json',
    'shared/components/Modal.tsx',
    'shared/data/galeria.ts',
  ])
    assert.equal(resolveOwner(file), 'santiago', file);
});

test('las excepciones funcionales tienen precedencia sobre la carpeta frontend', () => {
  for (const file of [
    'frontend/src/sections/Reserva/components/Comprobante.tsx',
    'frontend/src/sections/Costos/Costos.css',
    'frontend/src/components/ui/Calendario/Calendario.tsx',
    'frontend/src/hooks/useReserva.ts',
    'frontend/src/services/api.ts',
    'shared/config/index.ts',
    'shared/utils/capacity.ts',
  ])
    assert.equal(resolveOwner(file), 'damian', file);
});

test('los prefijos de carpeta y las rutas exactas no incluyen archivos parecidos', () => {
  assert.equal(resolveOwner('frontend/src/hooks/useReserva.ts.backup'), 'santiago');
  assert.equal(resolveOwner('frontend/src/sections/ReservaNueva/index.ts'), 'santiago');
  assert.equal(resolveOwner('frontend-extra/archivo.ts'), 'coordinacion');
});

test('administración, backend y herramientas quedan separados', () => {
  assert.equal(resolveOwner('admin/src/App.tsx'), 'admin');
  assert.equal(resolveOwner('backend/src/routes/index.ts'), 'backend');
  assert.equal(resolveOwner('shared/contracts/participante.ts'), 'backend');
  assert.equal(resolveOwner('docs/responsables.json'), 'coordinacion');
});

test('se normalizan separadores de Windows sin cambiar el responsable', () => {
  assert.equal(resolveOwner('frontend\\src\\sections\\Reserva\\Reserva.tsx'), 'damian');
});

test('el verificador rechaza cambios cruzados, incluido el origen de un traslado', () => {
  const files = [
    'frontend/src/sections/Galeria/Galeria.tsx',
    'frontend/src/sections/Reserva/GaleriaTrasladada.tsx',
    'admin/src/App.tsx',
  ];
  assert.deepEqual(getViolations('damian', files), [
    { file: files[0], owner: 'santiago' },
    { file: files[2], owner: 'admin' },
  ]);
});

test('coordinación permite integrar varias áreas y los roles desconocidos fallan', () => {
  assert.deepEqual(
    getViolations('coordinacion', ['frontend/src/App.tsx', 'admin/src/App.tsx']),
    [],
  );
  assert.throws(() => getViolations('sin-asignar', []), /desconocido/);
});
