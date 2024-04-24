const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const modeConfig = (env) => require(`./build-utils/webpack.${env.mode}.js`)(env);

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const polyfills = [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: 'vendor',
    flatten: true
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: 'vendor/bundles',
    flatten: true
  },
  {
    from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: 'vendor',
    flatten: true
  }
];

const assets = [
  {
    from: 'src/img',
    to: 'img/'
  },
  {
    from: './node_modules/leaflet/dist',
    to: 'assets/leaflet',
},
];

const plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  }),
  new CopyWebpackPlugin([ ...assets], {
    ignore: ['.DS_Store']
  })
];

module.exports = ({ mode, presets }) => {
  return webpackMerge(
    {
      mode,
      entry: "./src/index.ts",
      output: {
        filename: '[name].[chunkhash:8].js',
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            options: { allowTsInNodeModules: true },
          },
          {
            test: /\.png$/,
            use: ["file-loader"],
          },
          
        ]
      },
      plugins
    },
    modeConfig({ mode, presets }),
  );
};
