# Rally Club

Web en español para gestionar campeonatos de rally entre amigos desde un dispositivo. Sin instalación de dependencias, cuentas ni servidor de datos.

## Uso

Con Node.js 20 o posterior, ejecuta `npm start` y abre http://127.0.0.1:4173. Para alojamiento estático, publica el contenido de `dist/` en cualquier servicio HTTPS. El sitio utiliza rutas relativas, compatibles con GitHub Pages.

1. Crea un campeonato con 2–30 pilotos, 1–30 rallys y 1–30 tramos por rally.
2. En «Rallys y tiempos», cambia los nombres de los rallys. Puedes ajustar sus tramos antes de introducir tiempos.
3. Introduce tiempos como `3:24.567` o `204.567` segundos. Se admite coma decimal. Los tiempos válidos se guardan al salir de la casilla.
4. Finaliza cada rally con todos los tiempos completos para repartir 5, 3 y 1 puntos. El resto recibe 0.
5. Consulta la general o reabre un rally para corregirlo. Al reabrir, se retiran sus puntos hasta finalizarlo de nuevo.

Gana cada rally la menor suma. Si hay empate, se comparan los tramos desde el último hacia el primero. Un empate exacto comparte puesto y puntos y salta la posición siguiente (1, 1, 3). En la general, los mismos puntos comparten posición.

## Datos y copias

Los datos se guardan en `localStorage` del navegador y del dominio utilizado. No se sincronizan entre dispositivos ni entre el enlace de Sites y una instalación local. Borrar los datos del navegador elimina el guardado. Usa «Exportar» regularmente para descargar una copia JSON; «Importar» añade copias independientes sin borrar los campeonatos existentes. Los errores de guardado se muestran en pantalla. Los tiempos del campeonato de ejemplo son ficticios.

## Verificación

`npm test` comprueba formatos de tiempo, clasificación, reparto y retirada de puntos, empates, resultados incompletos e importación. El núcleo de reglas está en `dist/rules.js`.

La tipografía de Google Fonts es opcional: si no está disponible, se usan fuentes del sistema.
