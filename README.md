# Become a Leader

## Descripción

**Become a Leader** es un juego que simula batallas de Pokémon donde el jugador asume el rol de líder de gimnasio y lucha usando solo un tipo de Pokémon. A medida que el jugador gana batallas, acumula puntos. Si pierde, su puntaje se guarda en una tabla de clasificación. ¡Demuestra que eres el mejor!

## Tecnologías

Este proyecto está construido utilizando las siguientes tecnologías:

- **Angular 18**: Framework para la construcción de la interfaz de usuario.
- **RxJS**: Para manejar operaciones asincrónicas y flujos de datos reactivos.
- **Node.js**: Plataforma de backend para manejar las peticiones.
- **JSON Server**: Para simular un backend y almacenar datos como las partidas y el puntaje.
- **TypeScript**: Lenguaje utilizado para la lógica de la aplicación.

## Requisitos

Antes de comenzar con la instalación y ejecución del proyecto, asegúrate de tener instalados los siguientes programas:

- **Node.js** (última versión estable)
- **JSON Server**: Utilizado para simular una API RESTful.
- **Angular CLI**: La interfaz de línea de comandos para Angular.

## Instalación

Sigue los siguientes pasos para instalar y ejecutar el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/LuchoDMD/Become-a-Leader/tree/rama-usuario

2. **Navega al directorio del proyecto**
3. **Instala las dependencias del proyecto**:
    npm install
4. **Instala JSON Server: Si no tienes instalado JSON Server, instálalo globalmente**:
    npm install -g json-server
5. **Configura el servidor de JSON Server: Asegúrate de tener el archivo db.json en el directorio raíz del proyecto, el cual contiene los datos de las partidas, pokemons y usuarios.**
6. **Inicia el servidor JSON Server**:
    json-server --watch db.json --port 3000
7. **Inicia la aplicación Angular: Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Angular**:
    ng serve
8. **Accede a la aplicación: Abre tu navegador y ve a http://localhost:4200 para ver la aplicación en funcionamiento.**

## Funcionalidad
La aplicación tiene las siguientes funcionalidades clave:

- Crear e iniciar sesión de usuario: Los usuarios pueden registrarse y acceder a su cuenta.
- Manejo de la base de datos de Pokémon como administrador: Los administradores pueden gestionar la lista de Pokémon disponibles para las batallas.
- Crear una partida: Los jugadores pueden elegir un tipo de Pokémon y comenzar una partida.
- Luchar contra entrenadores generados al azar: El jugador se enfrentará a entrenadores con Pokémon de un tipo aleatorio.
- Sistema de puntajes: Cada victoria otorga un punto. El jugador continúa luchando hasta que pierda.
- Guardar el puntaje: Al perder, la partida se elimina y se guarda el puntaje del jugador en la tabla de clasificación.

## Estructura del proyecto
public/
├── # Contiene todos los archivos de imagen para el proyecto
src/
├── app/
│   ├── components/
│   │    ├──add-pokemon         # Agregar Pokemon a la base de datos desde la PokeAPI
│   │    ├──batalla             # Metodos y logica de las batallas
│   │    ├──edit-pokemon        # Editar informacion de un Pokemon en particular
│   │    ├──pokemon-detail      # Detalle de la informacion de un Pokemon
│   │    ├──pokemon-list        # Lista de los Pokemon almacenados en la base de datos
│   │    ├──ranking             # Tabla de puntajes y clasificaciones
│   │    ├──user-account-info   # Manejo de la informacion de la cuenta del usuario
│   ├── interface/              # Estructuras globales de los objetos usados en la aplicacion
│   ├── pages/
│   │    ├──home                # Pagina de inicio de la aplicacion
│   │    ├──login               # Pantalla de inicio de sesion de usuarios
│   │    ├──login-admin         # Pantalla de inicio de sesion para el administrador
│   │    ├──menu                # Menu de juego del usuario
│   │    ├──nueva-partida       # Creacion de una nueva partida para un usuario
│   │    ├──partida             # Mensaje de bienvenida para los jugadores
│   │    ├──register            # Creacion de usuarios
│   │    ├──sobre-nosotros      # Informacion y enlaces de los desarrolladores
│   │    ├──user-profile        # Visualizar detalles de la cuenta del usuario
│   ├── services/               # Servicios para manejar la lógica (usuario, batalla, etc.)
│   ├── app.routes.ts           # Configuracion de rutas del proyecto
├── index.html                  # Página principal de la app
│
db.json
├── # Base de datos del proyecto

## Contacto
    Si tienes preguntas o sugerencias, no dudes en contactarnos:

    Correos: -lucio.mdq21@gmail.com
             -quimeyvarela97@gmail.com
             -tomas.dallier@gmail.com
             -imalaguti05@gmail.com
             -gonzalovarelaalagna@gmail.com
