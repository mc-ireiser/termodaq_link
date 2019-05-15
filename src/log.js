const fs = require('fs')
const chalk = require('chalk')

module.exports = {

  info: function (from, data) {
    console.log(chalk.blue.bold(from), data)
  },

  error: function (from, data) {
    console.log(chalk.red.bold(from), data)
  },

  exitCli: function () {
    console.log(chalk.green('\n\rLa tarea ha sido completada de manera exitosa...\n\r'))
    console.log(chalk.bgGreen.bold('Presione Ctrl+C Para salir'))
  },

  writeDataFile: async function (fileName, data) {
    await fs.appendFile(fileName, data + '\r\n', function (err) {
      if (err) {
        return console.log(chalk.red.bold('Error almacenando archivo: '), err)
      }
    })
  }
}