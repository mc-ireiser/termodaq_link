'use strict'

const v = require('./var.json')
const axios = require('axios')
const logData = require('./log')
const auth = require('./auth')

module.exports = {

  upload: async function (id, token, estudio) {

    try {
      logData.info('~$termodaq-api:', 'DATAFILE SUBIENDO AL SERVIDOR')
      let url = `${v.host}/api/usuarios/${id}/estudios?access_token=${token}`
      await axios.post(url, {
        data: estudio
      })
      logData.info('~$termodaq-api:', 'DATAFILE SUBIDO AL SERVIDOR')
      auth.logout(token)
    } catch (e) {
      logData.error('~$termodaq-api:', 'ERROR SUBIENDO DATAFILE => ' + e)
      auth.logout(token)
    }
  }
}
