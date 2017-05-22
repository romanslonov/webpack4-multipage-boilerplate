const { join, resolve } = require('path')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const utils = require('./utils')

var entries = utils.getEntries('./src/pages/', 'js') // Obtain entry js file
var chunks = Object.keys(entries)

const config = {
    entry: entries,
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        publicPath: '/',
        chunkFilename: '[id].js'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            assets: join(__dirname, '../src/assets'),
            pages: join(__dirname, '../src/pages')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.pug/,
                use: [
                    { loader: 'html-loader' },
                    { loader: 'pug-html-loader', options: { pretty: true }}
                ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Extraction vendor icnludes 3d libraries from node_modules
        new CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.js',
            minChunks (module, count) {
                var context = module.context
                return context && context.indexOf('node_modules') >= 0
            }
        }),
        // Extraction common module
        new CommonsChunkPlugin({
            name: 'common', // The name of the common module
            filename: 'js/common.js',
            chunks: chunks,  // chunks need to extract module
            minChunks: chunks.length
        }),
        new ExtractTextPlugin('styles.css')
    ],
    devtool: '#eval-source-map'
}

module.exports = config


// Add webpack-hot-middleware/client
Object.keys(config.entry).forEach(key => {
    config.entry[key] = [
        path.join(__dirname, 'dev-client.js'),
        config.entry[key]
    ]
})

if (process.env.NODE_ENV === 'production') {
    // minimize webpack output
    module.exports.stats = {
        // Add children information
        children: false,
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,
        // Add built modules information to chunk information
        chunkModules: false,
        chunkOrigins: false,
        modules: false,
        maxModules: 0
    }
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}

var pages = utils.getEntries('./src/pages/', 'pug')
for (var pathname in pages) {
    // Configured to generate the html file, define paths, etc.
    var conf = {
        filename: pathname + '.html', // html output pathname
        template: pages[pathname], // Template path
        inject: true,              // js insertion
        chunks: ['common', 'vendor', pathname]
    }
    config.plugins.push(new HtmlWebpackPlugin(conf))
}
