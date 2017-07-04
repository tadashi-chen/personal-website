module.exports = function(grunt) {

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

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            website: {
                files: {
                    './dist/assets/js/base.min.js': './assets/js/base.js'
                }
            },
            blog: {
                files: {
                    './dist/blog/assets/js/base.min.js': './blog/assets/js/base.js'
                }
            }
        },
        clean: {
            blog: {
                src: ['./dist/blog/']
            },
            website: {
                src: ['./dist']
            }
        },
        copy: {
            website: {
                files: [{
                    expand: true,
                    cwd: "./assets/css/fonts/",
                    src: ['*'],
                    dest: './dist/assets/css/fonts/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: "./assets/img/",
                    src: ['*'],
                    dest: './dist/assets/img/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    src: ['favicon.ico'],
                    dest: './dist/',
                    filter: 'isFile'
                }],
            },
            blog: {
                files: [{
                    expand: true,
                    cwd: "./blog/assets/img/",
                    src: ['*'],
                    dest: './dist/blog/assets/img/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: "./assets/css/fonts/",
                    src: ['*'],
                    dest: './dist/blog/assets/css/fonts/',
                    filter: 'isFile'
                }]
            }
        },
        cssmin: {
            website: {
                files: [{
                    expand: false, // true: 压缩为多个文件 false: 合并为一个文件
                    // cwd: 'assets/css/',
                    src: [
                        './assets/css/style.css',
                        './assets/css/base.css',
                        './assets/css/reset.css',
                        './assets/css/media.css',
                        './assets/css/index.css'
                    ],
                    // src: ['base.css', 'reset.css', 'media.css', 'index.css'],
                    dest: './dist/assets/css/base.min.css',
                    // ext: '.min.css'
                }]
            },
            blog: {
                files: [{
                    expand: false,
                    src: [
                        './assets/css/style.css',
                        './blog/assets/css/base.css',
                        './blog/assets/css/reset.css',
                        './blog/assets/css/media.css',
                        './blog/assets/css/index.css'
                    ],
                    dest: './dist/blog/assets/css/base.min.css',
                }]
            }
        },
        htmlmin: {
            website: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    './dist/index.html': './index.html'
                }
            },
            blog: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: './blog/',
                    src: '*.html',
                    dest: './dist/blog/',
                    ext: '.html'
                }]
            },
            blogs: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: './blog/',
                    src: '*/*/*.html',
                    dest: './dist/blog/',
                    ext: '.html'
                }]
            }
        },
        markdown: {
            all: {
                options: {
                    template: './blog/theme/tpl-blog.html',
                    // markdownOptions: {
                    //     // gfm: true,
                    //     // highlight: 'manual',
                    //     codeLines: {
                    //         before: '<span>',
                    //         after: '</span>'
                    //     }
                    // }
                },
                files: [{
                    expand: true,
                    cwd: './blog/post/',
                    src: '*.md',
                    dest: './blog/',
                    ext: '.html'
                }]
            }
        },
        //生成博客主页
        page: {
            all: {
                files: [{
                    expand: true,
                    cwd: './blog/post/',
                    src: '*.md',
                    dest: './blog/',
                    ext: '.html'
                }]
            }
        },
        sass: {
            main: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: [
                    { './assets/css/index.css': './assets/css/index.scss' },
                    { './assets/css/media.css': './assets/css/media.scss' },
                    { './blog/assets/css/index.css': './blog/assets/css/index.scss' },
                    { './blog/assets/css/media.css': './blog/assets/css/media.scss' },
                ]
            }
        },
        //更换引入css与js的标签
        tag: {
            // website: {

            // },
            //博客首页与归档
            blog: {
                files: [{
                    expand: true,
                    cwd: './blog/',
                    src: '*.html',
                    dest: './blog/',
                    ext: '.html'
                }],
                js: '<script src="./assets/js/base.min.js"></script>',
                css: '<link rel="stylesheet" type="text/css" href="./assets/css/base.min.css">'
            },
            //博客文章
            blogs: {
                files: [{
                    expand: true,
                    cwd: './blog/',
                    src: '*/*/*.html',
                    dest: './blog/',
                    ext: '.html'
                }],
                js: '<script src="../../assets/js/base.min.js"></script>',
                css: '<link rel="stylesheet" type="text/css" href="../../assets/css/base.min.css">'
            }
        },
        uglify: {
            options: {
                banner: '/*! Update time: <%= grunt.template.date("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            website: {
                files: [
                    { './dist/assets/js/base.min.js': ['./dist/assets/js/base.min.js'] }
                ]
            },
            blog: {
                files: [{
                    './dist/blog/assets/js/base.min.js': ['./dist/blog/assets/js/base.min.js']
                }]
            }
        },
        watch: {
            css: {
                files: [
                    './assets/css/index.scss',
                    './assets/css/media.scss',
                    './blog/assets/css/index.scss',
                    './blog/assets/css/media.scss'
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            }
        },

    });

    grunt.registerMultiTask('page', '', function() {

        var blogs = [];
        const path = require('path');

        this.files.forEach(function(f) {

            f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {

                var [info, content] = grunt.file.read(filepath).split('-----');
                info = JSON.parse(info);
                content = content.trim();

                info.date = new Date(info.date);
                info.content = content.substring(0, content.indexOf('\n'));
                info.url = './' + info.date.format('yyyy/MM/') + filepath.substr(10, filepath.length - 13) + '.html';

                var length = blogs.length;

                for (let i = 0; i < blogs.length; i++) {
                    if (blogs[i].date < info.date) {
                        blogs.splice(i, 0, info);
                        break;
                    }
                }

                length === blogs.length && blogs.push(info);
            });

        });

        let lis = '';
        for (let i = 0; i < blogs.length; i++) {
            let blog = blogs[i];
            lis += `
                <li>
                    <h2><a href="${blog.url}">${blog.title}</a></h2>
                    <div class="icon-date date">${blog.date.format('yyyy年MM月dd日')}</div>
                    <p>${blog.content}</p>
                    <div class="read-more"><a href="${blog.url}">阅读更多<b class="icon-goto"></b></a></div>
                </li>`;
            
        }

        var tpl = grunt.file.read(path.join(__dirname, 'blog/theme/template.html'));
        grunt.file.write(path.join(__dirname, 'blog/index.html'), tpl.replace('$content', lis));

        grunt.log.writeln('index.html created.');
    });

    grunt.registerMultiTask('tag', '', function() {

        let data = this.data;

        this.files.forEach(function(f) {

            f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {

                let src = grunt.file.read(filepath).split('\n');

                for (let i = src.length - 1; i >= 0; i--) {
                    if (src[i].indexOf('</script>') > -1 || src[i].indexOf('<link rel') > -1) {
                        src.splice(i, 1);
                    } else if (src[i].indexOf('</body>') > -1) {
                        src.splice(i + 1, 0, data.js);
                    } else if (src[i].indexOf('<meta name') > -1) {
                        src.splice(i + 1, 0, data.css);
                        break;
                    }
                }
                grunt.file.write(filepath, src.join('\n'));

            });

        });
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask("default", ["watch"]);
    //网站主页打包发布
    grunt.registerTask("release", ["babel:website", "uglify:website", "cssmin:website", "htmlmin:website", "copy:website"]);
    //博客生成静态网页文件
    grunt.registerTask("generate", ["markdown", "page"]);
    //博客打包发布    
    grunt.registerTask("blog", ["markdown", "page", "clean:blog", "copy:blog", "babel:blog", "uglify:blog", "cssmin:blog", "tag:blog", "tag:blogs", "htmlmin:blog", "htmlmin:blogs"]);
}
