module.exports = (pathArray) => pathArray.reduce((acc, cv) =>  `${acc}${cv}/`, '/')
