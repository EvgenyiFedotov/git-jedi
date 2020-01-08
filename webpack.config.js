const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = [
  {
    mode: "development",
    entry: "./src/electron.ts",
    target: "electron-main",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }]
        }
      ]
    },
    output: {
      path: __dirname + "/dist",
      filename: "electron.js"
    }
  },
  {
    mode: "development",
    entry: "./src/index.tsx",
    target: "electron-renderer",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: ["ts-loader"]
        }
      ]
    },
    resolve: {
      modules: ["node_modules", path.resolve(__dirname, "src")],
      extensions: [".js", ".ts", ".json", ".tsx"]
    },
    output: {
      path: __dirname + "/dist",
      filename: "react.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      })
    ]
  }
];
