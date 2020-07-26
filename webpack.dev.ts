import commonWebpackConfiguration from './webpack.common';
import { merge } from 'webpack-merge';
import webpack from 'webpack';

const config: webpack.Configuration = merge(commonWebpackConfiguration, {
  mode: 'development',
  devtool: 'inline-source-map',

  module: {
    rules: [],
  },
  plugins: [],
});

export default config;
