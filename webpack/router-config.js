var fs = require("fs");
var path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
// let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const distFolder = "dist";

module.exports = {
  mode: "development",
  target: "node",
  entry: ["./example/gen-router.ts"],
  output: {
    filename: "gen-router.js",
    path: path.join(__dirname, "../", distFolder),
  },
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, path.join(__dirname, "scripts")],
        use: [
          { loader: "cache-loader" },
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus().length - 1,
            },
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              transpileOnly: true,
            },
          },
        ],
      },
    ],
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
  externals: {
    prettier: "commonjs prettier",
    "@jimengio/router-code-generator": "commonjs @jimengio/router-code-generator",
    fs: "commonjs fs",
    path: "commonjs path",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.join(__dirname, "example"), "node_modules"],
    plugins: [new TsconfigPathsPlugin({ configFile: path.join(__dirname, "../tsconfig.json") })],
  },
  plugins: [
    // lines
    // new BundleAnalyzerPlugin(),
  ],
};
