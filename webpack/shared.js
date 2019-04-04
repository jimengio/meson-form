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
  loader: "awesome-typescript-loader",
  exclude: /node_modules/,
};
