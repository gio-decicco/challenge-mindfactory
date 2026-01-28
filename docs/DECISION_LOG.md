En cuanto a la escalabilidad de este proyecto, opté por utilizar el patrón DDD Light mencionado en el challenge, me pareció interesante y me gusta esa forma de trabajar orientado a features. Me parece que quedan separadas las responsabilidades y no quedan services tan grandes, a la vez tampoco quedan tantas capas como puede ser quizas en un proyecto .NET con Clean Architecture.

Yendo hacia el front. Decidí apostar por algo parecido, que es lo que hacíamos nosotros en mi trabajo anterior. Hay dos apartados a mencionar en ese caso.
El primer apartado es la utilizacion de NgRx, un paquete utilizado para aplicar el manejo de estados a angular, cosa que React trae de un principio. Decidí utilizarlo solamente para lo más complejo, ya que es algo engorroso para proyectos pequeños pero para cuando las cosas se ponen serias es bueno tenerlo en cuenta.
Como se puede observar en el apartado de sujetos del front decidí no usarlo para mostrar que lo sé hacer de una manera más simple también.

Microdecisiones también fueron colocar los validadores en pipes en el back, para evitar el exceso de código en el service.

En el service de automotores opté por separar bien los métodos para dejar el código legible y en muchos pasos simples.

Tomé la decision de usar reactive forms en el front en vez de lo que solía usar yo en mi anterior trabajo que era NgRx-forms, simplemente por velocidad y simplicidad. Tengo entendido que ngrx forms es una tecnología medio atrasada.

Colocar modales de confirmación siempre me parece importante, al igual que los validadores asíncronos bien implementados.

Decidí usar primeng en el front por la facilidad y los componentes útiles que ofrece. Buena estética y funcionalidad, fácil de implementar.

Al crear el docker compose corre la última migración el backend hacia la base de datos para mantenerla actualizada. También genera un volumen para no perder los datos al detener el contenedor. Agregué un script con unos datos mínimos que se puede ejecutar con un comando.

Agregué swagger porque me gusta mucho utilizarlo para probar y documentar apis. Al correr el contenedor está accesible.