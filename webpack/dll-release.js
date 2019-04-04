let fs = require("fs");
let path = require("path");
let webpack = require("webpack");
// let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
let DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

let { matchCssRule, matchFontsRule } = require("./shared");

module.exports = {
  mode: "development",
  entry: ["react", "react-dom", "emotion", "immer", "dayjs", "lodash", "@jimengio/ruled-router"],
  output: {
    filename: "dll_vendors_[hash:8].js",
    path: path.join(__dirname, "../dist"),
    library: "dll_vendors_[hash:8]",
  },
  devtool: "cheap-source-map",
  module: {
    rules: [matchCssRule, matchFontsRule],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new webpack.NamedModulesPlugin(),
    new webpack.DllPlugin({
      name: "dll_vendors_[hash:8]",
      path: path.join(__dirname, "dll/manifest-release.json"),
    }),
    new DuplicatePackageCheckerPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
