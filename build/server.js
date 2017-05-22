const express = require('express')
const router = express.Router()
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.js')

// create our Express app
const app = express()

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'dist')))

let compiler

try {
    compiler = webpack(webpackConfig)
} catch (err) {
    console.log(err.message)
    process.exit(1)
}

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        maxModules: 0,
        colors: true,
        children: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        modules: false
    }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, { log: () => {} })

// reload page when views are changed
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// serve webpack bundle output
app.use(devMiddleWare)

app.use(hotMiddleware)

// Start our app!
console.log('> Starting dev server...')
devMiddleWare.waitUntilValid(() => {
    app.set('port', process.env.PORT || 9999)
    const server = app.listen(app.get('port'), () => {
        console.log(`🚀  Express running → at http://localhost:${server.address().port}`)
    })
})
