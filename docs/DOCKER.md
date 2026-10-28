# Docker en Trekking Desafío Perijá 13K

Esta guía explica **qué** se empaquetó, **por qué** tiene sentido hacerlo, **cómo** usarlo y **cómo conectar la base de datos** sin romper nada.

## Índice

1. [Resumen en 30 segundos](#1-resumen-en-30-segundos)
2. [Qué es Docker (lo mínimo para entender el resto)](#2-qué-es-docker-lo-mínimo-para-entender-el-resto)
3. [Por qué empaquetar este proyecto](#3-por-qué-empaquetar-este-proyecto)
4. [Beneficios en general](#4-beneficios-en-general)
5. [Costos y límites (lo que Docker no resuelve)](#5-costos-y-límites-lo-que-docker-no-resuelve)
6. [Cómo quedó empaquetado el proyecto](#6-cómo-quedó-empaquetado-el-proyecto)
7. [Uso diario](#7-uso-diario)
8. [Conectar la base de datos (guía para quien la implemente)](#8-conectar-la-base-de-datos-guía-para-quien-la-implemente)
9. [Variables, secretos y seguridad](#9-variables-secretos-y-seguridad)
10. [Datos persistentes y copias de seguridad](#10-datos-persistentes-y-copias-de-seguridad)
11. [Problemas frecuentes](#11-problemas-frecuentes)
12. [Glosario](#12-glosario)
13. [Próximos pasos posibles](#13-próximos-pasos-posibles)

---

## 1. Resumen en 30 segundos

- El sitio público y el panel (`/admin`) se compilan y se sirven desde **una sola imagen de Docker** (`Dockerfile` en la raíz).
- Cualquier persona con Docker instalado levanta todo con `docker compose up -d --build` y abre <http://localhost:8080>. No necesita instalar Node, npm ni versiones concretas de nada.
- `docker-compose.yml` ya trae un servicio **PostgreSQL** (`db`) listo para usar con `--profile db`, con sus datos en un volumen que no se pierde al apagar el contenedor.
- La carpeta `backend/` está vacía: **la API aún no existe**. Más abajo (sección 8) está explicado el camino exacto para que tu compañero conecte la base de datos.

```bash
docker compose --profile db up -d --build
```

---

## 2. Qué es Docker (lo mínimo para entender el resto)

Docker permite meter una aplicación **junto con todo lo que necesita para funcionar** (sistema base, versión de Node, servidor web, configuración) en un paquete llamado **imagen**. Al ejecutar una imagen se crea un **contenedor**: un proceso aislado que se comporta igual en cualquier computador.

Piénsalo así: en vez de entregar una receta («instala Node 22, luego npm, luego…») y esperar que la cocina de cada persona sea igual, se entrega **el plato ya servido en su recipiente sellado**.

| Concepto           | Qué es                                                       | Analogía                          |
| ------------------ | ------------------------------------------------------------ | --------------------------------- |
| **Imagen**         | Plantilla de solo lectura con la app y sus dependencias      | Molde / receta terminada          |
| **Contenedor**     | Imagen en ejecución                                          | Plato servido a partir del molde  |
| **Dockerfile**     | Instrucciones para construir una imagen                      | La receta                         |
| **Docker Compose** | Archivo que describe varios contenedores que trabajan juntos | El menú completo del día          |
| **Volumen**        | Almacenamiento que sobrevive al contenedor                   | Un congelador aparte de la cocina |
| **Red**            | Red privada entre contenedores (se llaman por nombre)        | Comunicador interno               |

---

## 3. Por qué empaquetar este proyecto

Razones **específicas de este proyecto**, no solo generales:

1. **El código importa carpetas hermanas.** `frontend/` importa de `../admin` y `../shared` (ver `frontend/tsconfig.json` y `vite.config.ts`). Una persona nueva que clone solo una parte, o ejecute el comando desde otra carpeta, obtiene errores confusos. El `Dockerfile` fija la disposición correcta (`/app/frontend`, `/app/admin`, `/app/shared`) y nadie tiene que acordarse.
2. **Versiones muy nuevas de las herramientas.** El proyecto usa Vite 8, TypeScript 7 y React 19, que exigen Node `^20.19.0 || >=22.12.0`. Con Docker la versión de Node viene dentro de la imagen: no importa qué tenga instalado cada computador.
3. **Tu compañero necesita una base de datos y no debería instalarla a mano.** Instalar PostgreSQL en Windows implica instalador, servicio, contraseña, puerto, versión… Con el servicio `db` son una línea y se borra igual de fácil si algo sale mal.
4. **Hoy los datos viven en el navegador, y eso debe cambiar.** Las reservas están en `localStorage` (`shared/reservas/servicios/repositorio.ts`): lo que se reserva en un equipo no aparece en otro. La base de datos es justo lo que resuelve eso, y con Docker el entorno donde se probará ya está montado.
5. **La web es 100 % estática una vez compilada.** Es el mejor caso posible para Docker: la imagen final solo contiene nginx y los archivos compilados (muy liviana, rápida y con muy poca superficie de ataque).
6. **El panel requiere reescritura de SPA.** El README indica que el hosting debe responder `index.html` también en `/admin`. La configuración de nginx (`docker/nginx.conf`) ya lo hace; en cualquier servidor donde se despliegue la imagen funciona igual, sin reconfigurar.
7. **El proyecto está en OneDrive y se trabaja en equipo.** Con la carpeta sincronizada en la nube y varias personas con sistemas distintos, un entorno cerrado evita sorpresas por rutas, finales de línea o permisos.
8. **Prepara el despliegue.** Casi cualquier hosting moderno (VPS, Railway, Render, Fly.io, Google Cloud Run, Azure, AWS…) acepta imágenes Docker. Lo que se prueba en local es **la misma imagen** que se publica.

---

## 4. Beneficios en general

**Reproducibilidad**

- «En mi computador sí funciona» deja de existir: todos ejecutan la misma imagen.
- `npm ci` instala exactamente lo del `package-lock.json`, así el build de hoy es igual al de dentro de seis meses.

**Onboarding rápido**

- Persona nueva: instala Docker Desktop, clona, ejecuta un comando. Sin guía de 15 pasos.

**Aislamiento**

- Nada se instala en el sistema operativo: ni Node, ni PostgreSQL, ni nginx. No chocan con otros proyectos que usen otras versiones.
- Si algo se rompe, se borra el contenedor y se vuelve a crear. El computador queda limpio.

**Paridad entre desarrollo y producción**

- Se prueba contra el mismo nginx y la misma configuración que se publicará. Errores típicos (rutas que dan 404 al recargar `/admin`, cachés, compresión) aparecen antes de publicar.

**Despliegue portable**

- Una imagen se mueve entre proveedores sin reescribir nada. No hay «dependencia» de un hosting concreto.

**Versionado y vuelta atrás**

- Cada imagen se puede etiquetar (`trekking-manaure/web:1.2.0`). Si una versión sale mal, se vuelve a la anterior en segundos.

**Seguridad**

- La imagen final **no incluye** Node, `node_modules`, código fuente ni herramientas de compilación: menos cosas que puedan tener vulnerabilidades.
- nginx corre **sin privilegios de root** (imagen `nginx-unprivileged`).
- El contexto de build excluye `.env`, `.git` y secretos (`.dockerignore`).
- Cabeceras de seguridad básicas ya configuradas.
- La base de datos solo escucha en `127.0.0.1`: no es accesible desde otras máquinas de la red.

**Eficiencia**

- **Build por etapas (multi-stage):** la imagen final pesa decenas de MB, no cientos.
- **Caché de capas:** si solo cambias código, no se vuelven a descargar las dependencias.
- Archivos con hash (`/assets/`) con caché de un año y `index.html` sin caché: despliegues se ven al instante y la carga repetida es muy rápida.
- Compresión gzip activada.

**Trabajo en equipo y colaboración entre áreas**

- La persona de backend y la de frontend trabajan sobre el mismo entorno. Compose describe cómo se conectan los servicios, y ese archivo se versiona en Git: cualquier cambio se revisa en un pull request como si fuera código.

**Integración continua (CI)**

- El mismo `Dockerfile` sirve en GitHub Actions: se construye la imagen, se verifica el tipado (el build ejecuta `tsc --noEmit`), y si falla, no se publica.

**Salud y diagnóstico**

- Los servicios tienen `healthcheck`: `docker compose ps` indica si están sanos. La base de datos hace que otros servicios esperen a que esté lista antes de arrancar.

**Escalabilidad futura**

- Si el evento crece, es posible ejecutar varias réplicas del contenedor detrás de un balanceador sin cambiar la aplicación.

---

## 5. Costos y límites (lo que Docker no resuelve)

Conviene saberlo para no esperar de más:

- **Hay que instalar Docker Desktop** (en Windows usa WSL 2; consume RAM y disco). Es el único requisito.
- **Curva de aprendizaje.** Mientras se aprende, depurar dentro de contenedores es un paso extra. Para trabajar en la interfaz día a día, puedes seguir usando `npm run dev --prefix frontend` (con recarga instantánea); Docker es para **integrar, probar el resultado final y desplegar**.
- **Reconstruir tarda.** Cada cambio de código requiere `docker compose up -d --build` para verse en el contenedor (por eso no se sustituye el modo desarrollo).
- **No arregla la lógica.** Docker no conecta la base de datos por sí solo: da el lugar donde vive. Falta escribir la API (sección 8).
- **Los datos no son magia.** Un contenedor de base de datos sin volumen pierde todo al borrarse. Aquí hay volumen, pero también hay que hacer copias de seguridad (sección 10).
- **Variables `VITE_*` son públicas y se fijan al compilar.** Cambiarlas exige reconstruir la imagen.
- **No es un backend ni un hosting.** Es el formato en que se empaqueta; todavía hace falta un lugar donde ejecutarlo para publicar el sitio.

---

## 6. Cómo quedó empaquetado el proyecto

### Arquitectura

```text
                         Tu computador (Docker Desktop)
 ┌────────────────────────────────────────────────────────────────────┐
 │                                                                    │
 │  Navegador ──► localhost:8080 ──► [ web ]  nginx + archivos        │
 │                                    estáticos (sitio + /admin)      │
 │                                        │                           │
 │                        (futuro) /api ──┤                           │
 │                                        ▼                           │
 │                                   [ api ]  backend (pendiente)     │
 │                                        │                           │
 │                                        ▼  postgres://db:5432       │
 │  Cliente SQL ─► 127.0.0.1:5432 ─► [ db ]  PostgreSQL 17            │
 │                                        │                           │
 │                                        ▼                           │
 │                                 volumen «db-data»                  │
 └────────────────────────────────────────────────────────────────────┘
```

- `web`: existe y funciona hoy.
- `db`: existe y funciona hoy (perfil `db`), todavía sin nadie que la use.
- `api`: **pendiente**; está comentada en `docker-compose.yml` con la forma que debería tener.

### Archivos añadidos

| Archivo              | Para qué sirve                                                                       |
| -------------------- | ------------------------------------------------------------------------------------ |
| `Dockerfile`         | Receta de la imagen web en tres etapas: `deps` → `build` → `production`              |
| `.dockerignore`      | Lo que no entra a la imagen (node_modules, .git, .env, docs…)                        |
| `docker/nginx.conf`  | nginx: fallback de SPA (`/admin`), caché, gzip, cabeceras, y bloque `/api` comentado |
| `docker-compose.yml` | Servicios `web` y `db` (y `api` comentado), puertos, volumen y healthchecks          |
| `.env.example`       | Plantilla de variables (puerto, credenciales de la base, `VITE_*`)                   |
| `db/init/`           | Aquí van los `.sql` que crean las tablas la primera vez que nace la base             |
| `docs/DOCKER.md`     | Este documento                                                                       |

### Por qué el contexto de build es la raíz

`frontend/` no es autosuficiente: compila código de `admin/` y `shared/`. Si el contexto fuera solo `frontend/`, Docker no vería esas carpetas y el build fallaría. Por eso el `Dockerfile` está en la raíz y copia las tres carpetas conservando su disposición relativa.

### Las tres etapas del Dockerfile

1. **`deps`** (Node 22 Alpine): copia solo `package.json` y `package-lock.json` y ejecuta `npm ci`. Es la capa más costosa y se reutiliza mientras no cambien las dependencias.
2. **`build`**: añade el código y ejecuta `npm run build` (comprobación de TypeScript + Vite). Si hay un error de tipos, **la imagen no se construye**, igual que pasa hoy con `npm run build`.
3. **`production`** (nginx 1.28 sin root): recibe solo la carpeta `dist/`. Node y `node_modules` se descartan, no llegan a la imagen final.

---

## 7. Uso diario

Requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y abierto (verifica con `docker --version`).

### Solo el sitio

```bash
docker compose up -d --build
```

Abre <http://localhost:8080> (sitio) y <http://localhost:8080/admin> (panel).

### Sitio + base de datos

```bash
docker compose --profile db up -d --build
```

### Comandos útiles

| Quiero…                               | Comando                                           |
| ------------------------------------- | ------------------------------------------------- |
| Ver qué está corriendo y si está sano | `docker compose ps`                               |
| Ver los registros (logs)              | `docker compose logs -f web`                      |
| Apagar todo (los datos se conservan)  | `docker compose down`                             |
| Apagar y **borrar la base de datos**  | `docker compose down -v`                          |
| Reconstruir tras cambiar código       | `docker compose up -d --build`                    |
| Reconstruir desde cero, sin caché     | `docker compose build --no-cache web`             |
| Entrar a la consola de PostgreSQL     | `docker compose exec db psql -U perija -d perija` |
| Cambiar el puerto del sitio           | Pon `WEB_PORT=9090` en `.env`                     |

### Configuración local

```bash
cp .env.example .env
```

(En PowerShell: `Copy-Item .env.example .env`.) No es obligatorio: todo tiene valores por defecto. El archivo `.env` está en `.gitignore` y nunca se sube a Git.

---

## 8. Conectar la base de datos (guía para quien la implemente)

### Idea clave

**El navegador nunca debe hablar directamente con la base de datos.** Si lo hiciera, la contraseña de la base viajaría en el JavaScript público y cualquiera podría leerla. La forma correcta es:

```text
Navegador  ──HTTP──►  API (backend)  ──SQL──►  PostgreSQL
```

La API valida, aplica reglas (cupos, pagos, aprobaciones) y es la única que conoce las credenciales.

### Estado actual

- No hay backend: `backend/` está vacío.
- Los datos de reservas se guardan en `localStorage` con la clave `perija.reservas.v1`.
- El proyecto **ya está preparado** para el cambio: toda la interfaz habla con un único punto de contacto.

### Dónde está la «costura» del sistema

| Archivo                                    | Qué hace hoy                                                                                                                             | Qué hacer al conectar la API                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/reservas/servicios/reservasApi.ts` | Único punto de contacto entre la interfaz y los datos de reservas. Hoy trabaja sobre el repositorio local y devuelve siempre un `Result` | Cada función (`crearReserva`, aprobar/rechazar pagos, cupos…) debe llamar a su endpoint y conservar el tipo `Result` para que la interfaz no cambie |
| `shared/reservas/servicios/repositorio.ts` | Lee/escribe en `localStorage` y avisa a otras pestañas                                                                                   | Sustituirlo por uno que lea de la API (o dejar de usarlo si todo pasa por `reservasApi`)                                                            |
| `shared/reservas/tipos.ts`                 | Modelo único de una reserva: `Registration`, `Payment`, `Person`, `Companion`…                                                           | Es el **contrato**: úsalo para diseñar las tablas y los cuerpos JSON                                                                                |
| `admin/src/services/auth.ts`               | Acceso simulado al panel (acepta cualquier correo con formato válido)                                                                    | `iniciarSesion` debe llamar a `POST /auth/login`, rechazar credenciales incorrectas y guardar el token                                              |
| `frontend/.env.example` → `VITE_API_URL`   | Dirección de la futura API                                                                                                               | Apuntar a la API real                                                                                                                               |

> Nota: los comentarios del código mencionan `docs/INTEGRACION-BACKEND.md`, que ya no existe en el repositorio. Esta sección ocupa su lugar.

### Pasos recomendados

1. **Levantar la base**

   ```bash
   docker compose --profile db up -d
   docker compose ps          # db debe aparecer como «healthy»
   ```

2. **Diseñar el esquema a partir de `tipos.ts`.** Entidades que ya se desprenden del modelo: reservas (con el titular), acompañante, pagos (cada uno con su revisión `Por revisar | Aprobado | Rechazado`), configuración de cupos (60 al inicio, hasta 70) y contadores de códigos (`PER-0001`, `PAG-0001`).

3. **Crear las tablas automáticamente.** Guarda los scripts en `db/init/`, por ejemplo `db/init/001_esquema.sql`. Se ejecutan **una sola vez, al crear la base por primera vez**, en orden alfabético. Si ya existe el volumen y quieres rehacerlos:

   ```bash
   docker compose down -v
   docker compose --profile db up -d
   ```

   Para cambios posteriores, usa migraciones (herramienta de tu ORM) en lugar de editar `db/init/`.

4. **Crear la API en `backend/`** (Node, el mismo lenguaje del proyecto, es lo más natural; pero la decisión es del equipo). Debe:
   - leer `DATABASE_URL` del entorno,
   - exponer los endpoints que reemplazan a `reservasApi.ts` y `auth.ts`,
   - **volver a validar todo en el servidor** (las validaciones de `shared/reservas/utils/validaciones.ts` se pueden reutilizar),
   - atender el requisito de negocio: **un pago solo se aprueba desde el panel**, tras verificar el dinero en Bre-B; no hay comprobantes ni cuentas de ejemplo.

5. **Dockerizar la API.** Añadir `backend/Dockerfile` y descomentar el servicio `api` en `docker-compose.yml`. Dentro de la red de Docker la base se llama **`db`**, no `localhost`:

   ```text
   DATABASE_URL=postgres://perija:perija_dev@db:5432/perija
   ```

6. **Exponer la API al navegador.** Dos opciones:
   - _Recomendada:_ descomentar el bloque `location /api/` de `docker/nginx.conf`. El navegador llama a `/api/...` en el mismo origen del sitio (sin CORS) y se pone `VITE_API_URL=/api`.
   - _Alternativa:_ publicar el puerto 3000 de la API y dejar `VITE_API_URL=http://localhost:3000` (hay que configurar CORS en la API).

   Tras cambiar `VITE_API_URL`: `docker compose build web`.

7. **Migrar la interfaz.** Cambiar `reservasApi.ts` y `auth.ts` para que llamen a la API. Como todo pasa por ellos, ninguna página debería necesitar cambios.

### Conectar con un cliente SQL (DBeaver, TablePlus, psql…)

Desde tu computador (no desde otro contenedor):

| Campo      | Valor                                    |
| ---------- | ---------------------------------------- |
| Host       | `127.0.0.1`                              |
| Puerto     | `5432` (o `DB_PORT`)                     |
| Base       | `perija`                                 |
| Usuario    | `perija`                                 |
| Contraseña | `perija_dev` (o la que pongas en `.env`) |

### ¿Y si el equipo prefiere otra base de datos?

El servicio `db` es **PostgreSQL 17** por ser una opción sólida y habitual para datos relacionales como reservas y pagos, pero es una decisión del equipo. Para usar otra (MySQL, MariaDB, SQL Server…), cambia `image`, las variables de entorno, el puerto y la ruta del volumen en el servicio `db`; el resto de la estructura se mantiene. Si el equipo prefiere un servicio gestionado (por ejemplo Supabase), basta con quitar el servicio `db` y poner la `DATABASE_URL` del servicio en la API.

---

## 9. Variables, secretos y seguridad

| Variable                                              | Dónde se usa                     | ¿Pública?       | Nota                                                            |
| ----------------------------------------------------- | -------------------------------- | --------------- | --------------------------------------------------------------- |
| `VITE_API_URL`                                        | Se incrusta en el JS al compilar | **Sí**          | Cambiarla exige reconstruir la imagen                           |
| `VITE_CLOUDINARY_CLOUD_NAME`                          | Idem                             | **Sí**          | Es el nombre de la nube, no un secreto                          |
| `WEB_PORT`                                            | Compose                          | No aplica       | Puerto local del sitio                                          |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Contenedor `db`                  | **No: secreto** | Valores de desarrollo. En producción, contraseña propia y larga |
| `DB_PORT`                                             | Compose                          | No aplica       | Puerto local de la base                                         |

Reglas:

- **Nunca** pongas secretos en variables `VITE_*`: terminan en el JavaScript que descarga cualquiera.
- `.env` está ignorado por Git y por Docker (`.gitignore` y `.dockerignore`). Solo `.env.example` se versiona.
- La contraseña `perija_dev` es solo para desarrollo local. **No uses estos valores por defecto en un servidor público.**
- El puerto de la base se publica únicamente en `127.0.0.1`. No lo cambies a `0.0.0.0` ni lo abras en el firewall.
- Las reservas contienen datos personales y de salud (documento, EPS, alergias, contacto de emergencia). Cuando se almacenen en la base, aplican las obligaciones de protección de datos personales (en Colombia, la Ley 1581 de 2012): acceso restringido, copias seguras y conexión cifrada en producción.

---

## 10. Datos persistentes y copias de seguridad

Los datos de PostgreSQL viven en el volumen `db-data`, **fuera** del contenedor:

| Acción                                           | ¿Se pierden los datos? |
| ------------------------------------------------ | ---------------------- |
| `docker compose down`                            | No                     |
| `docker compose up -d --build` (reconstruir)     | No                     |
| Reiniciar el computador                          | No                     |
| `docker compose down -v`                         | **Sí**                 |
| Desinstalar Docker Desktop o «limpiar volúmenes» | **Sí**                 |

Copia de seguridad y restauración:

```bash
docker compose exec -T db pg_dump -U perija perija > respaldo.sql
```

```bash
docker compose exec -T db psql -U perija -d perija < respaldo.sql
```

(En PowerShell, la redirección `<` no funciona igual: usa `Get-Content respaldo.sql | docker compose exec -T db psql -U perija -d perija`.)

No subas respaldos a Git: contienen datos personales.

---

## 11. Problemas frecuentes

**`Cannot connect to the Docker daemon` / `error during connect`**
Docker Desktop no está abierto. Ábrelo y espera a que diga «Engine running».

**`port is already allocated` / `bind: address already in use`**
Otro programa usa el puerto. Cambia `WEB_PORT` o `DB_PORT` en `.env` (por ejemplo `5433` si ya tienes PostgreSQL instalado en Windows).

**El sitio carga, pero al recargar `/admin` da 404**
No debería pasar con esta configuración (nginx entrega `index.html`). Si ocurre, comprueba que `docker/nginx.conf` no fue modificado y reconstruye con `--no-cache`.

**Cambié el código y no veo el cambio**
El contenedor sirve lo compilado al construir la imagen: ejecuta `docker compose up -d --build`. Para ver cambios al instante mientras desarrollas la interfaz, usa `npm run dev --prefix frontend`. Si el navegador sigue mostrando lo anterior, haz recarga forzada (`Ctrl + Shift + R`).

**Los scripts de `db/init/` no se ejecutaron**
Solo corren al crear la base por primera vez. Si el volumen ya existía: `docker compose down -v` y vuelve a levantar (¡borra los datos!).

**La base está `unhealthy` o no arranca tras cambiar de versión de PostgreSQL**
El volumen guarda datos de la versión anterior y la nueva no los abre. En desarrollo: `docker compose down -v`. En producción: migrar con `pg_dump`/`pg_restore`.

**Error de tipos al construir (`tsc`)**
Es intencionado: el build falla igual que `npm run build`. Corrige el error indicado.

**Archivos con finales de línea de Windows (CRLF) rompen scripts `.sh`**
`.gitattributes` fuerza LF para `.sh`, `.sql`, `.yml`, `.conf` y `Dockerfile`. Si un archivo ya se había clonado antes, vuelve a clonar o ejecuta `git add --renormalize .`.

**La app dentro del contenedor no puede alcanzar la base en `localhost`**
Dentro de un contenedor, `localhost` es **el propio contenedor**. Usa el nombre del servicio: `db`.

---

## 12. Glosario

- **Imagen:** paquete inmutable con la aplicación y su entorno.
- **Contenedor:** instancia en ejecución de una imagen.
- **Dockerfile:** receta para construir una imagen.
- **Multi-stage build:** build en varias etapas; solo la última llega a la imagen final.
- **Capa:** cada instrucción del Dockerfile crea una; Docker las cachea.
- **Docker Compose:** herramienta para definir y levantar varios contenedores con un archivo YAML.
- **Perfil (`profiles`):** permite que un servicio solo arranque si se pide (`--profile db`).
- **Volumen:** almacenamiento persistente administrado por Docker.
- **Healthcheck:** prueba periódica que indica si el servicio está sano.
- **SPA (Single Page Application):** aplicación de una sola página; el navegador carga `index.html` y React gestiona las rutas.
- **Reverse proxy:** servidor (aquí nginx) que recibe peticiones y las reenvía a otro (la API).
- **CORS:** regla del navegador que limita llamadas entre orígenes distintos.

---

## 13. Próximos pasos posibles

- Crear el esquema SQL en `db/init/` y el backend en `backend/` (sección 8).
- Añadir un servicio de desarrollo con recarga instantánea (Vite dentro de Docker). En Windows requiere activar _polling_ en Vite porque los cambios de archivos no cruzan al contenedor.
- Publicar la imagen en un registro (GitHub Container Registry o Docker Hub) con una Action de GitHub que construya en cada pull request.
- Añadir HTTPS (por ejemplo con Caddy o Traefik delante, o el que ofrezca el hosting).
- Añadir una política de seguridad de contenido (CSP) en nginx, una vez se conozcan todos los orígenes externos (Cloudinary, banderas de flagcdn, etc.).
- Automatizar copias de seguridad de la base y probar la restauración.
