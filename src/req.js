const v = require('./var.json')
const axios = require('axios')
const logData = require('./log')

module.exports = {

  upload: async function (id, token, estudio) {
    let url = `${v.host}/api/usuarios/${id}/estudios?access_token=${token}`

    await axios.post(url, {
      data: estudio
    })
    .then(function (response) {
      logData.info('~$termodaq-api:', 'DATAFILE SUBIDO AL SERVIDOR')
      logData.exitCli()
    })
    .catch(function (e) {
      logData.error('~$termodaq-api:', 'ERROR SUBIENDO ESTUDIO => ' + e)
      logData.exitCli()
    })
  }

}