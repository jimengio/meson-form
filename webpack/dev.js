var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
let HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
let ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

let { matchCssRule, matchFontsRule, matchTsRule, matchMdRule } = require("./shared");
let splitChunks = require("./split-chunks");
let dllManifest = require("./dll/manifest.json");

module.exports = {
  mode: "development",
  entry: ["webpack-hud", "./example/main.tsx"],
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  devtool: "cheap-source-map",
  module: {
    rules: [matchCssRule, matchFontsRule, matchTsRule, matchMdRule],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.join(__dirname, "../example"), "node_modules"],
    alias: {
      "meson-form$": path.resolve(__dirname, "../src/form.tsx"),
      immutable$: path.join(__dirname, "../node_modules/immutable/dist/immutable.min.js"),
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
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true, async: false }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll/manifest.json"),
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
      trackingCode: "",
    }),
    new HtmlWebpackTagsPlugin({
      tags: [`dll/${dllManifest.name}.js`],
      append: false,
    }),
  ],
};
