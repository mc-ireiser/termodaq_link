#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const serialport = require("serialport")
const Readline = require('@serialport/parser-readline')
const fs = require('fs')
const chalk = require('chalk')

// let isWin = process.platform === "win32";
// let isLin = process.platform === "linux";
// let isMac = process.platform === "darwin";

let portList = []

async function init() {
  
  await serialport.list(function (err, ports) {
    ports.forEach(function (port) {
      portList.push(port.comName)
    })
  })

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'task',
        message: 'Tarea a realizar: ',
        choices: [
          {
            name: 'Verificar DataFile',
            value: '1'
          },
          {
            name: 'Descargar DataFile',
            value: '2'
          },
          {
            name: 'Eliminar DataFile',
            value: '3'
          },
          {
            name: 'Continuar sin realizar ninguna tarea',
            value: '4'
          }
        ]
      },
      {
        type: 'list',
        name: 'port',
        message: 'Puerto SerialCOM: ',
        paginated: false,
        choices: portList,
        when: function(answers) {
          return answers.task !== '4' 
        }
      },
      {
        type: 'input',
        name: 'alias',
        message: 'DataFile - Alias: ',
        when: function(answers) {
          return answers.task === '2' 
        }
      }
    ])
    
    .then(answers => {

      console.log()
      console.log(chalk.blue.bold('termoDaQ V1.0'))
      console.log()

      if (answers.task === '4') {
        return
      }

      var date = new Date();
      var time = date.getTime();
      let alias

      if (answers.alias) {
        alias = '-' + answers.alias.replace(/ /g, "")
      } else {
        alias = ''
      }

      let fileName = './' + 'termodaq-' + time + alias + '.txt'

      async function portConnection() {
        
        const port = await new serialport(answers.port, {
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        })

        const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

        parser.on('data', function (data) {

          console.log(chalk.blue.bold('~$termodaq:'), data)

          if (answers.task === '2' && data !== 'CS:OK' && data !== 'CS:END') {
            fs.appendFile(fileName, data + '\r\n', function (err) {
              if (err) {
                return console.log(chalk.red.bold('Error almacenando archivo: '), err);
              }
            })
          }

          if (data === 'CS:OK') {
            port.write(answers.task, function (err) {
              if (err) {
                return console.log(chalk.red.bold('Error escribiendo en el puerto Serial: '), err.message)
              }
            })
          }

          if (data === 'CS:END') {
            console.log()
            console.log(chalk.green('La tarea ha sido completada de manera exitosa...'))
            console.log()
            console.log(chalk.bgGreen.bold('Presione Ctrl+C Para salir'))
            return
            
            port.close(function (err) {
              if (err) {
                return console.log(chalk.red.bold('Error cerrando el puerto Serial: '), err.message)
              }
            })
          }

        })
      }
      
      portConnection()

    })
  // end inquirer
}

init();



