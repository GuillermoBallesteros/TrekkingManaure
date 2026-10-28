# Reparto de trabajo · Trekking Manaure

## Acuerdo principal

Cada archivo tiene un único responsable de edición. Santiago y Damian cubren entre los dos todo el frontend; el responsable del proyecto trabaja en administración y coordina las integraciones; la persona externa desarrolla el backend desde su propio entorno.

Las ramas separan las entregas. El reparto de archivos evita que dos personas editen los mismos archivos en esas ramas. Git todavía puede encontrar conflictos al modificar las mismas líneas o al eliminar un archivo que otra rama modifica; no existe una garantía absoluta de cero conflictos. Referencia: [conflictos de fusión en GitHub](https://docs.github.com/en/pull-requests/reference/merge-conflicts).

## Responsables

| Persona              | Área                                           | Entrega principal                                                                   |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Santiago             | Presentación e integración visual del frontend | Navegación, contenido, galería, diseño responsive y composición del sitio           |
| Damian               | Reservas e integración funcional del frontend  | Formulario, costos, cupos, calendario, validaciones y cliente de API pública        |
| Tú                   | Administración                                 | Acceso administrativo, participantes, pagos, cupos, galería y exportación           |
| Persona externa      | Backend                                        | API, autenticación/autorización, base de datos, archivos y operaciones del servidor |
| Tú, como coordinador | Integración del proyecto                       | Revisar/fusionar PR, herramientas, documentación común y acuerdos entre áreas       |

El mapa comprobable está en `docs/responsables.json`. Los nombres Santiago y Damian identifican responsabilidades; no se han supuesto sus usuarios `@...` de GitHub.

## Santiago: presentación del frontend

### Archivos propios

- `frontend/src/components/layout/`: Navbar y Footer, con sus CSS e índices.
- `frontend/src/sections/Inicio/`, `Evento/`, `Kit/`, `Alojamiento/`, `Seguridad/`, `Galeria/` y `Aliados/`.
- `frontend/src/components/ui/Marquee/`.
- Los hooks y datos de presentación: `frontend/src/hooks/{comun,contacto,navegacion,home,aliados,galeria}/` y `frontend/src/data/{navegacion,home,aliados,evento,kit,alojamiento,seguridad}/`.
- `frontend/src/App.tsx`, `main.tsx`, `pages/` y `styles/`.
- Los índices generales de `frontend/src/sections/`, `components/`, `components/ui/` y `hooks/`.
- `frontend/index.html`, `public/`, configuración Vite/TypeScript y `.env.example`.
- **Solo Santiago modifica `frontend/package.json` y `frontend/package-lock.json`.**
- `shared/styles/`, `shared/components/`, `shared/assets/` y `shared/data/`.
- Cualquier archivo nuevo de `frontend/` que no pertenezca expresamente al bloque de Damian.

### Trabajo a realizar

1. Mantener el diseño de referencia y terminar la adaptación móvil, navegación y accesibilidad del contenido.
2. Completar las secciones informativas, logos, recursos gráficos y galería con imágenes autorizadas.
3. Mantener la composición de Home y App, incorporando los componentes funcionales de Damian mediante sus props públicas.
4. Revisar estados visuales, carga de imágenes y coherencia de la identidad entre frontend y admin.

Santiago no cambia la lógica interna de Reserva, Calendario o Cupos. Para incorporar un componente nuevo de Damian a Home o a un índice general, Santiago realiza esa edición en su propio PR.

### Entregas sugeridas

- `feat/santiago/presentacion`: navegación, portada y secciones informativas.
- `feat/santiago/galeria`: fotografías, ampliación y accesibilidad de galería.
- `feat/santiago/integracion-visual`: composición del sitio y ajustes visuales compartidos.

## Damian: reservas y funcionamiento del frontend

### Archivos propios

- `frontend/src/sections/Reserva/`, incluidos sus componentes y CSS.
- `frontend/src/sections/Costos/`, `Extras/` y `Cupos/`.
- `frontend/src/components/ui/Calendario/`, `ContadorCupos/` y `CuentaRegresiva/`.
- Los hooks de esta área en `frontend/src/hooks/{reserva,calendario,cupos,costos,extras}/` y sus catálogos en `frontend/src/data/{reserva,calendario,cupos,extras}/`.
- `frontend/src/types/`, `utils/` y `services/`.
- `shared/config/` y `shared/utils/`.

### Trabajo a realizar

1. Completar el flujo de reserva: datos, estadía, acompañante, extras y fecha de pago.
2. Mantener un único cálculo de precios y un comportamiento coherente entre formulario, costos, cupos y resumen.
3. Implementar estados de espera, error, envío y confirmación del frontend cuando el backend esté disponible.
4. Conectar el cliente de API pública, la disponibilidad real y la creación de reservas según el contrato acordado.
5. Validar datos y archivos en el cliente para ayudar al usuario; la comprobación definitiva corresponde al backend.

Damian modifica el CSS de sus componentes, no el CSS global de Santiago. Si necesita una dependencia, una regla global, un icono o un cambio en Home, acuerda el cambio con Santiago y este lo entrega en un PR pequeño antes de que Damian lo consuma.

### Entregas sugeridas

- `feat/damian/reserva`: formulario, validación y resumen.
- `feat/damian/pagos-cupos`: costos, calendario y presentación de cupos.
- `feat/damian/api-publica`: conexión del frontend con la API acordada.

## Tu trabajo: administración

Tu área exclusiva es `admin/`, incluidos sus dependencias, tipos, servicios, contexto, componentes, páginas y estilos. Puedes añadir documentación de esta parte en `docs/admin/`.

Orden de trabajo:

1. Acceso administrativo y conexión a la autenticación del backend.
2. Listado, filtros y detalle de participantes.
3. Verificación de pagos por llave Bre-B y aceptación/rechazo.
4. Gestión de cupos y seguimiento de saldos y fechas.
5. Galería administrativa y exportación de información real.

Ramas sugeridas: `feat/admin/acceso`, `feat/admin/participantes-pagos` y `feat/admin/galeria-reportes`.

Importa los elementos compartidos como consumidor. Si necesitas cambiar el diseño de `shared/components/` o `shared/styles/`, Santiago edita esos archivos. Si cambia una regla de negocio o un precio de `shared/config/`, Damian realiza la edición acordada. Así se mantiene la separación también entre frontend y admin.

## Persona externa: backend

Su área exclusiva es `backend/`. Puede mantener documentación del servidor en `docs/backend/` y los contratos públicos de API en `shared/contracts/` cuando se incorporen.

Le corresponden la base de datos, autenticación, permisos, validación definitiva, almacenamiento de comprobantes/fotos, transacciones de cupos, pagos, exportaciones y demás integraciones del servidor.

Trabaja desde su propio checkout y sus propias ramas `feat/backend/...`, con PR al mismo repositorio. Su entorno no necesita ser este equipo. No modifica `frontend/` ni `admin/` para conectar sus endpoints: entrega el contrato y cada responsable adapta su cliente.

## Archivos compartidos: un editor, varios consumidores

| Recurso                                                                      | Lo edita                            | Lo revisan/consumen                             |
| ---------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------- |
| Colores, fuentes, marca, iconos y Modal                                      | Santiago                            | Santiago, Damian y tú                           |
| Imágenes, logos y catálogos visuales                                         | Santiago                            | Frontend y admin                                |
| Datos del evento, precios y reglas comunes                                   | Damian, con acuerdo del organizador | Frontend, admin y backend                       |
| Utilidades de dinero, fechas y capacidad                                     | Damian                              | Frontend y admin                                |
| Contratos públicos de la API                                                 | Persona del backend                 | Damian y tú; Santiago si cambia la presentación |
| Composición de App/Home e índices del frontend                               | Santiago                            | Damian                                          |
| Dependencias del frontend y su lockfile                                      | Santiago                            | Damian                                          |
| Dependencias de admin y su lockfile                                          | Tú                                  | Tú                                              |
| Dependencias del backend y su lockfile                                       | Persona del backend                 | Persona del backend                             |
| README, configuración de formato, scripts, `.github/` y mapa de responsables | Tú como coordinador                 | Todo el equipo                                  |

Cambiar un recurso compartido exige compilar frontend y admin, además de avisar del cambio de interfaz. Una edición sin conflicto de Git todavía puede romper a un consumidor: por eso hace falta la revisión de integración.

## Interfaces que deben acordarse antes de conectar

- Santiago y Damian conservan el contrato entre `Alojamiento`, Home y `Reserva`: selección de estadía y callback. Los cambios de props se entregan coordinados.
- Backend define los DTO, los estados de pago/reserva, los códigos de error, las fechas y el formato de dinero.
- Damian conecta las operaciones públicas; tú conectas las administrativas.
- El servidor determina los cupos confirmados y valida los pagos. Los clientes presentan ese resultado.
- La carga de fotos y comprobantes se acuerda con backend; no se guardan archivos operativos de usuarios mediante commits al repositorio.

No se inventan endpoints ni se consideran los datos de demostración como un contrato definitivo.

## Forma de trabajar en GitHub

1. **Primero, una base común aprobada.** El esqueleto y esta guía deben estar integrados en la rama base de GitHub antes de repartir nuevas ramas. El commit local del esqueleto es `141b122`; esta preparación local no equivale a haberlo publicado.
2. Cada persona empieza cada tarea desde `main` actualizado y usa una rama propia por tarea. No comparten una rama de trabajo ni crean su siguiente entrega desde una rama ya fusionada.
3. Se reserva una tarea por grupo de archivos. Una misma persona tampoco mantiene dos PR simultáneos que reescriban el mismo archivo.
4. Cada PR contiene cambios de una sola área. Los cambios de dependencias, estructura o interfaces compartidas se acuerdan primero y se integran en PR pequeños.
5. Antes de fusionar, se actualiza la rama con `main`, se vuelve a comprobar y el coordinador revisa/fusiona los PR de uno en uno.
6. Si aparece un conflicto, interviene el responsable del archivo. No se aceptan automáticamente todos los cambios de una de las ramas.

No trabajen directamente sobre `main`. Si quieres que GitHub exija el flujo, configura en el repositorio PR obligatorios y revisiones. Un archivo CODEOWNERS puede solicitar revisores, pero la aprobación obligatoria depende de la configuración de la rama. Se necesitan los `@usuarios` exactos, no solo sus nombres. Referencia: [propietarios de código en GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

Esta entrega deja el reparto y las herramientas locales. No crea PR, no cambia permisos ni protecciones y no envía mensajes ni cambios a GitHub.

## Comprobador de alcance y formato por responsable

Ejecutar desde la raíz del repositorio. Requiere Node.js y las dependencias de frontend para usar Prettier.

```powershell
node scripts/team-workflow.mjs check santiago --base origin/main
node scripts/team-workflow.mjs check damian --base origin/main
node scripts/team-workflow.mjs check admin --base origin/main
node scripts/team-workflow.mjs check backend --base origin/main
```

Cada persona ejecuta solo su comando. Se revisan los cambios de su rama desde el ancestro común con la base, los cambios locales y los archivos nuevos no ignorados. Los traslados comprueban tanto la ruta original como la nueva. El comando no modifica archivos ni descarga referencias.

Para comprobar únicamente los cambios locales frente al commit actual, usa `--base HEAD`. Para que el comparador vea la última base remota, ejecuta antes `git fetch origin`.

Para consultar el listado exacto de tus archivos:

```powershell
node scripts/team-workflow.mjs list santiago
node scripts/team-workflow.mjs list damian
```

Durante el trabajo paralelo no usen `npm.cmd run format --prefix frontend`: ese comando general escribe también admin, shared y documentación. Usen el formato por responsable:

```powershell
node scripts/team-workflow.mjs format santiago --base origin/main
node scripts/team-workflow.mjs format damian --base origin/main
node scripts/team-workflow.mjs format admin --base origin/main
```

El formateador se niega a escribir si encuentra cambios fuera del área. Solo formatea archivos de texto modificados que existen; no reescribe lockfiles, imágenes ni licencias de fuentes. Para comprobar sin escribir, añade `--check`.

`coordinacion` permite preparar una integración que toque varias áreas. Está reservado al responsable del proyecto y no se utiliza para saltarse el reparto de una tarea normal. El comprobador es una ayuda local de organización, no un sistema de permisos de GitHub.

## Ejemplo completo: Santiago trabaja la galería

Con el directorio de trabajo limpio y la base común ya publicada:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feat/santiago/galeria
```

Después de editar sus archivos:

```powershell
git fetch origin
git merge origin/main
node scripts/team-workflow.mjs check santiago --base origin/main
node scripts/team-workflow.mjs format santiago --base origin/main
npm.cmd run build --prefix frontend
npm.cmd run build --prefix admin
git diff --check
git add frontend/src/sections/Galeria
git commit -m "feat: mejorar galeria del evento"
git push -u origin feat/santiago/galeria
```

Después abre un PR hacia `main`. Si añade fotos o modifica el catálogo, añade esos archivos propios de `shared/assets/` o `shared/data/` de forma explícita antes del commit.

Damian sigue el mismo flujo con `feat/damian/reserva`, su identificador `damian` y sus archivos de Reserva. Tú utilizas `feat/admin/...` y `admin`. Backend utiliza `feat/backend/...` y `backend`.

La plantilla `.github/PULL_REQUEST_TEMPLATE.md` deja constancia de responsable, alcance, acuerdos y comprobaciones. Los comandos de push de este ejemplo son instrucciones para cada colaborador; no se ejecutan automáticamente.

## Criterio para dar una tarea por terminada

- El alcance del PR pertenece al responsable o existe un acuerdo de integración explícito.
- El código está formateado en varias líneas y no incluye cambios ajenos.
- El frontend compila; admin también compila cuando se toca `shared/`.
- Las pantallas modificadas se comprueban en escritorio y móvil.
- Backend documenta el contrato y valida sus operaciones con sus propias pruebas.
- El coordinador revisa y fusiona antes de que el siguiente cambio dependiente empiece.
