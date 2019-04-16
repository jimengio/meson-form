exports.matchCssRule = {
  test: /\.css$/,
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
  ],
};

exports.matchFontsRule = {
  test: /\.(eot|svg|ttf|jpg|png|woff|woff2?)(\?.+)?$/,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "assets/[hash:8].[ext]",
      },
    },
  ],
};

exports.matchTsRule = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: [
    { loader: "cache-loader" },
    {
      loader: "thread-loader",
      options: {
        workers: require("os").cpus().length - 1,
        poolTimeout: Infinity,
      },
    },
    {
      loader: "ts-loader",
      options: {
        happyPackMode: true,
      },
    },
  ],
};

exports.matchTsReleaseRule = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
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
      },
    },
  ],
};
