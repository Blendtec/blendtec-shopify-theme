
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

// const HTMLWebpackPluginConf = new HtmlWebpackPlugin({
//     template: __dirname + '/uibuilder/' + url + '/src/index_template.html',
//     filename: 'index.html'
// });

const copyWebpackPluginConf = new CopyWebpackPlugin([
  {from: './src/assets/fonts/**/*.{ttf,woff,eof,svg}', to: 'assets', flatten: true},
  {from: './src/assets/scripts/layout/app.js', to: 'assets'},
  {from: './src/assets/images', to: 'assets'},
  {from: './src/assets/**/*.liquid', to: 'assets', flatten: true},
  {from: './src/assets/scripts/**/*.js', to: 'assets', flatten: true},
  {from: './src/assets/styles/**/*.css', to: 'assets', flatten: true},
  //{from: './node_modules/slick-carousel/slick/fonts/*.woff', to: 'assets'},
  {from: './src/assets/svg', to: 'assets', flatten: true},
  {from: './src/config', to: 'config'},
  {from: './src/layout', to: 'layout'},
  {from: './src/locales', to: 'locales'},
  {from: './src/sections', to: 'sections'},
  {from: './src/snippets', to: 'snippets'},
  {from: './src/templates', to: 'templates'},
]);

const providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  path: path.resolve(__dirname, 'dist'),
  filename: 'assets/[name].bundle.css',
});
// const UglifyJSPluginConf = new UglifyJSPlugin({
//     uglifyOptions: {
//         compress: {
//             warnings: false,
//         },
//         output: {
//             comments: false
//         },
//     }
// });

// const webpackJQueryPluginConf = new webpack.ProvidePlugin({
//     $: 'jquery',
//     jQuery: 'jquery'
// });

module.exports = {
  entry: {
    app: './src/assets/scripts/layout/app.js',
    home: './src/assets/scripts/templates/home.js',
    vendor: ['jquery', 'lodash', 'slick-carousel'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    providePlugin,
    copyWebpackPluginConf,
    miniCssExtractPlugin,
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
          ],
        },
      },
    },
    ],
  },
};
