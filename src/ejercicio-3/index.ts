import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {Nota} from './nota';
import {GestorNota} from './gestorNota';

/**
 * Configuración del comando add mediante yargs
 */
yargs.command({
  command: 'add',
  describe: 'Añadir una nueva nota',
  builder: {
    user: {
      describe: 'Nombre de usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.body === 'string' && typeof argv.color === 'string') {
      const nuevaNota = new Nota(argv.title, argv.body, argv.color);
      const gestor = new GestorNota();
      gestor.addNota(nuevaNota, argv.user);
    } else {
      console.log(chalk.red('Argumentos no válidos'));
    }
  },
});

/**
 * Configuración del comando list mediante yargs
 */
yargs.command({
  command: 'list',
  describe: 'Listar las notas de un usuario',
  builder: {
    user: {
      describe: 'Nombre de usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' ) {
      const gestor = new GestorNota();
      gestor.listNotas(argv.user);
    } else {
      console.log(chalk.red('Argumentos no válidos'));
    }
  },
});

/**
 * Configuración del comando remove mediante yargs
 */
yargs.command({
  command: 'remove',
  describe: 'Eliminar una nota',
  builder: {
    user: {
      describe: 'Nombre de usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const gestor = new GestorNota();
      gestor.removeNota(argv.title, argv.user);
    } else {
      console.log(chalk.red('Argumentos no válidos'));
    }
  },
});

/**
 * Configuración del comando read mediante yargs
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota',
  builder: {
    user: {
      describe: 'Nombre de usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const gestor = new GestorNota();
      gestor.readNota(argv.user, argv.title);
    } else {
      console.log(chalk.red('Argumentos no válidos'));
    }
  },
});

/**
 * Configuración del comando edit mediante yargs
 */
yargs.command({
  command: 'edit',
  describe: 'Editar una nota',
  builder: {
    user: {
      describe: 'Nombre de usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.body === 'string' && typeof argv.color === 'string') {
      const gestor = new GestorNota();
      gestor.editNota(argv.user, argv.title, argv.body, argv.color);
    } else {
      console.log(chalk.red('Argumentos no válidos'));
    }
  },
});

yargs.parse();
