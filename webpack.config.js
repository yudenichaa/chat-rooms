const path = require("path");

module.exports = {
    entry: {
        index: "./src/index.tsx",
    },
    output: {
        path: path.join(__dirname, "public/"),
        filename: "bundle.js",
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            // ts
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            // sass/scss
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: true,
                        },
                    },
                    "sass-loader",
                ],
            },
            // css
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            // images
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                loader: "file-loader",
            },
            // fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
            },
        ],
    },
};
