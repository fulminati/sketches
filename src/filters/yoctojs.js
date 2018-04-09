
const fs = require('fs')
    , glob = require('glob')
    , minify = require('html-minifier').minify
    , dirname = require('path').dirname

module.exports = {

    selector: new RegExp('@loadhtml\\("(.*)"\\)', 'gm'),

    onBeforeVerify: function (sketch) {
        var files = glob.sync('**/*.ino', { cwd: sketch.path, absolute: true })

        for (var i in files) {
            if (files.hasOwnProperty(i)) {
                var code = fs.readFileSync(files[i]).toString()
                if (code.match(this.selector)) {
                    fs.writeFileSync(files[i] + '.loadhtml', code)
                    code = code.replace(this.selector, function (token, file) {
                        html = fs.readFileSync(dirname(files[i]) + '/' + file).toString()
                        html = minify(html, {
                            removeComments: true,
                            collapseWhitespace: true,
                            conservativeCollapse: false,
                            collapseInlineTagWhitespace: true,
                            collapseBooleanAttributes: true,
                            removeAttributeQuotes: true,
                            removeTagWhitespace: true,
                            processScripts: ['text/ng-template'],
                            minifyCSS: true,
                            minifyJS: { mangle: false }
                        })
                        html = html.match(new RegExp('.{1,' + 70 + '}', 'g'));
                        return 'String() \n\t+ "' + html.join('" \n\t+ "') + '"'
                    })
                    fs.writeFileSync(files[i], code)
                }
            }
        }
    },

    onAfterVerify: function (sketch) {



    }

}
