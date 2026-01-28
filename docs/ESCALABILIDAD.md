-Escalabilidad

-Contexto
El sistema debe escalar a cientos de formularios sin mantenimiento manual.

-Arquitectura propuesta
Pipeline:
XML > Parsing > Modelo intermedio > Code generation > Validación

-Modelo intermedio
Se define un modelo neutral que representa:
- formularios
- secciones
- campos
- validaciones
- disparadores

por ejemplo json aplicado al modelo utilizado en el programa
{
  "form": "AUTOMOTOR",
  "blocks": [
    {
      "name": "DATOS",
      "items": [
        { "name": "DOMINIO", "type": "string", "required": true },
        { "name": "COLOR", "type": "string" }
      ]
    }
  ],
  "triggers": ["WHEN-VALIDATE-ITEM"]
}

es muy importante la utilización de métricas para ver cuantos pasan, cuantos fallan y el tiempo que tardan, los recursos que utiliza. 

Creo que con inteligencia artifical se podría hacer algo muy interesante con esto.