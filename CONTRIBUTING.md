# Contributing to Aura Lab Sl

¡Gracias por querer contribuir a Aura Lab Sl! Este es un laboratorio educativo
de dinámica no lineal y teoría del caos. Cualquier ayuda para hacerlo más
riguroso, rápido o accesible es bienvenida.

## Convenciones

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`, `ci:`).
- **Lenguaje de código**: comentarios y código en inglés; textos de la interfaz
  y contenidos pedagógicos en español (i18n ES/EN planificado).
- **Tipado**: el proyecto usa TypeScript estricto. No uses `any` salvo casos
  justificados.

## Comandos

```bash
npm run dev            # servidor de desarrollo
npm run build          # build de producción a docs/
npm run typecheck      # TypeScript estricto (sin emitir)
npm run lint           # ESLint
npm run format         # Prettier
npm run test           # Vitest (núcleo matemático)
```

## Antes de enviar un PR

1. `npm run typecheck` sin errores.
2. `npm run lint` sin errores.
3. `npm run format` aplicado.
4. `npm run test` en verde (los tests matemáticos nuevos si cambiaste modelos).
5. Si cambiaste fórmulas o modelos matemáticos, documenta la fuente o
   derivación en el ADR correspondiente (`adr/`).

## Estructura

```
src/
├── core/        # AppState, eventos, utilidades
├── math/        # modelos matemáticos y motores de cómputo
├── components/  # renderizadores de canvas (2D/3D) y paneles UI
├── audio/       # sonificación (Web Audio API)
└── main.ts      # orquestador
```

Consulta `docs/adr/` y `CONTEXTO.md` para el contexto arquitectónico.
