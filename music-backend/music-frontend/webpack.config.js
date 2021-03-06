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


const main_config = (env) => {
    return {
        entry: './src/index_dev.js',
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
                TEST_STR: JSON.stringify('test'),
                SIA_UUID: JSON.stringify(env.uuid),
                SERVICE_WORKER_SCRIPT: JSON.stringify('/'+env.serviceworkerhash),//JSON.stringify('/service_worker.js'),
								SW_SCOPE: JSON.stringify( env.uuid),
            }), 
            new HtmlWebpackPlugin({
                title: 'Variable Injection Works',
                service_worker_script: '/service_worker.js',
                sia_uuid: env.uuid,
                template: './src/index.html',
                inlineSource: '.(js|css)$'
            }),
            new InlineSourcePlugin()
        ]
    }
}

module.exports = env => {
    return [
//        service_worker_config(env),
        main_config(env),
    ]
}
