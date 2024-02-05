const util = require('util');

class Logger {
  constructor(loggerId) {
    this.logger = console;
    this.loggerId = loggerId;
  };
  
  debug(params) {
    this.logger.debug(util.inspect({params}, { depth: null }));
  };

  info({ data }) {
    const date = (new Date()).toISOString();
    this.logger.log(`${this.loggerId} ${date} - INFO ${JSON.stringify(data)}`);
  };

  error(errMessage) {
    const date = (new Date()).toISOString();
    this.logger.error(`${this.loggerId} ${date} - ERROR ${errMessage}`)
  };

};

module.exports = {
  Logger,
}