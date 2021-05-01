import {spawn} from 'child_process';
import * as yargs from 'yargs';
import * as fs from 'fs';
import {access, constants} from 'fs';

/**
 * Función que se encarga de comprobar si una ruta que se le paqsa es un fichero
 * o un directorio
 * @param ruta ruta que se quiere comprobar
 */
function ficheroDirectorio(ruta: string) {
  access(ruta, constants.F_OK, (err) => {
    console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
    if (err) {
      process.exit(-1);
    } else {
      fs.open(ruta, fs.constants.O_DIRECTORY, (err) => {
        if (err) {
          console.log(`${ruta} es un fichero`);
        } else {
          console.log(`${ruta} es un directorio`);
        }
      });
    }
  });
}

/**
 * Función que se encarga de crear un directorio en la ruta especificada
 * @param ruta ruta donde se quiere crear el directorio
 */
function crearDirectorio(ruta: string) {
  access(ruta, constants.F_OK, (err) => {
    if (!err) {
      console.log('No se ha podido crear el directorio porque ya existe');
      process.exit(-1);
    } else {
      fs.mkdir(ruta, (err) => {
        if (err) {
          console.log('No se pudo crear el directorio');
        } else {
          console.log('Directorio creado');
        }
      });
    }
  });
}

/**
 * Función que se encarga de listar el contenido de un directorio
 * @param ruta directorio que se quiere listar
 */
function listarDirectorio(ruta: string) {
  access(ruta, constants.F_OK, (err) => {
    console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
    if (err) {
      process.exit(-1);
    } else {
      const ls = spawn('ls', [ruta]);
      let output = '';
      ls.stdout.on('data', (chunk) => (output += chunk));
      ls.on('close', () => {
        console.log(output);
      });
    }
  });
}

/**
 * Función que se encarga de mostrar el contenido de un fichero
 * @param ruta fichero que se quiere mostrar
 */
function mostrarFichero(ruta: string) {
  access(ruta, constants.F_OK, (err) => {
    console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
    if (err) {
      process.exit(-1);
    } else {
      fs.open(ruta, fs.constants.O_DIRECTORY, (err) => {
        if (!err) {
          console.log(`${ruta} es un directorio, no un fichero`);
          process.exit(-1);
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

/**
 * Función que se encarga de eliminar un fichero o un directorio
 * @param ruta ruta que se quiere eliminar
 */
function eliminar(ruta: string) {
  access(ruta, constants.F_OK, (err) => {
    console.log(`${ruta} ${err ? 'no existe' : 'existe'}`);
    if (err) {
      process.exit(-1);
    } else {
      const rm = spawn('rm', ['-r', ruta]);
      rm.on('close', (err) => {
        if (err) {
          console.log('No se ha podido eliminar el fichero');
        } else {
          console.log('Eliminado correctamente');
        }
      });
    }
  });
}

/**
 * Función que se encarga de copiar un fichero o directorio en otra ruta
 * @param origen ruta de origen
 * @param destino ruta de destino
 */
function move(origen: string, destino: string) {
  access(origen, constants.F_OK, (err) => {
    console.log(`${origen} ${err ? 'no existe' : 'existe'}`);
    if (err) {
      process.exit(-1);
    } else {
      const cp = spawn('cp', ['-r', origen, destino]);
      cp.on('close', (err) => {
        if (err) {
          console.log('No se ha podido mover el directorio');
        } else {
          console.log('Se ha copiado correctamente');
        }
      });
    }
  });
}


/**
 * Comando que lleva a cabo la función ficheroDirectorio
 */
yargs.command( {
  command: 'DoF',
  describe: 'Comprobar si es un directorio o un fichero',
  builder: {
    ruta: {
      describe: 'Ruta que se quiere comprobar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.ruta === "string") {
      ficheroDirectorio(argv.ruta);
    }
  },
});

/**
 * Comando que lleva a cabo la función crearDirectorio
 */
yargs.command( {
  command: 'CD',
  describe: 'Crear un directorio',
  builder: {
    ruta: {
      describe: 'Ruta donde se quiere crear el directorio',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.ruta === "string") {
      crearDirectorio(argv.ruta);
    }
  },
});

/**
 * Comando que lleva a cabo la función listarDirectorio
 */
yargs.command( {
  command: 'LF',
  describe: 'Listar ficheros de un directorio',
  builder: {
    ruta: {
      describe: 'Ruta que se quiere listar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.ruta === "string") {
      listarDirectorio(argv.ruta);
    }
  },
});

/**
 * Comando que lleva a cabo la función mostrarFichero
 */
yargs.command( {
  command: 'MF',
  describe: 'Mostrar contenido de un fichero',
  builder: {
    ruta: {
      describe: 'Fichero que se quiere mostrar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.ruta === "string") {
      mostrarFichero(argv.ruta);
    }
  },
});

/**
 * Comando que lleva a cabo la función eliminar
 */
yargs.command( {
  command: 'RM',
  describe: 'Eliminar un fichero o un directorio',
  builder: {
    ruta: {
      describe: 'Directorio que se quiere eliminar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.ruta === "string") {
      eliminar(argv.ruta);
    }
  },
});

/**
 * Comando que lleva a cabo la función move
 */
yargs.command( {
  command: 'CP',
  describe: 'Mover un directorio o fichero a una ruta especificada ',
  builder: {
    origen: {
      describe: 'Directorio que se quiere eliminar',
      demandOption: true,
      type: 'string',
    },
    destino: {
      describe: 'Directorio que se quiere eliminar',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.origen === "string" && typeof argv.destino === "string") {
      move(argv.origen, argv.destino);
    }
  },
});

yargs.parse();
