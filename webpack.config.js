const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'webworker', // Ensures that the build works for Cloudflare Workers
  entry: './src/main.ts', // Path to your Nest.js entry point
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()], // Exclude Node.js built-ins
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
