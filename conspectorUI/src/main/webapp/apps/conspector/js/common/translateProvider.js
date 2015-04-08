app.config(['$translateProvider',
    function($translateProvider) {
        $translateProvider.translations('en', {
            //global
            global_languageCode: 'FR',
            global_closeMenu: 'Close Menu',
            global_platform: 'Conspector is a collaboration platform for construction',
            global_home: 'Home',
            global_contact: 'Contact',
            global_aboutUs: 'About Us',
            global_login: 'Login',
            global_menu: 'Menu',
            global_bigPunch: 'It\u0027s a simple solution for complex projects.\n\nWith Conspector, general entrepreneurs, promoters, contractors and customers all benefit.',
            global_licenseGenEntr: 'General Entrepreneur',
            global_licenseSousT: 'Contractor',
            global_licensePromo: 'Promoter',
            global_anAppFor: 'An app for everyone:'
        });

        $translateProvider.translations('fr', {
            //global
            global_languageCode: 'EN',
            global_closeMenu: 'Fermer le menu',
            global_platform: 'Conspector est une plateforme de collaboration pour la construction',
            global_home: 'Accueil',
            global_contact: 'Contact',
            global_aboutUs: '\u00C0 propos',
            global_login: 'Connexion',
            global_menu: 'Menu',
            global_bigPunch: 'C\u0027est une solution simple pour des projets complexes.\n\nAvec Conspector, les entrepreneurs g\u00E9n\u00E9raux, les promoteurs, les sous-traitants et les clients y gagne tous.',
            global_licenseGenEntr: 'Entrepreneur g\u00E9ral',
            global_licenseSousT: 'Sous-traitant',
            global_licensePromo: 'Promoteur',
            global_anAppFor: 'Une application pour chaque intervenant:'
        });

        $translateProvider.preferredLanguage('en');
        // $translateProvider.useCookieStorage();
    }
]);