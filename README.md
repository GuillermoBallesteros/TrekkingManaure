# Trekking Desafío Perijá 13K

Primer esqueleto visual basado en `diseno.html`: página pública y administración con React, TypeScript y Vite. Conserva la identidad verde profundo, dorado, rojo y naranja del diseño adjunto.

## Organización

- `frontend/`: navegación, secciones públicas, galería y formulario de reserva de prueba.
- `admin/`: acceso visual, resumen, participantes, revisión de pagos, cupos, galería y exportación de muestra.
- `shared/`: recursos compartidos por ambas aplicaciones: configuración del evento, imágenes existentes, fuentes locales, colores, iconos y diálogos.
- `backend/`: estructura de la futura API, conservada sin implementar integraciones.
- `docs/ESTRUCTURA.md`: mapa de componentes, decisiones y continuación del desarrollo.

El código fuente está formateado en varias líneas. No se incrusta el archivo HTML completo ni se ejecuta su script original.

## Ejecutar el proyecto

Se requiere Node.js y npm. Desde la raíz, instala las dependencias de cada aplicación:

```powershell
npm.cmd install --prefix frontend
npm.cmd install --prefix admin
```

Abre dos terminales y ejecuta cada comando por separado:

```powershell
npm.cmd run dev --prefix frontend
```

```powershell
npm.cmd run dev --prefix admin
```

- Sitio público: http://localhost:5173/
- Acceso administrativo: http://localhost:5174/
- Vista general de ejemplo: http://localhost:5174/#/resumen

Se puede configurar `VITE_ADMIN_URL` en frontend y `VITE_PUBLIC_URL` en admin para cambiar los enlaces entre aplicaciones.

## Comprobar y dar formato

```powershell
npm.cmd run build --prefix frontend
npm.cmd run build --prefix admin
npm.cmd run format:check --prefix frontend
```

Para aplicar el formato a ambas aplicaciones, a `shared/` y a la documentación:

```powershell
npm.cmd run format --prefix frontend
```

La configuración de Prettier está en `.prettierrc.json`. Los builds incluyen la comprobación de TypeScript.

## Alcance de esta entrega

El formulario permite elegir estadía, acompañante, actividades y fecha de pago, validar un comprobante local y revisar un resumen. No envía datos, archivos ni pagos. El calendario se habilita con un archivo JPG, PNG o PDF válido de hasta 5 MB.

El panel usa seis participantes ficticios. Sus acciones solo cambian la demostración en memoria y se reinician al recargar. La autenticación, los comprobantes reales, WhatsApp, la persistencia y la exportación .xlsx se conectarán en una etapa posterior. La descarga actual es una muestra CSV compatible con Excel.

La configuración de referencia está en `shared/config/index.ts`. Las fotografías generales se añaden a `shared/assets/images/galeria/`; las dos aplicaciones usan el mismo catálogo. Se conservaron el afiche y los diez logos ya existentes.
