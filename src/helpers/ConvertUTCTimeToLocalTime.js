const moment = require('moment-timezone')
module.exports = (timeObject, format) => moment(timeObject).tz(moment.tz.guess()).format(format)
