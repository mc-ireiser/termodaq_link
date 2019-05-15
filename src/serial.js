'use strict'

const serialport = require("serialport")
const Readline = require('@serialport/parser-readline')
const CSV = require('comma-separated-values')
const logData = require('./log')
const serverReq = require('./req')

let rawData = ""

let isWin = process.platform === "win32";
let isLin = process.platform === "linux";
let isMac = process.platform === "darwin";

module.exports = {

  listPorts: async function () {
    let list = []
    await serialport.list(function (err, ports) {
      ports.forEach(function (port) {
        list.push(`${port.comName} - ${port.manufacturer}`)
      })
    })
    return list
  },

  openPort: async function (portPath) {
    let openPort = await new serialport(portPath, {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none'
    })
    return openPort
  },

  closePort: function (port) {
    port.close(function (e) {
      if (e) {
        logData.error('~$termodaq-link:', 'ERROR CERRANDO PUERTO SERIAL => ' + e.message)
      }
    })
  },

  portParse: async function (port, task, cloud, fileName, userData) {
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
    
    parser.on('data', async function (data) {
      
      logData.info('~$termodaq:', data)
      // console.log('~$termodaq:', data)

      if (data === 'CS:OK') {
        port.write(task, function (e) {
          if (e) {
            logData.error('~$termodaq-link:', 'ERROR ESCRIBIENDO EN PUERTO SERIAL => ' + e.message)
          }
        })
      }

      if (task === '2' && (data !== 'CS:OK' && data !== 'CS:END')) {
        logData.writeDataFile(fileName, data)

        if (cloud === 'Si') {
          if (rawData === "") {
            rawData = data
          }
          rawData = rawData + '\n\r' + data
        }
      }

      if (data === 'CS:END') {
        if (cloud === 'Si') {
          try {
            let studio = await new CSV(rawData, {
              header: ['latitude', 'longitude', 'date', 'time', 'tempInternal', 'tempWater', 'tempAir', 'pressure', 'uv']
            }).parse()
            serverReq.upload(userData.id, userData.token, studio)
          } catch(e) {
            logData.error('~$termodaq-link:', 'ERROR EN PARSE => ' + e)
          }
        } else {
          logData.exitCli()
        }
      }
    })
  }
}
