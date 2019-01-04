const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry:  path.join(__dirname, 'src/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [ /\.vue$/ ],
                }
            },
            {
                test: /\.css$/,
                use: [ "vue-style-loader", "css-loader" ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
}
