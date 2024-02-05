const util = require('util');

class Logger {
  constructor() {
    this.logger = console;
  };

  debug(params) {
    this.logger.debug(util.inspect({params}, { depth: null }));
  };

  info({ key, data }) {
    const date = (new Date()).toISOString();
    this.logger.log(`${date} - INFO ${key} ${JSON.stringify(data)}`);
  };

  error(errMessage) {
    const date = (new Date()).toISOString();
    this.logger.error(`${date} - ERROR ${errMessage}`)
  };

};

module.exports = {
  Logger,
}