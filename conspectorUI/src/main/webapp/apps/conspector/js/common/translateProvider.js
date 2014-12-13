app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
  	  //signIn
  	  signIn_userName: 'Username',
  	  signIn_password: 'Password',
  	  signIn_logIn: 'Log In',
  	  signIn_languageCode: 'EN',
  	  signIn_forgotPassword: 'Forgot your password?'
  });
  
  $translateProvider.translations('fr', {
   	  //signIn
  	  signIn_userName: 'Utilisateur',
  	  signIn_password: 'Mot de pass',
  	  signIn_logIn: 'Connection',
  	  signIn_languageCode: 'FR',
  	  signIn_forgotPassword: 'Mot de passe oubli\u00E9?' 	
  });  
  
  $translateProvider.preferredLanguage('en');
  $translateProvider.useCookieStorage(); 
}]);