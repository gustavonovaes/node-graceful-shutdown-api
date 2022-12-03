import { createServer } from 'node:http';
import { once } from 'node:events';

const handler = async (request, response) => {
  try {
    const data = JSON.parse(await once(request, 'data'))
    response.writeHead(200);
    response.end(JSON.stringify(data))

    setTimeout(() => {
      throw new Error('setTimeout error')
    }, 1000);

    // Promise.reject('Promise without catch')

  } catch (error) {
    console.error('[ERROR]: ', error);

    response.writeHead(500);
    response.end()
  }
}


const server = createServer(handler)
  .listen(3000)
  .on('listening', () => {
    console.log('> Server listening at 3000...');
  })

const gracefulShutdown = (signal) => {
  return (error) => {
    console.info(`[${signal}]:`, error.stack || error);

    console.info('> Closing server...');
    server.close(() => {
      console.info('> Server closed');
      process.exit(error ? 1 : 0);
    })
  }
}

process.on('uncaughtException', gracefulShutdown('uncaughtException'))
process.on('unhandledRejection', gracefulShutdown('unhandledRejection'))
process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));