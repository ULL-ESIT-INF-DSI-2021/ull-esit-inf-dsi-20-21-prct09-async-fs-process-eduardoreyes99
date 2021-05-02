import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}

/*
TRAZA DE EJECUCIÓN

- Iteración inicial:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 1:
  Pila de llamadas:
    - main
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 2:
  Pila de llamadas:
    - access
    - main
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 3:
  Pila de llamadas:
    - main
  Registro de eventos de la API:
    - access
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 4:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    -
  Cola de manejadores:
    - manejador de access
  Consola:
    -
----------------------------------------------------
  - Iteración 5:
  Pila de llamadas:
    - manejador de access
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 6:
  Pila de llamadas:
    - console.log(`Starting to watch file helloworld.txt `)
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    -
----------------------------------------------------
  - Iteración 7:
  Pila de llamadas:
    - manejador de access
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
  - Iteración 8:
  Pila de llamadas:
    - watch(process.argv[2])
    - manejador de access
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
  - Iteración 9:
  Pila de llamadas:
    - manejador de access
  Registro de eventos de la API:
    - watch(process.argv[2])
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
  - Iteración 10:
  Pila de llamadas:
    - manejador de acess
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
  - Iteración 11:
  Pila de llamadas:
    - watcher.on('change')
    - manejador de access
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
    - Iteración 12:
  Pila de llamadas:
    - manejador de access
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
    - Iteración 13:
  Pila de llamadas:
    - console.log(`File ${filename} is no longer watched`)
    - manejador de access
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
----------------------------------------------------
    - Iteración 14:
  Pila de llamadas:
    - manejador de access
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
----------------------------------------------------
    - Iteración 15:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    - console.log(`File ${filename} has been modified somehow`)
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
----------------------------------------------------
    - Iteración 16:
  Pila de llamadas:
    - console.log(`File ${filename} has been modified somehow`)
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
----------------------------------------------------
    - Iteración 17:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    - watcher.on('change'
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
    - File helloworld.txt has been modified somehow
----------------------------------------------------
    - Iteración 18:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
    - File helloworld.txt has been modified somehow
----------------------------------------------------
    - Iteración 19:
  Pila de llamadas:
    - console.log(`File ${filename} has been modified somehow`)
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
    - File helloworld.txt has been modified somehow
----------------------------------------------------
    - Iteración 20:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    - watcher.on('change')
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
    - File helloworld.txt has been modified somehow
    - File helloworld.txt has been modified somehow
----------------------------------------------------
    - Iteración 21:
  Pila de llamadas:
    -
  Registro de eventos de la API:
    -
  Cola de manejadores:
    -
  Consola:
    - Starting to watch file helloworld.txt
    - File helloworld.txt is no longer watched
    - File helloworld.txt has been modified somehow
    - File helloworld.txt has been modified somehow
----------------------------------------------------
*/
