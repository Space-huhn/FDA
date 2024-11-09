// require('dotenv').config();
// const express = require('express');
// const sequelize = require('../db');
// const PORT = process.env.PORT;
// const app = require('../app');
// const models = require('../models/models')
// const cors = require('cors')
//
// const http = require('http');
// const port = PORT || '3050';
// app.set('port', port);
// app.use(cors())
// app.use(express.json())
//
// const server = http.createServer(app);
// // const debug = require('debug')('fda:server');
// // server.listen(port);
// // server.on('error', onError);
// // server.on('listening', onListening);
//
// // function normalizePort(val) {
// //   const port = parseInt(val, 10);
// //   if (isNaN(port)) {
// //     return val;
// //   }
// //
// //   if (port >= 0) {
// //     return port;
// //   }
// //   return false;
// // }
// //
// // function onError(error) {
// //   if (error.syscall !== 'listen') {
// //     throw error;
// //   }
// //
// //   const bind = typeof port === 'string'
// //     ? 'Pipe ' + port
// //     : 'Port ' + port;
// //   switch (error.code) {
// //     case 'EACCES':
// //       console.error(bind + ' requires elevated privileges');
// //       process.exit(1);
// //       break;
// //     case 'EADDRINUSE':
// //       console.error(bind + ' is already in use');
// //       process.exit(1);
// //       break;
// //     default:
// //       throw error;
// //   }
// // }
// //
// // function onListening() {
// //   const addr = server.address();
// //   const bind = typeof addr === 'string'
// //     ? 'pipe ' + addr
// //     : 'port ' + addr.port;
// //   debug('Listening on ' + bind);
// //
// //   console.log(`Example app listening on port: ${port}`)
// // }
//
// const start = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     onListening()
//   } catch (e) {
//     console.log(e)
//   }
// }
//
// start().then(r => r)
//
// app.get('/', (req, res) => {
//   res.status(200).json({message: "ok!!!!"})
// })