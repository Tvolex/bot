const { responser } = require('../../helpers');

module.exports = ((req, res, next) => {
    return responser(res, 200, { message: 'Home, sweet home...' });
});
