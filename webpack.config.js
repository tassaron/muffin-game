const webpack = require("webpack");
const path = require("path");
const TerserPlugin =  require('terser-webpack-plugin')

module.exports = (env, argv) => {
    const config = {
        context: path.resolve(__dirname, 'src'),
        entry: ['./main.ts'],
        module: {
            rules: [
                /*{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },*/
                {
                    test: /\.(ts|js)?/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
    };

    if (argv.mode == "production") {
        const TerserPlugin = require('terser-webpack-plugin');
        config.optimization = {
            minimizer: [new TerserPlugin({})],
        }
    } else if (argv.mode == "development") {
        config.devtool = 'source-map';
    }

    return config;
}