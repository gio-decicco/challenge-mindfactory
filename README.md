# Challenge MindFactory

## Requisitos

- Docker y Docker Compose instalados

## Comandos

### Levantar el proyecto

```bash
docker compose up -d --build
```

### Ejecutar el seed de datos

```bash
docker compose exec api npm run seed
```

### Ver logs

```bash
docker compose logs -f
```

### Detener el proyecto

```bash
docker compose down
```

### Detener y eliminar volúmenes (limpiar base de datos)

```bash
docker compose down -v
```

# Ver documentación Swagger
# Abrir en navegador: http://localhost:3000/api-docs