module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
        '../webapp/apps/conspector/js/app.js',
        '../webapp/apps/conspector/js/constants.js',
        '../webapp/apps/conspector/js/types.js',
        '../webapp/apps/conspector/js/rolesSettings.js',

        '../webapp/apps/conspector/js/common/cacheProvider.js', 
        '../webapp/apps/conspector/js/common/utilsProvider.js', 
        '../webapp/apps/conspector/js/common/translateProvider.js', 
        '../webapp/apps/conspector/js/common/dataProvider.js', 
        '../webapp/apps/conspector/js/common/apiProvider.js', 
        '../webapp/apps/conspector/js/common/servicesProvider.js',         

        '../webapp/apps/conspector/js/mainController.js',

        '../webapp/apps/conspector/components/userManagement/controllers/*.js', 
        '../webapp/apps/conspector/components/units/controllers/*.js', 
        '../webapp/apps/conspector/components/profileSettings/controllers/*.js',
        '../webapp/apps/conspector/components/generalLayout/controllers/*.js',
        '../webapp/apps/conspector/components/deficiencies/controllers/*.js',
        '../webapp/apps/conspector/components/contractors/controllers/*.js',     
        '../webapp/apps/conspector/components/clients/controllers/*.js',    
        '../webapp/apps/conspector/components/adminPanel/controllers/*.js'                  
        ],
        dest: '../webapp/dist/conspector.js'
      }
    },
    uglify: {
      options: {
        sourceMap: 'conspector.map',
        banner: '/*! conspector <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '../webapp/dist/conspector.min.js': ['<%= concat.dist.dest %>']
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
          "../webapp/apps/conspector/css/style.css": "../webapp/apps/conspector/css/style.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['../webapp/apps/conspector/css/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }    
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');  

  grunt.registerTask('default', ['concat', 'uglify', 'less', 'watch']);

};