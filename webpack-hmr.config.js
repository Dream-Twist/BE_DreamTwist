/**
File Name : webpack-hmr.config
Description : Webpack HMR Config
Author : 박수정

History
Date        Author      Status      Description
2024.07.23  박수정      Created     
2024.07.23  박수정      Modified     Hot Reload 설정
*/

const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/],
            }),
            new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false }),
        ],
    };
};
