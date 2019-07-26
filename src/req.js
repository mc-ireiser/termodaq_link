'use strict'

const v = require('./var.json')
const axios = require('axios')
const logData = require('./log')
const auth = require('./auth')

module.exports = {

  upload: async function (id, token, estudio, titulo, lugar, descripcion) {

    try {
      logData.info('~$termodaq-api:', 'DATAFILE SUBIENDO AL SERVIDOR')
      let url = `${v.host}/api/usuario/${id}/estudio?access_token=${token}`
      const result = await axios.post(url, {
        data: estudio
      })
      
      logData.info('~$termodaq-api:', 'DATAFILE SUBIDO AL SERVIDOR')
      let urlFicha = `${v.host}/api/estudio/${result.data.id}/ficha?access_token=${token}`
      const result2 = await axios.post(urlFicha, {
        'titulo': titulo || 'N/A',
        'lugar': lugar || 'N/A',
        'descripcion': descripcion || 'N/A'
      })

      auth.logout(token)

    } catch (e) {
      logData.error('~$termodaq-api:', 'ERROR SUBIENDO DATAFILE => ' + e)
      auth.logout(token)
    }
  }
}
