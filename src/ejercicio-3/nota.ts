import * as chalk from 'chalk';

/**
 * Clase Nota que se encarga de crear una nota
 */
export class Nota {
  /**
   * Constructor de la clase nota
   * @param titulo Titulo de la nota
   * @param cuerpo Cuerpo de la nota
   * @param color Color de la nota
   */
  constructor(protected titulo: string, protected cuerpo: string,
    protected color: string) {}

  /**
  * Getter de título
  * @returns devuelve el título de la nota
  */
  getTitulo(): string {
    return this.titulo;
  }

  /**
  * Getter de cuerpo
  * @returns devuelve el cuerpo de la nota
  */
  getCuerpo(): string {
    return this.cuerpo;
  }

  /**
  * Setter de color
  * @returns devuelve el color de la nota
  */
  getColor(): string {
    return this.color;
  }

  /**
  * Setter de título
  */
  setTitulo(titulo: string) {
    this.titulo = titulo;
  }

  /**
  * Setter de cuerpo
  */
  setCuerpo(cuerpo: string) {
    this.cuerpo = cuerpo;
  }

  /**
  * Setter de color
  */
  setColor(color: string) {
    this.color = color;
  }

  /**
   * Método que se encarga de imprimir el título de la nota
   * en el color correspondiente
   */
  showTitulo(): void {
    switch (this.color) {
      case "Rojo":
        console.log(chalk.red(this.titulo));
        break;
      case "Azul":
        console.log(chalk.blue(this.titulo));
      case "Verde":
        console.log(chalk.green(this.titulo));
        break;
      case "Amarillo":
        console.log(chalk.yellow(this.titulo));
        break;
      default:
        console.log(chalk.red("No es un color válido"));
        break;
    }
  }

  /**
   * Método que se encarga de imprimir el cuerpo de la nota
   * con el color correspondiente
   */
  showCuerpo() {
    switch (this.color) {
      case "Rojo":
        console.log(chalk.red(this.cuerpo));
        break;
      case "Azul":
        console.log(chalk.blue(this.cuerpo));
      case "Verde":
        console.log(chalk.green(this.cuerpo));
        break;
      case "Amarillo":
        console.log(chalk.yellow(this.cuerpo));
        break;
      default:
        console.log(chalk.red("No es un color válido"));
        break;
    }
  }
}
