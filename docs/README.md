# Documentacion del proyecto

Este directorio centraliza la documentacion tecnica y operativa del proyecto.

## Archivos

- `repository/SETUP-GUIDE.md`: guia rapida para configurar el flujo publico/privado.
- `repository/SECURITY.md`: reglas de seguridad y manejo de archivos sensibles.
- `repository/REPO-STRATEGY.md`: estrategia de trabajo entre repositorio publico y privado.

## Estructura recomendada del repositorio

```text
/securenet
  /src                 -> codigo base de la aplicacion (frontend + hooks + utilidades)
  /server              -> servicios Node auxiliares (API de metricas)
  /terraform           -> infraestructura como codigo
  /docker              -> Dockerfiles, gateway y configuracion de contenedores
  /public              -> recursos estaticos
  /docs                -> documentacion tecnica y de operacion
    /repository        -> estrategia, setup y seguridad del repositorio
    /architecture      -> diagramas y recursos visuales
  README.md            -> vision general del proyecto
```

## Carpeta para arquitectura

Usa `docs/architecture/` para guardar diagramas, capturas y recursos visuales.
