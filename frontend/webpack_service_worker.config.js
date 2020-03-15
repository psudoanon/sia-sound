const path 	                = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const InlineSourcePlugin    = require('html-webpack-inline-source-plugin');
const webpack               = require('webpack'); 

const service_worker_config = (env) => {
    return {
        module: {},
        name: 'service_worker_config',
        entry: './src/service_worker.js',
        output: {
            filename: 'service_worker.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new webpack.DefinePlugin({
                SIA_UUID: JSON.stringify('/' + env.uuid),
                PWA_CACHE_NAME: env.uuid.toUpperCase()
            })
        ]
    }
}

module.exports = env => {
    return [
        service_worker_config(env),
    ]
}
