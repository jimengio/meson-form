module.exports = {
  minSize: 30000,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  cacheGroups: {
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      minSize: 0,
      minChunks: 1,
      name: "vendors",
    },
  },
};
