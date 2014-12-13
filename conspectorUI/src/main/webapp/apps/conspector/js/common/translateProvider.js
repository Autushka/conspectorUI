app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
  	  //signIn
  	  signIn_userName: 'Username',
  	  signIn_password: 'Password',
  	  signIn_logIn: 'Log In',
  	  signIn_languageCode: 'EN',
  	  signIn_forgotPassword: 'Forgot your password?',
      m100: 'Operation was successfully finished',
      m101: 'Email with instructions to recover your password was successfully sent.',
      m102: 'Your password was successfully changed.',
      m200: 'Username already exists',
      m201: 'User with provided email already exists',
      m203: 'Can not login. Check your Username and Password.',
      m204: 'Email not found.',
      m205: 'Provided Old Password is not correct',
      m206: 'Username not found'
  });
  
  $translateProvider.translations('fr', {
   	  //signIn
  	  signIn_userName: 'Utilisateur',
  	  signIn_password: 'Mot de pass',
  	  signIn_logIn: 'Connection',
  	  signIn_languageCode: 'FR',
  	  signIn_forgotPassword: 'Mot de passe oubli\u00E9?',
      m100: 'Operation was successfully finished',
      m101: 'Email with instructions to recover your password was successfully sent.',
      m102: 'Your password was successfully changed.',
      m200: 'Username already exists',
      m201: 'User with provided email already exists',
      m203: 'Can not login. Check your Username and Password.',
      m204: 'Email not found.',
      m205: 'Provided Old Password is not correct',
      m206: 'Username not found'      
  });  
  
  $translateProvider.preferredLanguage('en');
  $translateProvider.useCookieStorage(); 
}]);