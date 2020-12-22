const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pluginsArray = [
  // fix "process is not defined" error:
  // (do "npm install process" before running the build)
  new webpack.ProvidePlugin({
    process: 'process/browser',
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
  }),
];

const common = {
  entry: './src/box_date.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        // include: path.join(__dirname, 'src/static/css'),
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: false,
              namedExport: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      commons: path.resolve(__dirname, '../commons'),
    },
  },
  plugins: pluginsArray,
  output: {
    filename: 'libs/[name].[contenthash].js',
    path: path.resolve(__dirname, `./dist`),
    globalObject: 'this',
  },
};


module.exports = (env) => {
  const pluginsArray = [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development'),
    }),
  ];

  if (env && env.analyze) {
    pluginsArray.push(new BundleAnalyzerPlugin());
  }

  return merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true,
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 3000,
    },
    plugins: pluginsArray,
  });
};
