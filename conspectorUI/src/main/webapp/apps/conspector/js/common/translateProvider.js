app.config(['$translateProvider',
  function($translateProvider) {
    $translateProvider.translations('en', {
      successOperation: "Operation finished successfully.",
      errorOperation: "Operation failed.",
      noRoleAssignment: "Contact your system administrator (No role assignment to the user)",
      //backendMessages
      m100: 'Operation finished successfully.',
      m101: 'Email with instructions to recover your password was successfully sent.',
      m102: 'Your password was successfully changed.',
      m200: 'Username already exists',
      m201: 'User with provided email already exists',
      m203: 'Can not login. Check your Username and Password.',
      m204: 'Email not found.',
      m205: 'Provided Old Password is not correct',
      m206: 'Username not found',
      //app
      app_logOut: 'Log Out',
      //signIn
      signIn_userName: 'Username',
      signIn_password: 'Password',
      signIn_logIn: 'Log In',
      signIn_languageCode: 'EN',
      signIn_forgotPassword: 'Forgot your password? Click here',
      signIn_rememberUserName: 'Remember Username',
      //initialPasswordReset
      initialPasswordReset_headerLabel: 'This is the first time you login. Please enter a new password:',
      initialPasswordReset_newPassword: "New password",
      initialPasswordReset_newPasswordConfirmation: "New password confirmation",
      initialPasswordReset_reset: "Set new password",
      initialPasswordReset_passwordsDontMatch: "Provided passwords don't match.",
       //passwordReset
      passwordReset_headerLabel: 'Please enter a new password:',
      passwordReset_newPassword: "New password",
      passwordReset_newPasswordConfirmation: "New password confirmation",
      passwordReset_reset: "Set new password",
      passwordReset_passwordsDontMatch: "Provided passwords don't match.",     
      //roleSelection
      roleSelection_heagerLabel: 'Please choose a role:',
      roleSelection_continue: 'Continue',
      //forgotPassword
      forgotPassword_heagerLabel: 'Please select what you remember:',
      forgotPassword_userName: 'Username',
      forgotPassword_email: 'Email',
      forgotPassword_reset: 'Reset password',
      forgotPassword_footerLabel: 'Still have questions? Send us an email at support@conspector.com',


    });

    $translateProvider.translations('fr', {
      successOperation: "Operation finished successfully.",
      errorOperation: "Operation failed.",
      noRoleAssignment: "Contact your system administrator (No role assignment to the user)",      
      //backendMessages      
      m100: 'Operation finished successfully.',
      m101: 'Email with instructions to recover your password was successfully sent.',
      m102: 'Your password was successfully changed.',
      m200: 'Username already exists',
      m201: 'User with provided email already exists',
      m203: 'Can not login. Check your Username and Password.',
      m204: 'Email not found.',
      m205: 'Provided Old Password is not correct',
      m206: 'Username not found',
      //app
      app_logOut: 'Log Out',      
      //signIn
      signIn_userName: 'Utilisateur',
      signIn_password: 'Mot de pass',
      signIn_logIn: 'Connection',
      signIn_languageCode: 'FR',
      signIn_forgotPassword: 'Mot de passe oubli\u00E9?',
      signIn_rememberUserName: 'Remember Username',
      //initialPasswordReset
      initialPasswordReset_headerLabel: 'This is the first time you login. Please enter a new password:',
      initialPasswordReset_newPassword: "New password",
      initialPasswordReset_newPasswordConfirmation: "New password confirmation",
      initialPasswordReset_reset: "Set new password",
      initialPasswordReset_passwordsDontMatch: "Provided passwords don't match.",
       //passwordReset
      passwordReset_headerLabel: 'Please enter a new password:',
      passwordReset_newPassword: "New password",
      passwordReset_newPasswordConfirmation: "New password confirmation",
      passwordReset_reset: "Set new password",
      passwordReset_passwordsDontMatch: "Provided passwords don't match.",       
      //roleSelection
      roleSelection_heagerLabel: 'Please choose a role:',
      roleSelection_continue: 'Continue',   
      //forgotPassword
      forgotPassword_heagerLabel: 'Please select what you remember:',
      forgotPassword_userName: 'Username',
      forgotPassword_email: 'Email',
      forgotPassword_reset: 'Reset password',
      forgotPassword_footerLabel: 'Still have questions? Send us an email at support@conspector.com',             

    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();
  }
]);