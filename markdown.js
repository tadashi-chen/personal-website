/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';
    var noop = function() {};

    var path = require('path');

    Date.prototype.format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    // Internal lib.
    var markdown = require('./lib/markdown').init(grunt);

    grunt.registerMultiTask('markdown', 'Compiles markdown files into html.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            htmlExtension: 'html',
            markdownExtension: 'md',
            markdownOptions: {},
            preCompile: noop,
            postCompile: noop,
            templateContext: {},
            contextBinder: false,
            contextBinderMark: '@@@',
            autoTemplate: false,
            autoTemplateFormat: "jst",
            // template: path.join(__dirname, '../../../blog/theme/template.html')
        });

        var template = null;

        grunt.util.async.forEachLimit(this.files, 25, function(file, next) {

            if (options.contextBinder === true) {
                getTemplateContext(file.src);
            }

            if (options.autoTemplate === true) {
                var workingPath = getWorkingPath(file.src),
                    templatePath = getTemplate(workingPath);

                if (templatePath) {
                    options.template = path.join(templatePath);
                }
            }

            template = grunt.file.read(options.template);
            convert(file.src, file.dest, file.orig.dest, next);
        }.bind(this), this.async());

        // Check if template context exists in template
        function checkTemplateContext(file) {

            return new RegExp('(' + options.contextBinderMark + ')(.*?)(' + options.contextBinderMark + ')', 'g').test(file);
        }

        // Apply new template context option to Object
        function setTemplateContext(contextArray) {

            var newTemplateContext = {};
            contextArray.forEach(function(item) {
                var cleanString = item.slice(options.contextBinderMark.length, -options.contextBinderMark.length),
                    separatedPairs = cleanString.split(':');

                newTemplateContext[separatedPairs[0]] = separatedPairs[1];
            });
            options.templateContext = newTemplateContext;
        }

        // Collect context items
        function getTemplateContext(file) {

            var sourceFile = grunt.file.read(file),
                hasTemplateContext = checkTemplateContext(sourceFile),
                pattern = new RegExp('(' + options.contextBinderMark + ')(.*?)(' + options.contextBinderMark + ')', 'g'),
                contextArray;

            if (!hasTemplateContext) {
                return;
            }
            contextArray = sourceFile.match(pattern);
            setTemplateContext(contextArray);
        }
        // Get working path to automaticaly searching for default template.
        function getWorkingPath(file) {

            var completePath = JSON.stringify(file).slice(2, -2).split('/'),
                lastPathElement = completePath.pop(),
                fileDirectory = completePath.splice(lastPathElement).join('/');

            return fileDirectory;
        }

        // Automaticaly find temnplate in working directory.
        function getTemplate(workingPath) {

            var templateFile = grunt.file.expand({}, workingPath + '/*.' + options.autoTemplateFormat);

            return templateFile[0];
        }

        function convert(src, dest, orig, next) {

            var [info, content] = grunt.file.read(src).split('-----');
            info = JSON.parse(info);

            if (info.title) {
                template = template.replace(/\$title/g, info.title)
                template = template.replace(/\$date/g, new Date(info.date).format('yyyy年MM月dd日'))
            }
            
            var content = markdown.markdown( content, options, template );

            var date = new Date(info.date);
            var filePath = orig + date.format('yyyy/MM/') + dest.split('/').pop();
            grunt.file.write(filePath, content);
            grunt.log.writeln('File "' + dest + '" created.');
            process.nextTick(next);
        }
    });

};
