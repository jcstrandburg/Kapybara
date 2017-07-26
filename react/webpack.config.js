var webpack = require('webpack');

var config = {
   entry: './main.js',

   output: {
      path: __dirname+'/',
      filename: '../static/index.js',
   },

   devServer: {
      inline: true,
      port: 8080
   },

   devtool: 'cheap-module-eval-source-map',

   plugins: [
      new webpack.ProvidePlugin({
         "React": "react",
      }),
   ],

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
