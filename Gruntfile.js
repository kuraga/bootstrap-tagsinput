module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.*', 'test/**/*.js', 'examples/**/*.html'],
        tasks: ['copy:build', 'uglify:build'],
        options: {
          spawn: false,
          interupt: true
        }
      }
    },

  grunt.registerTask('unit', ['karma']);
};
