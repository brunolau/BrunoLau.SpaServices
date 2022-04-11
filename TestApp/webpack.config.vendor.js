const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    const isDevBuild = (env == null || env.production != true);

    return [{
        stats: { modules: false },
        resolve: { extensions: ['.js'] },
        entry: {
            vendor: [
                'bootstrap',
                'bootstrap/dist/css/bootstrap.min.css',
                'event-source-polyfill',
                'jquery',
                'vue',
                'vue-router'
            ],
        },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: [isDevBuild ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"] },
                { test: /\.(png)(\?|$)/, use: 'url-loader?limit=100000' },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                }

            ]
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        optimization: {
            minimize: !isDevBuild
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    }];
};
