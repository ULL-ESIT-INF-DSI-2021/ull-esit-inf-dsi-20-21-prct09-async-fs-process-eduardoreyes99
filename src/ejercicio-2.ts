/* eslint-disable max-len */

import {spawn} from 'child_process';
import * as yargs from 'yargs';
import {access, constants} from 'fs';

/**
 * Función que se encarga de mostrar la información de un fichero utilizando los comandos wc y echo empleando
 * el método pipe para ello
 * @param ruta Ruta del fichero
 * @param caracteres Opción para mostar caracteres del fichero
 * @param palabras Opción para mostar palabras del fichero
 * @param lineas Opción para mostar lineas del fichero
 */
function funcionConPipe(ruta: string, caracteres: boolean,
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

/**
 * Función que se encarga de mostrar la información de un fichero mediante el uso del comando wc
 * @param ruta Ruta del fichero
 * @param caracteres Opción para mostar caracteres del fichero
 * @param palabras Opción para mostar palabras del fichero
 * @param lineas Opción para mostar lineas del fichero
 */
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

/**
 * Comando info muestra la información de un fichero, este comando que puede recibe 5 parámetros, el nombre del fichero, si se utiliza el método pipe, si se desea mostar los caracteres,
 * palabras o líneas del fichero
 */
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

// Ejemplo de ejecución: node dist/ejercicio-2.js info --fichero=hola.txt --pipe=true --caracteres=true --palabras=true --lineas=true
yargs.parse();
