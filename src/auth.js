'use strict'

const v = require('./var.json')
const axios = require('axios')
const logData = require('./log')

let userData

module.exports = {

  login: async function(email, password) {
    try {
      let url = `${v.host}/api/usuarios/login`
      const response = await axios.post(url, {
        email: email,
        password: password
      })
      userData = {
        token: response.data.id,
        id: response.data.userId
      }
      logData.info('~$termodaq-api:', 'LOGIN OK')
      return userData
    } catch (e) {
      logData.error('~$termodaq-api:', 'ERROR EN LOGIN => ' + e)
      return null
    }
  },

  logout: async function(token) {
    try {
      let url = `${v.host}/api/usuarios/logout?access_token=${token}`
      await axios.post(url)
      logData.info('~$termodaq-api:', 'LOGOUT OK')
      logData.exitCli()
    } catch (e) {
      logData.error('~$termodaq-api:', 'ERROR EN LOGOUT => ' + e)
      logData.exitCli()
    }
  }
}
