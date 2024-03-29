module.exports = (callback, runArgs) => {
    var aspNetWebpack;
    var requireNewCopyProvider;
    var webpackTestPermissions;
    var connect;
    var exStack = '';

    try {
        connect = require("connect");
    } catch (ex) {
        connect = null;
        exStack = ex.stack;
    }

    if (connect == null) {
        callback('Webpack dev middleware failed because of an error while loading \'connect\' package. Ensure you have the \'connect\' npm package installed. Error was: '
            + exStack
            + '\nCurrent directory is: '
            + process.cwd());
        return;
    }



    (function () {
        function requireNewCopy(moduleNameOrPath) {
            // Store a reference to whatever's in the 'require' cache,
            // so we don't permanently destroy it, and then ensure there's
            // no cache entry for this module
            var resolvedModule = require.resolve(moduleNameOrPath);
            var wasCached = resolvedModule in require.cache;
            var cachedInstance;
            if (wasCached) {
                cachedInstance = require.cache[resolvedModule];
                delete require.cache[resolvedModule];
            }
            try {
                // Return a new copy
                return require(resolvedModule);
            }
            finally {
                // Restore the cached entry, if any
                if (wasCached) {
                    require.cache[resolvedModule] = cachedInstance;
                }
            }
        }

        requireNewCopyProvider = {
            requireNewCopy: requireNewCopy
        }
    })();

    (function () {
        var fs = require("fs");
        var path = require("path");
        var isWindows = /^win/.test(process.platform);
        // On Windows, Node (still as of v8.1.3) has an issue whereby, when locating JavaScript modules
        // on disk, it walks up the directory hierarchy to the disk root, testing whether each directory
        // is a symlink or not. This fails with an exception if the process doesn't have permission to
        // read those directories. This is a problem when hosting in full IIS, because in typical cases
        // the process does not have read permission for higher-level directories.
        //
        // NodeServices itself works around this by injecting a patched version of Node's 'lstat' API that
        // suppresses these irrelevant errors during module loads. This covers most scenarios, but isn't
        // enough to make Webpack dev middleware work, because typical Webpack configs use loaders such as
        // 'awesome-typescript-loader', which works by forking a child process to do some of its work. The
        // child process does not get the patched 'lstat', and hence fails. It's an especially bad failure,
        // because the Webpack compiler doesn't even surface the exception - it just never completes the
        // compilation process, causing the application to hang indefinitely.
        //
        // Additionally, Webpack dev middleware will want to write its output to disk, which is also going
        // to fail in a typical IIS process, because you won't have 'write' permission to the app dir by
        // default. We have to actually write the build output to disk (and not purely keep it in the in-
        // memory file system) because the server-side prerendering Node instance is a separate process
        // that only knows about code changes when it sees the compiled files on disk change.
        //
        // In the future, we'll hopefully get Node to fix its underlying issue, and figure out whether VS
        // could give 'write' access to the app dir when launching sites in IIS. But until then, disable
        // Webpack dev middleware if we detect the server process doesn't have the necessary permissions.
        function hasSufficientPermissions() {
            if (isWindows) {
                return canReadDirectoryAndAllAncestors(process.cwd());
            }
            else {
                return true;
            }
        }
        function canReadDirectoryAndAllAncestors(dir) {
            if (!canReadDirectory(dir)) {
                return false;
            }
            var parentDir = path.resolve(dir, '..');
            if (parentDir === dir) {
                // There are no more parent directories - we've reached the disk root
                return true;
            }
            else {
                return canReadDirectoryAndAllAncestors(parentDir);
            }
        }
        function canReadDirectory(dir) {
            try {
                fs.statSync(dir);
                return true;
            }
            catch (ex) {
                return false;
            }
        }

        webpackTestPermissions = {
            hasSufficientPermissions: hasSufficientPermissions
        }

    })();

    (function () {
        var webpack = require("webpack");
        var fs = require("fs");
        var path = require("path");
        var querystring = require("querystring");
        function isThenable(obj) {
            return obj && typeof obj.then === 'function';
        }
        function attachWebpackDevMiddleware(app, webpackConfig, enableHotModuleReplacement, enableReactHotModuleReplacement, hmrClientOptions, hmrServerEndpoint) {
            // Build the final Webpack config based on supplied options
            if (enableHotModuleReplacement) {
                // For this, we only support the key/value config format, not string or string[], since
                // those ones don't clearly indicate what the resulting bundle name will be
                var entryPoints_1 = webpackConfig.entry;
                var isObjectStyleConfig = entryPoints_1
                    && typeof entryPoints_1 === 'object'
                    && !(entryPoints_1 instanceof Array);
                if (!isObjectStyleConfig) {
                    throw new Error('To use HotModuleReplacement, your webpack config must specify an \'entry\' value as a key-value object (e.g., "entry: { main: \'ClientApp/boot-client.ts\' }")');
                }
                // Augment all entry points so they support HMR (unless they already do)
                Object.getOwnPropertyNames(entryPoints_1).forEach(function (entryPointName) {
                    var webpackHotMiddlewareEntryPoint = 'webpack-hot-middleware/client';
                    var webpackHotMiddlewareOptions = '?' + querystring.stringify(hmrClientOptions);
                    if (typeof entryPoints_1[entryPointName] === 'string') {
                        entryPoints_1[entryPointName] = [webpackHotMiddlewareEntryPoint + webpackHotMiddlewareOptions, entryPoints_1[entryPointName]];
                    }
                    else if (firstIndexOfStringStartingWith(entryPoints_1[entryPointName], webpackHotMiddlewareEntryPoint) < 0) {
                        entryPoints_1[entryPointName].unshift(webpackHotMiddlewareEntryPoint + webpackHotMiddlewareOptions);
                    }
                    // Now also inject eventsource polyfill so this can work on IE/Edge (unless it's already there)
                    // To avoid this being a breaking change for everyone who uses aspnet-webpack, we only do this if you've
                    // referenced event-source-polyfill in your package.json. Note that having event-source-polyfill available
                    // on the server in node_modules doesn't imply that you've also included it in your client-side bundle,
                    // but the converse is true (if it's not in node_modules, then you obviously aren't trying to use it at
                    // all, so it would definitely not work to take a dependency on it).
                    var eventSourcePolyfillEntryPoint = 'event-source-polyfill';
                    if (npmModuleIsPresent(eventSourcePolyfillEntryPoint)) {
                        var entryPointsArray = entryPoints_1[entryPointName]; // We know by now that it's an array, because if it wasn't, we already wrapped it in one
                        if (entryPointsArray.indexOf(eventSourcePolyfillEntryPoint) < 0) {
                            var webpackHmrIndex = firstIndexOfStringStartingWith(entryPointsArray, webpackHotMiddlewareEntryPoint);
                            if (webpackHmrIndex < 0) {
                                // This should not be possible, since we just added it if it was missing
                                throw new Error('Cannot find ' + webpackHotMiddlewareEntryPoint + ' in entry points array: ' + entryPointsArray);
                            }
                            // Insert the polyfill just before the HMR entrypoint
                            entryPointsArray.splice(webpackHmrIndex, 0, eventSourcePolyfillEntryPoint);
                        }
                    }
                });
                webpackConfig.plugins = [].concat(webpackConfig.plugins || []); // Be sure not to mutate the original array, as it might be shared
                webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
                // Set up React HMR support if requested. This requires the 'aspnet-webpack-react' package.
                if (enableReactHotModuleReplacement) {
                    var aspNetWebpackReactModule = void 0;
                    try {
                        aspNetWebpackReactModule = require('aspnet-webpack-react');
                    }
                    catch (ex) {
                        throw new Error('ReactHotModuleReplacement failed because of an error while loading \'aspnet-webpack-react\'. Error was: ' + ex.stack);
                    }
                    aspNetWebpackReactModule.addReactHotModuleReplacementBabelTransform(webpackConfig);
                }
            }
            // Attach Webpack dev middleware and optional 'hot' middleware
            var compiler = webpack(webpackConfig);
            app.use(require('webpack-dev-middleware')(compiler, {
                stats: webpackConfig.stats,
                publicPath: ensureLeadingSlash(webpackConfig.output.publicPath)
            }));
            // After each compilation completes, copy the in-memory filesystem to disk.
            // This is needed because the debuggers in both VS and VS Code assume that they'll be able to find
            // the compiled files on the local disk (though it would be better if they got the source file from
            // the browser they are debugging, which would be more correct and make this workaround unnecessary).
            // Without this, Webpack plugins like HMR that dynamically modify the compiled output in the dev
            // middleware's in-memory filesystem only (and not on disk) would confuse the debugger, because the
            // file on disk wouldn't match the file served to the browser, and the source map line numbers wouldn't
            // match up. Breakpoints would either not be hit, or would hit the wrong lines.
            var copy = function (stats) { return copyRecursiveToRealFsSync(compiler.outputFileSystem, '/', [/\.hot-update\.(js|json|js\.map)$/]); };
            if (compiler.hooks) {
                compiler.hooks.done.tap('aspnet-webpack', copy);
            }
            else {
                compiler.plugin('done', copy);
            }
            if (enableHotModuleReplacement) {
                var webpackHotMiddlewareModule = void 0;
                try {
                    webpackHotMiddlewareModule = require('webpack-hot-middleware');
                }
                catch (ex) {
                    throw new Error('HotModuleReplacement failed because of an error while loading \'webpack-hot-middleware\'. Error was: ' + ex.stack);
                }
                app.use(workaroundIISExpressEventStreamFlushingIssue(hmrServerEndpoint));
                app.use(webpackHotMiddlewareModule(compiler, {
                    path: hmrServerEndpoint,
                    overlay: true
                }));
            }
        }
        function workaroundIISExpressEventStreamFlushingIssue(path) {
            // IIS Express makes HMR seem very slow, because when it's reverse-proxying an EventStream response
            // from Kestrel, it doesn't pass through the lines to the browser immediately, even if you're calling
            // response.Flush (or equivalent) in your ASP.NET Core code. For some reason, it waits until the following
            // line is sent. By default, that wouldn't be until the next HMR heartbeat, which can be up to 5 seconds later.
            // In effect, it looks as if your code is taking 5 seconds longer to compile than it really does.
            //
            // As a workaround, this connect middleware intercepts requests to the HMR endpoint, and modifies the response
            // stream so that all EventStream 'data' lines are immediately followed with a further blank line. This is
            // harmless in non-IIS-Express cases, because it's OK to have extra blank lines in an EventStream response.
            // The implementation is simplistic - rather than using a true stream reader, we just patch the 'write'
            // method. This relies on webpack's HMR code always writing complete EventStream messages with a single
            // 'write' call. That works fine today, but if webpack's HMR code was changed, this workaround might have
            // to be updated.
            var eventStreamLineStart = /^data\:/;
            return function (req, res, next) {
                // We only want to interfere with requests to the HMR endpoint, so check this request matches
                var urlMatchesPath = (req.url === path) || (req.url.split('?', 1)[0] === path);
                if (urlMatchesPath) {
                    var origWrite_1 = res.write;
                    res.write = function (chunk) {
                        var result = origWrite_1.apply(this, arguments);
                        // We only want to interfere with actual EventStream data lines, so check it is one
                        if (typeof (chunk) === 'string') {
                            if (eventStreamLineStart.test(chunk) && chunk.charAt(chunk.length - 1) === '\n') {
                                origWrite_1.call(this, '\n\n');
                            }
                        }
                        return result;
                    };
                }
                return next();
            };
        }
        function copyRecursiveToRealFsSync(from, rootDir, exclude) {
            from.readdirSync(rootDir).forEach(function (filename) {
                var fullPath = pathJoinSafe(rootDir, filename);
                var shouldExclude = exclude.filter(function (re) { return re.test(fullPath); }).length > 0;
                if (!shouldExclude) {
                    var fileStat = from.statSync(fullPath);
                    if (fileStat.isFile()) {
                        var fileBuf = from.readFileSync(fullPath);
                        fs.writeFileSync(fullPath, fileBuf);
                    }
                    else if (fileStat.isDirectory()) {
                        if (!fs.existsSync(fullPath)) {
                            fs.mkdirSync(fullPath);
                        }
                        copyRecursiveToRealFsSync(from, fullPath, exclude);
                    }
                }
            });
        }
        function ensureLeadingSlash(value) {
            if (value !== null && value.substring(0, 1) !== '/') {
                value = '/' + value;
            }
            return value;
        }
        function pathJoinSafe(rootPath, filePath) {
            // On Windows, MemoryFileSystem's readdirSync output produces directory entries like 'C:'
            // which then trigger errors if you call statSync for them. Avoid this by detecting drive
            // names at the root, and adding a backslash (so 'C:' becomes 'C:\', which works).
            if (rootPath === '/' && path.sep === '\\' && filePath.match(/^[a-z0-9]+\:$/i)) {
                return filePath + '\\';
            }
            else {
                return path.join(rootPath, filePath);
            }
        }
        function beginWebpackWatcher(webpackConfig) {
            var compiler = webpack(webpackConfig);
            compiler.watch(webpackConfig.watchOptions || {}, function (err, stats) {
                // The default error reporter is fine for now, but could be customized here in the future if desired
            });
        }
        function createWebpackDevServer(callback, optionsJson) {
            var options = JSON.parse(optionsJson);
            // Enable TypeScript loading if the webpack config is authored in TypeScript
            if (path.extname(options.webpackConfigPath) === '.ts') {
                try {
                    require('ts-node/register');
                }
                catch (ex) {
                    throw new Error('Error while attempting to enable support for Webpack config file written in TypeScript. Make sure your project depends on the "ts-node" NPM package. The underlying error was: ' + ex.stack);
                }
            }
            // See the large comment in WebpackTestPermissions.ts for details about this
            if (!webpackTestPermissions.hasSufficientPermissions()) {
                console.log('WARNING: Webpack dev middleware is not enabled because the server process does not have sufficient permissions. You should either remove the UseWebpackDevMiddleware call from your code, or to make it work, give your server process user account permission to write to your application directory and to read all ancestor-level directories.');
                callback(null, {
                    Port: 0,
                    PublicPaths: []
                });
                return;
            }
            // Read the webpack config's export, and normalize it into the more general 'array of configs' format
            var webpackConfigModuleExports = requireNewCopyProvider.requireNewCopy(options.webpackConfigPath);
            var webpackConfigExport = webpackConfigModuleExports.__esModule === true
                ? webpackConfigModuleExports.default
                : webpackConfigModuleExports;
            if (webpackConfigExport instanceof Function) {
                // If you export a function, then Webpack convention is that it takes zero or one param,
                // and that param is called `env` and reflects the `--env.*` args you can specify on
                // the command line (e.g., `--env.prod`).
                // When invoking it via WebpackDevMiddleware, we let you configure the `env` param in
                // your Startup.cs.
                webpackConfigExport = webpackConfigExport(options.suppliedOptions.EnvParam);
            }
            var webpackConfigThenable = isThenable(webpackConfigExport)
                ? webpackConfigExport
                : { then: function (callback) { return callback(webpackConfigExport); } };
            webpackConfigThenable.then(function (webpackConfigResolved) {
                var webpackConfigArray = webpackConfigResolved instanceof Array ? webpackConfigResolved : [webpackConfigResolved];
                var enableHotModuleReplacement = options.suppliedOptions.HotModuleReplacement;
                var enableReactHotModuleReplacement = options.suppliedOptions.ReactHotModuleReplacement;
                if (enableReactHotModuleReplacement && !enableHotModuleReplacement) {
                    callback('To use ReactHotModuleReplacement, you must also enable the HotModuleReplacement option.', null);
                    return;
                }
                // The default value, 0, means 'choose randomly'
                var suggestedHMRPortOrZero = options.suppliedOptions.HotModuleReplacementServerPort || 0;
                var app = connect();
                var listener = app.listen(suggestedHMRPortOrZero, function () {
                    try {
                        // For each webpack config that specifies a public path, add webpack dev middleware for it
                        var normalizedPublicPaths_1 = [];
                        webpackConfigArray.forEach(function (webpackConfig) {
                            if (webpackConfig.target === 'node') {
                                // For configs that target Node, it's meaningless to set up an HTTP listener, since
                                // Node isn't going to load those modules over HTTP anyway. It just loads them directly
                                // from disk. So the most relevant thing we can do with such configs is just write
                                // updated builds to disk, just like "webpack --watch".
                                beginWebpackWatcher(webpackConfig);
                            }
                            else {
                                // For configs that target browsers, we can set up an HTTP listener, and dynamically
                                // modify the config to enable HMR etc. This just requires that we have a publicPath.
                                var publicPath = (webpackConfig.output.publicPath || '').trim();
                                if (!publicPath) {
                                    throw new Error('To use the Webpack dev server, you must specify a value for \'publicPath\' on the \'output\' section of your webpack config (for any configuration that targets browsers)');
                                }
                                var publicPathNoTrailingSlash = removeTrailingSlash(publicPath);
                                normalizedPublicPaths_1.push(publicPathNoTrailingSlash);
                                // This is the URL the client will connect to, except that since it's a relative URL
                                // (no leading slash), Webpack will resolve it against the runtime <base href> URL
                                // plus it also adds the publicPath
                                var hmrClientEndpoint = removeLeadingSlash(options.hotModuleReplacementEndpointUrl);
                                // This is the URL inside the Webpack middleware Node server that we'll proxy to.
                                // We have to prefix with the public path because Webpack will add the publicPath
                                // when it resolves hmrClientEndpoint as a relative URL.
                                var hmrServerEndpoint = ensureLeadingSlash(publicPathNoTrailingSlash + options.hotModuleReplacementEndpointUrl);
                                // We always overwrite the 'path' option as it needs to match what the .NET side is expecting
                                var hmrClientOptions = options.suppliedOptions.HotModuleReplacementClientOptions || {};
                                hmrClientOptions['path'] = hmrClientEndpoint;
                                var dynamicPublicPathKey = 'dynamicPublicPath';
                                if (!(dynamicPublicPathKey in hmrClientOptions)) {
                                    // dynamicPublicPath default to true, so we can work with nonempty pathbases (virtual directories)
                                    hmrClientOptions[dynamicPublicPathKey] = true;
                                }
                                else {
                                    // ... but you can set it to any other value explicitly if you want (e.g., false)
                                    hmrClientOptions[dynamicPublicPathKey] = JSON.parse(hmrClientOptions[dynamicPublicPathKey]);
                                }
                                attachWebpackDevMiddleware(app, webpackConfig, enableHotModuleReplacement, enableReactHotModuleReplacement, hmrClientOptions, hmrServerEndpoint);
                            }
                        });
                        // Tell the ASP.NET app what addresses we're listening on, so that it can proxy requests here
                        callback(null, {
                            Port: listener.address().port,
                            PublicPaths: normalizedPublicPaths_1
                        });
                    }
                    catch (ex) {
                        callback(ex.stack, null);
                    }
                });
            }, function (err) { return callback(err.stack, null); });
        }
        function removeLeadingSlash(str) {
            if (str.indexOf('/') === 0) {
                str = str.substring(1);
            }
            return str;
        }
        function removeTrailingSlash(str) {
            if (str.lastIndexOf('/') === str.length - 1) {
                str = str.substring(0, str.length - 1);
            }
            return str;
        }
        function firstIndexOfStringStartingWith(array, prefixToFind) {
            for (var index = 0; index < array.length; index++) {
                var candidate = array[index];
                if ((typeof candidate === 'string') && (candidate.substring(0, prefixToFind.length) === prefixToFind)) {
                    return index;
                }
            }
            return -1; // Not found
        }
        function npmModuleIsPresent(moduleName) {
            try {
                require.resolve(moduleName);
                return true;
            }
            catch (ex) {
                return false;
            }
        }

        aspNetWebpack = {
            createWebpackDevServer: createWebpackDevServer
        }
    })();

    if (aspNetWebpack == null) {
        callback('Webpack dev middleware failed because of an error while loading \'aspnet-webpack\'. Error was: '
            + exStack
            + '\nCurrent directory is: '
            + process.cwd());
        return;
    }

    aspNetWebpack.createWebpackDevServer(callback, runArgs);
};