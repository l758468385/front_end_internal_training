const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode:'development',
    resolve: {
        extensions: [".js", ".jsx"], // 引入 js jsx文件时，引入路径不需携带文件后缀
        // 设置别名，@ 直接指向 src 目录
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader",                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 小于8KB的文件转换为base64格式
                            name: 'images/[name].[hash:8].[ext]' // 输出文件名格式
                        }
                    }
                ]
            },

            {test: /\.css$/, use: ["style-loader", "css-loader"]},
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ],
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'dist')
        },
        port: 3456
    }
};
