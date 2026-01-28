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

### Ejecutar migraciones manualmente (si es necesario)

```bash
docker compose exec api npm run migration:run
```

### Verificar que la API está funcionando

```bash
# Ver todos los automotores
curl http://localhost:3000/automotores

# Ver un automotor específico
curl http://localhost:3000/automotores/ABC123

# Ver documentación Swagger
# Abrir en navegador: http://localhost:3000/api-docs
```

### Acceder a la base de datos directamente

```bash
docker compose exec postgres psql -U mindfactory -d mindfactory_db
```

### Verificar datos en la vista

```bash
docker compose exec postgres psql -U mindfactory -d mindfactory_db -c "SELECT * FROM vw_automotores_con_dueno;"
```
