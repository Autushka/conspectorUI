module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['apps/conspector/js/*.js', 'apps/conspector/js/common/*.js', 'apps/conspector/components/userManagement/controllers/*.js'],
        dest: 'dist/conspector.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! conspector <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/conspector.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);

};