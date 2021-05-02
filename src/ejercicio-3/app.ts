import * as fs from 'fs';
import * as yargs from 'yargs';
import {spawn} from 'child_process';
import {access, constants} from 'fs';


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

// node dist/ejercicio-3/app.js look --usuario=eduardo --ruta=prueba
yargs.parse();
