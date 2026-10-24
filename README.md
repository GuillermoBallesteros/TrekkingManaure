# Trekking Desafío Perijá 13K
Esqueleto inicial; secciones con títulos, sin funcionalidades ni integraciones.
- frontend/: sitio público con Vite, React y TypeScript.
- admin/: aplicación administrativa independiente con la misma base.
- backend/: estructura para Node.js, Express y TypeScript; sin servidor.
- docs/: reglas, almacenamiento y decisiones pendientes.
Desde cada carpeta, ejecutar los comandos por separado:
- Frontend: cd frontend → npm.cmd install → npm.cmd run dev (puerto 5173).
- Admin: cd admin → npm.cmd install → npm.cmd run dev (puerto 5174).
- Backend: cd backend → npm.cmd install → npm.cmd run dev.
Backend dev solo observa tipos; no inicia una API porque aún no existe.
Las apps admiten npm.cmd run build y npm.cmd run typecheck.
Backend admite npm.cmd run typecheck. Configuración del evento: frontend/src/config/.
