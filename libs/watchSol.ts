import chokidar from 'chokidar';
import exec from 'child_process';
import log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'debug';

const watcher = chokidar.watch('src', {
  ignored: /[\/\\]\./,
  persistent: true
});

watcher.on('ready', () => {
  logger.debug('Sol container started !');
});

watcher.on('change', (path, stats) => {
  exec.exec('npm run build:sol', (error, stdout, stderror) => {
    logger.debug(error);
    logger.debug(stdout);
    logger.debug(stderror);
  });
});
