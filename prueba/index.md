# Práctica 9. Sistema de ficheros y creación de procesos en Node.js

### Ejercicio 1

La traza del ejercicio se encuentra en el propio fichero de código fuente.
[Ejercicio-1](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-eduardoreyes99/blob/main/src/ejercicio-1.ts)
- ¿Qué hace la función access? 
  La función access comprueba los permisos de accesos que tienen un usuario para acceder a una ruta que se le especifica como argumento.
- ¿Para qué sirve el objeto constants?
  El objeto constants es un argumento opcional de la función access, si no se especifica ninguno se establece constants.F_OK por defecto, está opción comprueba si el fichero o directorio existe pero también existe constants.R_OK para lectura y constants.W_OK para escritura. 
### Ejercicio 2

Para la realización de este ejercicio he desarrollado dos funciones, una que realice la tarea utilizando el método pipe y otra sin este método. Por útlimo mediante el uso de yargs he configurado un comando que pida las opciones correspondientes y se encargue de llamar a la función correcta.
- Función con pipe: en esta función se utiliza acces para comprobar la existencia del fichero, y posteriormente utilizamos **spawn** para poder utilizar el comando **wc**, mediante la utilización del método **pipe** podemos redirigir la salida a través del comando **echo** y de esta forma mostrarlo por pantalla.
  ```
  function funcionConPipe(ruta: string, caracteres: boolean,
    palabras: boolean, lineas: boolean): void {
    access(ruta, constants.F_OK, (err) => {
      console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
      if (err) {
        process.exit(-1);
      } else {
        const wc = spawn('wc', [ruta]);

        let output = '';
        wc.stdout.on('data', (chunk) => (output += chunk));

        wc.on('close', () => {
          const parts = output.split(/\s+/);
          if (caracteres) {
            const echo = spawn('echo', [`Líneas: ${parseInt(parts[1])+1}`]);
            echo.stdout.pipe(process.stdout);
          }
          if (palabras) {
            const echo = spawn('echo', [`Palabras: ${parts[2]}`]);
            echo.stdout.pipe(process.stdout);
          }
          if (lineas) {
            const echo = spawn('echo', [`Caracteres: ${parts[3]}`]);
            echo.stdout.pipe(process.stdout);
          }
        });
      }
    });
  }
  ```

- Función sin pipe: en esta función como no se usará el método pipe utilizaremos la función **string.split()** para poder modificar la salida del comando **wc** y modificarla de la forma que queramos imprimiendola usando un **console.log()**
  ```
  function funcionSinPipe(ruta: string, caracteres: boolean,
    palabras: boolean, lineas: boolean): void {
    access(ruta, constants.F_OK, (err) => {
      console.log(`${ruta} ${err ? 'no exist' : 'existe'}`);
      if (err) {
        process.exit(-1);
      } else {
        const wc = spawn('wc', [ruta]);
        let output = '';

        wc.stdout.on('data', (chunk) => (output += chunk));

        wc.on('close', () => {
          const parts = output.split(/\s+/);
          let final = '';
          if (caracteres) {
            final+= `Líneas: ${parseInt(parts[1])+1}\n`;
          }
          if (palabras) {
            final+= `Palabras: ${parts[2]}\n`;
          }
          if (lineas) {
            final+= `Caracteres: ${parts[3]}\n`;
          }
          console.log(final);
        });
      }
    });
  }
  ```

- Comando yargs:
  ```
  yargs.command({
    command: 'info',
    describe: 'Muestra la información de un fichero',
    builder: {
      fichero: {
        describe: 'Ruta del fichero',
        demandOption: true,
        type: 'string',
      },
      pipe: {
        describe: 'Uso del método pipe',
        demandOption: true,
        type: 'boolean',
      },
      caracteres: {
        describe: 'Contar caracteres o no',
        demandOption: true,
        type: 'boolean',
      },
      palabras: {
        describe: 'Contar palabras o no',
        demandOption: true,
        type: 'boolean',
      },
      lineas: {
        describe: 'Contar líneas o no',
        demandOption: true,
        type: 'boolean',
      },
    },
    handler(argv) {
      if (typeof argv.fichero === 'string' && typeof argv.pipe === 'boolean'&&
      typeof argv.caracteres === 'boolean' && typeof argv.palabras === 'boolean'&&
      typeof argv.lineas === 'boolean') {
        if (argv.pipe) {
          funcionConPipe(argv.fichero, argv.caracteres, argv.palabras, argv.lineas);
        } else {
          funcionSinPipe(argv.fichero, argv.caracteres, argv.palabras, argv.lineas);
        }
      }
    },
  });
  ```


