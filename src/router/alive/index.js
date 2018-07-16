const { responser } = require('../../helpers');

module.exports = ((req, res) => {
    responser(res, 200, {status: 'ok'});
});
