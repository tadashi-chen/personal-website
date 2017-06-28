module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    './dist/js/base.min.js': './assets/js/base.js'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: false, // true: 压缩为多个文件 false: 合并为一个文件
                    // cwd: 'assets/css/',
                    src: ['./assets/css/base.css', './assets/css/reset.css', './assets/css/media.css', './assets/css/index.css'],
                    // src: ['base.css', 'reset.css', 'media.css', 'index.css'],
                    dest: './dist/css/base.min.css',
                    // ext: '.min.css'
                }]
            }
        },
        sass: {
            dist: {
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
                    { './dist/js/base.min.js': ['./dist/js/base.min.js'] }
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("release", ["babel", "uglify", "cssmin"]);
}
