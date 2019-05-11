# termoDaQ Link

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