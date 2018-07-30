const { responser } = require('../../helpers');

module.exports = ((req, res) => {
    return responser(res, 200, {status: 'ok'});
});
