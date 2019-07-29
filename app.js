#!/usr/bin/env node

"use strict";

const Isemail = require("isemail");
const inquirer = require("inquirer");
const auth = require("./src/auth");
const logData = require("./src/log");
const serial = require("./src/serial");
let portList = serial.listPorts;

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "Tarea a realizar: ",
        choices: [
          {
            name: "Verificar DataFile",
            value: "1"
          },
          {
            name: "Descargar DataFile",
            value: "2"
          },
          {
            name: "Eliminar DataFile",
            value: "3"
          },
          {
            name: "Salir",
            value: "4"
          }
        ]
      },
      {
        type: "list",
        name: "cloud",
        message: "Respaldar en el servidor: ",
        paginated: false,
        choices: ["Si", "No"],
        when: function(answers) {
          return answers.task === "2";
        }
      },
      {
        type: "input",
        name: "email",
        message: "Email: ",
        when: function(answers) {
          return answers.cloud === "Si";
        },
        validate: function(input) {
          return Isemail.validate(input);
        }
      },
      {
        type: "password",
        name: "password",
        message: "Contraseña: ",
        mask: "*",
        when: function(answers) {
          return answers.cloud === "Si";
        },
        validate: function(input) {
          return input.length > 0;
        }
      },
      {
        type: "list",
        name: "port",
        message: "Puerto SerialCOM: ",
        paginated: false,
        choices: portList,
        when: function(answers) {
          return answers.task !== "4";
        }
      },
      {
        type: 'input',
        name: 'alias',
        message: 'DataFile - Alias: ',
        when: function (answers) {
          return answers.cloud === 'No'
        }
      },
      {
        type: 'input',
        name: 'titulo',
        message: 'DataFile - Titulo: ',
        when: function (answers) {
          return answers.cloud === 'Si'
        },
        validate: function(input) {
          return input.length > 0;
        }
      },
      {
        type: 'input',
        name: 'lugar',
        message: 'DataFile - Lugar: ',
        when: function (answers) {
          return answers.cloud === 'Si'
        },
        validate: function(input) {
          return input.length > 0;
        }
      },
      {
        type: 'input',
        name: 'descripcion',
        message: 'DataFile - Descripcion: ',
        when: function (answers) {
          return answers.cloud === 'Si'
        },
        validate: function(input) {
          return input.length > 0;
        }
      }
    ])
    .then(answers => {
      let userData = {};

      async function main() {
        if (answers.task === "4") {
          return;
        }

        logData.header();

        let alias;
        if (answers.alias) {
          alias = "-" + answers.alias.replace(/ /g, "");
        } else {
          alias = "";
        }
        let date = new Date();
        let fileName = "./" + "termodaq-" + date.getTime() + alias + ".txt";

        if (answers.cloud === "Si") {
          userData = await auth.login(answers.email, answers.password);
        }

        let portPath = answers.port.split(" ", 1);
        const serialPort = await serial.openPort(portPath[0]);
        serial.portParse(
          serialPort,
          answers.task,
          answers.cloud,
          fileName,
          userData,
          answers.titulo,
          answers.lugar,
          answers.descripcion
        );
      }

      main();
    });
  // end inquirer
}

init();
