'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha_istanbul: {
            unit: {
                src: 'test/',
                options: {
                    coverage: true,
                    coverageFolder: './coverage.unit',
                    mask: '**/*.spec.js',
                    excludes: ['**/*.spec.js', 'coverage*/**', 'node/*', 'node_modules/*', 'gruntfile.js'],
                    reportFormats: ['cobertura', 'html', 'lcovonly', 'text'],
                    mochaOptions: ['-R', 'mocha-jenkins-reporter',
                        '-O',
                        'junit_report_name=Unit test report' +
                        ',junit_report_path' +
                        '=report/reports.unit.xml' +
                        ',junit_report_stack=1'
                    ],
                    istanbulOptions: ['--include-all-sources'],
                    'root': '.',
                    'timeout': 10000
                }
            }
        },

        istanbul_combine: {
            options: {
                dir: './coverage',
                pattern: './coverage.*/coverage.json',
                base: './coverage',
                reporters: {
                    cobertura: {},
                    html: {},
                    lcovonly: {},
                    json: {}
                }
            }
        },

        istanbul_check_coverage: {
            'default': {
                options: {
                    coverageFolder: './coverage',
                    check: {
                        statements: 0,
                        branches: 0,
                        lines: 0,
                        functions: 0
                    }
                }
            }
        }
    });

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-istanbul-combine');

    grunt.event.on('coverage', function(lcov, done) { 
        done();  
    });

    grunt.registerTask('default', 'coverage');
    grunt.registerTask('checkcoverage',
        ['istanbul_combine', 'istanbul_check_coverage']);
    grunt.registerTask('coverage', ['mocha_istanbul', 'checkcoverage']);


    grunt.registerTask('test', function() {
        var tasks = [];
        if (!process.env.JOB_NAME) {
            tasks = ['coverage'];
        } else if (process.env.JOB_NAME.match(/.*\.unittest/)) {
            tasks = ['coverage:unit'];
        }  
        grunt.task.run(tasks);
    });
 
    grunt.registerTask('coverage:unit',
        ['mocha_istanbul:unit']);

};