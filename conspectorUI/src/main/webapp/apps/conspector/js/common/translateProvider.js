app.config(['$translateProvider',
      function($translateProvider) {
            $translateProvider.translations('en', {
                  //global
                  global_languageCode: 'FR',
                  global_closeMenu: 'Close Menu'
            });

            $translateProvider.translations('fr', {
                  //global
                  global_languageCode: 'EN',
                  global_closeMenu: 'Fermer le menu'
                  
            });

            $translateProvider.preferredLanguage('en');
            // $translateProvider.useCookieStorage();
      }
]);