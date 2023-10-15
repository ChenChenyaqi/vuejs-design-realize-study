const path = require("path")
module.exports = {
  entry: "./src/05_渲染器/main.js",
  output: {
    path: path.resolve(__dirname, "./src/05_渲染器/build"),
    filename: "build.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [],
  mode: "development",
}
