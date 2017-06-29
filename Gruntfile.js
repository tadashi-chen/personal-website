module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    './dist/assets/js/base.min.js': './assets/js/base.js'
                }
            }
        },
        copy: {
            main: {
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
            }
        },
        cssmin: {
            target: {
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
            }
        },
        htmlmin: { // Task
            main: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    './dist/index.html': './index.html', // 'destination': 'source'
                    // 'dist/contact.html': 'src/contact.html'
                }
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
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! Update time: <%= grunt.template.date("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            release: {
                files: [
                    { './dist/assets/js/base.min.js': ['./dist/assets/js/base.min.js'] }
                ]
            }
        },
        watch: {
            css: {
                files: [
                    './assets/css/index.scss',
                    './assets/css/media.scss'
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            }
        },

    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("release", ["babel", "uglify", "cssmin", "htmlmin", "copy"]);
}