### Ejercicio 3

Para este ejercicio he decidido crear dos funciones, **observar()** y **mostrarFichero()**, además de un comando utilizando **yargs**
- function observar(): en primer lugar en esta función se comprueba con **fs.acess** que existe la ruta que se introduce, a continuación se mira con **fs.open** si es un fichero o un directorio, ya que en este caso nos interesa que sea un directorio, el siguiente paso es utilizar **fs.readdir** para ver si podemos leer el contenido del directorio y por último utilizaremos **fs.watch** para observar los cambios que ocurran en el directorio, cabe destacar que dentro de este watch he introducido otro readdir para poder controlar si se está creando o eliminando un fichero.
  ```
  function observar(usuario: string, ruta: string) {
    const rutapersonal: string = ruta + '/' + usuario;
    access(ruta, constants.F_OK, (err) => {
      console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
      if (err) {
        process.exit(-1);
      } else {
        fs.open(rutapersonal, constants.O_DIRECTORY, (err) => {
          if (err) {
            console.log(`${rutapersonal} es un fichero`);
          } else {
            console.log(`${rutapersonal} es un directorio`);
            fs.readdir(rutapersonal, (err, ficheros) => {
              if (err) {
                console.log('No se ha podido leer el contenido del directorio');
              } else {
                fs.watch(rutapersonal, (eventType, filename) => {
                  const rutaarchivo: string = rutapersonal + '/' + filename;
                  fs.readdir(rutapersonal, (err, ficheros2) => {
                    if (err) {
                      console.log('Ha habido un problema al leer el directorio');
                    } else {
                      if (eventType == 'rename') {
                        if (ficheros.length < ficheros2.length) {
                          console.log(`Se ha creado el fichero ${filename}`);
                          mostrarFichero(rutaarchivo);
                        } else {
                          console.log(`Se ha eliminado el fichero ${filename}`);
                        }
                      } else if (eventType == 'change') {
                        console.log(`Se ha modificado el fichero ${filename}`);
                        console.log(`${filename} tiene el contenido: `);
                        mostrarFichero(rutaarchivo);
                      }
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  }
  ```
  
- function mostrarFichero(): esta función es la misma que se utilizará en el ejercicio 4, basicamente comprueba si existe la ruta especificada y mira si es un fichero o directorio en caso de que sea un fichero utilizando **spawn** y el comando **cat** muestra por pantalla el contenido del archivo.
  ```
  function mostrarFichero(ruta: string) {
    access(ruta, constants.F_OK, (err) => {
      console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
      if (err) {
        process.exit(-1);
      } else {
        fs.open(ruta, fs.constants.O_DIRECTORY, (err) => {
          if (!err) {
            console.log(`${ruta} es un directorio, no un fichero`);
          } else {
            const cat = spawn('cat', [ruta]);
            let output = '';
            cat.stdout.on('data', (chunk) => (output += chunk));
            cat.on('close', () => {
              console.log(output);
            });
          }
        });
      }
    });
  }
  ```
- Comando yargs:
  ```
  yargs.command( {
    command: 'look',
    describe: 'Observar los cambios realizados en un directorio',
    builder: {
      usuario: {
        describe: 'Usuario que queremos ver',
        demandOption: true,
        type: 'string',
      },
      ruta: {
        describe: 'Directorio que se quiere observar',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.usuario === "string" && typeof argv.ruta === "string") {
        observar(argv.usuario, argv.ruta);
      }
    },
  });
  ```

### Ejercicio 4

para la realización de este ejercicio he decidido crear una función para cada apartado del ejercicio, ficheroDirectorio, mostrarFichero, crearDirectorio, listarDirectorio, eliminar y move, además he configurado 6 comandos diferentes que están asociados a una función de las anteriormente citadas. Para conseguir desarrollar todas las funcionalidades he utilizado tanto funciones de **fs**(access, open, mkdir) como comandos de **spawn** (cp, ls, cat, rm)
[Ejercicio-4](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-eduardoreyes99/blob/main/src/ejercicio-4.ts)
### Conclusión

En esta práctica se ha seguido utilizando los comandos de yargs y además se ha porfundizado en los conocimientos sobre el sistema de ficheros y la creación de procesos en Node.js.
### Bibliografía

[Guión de la Práctica](https://ull-esit-inf-dsi-2021.github.io/prct09-async-fs-process/)

[Apuntes Node.js](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/)

[FS Documentation](https://nodejs.org/api/fs.html#fs_fs_existssync_path)

[Yargs](https://www.npmjs.com/package/yargs)

[Stream](https://nodejs.org/api/stream.html)

[Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)