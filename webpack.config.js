const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = require("./env.json");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

process.env.NODE_ENV === process.env.NODE_ENV || "development"; // development | production
process.env.BUILD_ENV === process.env.BUILD_ENV || "prd"; // dev | qa | uat | prd
const isDev = process.env.NODE_ENV === "development" ? true : false;
const apiUrl = env[process.env.BUILD_ENV].apiUrl;
const publicPath = env[process.env.BUILD_ENV].publicPath;
const version = env[process.env.BUILD_ENV].version;
console.log(`========= LOG ENV ======== `);
console.log("apiUrl: ", apiUrl);
console.log("publicPath: ", publicPath);
console.log("version: ", version);
const entry = {};
const plugins = [];

entry.main = ["./src/index.tsx"];
plugins.push(
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    VERSION: version,
    API_URL: apiUrl
  })
);
plugins.push(
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: isDev ? "./src/index.dev.html" : "./src/index.html"
  })
);
plugins.push(new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }));
if (process.env.analyze) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "server",
      analyzerHost: "127.0.0.1",
      analyzerPort: 8889,
      reportFilename: "report.html",
      defaultSizes: "parsed",
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: "stats.json",
      statsOptions: null,
      logLevel: "info"
    })
  );
}

const threadLoaderOptions = {
  // there should be 1 cpu for the fork-ts-checker-webpack-plugin
  workers: require("os").cpus().length - 1
};

const config = {
  mode: process.env.NODE_ENV,
  target: "web",
  context: __dirname,
  entry: entry,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[chunkhash].js",
    globalObject: "this",
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "thread-loader",
            options: threadLoaderOptions
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "thread-loader",
            options: threadLoaderOptions
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "thread-loader",
            options: threadLoaderOptions
          },
          "css-loader",
          "less-loader"
        ]
      }
    ]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".tsx", ".less"],
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  plugins: plugins,
  devServer: {
    contentBase: path.resolve(__dirname, "src"),
    historyApiFallback: true,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    },
    port: 8000,
    hot: true
  }
};

if (isDev) {
  threadLoaderOptions.poolTimeout = Infinity;
} else {
  console.log("use UglifyJSPlugin==================================");
  compressOption = {};
  if (process.env.BUILD_ENV === "prd") {
    console.log("remove console.log");
    compressOption.pure_funcs = ["console.log"];
    compressOption.drop_debugger = true;
  }

  config.optimization = {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          compress: compressOption
        }
      })
    ]
  };
}

module.exports = config;
