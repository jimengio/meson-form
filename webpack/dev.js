var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
let HtmlIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

let { matchCssRule, matchFontsRule, matchTsRule } = require("./shared");
let splitChunks = require("./split-chunks");
let dllManifest = require("./dll/manifest.json");

module.exports = {
  mode: "development",
  entry: ["./example/main.tsx"],
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  devtool: "cheap-source-map",
  module: {
    rules: [matchCssRule, matchFontsRule, matchTsRule],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "meson-form$": path.resolve(__dirname, "../src/form.tsx"),
    },
  },
  devServer: {
    contentBase: __dirname,
    publicPath: "/",
    compress: true,
    clientLogLevel: "info",
    disableHostCheck: true,
    host: "0.0.0.0",
    stats: {
      all: false,
      colors: true,
      errors: true,
      errorDetails: true,
      performance: true,
      reasons: true,
      timings: true,
      warnings: true,
    },
  },
  optimization: {
    minimize: false,
    namedModules: true,
    chunkIds: "named",
    splitChunks: splitChunks,
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll/manifest.json"),
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
    }),
    new HtmlIncludeAssetsPlugin({
      assets: [`dll/${dllManifest.name}.js`],
      append: false,
    }),
  ],
};
