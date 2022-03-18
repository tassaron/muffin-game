const webpack = require("webpack");
const path = require("path");
const TerserPlugin =  require('terser-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: ['./main.js'],
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
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    plugins:[new TerserPlugin()]
}