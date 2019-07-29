# termoDaQ Link

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b4065f9016494e598244314e15526e95)](https://app.codacy.com/app/mc.ireiser/termodaq_link?utm_source=github.com&utm_medium=referral&utm_content=mc-ireiser/termodaq_link&utm_campaign=Badge_Grade_Dashboard)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmc-ireiser%2Ftermodaq_link.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmc-ireiser%2Ftermodaq_link?ref=badge_shield)

Aplicación para establecer conexión Serial con la tarjeta termoDaQ

## Instalar y ejecutar desde el código fuente

Clone o Descarge el **Repositorio**.

Si Clona:
> Entre en la carpeta termodaq_link-master.

Si Descarga:
> Descomprima el archivo descargado, luego entre en la carpeta termodaq_link-master.

En el terminal ejecute los siguientes comandos:

```bash
# Para instalar
npm install

# Para ejecutar la aplicación
npm run termodaq
```

## Empaquetar la aplicación

Para empaquetar el proyecto en un archivo ejecutable instale la herramienta pkg utilizando el siguiente comando:

```bash
~$ npm install -g pkg
```

pkg permite ejecutar la aplicación incluso en dispositivos que no posean Node.js instalado

Una vez instalada la herramienta, en la carpeta raíz del proyecto ejecute el comando:

```bash
~$ pkg .
> pkg@4.4.0
> Targets not specified. Assuming:
  node10-linux-x64, node10-macos-x64, node10-win-x64
```

Nota: `Node.js V 10.4.1` es requerido para realizar el proceso anterior.

Como resultado se generan ejecutables: `linux-x64`, `win-x64` y `macos-x64`

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmc-ireiser%2Ftermodaq_link.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmc-ireiser%2Ftermodaq_link?ref=badge_large)
