# Solución de la Prueba Técnica

Este repositorio contiene la solución a la prueba técnica planteada, desarrollada utilizando **Node.js** para el backend y **React** para el frontend.

## Pasos para ejecutar el proyecto localmente

### 1. Clonar el repositorio

Primero, clona este repositorio en tu máquina local utilizando el siguiente comando:
```
git clone https://github.com/danielDj24/technical_test_js.git
```

### 2. correr el proyecto frontend
```
    1. Dirígete a la carpeta del backend:
        cd backend

    2. Instala los módulos de Node.js necesarios con el siguiente comando:
        npm install 

    3. Crea un archivo .env en el directorio raíz del backend y añade las siguientes variables de entorno:
        MONGO_URI={url_de_mongo_en_el_archivo_del_ejercicio}
        PORT=5000

    4. Inicia el proyecto usando nodemon para que los cambios se actualicen automáticamente:
        nodemon index.js
```
### 3. correr el proyecto frontend
```
    1. Dirígete a la technical-test:
        cd ../technical-test

    2. Instala los módulos de React necesarios con el siguiente comando:
        npm install 

    3. Crea un archivo .env en el directorio raíz del frontend y añade las siguientes variables de entorno:
        REACT_APP_API_URL=http://{ip_local}:5000

    Sustituye {ip_local} con la dirección IP de tu máquina local o el dominio correspondiente al backend.

    4. Inicia el proyecto:
        npm start
```
### Justificación de Elecciones Técnicas
Opté por utilizar JavaScript, ya que es un lenguaje con el que me siento más cómodo y ágil. Dado que no contaba con mucho tiempo, tomé esta decisión para asegurarme de realizar una entrega eficiente, funcional y bien estructurada, sin comprometer la calidad del proyecto.

### Estructura del Proyecto
La estructura del backend la diseñé basándome en la forma en que desarrollo proyectos con frameworks como Django y Laravel, que son los que más utilizo. Esta elección me permitió trabajar de manera más ágil y organizada. En cuanto al frontend, utilicé componentes para garantizar que los elementos se rendericen de manera eficiente, ya sea globalmente o en rutas o secciones específicas. Esto mejora la carga y el rendimiento general del sitio
