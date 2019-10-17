import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import commonWebpackConfiguration from './webpack.common';
import merge from 'webpack-merge';
import webpack from 'webpack';

const config: webpack.Configuration = merge(commonWebpackConfiguration, {
  mode: 'production',

  module: {
    rules: [],
  },
  plugins: [],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
});

export default config;
