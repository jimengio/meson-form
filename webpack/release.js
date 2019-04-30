var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
let HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
// let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
let DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
let ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

let { matchCssRule, matchFontsRule, matchTsReleaseRule } = require("./shared");
let splitChunks = require("./split-chunks");
let dllManifest = require("./dll/manifest-release.json");

module.exports = {
  mode: "production",
  entry: {
    main: ["./example/main.tsx"],
  },
  output: {
    filename: "[name].[chunkhash:8].js",
    path: path.join(__dirname, "../dist"),
  },
  devtool: "none",
  optimization: {
    minimize: true,
    namedModules: true,
    chunkIds: "named",
    splitChunks: splitChunks,
  },
  module: {
    rules: [matchCssRule, matchFontsRule, matchTsReleaseRule],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "meson-form$": path.resolve(__dirname, "../src/form.tsx"),
    },
  },
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
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true, async: false }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll/manifest-release.json"),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
    }),
    new HtmlWebpackTagsPlugin({
      tags: [`${dllManifest.name}.js`],
      append: false,
    }),
    new DuplicatePackageCheckerPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
