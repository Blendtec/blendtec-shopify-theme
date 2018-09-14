const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');


const copyWebpackPluginConf = new CopyWebpackPlugin([
  {from: './src/assets/fonts/**/*.{ttf,woff,eof,svg}', to: 'assets', flatten: true},
  {from: './src/assets/images', to: 'assets'},
  {from: './src/assets/**/*.liquid', to: 'assets', flatten: true},
  // LEGACY SCRIPTS - These have not been migrated to ES5 and are being copied directly
  {from: './src/assets/scripts/static/jquery.currencies.min.js', to: 'assets', flatten: true},
  {from: './src/assets/scripts/static/price-spider.js', to: 'assets', flatten: true},
  {from: './src/assets/scripts/static/raf.js', to: 'assets', flatten: true},
  {from: './src/assets/scripts/static/vendor.min.js', to: 'assets', flatten: true},
  {from: './src/assets/scripts/static/respond.min.js', to: 'assets', flatten: true},
  // END LEGACY SCRIPTS
  {from: './src/assets/styles/**/*.css', to: 'assets', flatten: true},
  {from: './src/assets/svg', to: 'assets', flatten: true},
  {from: './src/config', to: 'config'},
  {from: './src/layout', to: 'layout'},
  {from: './src/locales', to: 'locales'},
  {from: './src/sections', to: 'sections'},
  {from: './src/snippets', to: 'snippets'},
  {from: './src/templates', to: 'templates'},
]);

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'assets/[name].bundle.css'
});

const optimizeCssAssetPlugin = new OptimizeCssAssetsPlugin({})

module.exports = {
  entry: {
    app: './src/assets/scripts/layout/app.js',
    sections: './src/assets/scripts/sections/sections.js',
    blog: './src/assets/scripts/templates/blog.js',
    collection: './src/assets/scripts/templates/collection.js',
    index: './src/assets/scripts/templates/index.js',
    registration: './src/assets/scripts/templates/registration.js',
    warranty: './src/assets/scripts/templates/warranty.js',
    vendor: ['lodash', 'slick-carousel', 'imagesloaded', 'lazysizes'],
  },
  externals: {
    jquery: 'jQuery',
    slick: 'slick',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].bundle.js',
  },

  plugins: [
    copyWebpackPluginConf,
    miniCssExtractPlugin
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ],
    },
    { 
      test: /vendor\/.+\.(jsx|js)$/,
      loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      },
    },
    ],
  }, 
  optimization: {
    minimizer: [
      optimizeCssAssetPlugin
    ]
  }
};
