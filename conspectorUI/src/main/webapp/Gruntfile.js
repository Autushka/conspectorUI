module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
        'apps/conspector/js/app.js',
        'apps/conspector/js/constants.js',
        'apps/conspector/js/types.js',
        'apps/conspector/js/rolesSettings.js',

        'apps/conspector/js/common/cacheProvider.js', 
        'apps/conspector/js/common/utilsProvider.js', 
        'apps/conspector/js/common/translateProvider.js', 
        'apps/conspector/js/common/dataProvider.js', 
        'apps/conspector/js/common/apiProvider.js', 
        'apps/conspector/js/common/servicesProvider.js',         

        'apps/conspector/js/mainController.js',

        'apps/conspector/components/userManagement/controllers/*.js', 
        'apps/conspector/components/units/controllers/*.js', 
        'apps/conspector/components/profileSettings/controllers/*.js',
        'apps/conspector/components/generalLayout/controllers/*.js',
        'apps/conspector/components/deficiencies/controllers/*.js',
        'apps/conspector/components/contractors/controllers/*.js',     
        'apps/conspector/components/clients/controllers/*.js',    
        'apps/conspector/components/adminPanel/controllers/*.js'                  
        ],
        dest: 'dist/conspector.js'
      }
    },
    uglify: {
      options: {
        sourceMap: 'conspector.map',
        banner: '/*! conspector <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/conspector.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "apps/conspector/css/style.css": "apps/conspector/css/style.less" // destination file and source file
        }
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');


  grunt.registerTask('default', ['concat', 'uglify', 'less']);

};