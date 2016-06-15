const webpack = require('webpack');
const HappyPack = require('happypack');

const config = {
  devtool: 'eval-source-map',
  entry: './client/index.jsx',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'happypack/loader'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/client/dist', // eslint-disable-line
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './client/dist',
    hot: true
  }
};

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ comments: false }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new HappyPack({
      loaders: ['babel']
    })
  ];
}

module.exports = config;
