const glob = require('glob')

exports.getEntries = function (context, extension) {
    if (context[context.length - 1] !== '/') {
        context += '/'
    }

    extension = '.' + extension

    var files = glob.sync(context + '**/*' + extension)
    var entries = {}

    files.forEach(function (file) {
        entries[file.replace(context, '').replace(extension, '')] = file
    })

    return entries
}
