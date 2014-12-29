app.config(['$translateProvider',
      function($translateProvider) {
            $translateProvider.translations('en', {
                  //global
                  global_addNew: 'Add New',
                  global_actions: 'Actions',
                  global_descriptionEN: 'Description EN',
                  global_descriptionFR: 'Description FR',
                  global_sortingSequence: 'Sorting sequence',
                  global_successOperation: 'Operation finished successfully.',
                  global_errorOperation: 'Operation failed.',
                  global_noRoleAssignment: 'Contact your system administrator (No role assignment to the user)',
                  global_noTableData: 'No data selected',
                  global_createdBy: 'Created By',
                  global_createdAt: 'Created At',
                  global_role: 'Role',
                  global_project: 'Project',
                  global_upload: 'Upload',
                  global_icon: 'Icon',
                  global_userName: 'Username',
                  global_email: 'Email',
                  global_back: 'Back',
                  global_edit: 'Edit',
                  global_save: 'Save',
                  global_delete: 'Delete',
                  global_saveAndNew: 'Save and new',
                  global_creationDate: 'Creation Date',
                  global_lastModificationDate: 'Last Modification Date',
                  global_associatedIconFileGuid: 'Associated Icon File Guid',
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
                  app_switchRoles: "Switch Role",
                  app_logOut: 'Log Out',
                  app_adminPanel: 'Admin Panel',
                  app_profileSettings: 'Profile Settings',
                  app_deficienciesTab: 'Deficiencies',
                  app_unitsTab: 'Units',
                  app_contractorsTab: 'Contractors',
                  app_clientsTab: 'Clients',
                  //adminPanel
                  adminPanel_menuHeader: 'Admin Panel Menu',
                  adminPanel_userManagement: 'User Management',
                  adminPanel_roles: "User Roles",
                  adminPanel_projects: 'Projects',
                  adminPanel_phases: 'Phases',
                  adminPanel_deficiencyStatuses: 'Deficiency Statuses',
                  adminPanel_systemFiles: 'System Files',
                  adminPanel_operationLogs: 'Operation Logs',
                  adminPanel_accountTypes: 'Account Types',
                  //usersList
                  usersList_title: 'Users',
                  usersList_roles: 'Role(s)',
                  //userDetails
                  userDetails_title: 'User Details',
                  userDetails_authorizedPhases: 'Authorized projects and phases:',
                  //rolesList
                  rolesList_title: "User Roles",
                  rolesList_roleName: "Role Name",
                  //projectsList
                  projectsList_title: 'Projects',
                  //phasesList
                  phasesList_title: 'Phases',
                  //deficiencyStatuses
                  deficiencyStatuses_title: 'Deficiency Statuses',
                  //operationLogsList
                  operationLogsList_title: 'Operation Logs',
                  operationLogsList_operationName: 'Operation Name',
                  operationLogsList_operationContent: 'Operation Content',
                  //accountTypesList
                  accountTypesList_title: 'Account Types',
                  //systemFiles
                  systemFiles_title: 'System Files',
                  systemFiles_logos: 'Logos:',
                  systemFiles_deficiencyStatuses: 'Deficiency Statuses:',
                  //signIn
                  signIn_userName: 'Username',
                  signIn_password: 'Password',
                  signIn_logIn: 'Log In',
                  signIn_languageCode: 'EN',
                  signIn_forgotPassword: 'Forgot your password? Click here',
                  signIn_rememberUserName: 'Remember Username',
                  //initialPasswordReset
                  initialPasswordReset_headerLabel: 'This is the first time you login. Please enter a new password:',
                  initialPasswordReset_newPassword: 'New password',
                  initialPasswordReset_newPasswordConfirmation: 'New password confirmation',
                  initialPasswordReset_reset: 'Set new password',
                  initialPasswordReset_passwordsDontMatch: "Provided passwords don't match.",
                  //passwordReset
                  passwordReset_headerLabel: 'Please enter a new password:',
                  passwordReset_newPassword: 'New password',
                  passwordReset_newPasswordConfirmation: 'New password confirmation',
                  passwordReset_reset: 'Set new password',
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
                  //global
                  global_addNew: 'Add New',
                  global_actions: 'Actions',
                  global_descriptionEN: 'Description EN',
                  global_descriptionFR: 'Description FR',
                  global_sortingSequence: 'Sorting sequence',
                  global_successOperation: 'Operation finished successfully.',
                  global_errorOperation: 'Operation failed.',
                  global_noRoleAssignment: 'Contact your system administrator (No role assignment to the user)',
                  global_noTableData: 'No data selected',
                  global_createdBy: 'Created By',
                  global_createdAt: 'Created At',
                  global_role: 'Role',
                  global_project: 'Project',
                  global_upload: 'Upload',
                  global_icon: 'Icon',
                  global_userName: 'Username',
                  global_email: 'Email',
                  global_back: 'Back',
                  global_edit: 'Edit',
                  global_save: 'Save',
                  global_delete: 'Delete',
                  global_saveAndNew: 'Save and new',
                  global_creationDate: 'Creation Date',
                  global_lastModificationDate: 'Last Modification Date',
                  global_associatedIconFileGuid: 'Associated Icon File Guid',
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
                  app_switchRoles: "Switch Role",
                  app_logOut: 'Log Out',
                  app_adminPanel: 'Admin Panel',
                  app_profileSettings: 'Profile Settings',
                  app_deficienciesTab: 'Deficiencies',
                  app_unitsTab: 'Units',
                  app_contractorsTab: 'Contractors',
                  app_clientsTab: 'Clients',
                  //adminPanel
                  adminPanel_menuHeader: 'Admin Panel Menu',
                  adminPanel_userManagement: 'User Management',
                  adminPanel_roles: "User Roles",
                  adminPanel_projects: 'Projects',
                  adminPanel_phases: 'Phases',
                  adminPanel_deficiencyStatuses: 'Deficiency Statuses',
                  adminPanel_systemFiles: 'System Files',
                  adminPanel_operationLogs: 'Operation Logs',
                  adminPanel_accountTypes: 'Account Types',
                  //usersList
                  usersList_title: 'Users',
                  usersList_roles: 'Role(s)',
                  //userDetails
                  userDetails_title: 'User Details',
                  userDetails_authorizedPhases: 'Authorized projects and phases:',
                  //rolesList
                  rolesList_title: "User Roles",
                  rolesList_roleName: "Role Name",
                  //projectsList
                  projectsList_title: 'Projects',
                  //phasesList
                  phasesList_title: 'Phases',
                  //deficiencyStatuses
                  deficiencyStatuses_title: 'Deficiency Statuses',
                  //operationLogsList
                  operationLogsList_title: 'Operation Logs',
                  operationLogsList_operationName: 'Operation Name',
                  operationLogsList_operationContent: 'Operation Content',
                  //accountTypesList
                  accountTypesList_title: 'Account Types',
                  //systemFiles
                  systemFiles_title: 'System Files',
                  systemFiles_logos: 'Logos:',
                  systemFiles_deficiencyStatuses: 'Deficiency Statuses:',
                  //signIn
                  signIn_userName: 'Username',
                  signIn_password: 'Password',
                  signIn_logIn: 'Log In',
                  signIn_languageCode: 'EN',
                  signIn_forgotPassword: 'Forgot your password? Click here',
                  signIn_rememberUserName: 'Remember Username',
                  //initialPasswordReset
                  initialPasswordReset_headerLabel: 'This is the first time you login. Please enter a new password:',
                  initialPasswordReset_newPassword: 'New password',
                  initialPasswordReset_newPasswordConfirmation: 'New password confirmation',
                  initialPasswordReset_reset: 'Set new password',
                  initialPasswordReset_passwordsDontMatch: "Provided passwords don't match.",
                  //passwordReset
                  passwordReset_headerLabel: 'Please enter a new password:',
                  passwordReset_newPassword: 'New password',
                  passwordReset_newPasswordConfirmation: 'New password confirmation',
                  passwordReset_reset: 'Set new password',
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