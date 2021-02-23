module.exports = (callback, runArgs) => {
    var aspNetWebpack;
    var exStack = '';
    try {
        aspNetWebpack = require("aspnet-webpack");
    } catch (ex) {
        aspNetWebpack = null;
        exStack = ex.stack;
    }

    if (aspNetWebpack == null) {
        callback('Webpack dev middleware failed because of an error while loading \'aspnet-webpack\'. Error was: '
            + exStack
            + '\nCurrent directory is: '
            + process.cwd());
        return;
    }

    aspNetWebpack.createWebpackDevServer(callback, runArgs);
};