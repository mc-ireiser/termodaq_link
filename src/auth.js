const v = require('./var.json')
const axios = require('axios')
const logData = require('./log')

let userData

module.exports = {

  login: async function(email, password) {
    let url = `${v.host}/api/usuarios/login`
    let authReq = await axios.post(url, {
      email: email,
      password: password
    })
    .then(function (response) {
      userData = {
        token: response.data.id,
        id: response.data.userId
      }
      logData.info('~$termodaq-api:', 'LOGIN OK')
      return userData
    })
    .catch(function (e) {
      logData.error('~$termodaq-api:', 'ERROR EN LOGIN => ' + e)
    })
    return authReq
  },

  logout: async function(token) {
    let url = `${v.host}/api/usuarios/logout?access_token=${token}`
    await axios.post(url)
    .then(function (response) {
      logData.info('~$termodaq-api:', 'LOGOUT OK')
      logData.exitCli()
    })
    .catch(function (e) {
      logData.error('~$termodaq-api:', 'ERROR EN LOGOUT => ' + e)
      logData.exitCli()
    })
  }
}
