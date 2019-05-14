#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const serialport = require("serialport")
const Readline = require('@serialport/parser-readline')
const fs = require('fs')
const chalk = require('chalk')
const Isemail = require('isemail')
const axios = require('axios')
const CSV = require('comma-separated-values')

let isWin = process.platform === "win32";
let isLin = process.platform === "linux";
let isMac = process.platform === "darwin";

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
            name: 'Salir',
            value: '4'
          }
        ]
      },
      {
        type: 'list',
        name: 'cloud',
        message: 'Respaldar en el servidor: ',
        paginated: false,
        choices: ['Si', 'No'],
        when: function (answers) {
          return answers.task === '2'
        }
      },
      {
        type: 'input',
        name: 'email',
        message: 'Email: ',
        when: function (answers) {
          return answers.cloud === 'Si'
        },
        validate: function (input) {
          return Isemail.validate(input)
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Contraseña: ',
        mask: '*',
        when: function (answers) {
          return answers.cloud === 'Si'
        },
        validate: function (input) {
          return input.length > 0
        }
      },
      {
        type: 'list',
        name: 'port',
        message: 'Puerto SerialCOM: ',
        paginated: false,
        choices: portList,
        when: function (answers) {
          return answers.task !== '4'
        }
      },
      {
        type: 'input',
        name: 'alias',
        message: 'DataFile - Alias: ',
        when: function (answers) {
          return answers.task === '2'
        }
      }
    ])

    .then(answers => {

      if (answers.task === '4') {
        return
      }

      console.log(chalk.blue.bold('\n\rtermoDaQ V1.0\n\r'))

      let alias
      let date = new Date()
      let port = null
      let rawData = ""
      let studio = []
      const host = 'http://api.termodaq.com.ve'

      if (answers.alias) {
        alias = '-' + answers.alias.replace(/ /g, "")
      } else {
        alias = ''
      }

      let fileName = './' + 'termodaq-' + date.getTime() + alias + '.txt'

      portConnection()

      async function portConnection() {
        port = await new serialport(answers.port, {
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        })

        portParse()
      }

      async function portParse() {
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
        parser.on('data', function (data) {

          logInfo(data)

          if (data === 'CS:OK') {
            port.write(answers.task, function (err) {
              if (err) {
                return console.log(chalk.red.bold('Error escribiendo en el puerto Serial: '), err.message)
              }
            })
          }

          if (answers.task === '2' && (data !== 'CS:OK' && data !== 'CS:END')) {
            writeDataFile(data)

            if (answers.cloud === 'Si') {
              setRawData(data)
            }
          }

          if (data === 'CS:END') {
            if (answers.cloud === 'Si') {
              loginUser()
              return
            }

            exitCli()
            return
          }
        })
      }

      function logInfo(data) {
        console.log(chalk.blue.bold('~$termodaq:'), data)
      }

      async function writeDataFile(data) {
        await fs.appendFile(fileName, data + '\r\n', function (err) {
          if (err) {
            return console.log(chalk.red.bold('Error almacenando archivo: '), err);
          }
        })
      }

      function setRawData(data) {
        if (rawData === "") {
          rawData = data
        }
        rawData = rawData + '\n\r' + data
      }

      async function setStudio(data) {
        try {
          let auxStudio = await new CSV(data, {
            header: ['latitude', 'longitude', 'date', 'time', 'tempInternal', 'tempWater', 'tempAir', 'pressure', 'uv']
          }).parse()
          studio.push(auxStudio)
        } catch(e) {
          console.log(chalk.red.bold('~$termodaq-link: ERROR EN PARSE => ', e))
        }
      }

      async function loginUser() {
        let url = `${host}/api/usuarios/login`
        
        await axios.post(url, {
          email: answers.email,
          password: answers.password
        })
        .then(function (response) {
          let user = response.data
          console.log(chalk.green.bold('~$termodaq-api: LOGIN OK'))
          upload(user)
        })
        .catch(function (e) {
          const error = e.response.data.error
          console.log(chalk.red.bold('~$termodaq-api: ERROR EN LOGIN => ', error.message))
          exitCli()
        })
      }

      async function upload(user) {
        let id = user.userId
        let token = user.id
        let url = `${host}/api/usuarios/${id}/estudios?access_token=${token}`

        let estudio = await new CSV(rawData, {
          header: ['latitude', 'longitude', 'date', 'time', 'tempInternal', 'tempWater', 'tempAir', 'pressure', 'uv']
        }).parse()

        await axios.post(url, {
          data: estudio
        })
        .then(function (response) {
          console.log(chalk.green.bold('~$termodaq-api: DataFile respaldado en el servidor de manera correcta'))
          exitCli()
        })
        .catch(function (e) {
          const error = e.response.data.error
          console.log(chalk.red.bold('~$termodaq-api: ERROR SUBIENDO ESTUDIO => ', error.message))
          exitCli()
        })
      }

      function closePort() {
        port.close(function (err) {
          if (err) {
            return console.log(chalk.red.bold('Error cerrando el puerto Serial: '), err.message)
          }
        })
      }

      function exitCli() {
        console.log(chalk.green('\n\rLa tarea ha sido completada de manera exitosa...\n\r'))
        console.log(chalk.bgGreen.bold('Presione Ctrl+C Para salir'))
      }

    })
  // end inquirer
}

init();
