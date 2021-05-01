import {Nota} from './nota';
import * as fs from 'fs';
import * as chalk from 'chalk';
import {existsSync, readFile, readdirSync} from 'fs';

/**
 * Clase GestorNota que se encargará de gestionar las distintas
 * notas de todos los usuarios
*/
export class GestorNota {
  constructor() {}

  /**
   * Método que se encarga de añadir una nota a la colección de un usuario
   * si no existe su directorio personalo lo creo
   * @param nota Nota que se va a añadir
   * @param usuario Usuario que va a añadir la nota
   */
  addNota(nota: Nota, usuario: string): void {
    const ruta: string = './src/database/' + usuario;
    const rutafichero: string = './src/database/' + usuario + '/' +
    nota.getTitulo() + '.json';

    if (fs.existsSync(ruta)) {
      console.log(chalk.green("Bienvenido de nuevo!"));
      if (fs.existsSync(rutafichero)) {
        console.log(chalk.red("El título de la nota ya ha sido usado"));
      } else {
        // eslint-disable-next-line max-len
        fs.writeFileSync(rutafichero, `{\n\t"titulo": "${nota.getTitulo()}",\n\t"cuerpo": "${nota.getCuerpo()}",\n\t"color": "${nota.getColor()}"\n}`);
        console.log(chalk.green("Nota agregada!"));
      }
    } else {
      console.log(chalk.green("Bienvenido, creando su directorio personal!"));
      fs.mkdirSync(ruta);
      // eslint-disable-next-line max-len
      fs.writeFileSync(rutafichero, `{\n\t"titulo": "${nota.getTitulo()}",\n\t"cuerpo": "${nota.getCuerpo()}",\n\t"color": "${nota.getColor()}"\n}`);
      console.log(chalk.green("Nota agregada!"));
    }
  }

  /**
   * Método que se encarga de editar una nota ya existente
   * @param usuario Usuario propietario de la nota
   * @param titulo Nuevo título de la nota
   * @param cuerpo Nuevo cuerpo de la nota
   * @param color Nuevo color de la nota
   */
  editNota(usuario: string, titulo: string, cuerpo: string, color: string) {
    const rutafichero: string = './src/database/' + usuario + '/' +
    titulo + '.json';

    if (fs.existsSync(rutafichero)) {
      // eslint-disable-next-line max-len
      fs.writeFileSync(rutafichero, `{\n\t"titulo": "${titulo}",\n\t"cuerpo": "${cuerpo}",\n\t"color": "${color}"\n}`);
      console.log(chalk.green("Nota modificada correctamente!"));
    } else {
      console.log(chalk.red("No se encontro la nota"));
    }
  }

  /**
   * Método que se encarga de eliminar una nota ya creada
   * @param titulo Título de la nota que queremos eliminar
   * @param usuario Usuario propietario de la nota
   */
  removeNota(titulo: string, usuario: string): void {
    const rutafichero: string = './src/database/' + usuario + '/' +
    titulo + '.json';

    if (fs.existsSync(rutafichero)) {
      fs.rmSync(rutafichero);
      console.log(chalk.green("Nota eliminada!"));
    } else {
      console.log(chalk.red("No se ha encontrado ninguna nota con ese título"));
    }
  }

  /**
   * Método que se encarga de listar todas las notas de un usuario
   * @param usuario Usuario del que queremos ver las notas
   */
  listNotas(usuario: string): void {
    const ruta: string = './src/database/' + usuario;

    if (existsSync(ruta)) {
      const aux: string[] = [];
      readdirSync(ruta).forEach((element) => {
        aux.push(element);
      });

      if (aux.length == 0) {
        console.log(chalk.red("El usuario no tiene notas"));
      } else {
        aux.forEach((nota) => {
          readFile(`./src/database/${usuario}/${nota}`, (err, data) => {
            if (err) {
              console.log(chalk.red("Error de lectura"));
            } else {
              const aux2 = JSON.parse(data.toString());
              if (aux2.color == "Rojo") {
                console.log(chalk.red(nota));
              } else if (aux2.color == "Azul") {
                console.log(chalk.blue(nota));
              } else if (aux2.color == "Verde") {
                console.log(chalk.green(nota));
              } else if (aux2.color == "Amarillo") {
                console.log(chalk.yellow(nota));
              }
            }
          });
        });
      }
    }
  }

  /**
   * Método que se encarga de leer una nota de un usuario
   * @param usuario Usuario propietario de la nota
   * @param titulo Título de la nota que queremos leer
   */
  readNota(usuario: string, titulo: string): void {
    if (existsSync(`./src/database/${usuario}/${titulo}.json`)) {
      readFile(`./src/database/${usuario}/${titulo}.json`, (err, data) => {
        if (err) {
          console.log(chalk.red("Error de lectura"));
        } else {
          const aux = JSON.parse(data.toString());
          switch (aux.color) {
            case 'Rojo':
              console.log(chalk.red(`\n${aux.titulo}\n${aux.cuerpo}\n`));
              break;
            case 'Azul':
              console.log(chalk.blue(`\n${aux.titulo}\n${aux.cuerpo}\n`));
              break;
            case 'Verde':
              console.log(chalk.green(`\n${aux.titulo}\n${aux.cuerpo}\n`));
              break;
            case 'Amarillo':
              console.log(chalk.yellow(`\n${aux.titulo}\n${aux.cuerpo}\n`));
              break;
          }
        }
      });
    } else {
      console.log(chalk.red('No existe esa nota'));
    }
  }
}
