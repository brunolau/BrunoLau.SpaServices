const path = require('path');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const CheckerPlugin = require('ts-loader').CheckerPlugin;

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const buildMode = (isDevBuild ? 'development' : 'production');
    const bundleOutputDir = (isDevBuild ? './wwwroot/dist' : './wwwroot/dist'); //demo purpose
    //const tsNameof = require("ts-nameof");
    console.log('Building for ' + buildMode + ' environment');

    return [{
        mode: buildMode,
        devtool: false,
        context: __dirname,
        resolve: { extensions: ['.js', '.ts', '.tsx', '.json'] },
        entry: { 'app': './ClientApp/boot.ts' },
        performance: {
            hints: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    exclude: [/node_modules/, /wwwroot/],
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: './tsconfig.json',

                                useCache: true,
                                useTranspileModule: false,
                                forceIsolatedModules: true,

                                useBabel: true,
                                babelOptions: {
                                    babelrc: false, /* Important line */
                                    presets: ["env", "es2015", "stage-2"],
                                    plugins: ["jsx-v-model", "transform-vue-jsx"]
                                },
                            },
                        }
                    ]
                },
                //{
                //    test: /\.svg$/,
                //    loader: 'svg-inline-loader'
                //}
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ['style-loader', 'css-loader'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.(ttf|woff2|woff|eot)$/, use: 'file-loader' }
            ]
        },
        output: {
            pathinfo: false,
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            chunkFilename: isDevBuild ? '[name].js' : 'splitted/[name]-chunk.[chunkhash:8]-[contenthash:6].js',
            publicPath: (isDevBuild ? '/dist-dev/' : '/dist/')
        },
        optimization: {
            minimize: !isDevBuild
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new HardSourceWebpackPlugin(),
            new webpack.EvalSourceMapDevToolPlugin({
                filename: "[file].map",
                fallbackModuleFilenameTemplate: '[absolute-resource-path]',
                moduleFilenameTemplate: '[absolute-resource-path]',
            })
        ] : [
                // Plugins that apply in production builds only
                //new webpack.optimize.UglifyJsPlugin()
                //new ExtractTextPlugin({
                //    filename: '[name].css',
                //    allChunks: true,
                //    ignoreOrder: true
                //})
            ])
    }];
};
