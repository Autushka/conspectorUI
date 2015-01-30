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
                  global_errorEntityWasUpdatedBefore: 'Operation failed. Data has been modified before you, prease refresh the page and try again.',
                  global_noDefaultViewForTheRole: 'Contact your system administrator (No default view assignment to the role)',
                  global_noCompanyAssignment: 'Contact your system administrator (No company assignment to the user)',
                  global_noRoleAssignment: 'Contact your system administrator (No role assignment to the user)',
                  global_noInitialPasswordProvided: 'No initial password has been provided. User creation is not possible',
                  global_changesSaveConfirmationHeader: 'Do you want to save changes?',
                  global_changesSaveConfirmationContent: 'Unsaved changes will be lost...',
                  global_emptyFields: 'Please make sure that all the fields are filled',
                  global_authorizedPhases: 'Authorized projects and phases:',
                  global_avatar: 'Avatar:',
                  global_noTableData: 'No data selected',
                  global_createdBy: 'Created By',
                  global_createdAt: 'Created At',
                  global_role: 'Role',
                  global_company: 'Company',
                  global_roles: 'Role(s)',
                  global_companies: 'Companies',
                  global_project: 'Project',
                  global_upload: 'Upload',
                  global_icon: 'Icon',
                  global_userName: 'Username',
                  global_email: 'Email',
                  global_emailPlaceholder: 'e.g. sara@conspector.com',
                  global_back: 'Back',
                  global_edit: 'Edit',
                  global_save: 'Save',
                  global_delete: 'Delete',
                  global_saveAndNew: 'Save and new',
                  global_creationDate: 'Creation Date',
                  global_lastModificationDate: 'Last Modification Date',
                  global_associatedIconFileGuid: 'Associated Icon File Guid',
                  global_associatedColor: 'Associated Color',
                  global_password: 'Password',
                  global_passwordConfirmation: 'Password Confirmation',
                  global_continue: 'Continue',
                  global_ok: 'Ok',
                  global_yes: 'Yes',
                  global_no: 'No',
                  global_cancel: 'Cancel',
                  global_passwordsDontMatch: "Provided passwords don't match.",
                  global_contractorName: 'Contractor',
                  global_clientName: 'Client',
                  global_phone: 'Phone',
                  global_phonePlaceholder: 'e.g. 514-123-1234',
                  global_tags: 'Tags',
                  global_name: 'Name',
                  global_title: 'Title',
                  global_secondaryPhone: 'Secondary Phone',
                  global_website: "Website",
                  global_websitePlaceholder: "e.g. www.website.com",
                  global_fax: 'Fax',
                  global_associatedPhases: 'Associated projects and phases:',
                  global_selectedProjectsAndPhases: 'Select Project(s) - Phase(s)',
                  global_billingStreet: 'Billing street',
                  global_billingStreetPlaceholder: 'e.g. 1010 Brian #213',
                  global_billingCity: 'Billing city',
                  global_billingCityPlaceholder: 'e.g. Nassau',
                  global_billingPostalCode: 'Billing postal code',
                  global_billingPostalCodePlaceholder: 'e.g. J01 E24',
                  global_billingCountry: 'Billing country:',
                  global_billingProvince: 'Billing state/province:',
                  global_shippingStreet: 'Shipping street',
                  global_shippingStreetPlaceholder: 'e.g. 1010 Brian #213 A',
                  global_shippingCity: 'Shipping city',
                  global_shippingCityPlaceholder: 'e.g. Nassau',
                  global_shippingPostalCode: 'Shipping postal code',
                  global_shippingPostalCodePlaceholder: 'e.g. J01 E24',
                  global_shippingCountry: 'Shipping country:',
                  global_shippingProvince: 'Shipping state/province:',
                  global_tags: "Tags",
                  global_addTag: "Add a tag",
                  global_contactType: "Contact Type:",
                  global_account: "Account",
                  global_selectCountry: "Select Country",
                  global_selectState: "Select Province/State",
                  global_pleaseSaveFirst: "To edit this field, please save first.",
                  //backendMessages
                  m100: 'Operation finished successfully.',
                  m101: 'Email with instructions to recover your password was successfully sent.',
                  m102: 'Your password was successfully changed.',
                  m200: 'Username already exists',
                  m201: 'User with provided email already exists',
                  m203: 'Can\u0027t log you in. Please check your Username and Password.',
                  m204: 'Email not found.',
                  m205: 'Provided Old Password is not correct',
                  m206: 'Username not found',
                  //app
                  app_switchCompanies: "Switch Company",
                  app_switchRoles: "Switch Role",
                  app_logOut: 'Log Out',
                  app_adminPanel: 'Admin Panel',
                  app_profileSettings: 'Profile Settings',
                  app_deficienciesTab: 'Deficiencies',
                  app_unitsTab: 'Units',
                  app_contractorsTab: 'Contractors',
                  app_clientsTab: 'Clients',
                  app_contactsTab: "Contacts",
                  //profileSettings
                  profileSettings_menuHeader: 'User Menu',
                  profileSettings_profileDetails: 'User Profile',
                  profileSettings_contactDetails: 'User\u0027s Contact',
                  profileSettings_changePassword: 'Change Password',
                  profileSettings_hideSidenav: 'Open User Menu',
                  //profileDetails
                  profileDetails_title: 'User Profile',
                  //changePassword
                  changePassword_title: 'Change Password',
                  changePassword_resetPassword: 'Change Password',
                  changePassword_newPassword: 'New Password',
                  changePassword_newPasswordConfirmation: 'New Password Confirmation',
                  //adminPanel
                  adminPanel_menuHeader: 'Admin Panel Menu',
                  adminPanel_companies: "Companies",
                  adminPanel_userManagement: 'User Management',
                  adminPanel_roles: "User Roles",
                  adminPanel_projects: 'Projects',
                  adminPanel_projectDefaultLabel: 'Select Project',
                  adminPanel_phases: 'Phases',
                  adminPanel_deficiencyStatuses: 'Deficiency Statuses',
                  adminPanel_deficiencyStatusIconDefaultLabel: 'Select Icon',
                  adminPanel_deficiencyPriorities: 'Deficiency Priorities',
                  adminPanel_systemFiles: 'System Files',
                  adminPanel_operationLogs: 'Operation Logs',
                  adminPanel_accountTypes: 'Account Types',
                  adminPanel_contactTypes: 'Contact Types',
                  adminPanel_hideSidenav: 'Open Admin Panel Menu',
                  //companiesList
                  companiesList_title: "Companies",
                  companiesList_companyName: "Company Name",
                  //usersList
                  usersList_title: 'Users List',
                  //userDetails
                  userDetails_title: 'User Details',
                  userDetails_deletionConfirmationHeader: 'Are you sure that you want to delete current user?',
                  userDetails_deletionConfirmationContent: 'Current user will be deleted...',
                  userDetails_username: 'Username:',
                  userDetails_password: 'Password:',
                  userDetails_passwordConfirmation: 'Password Confirmation:',
                  userDetails_email: 'Email:',
                  userDetails_associatedCompanies: 'Associated Companies:',
                  userDetails_associatedProjectsAndPhases: 'Associated Projects and Phases:',
                  userDetails_associatedRoles: 'Roles:',
                  userDetails_avatar: 'Profile Picture:', 
                  userDetails_associatedContact: 'Associated Contact:',
                  userDetails_communicationLanguage: 'Preferred Communication Language:',
                  //rolesList
                  rolesList_title: "User Roles",
                  rolesList_roleName: "Role Name",
                  //projectsList
                  projectsList_title: 'Projects',
                  //phasesList
                  phasesList_title: 'Phases',
                  //deficiencyStatuses
                  deficiencyStatuses_title: 'Deficiency Statuses',
                  //deficiencyPriorities
                  deficiencyPriorities_title: 'Deficiency Priorities',
                  //operationLogsList
                  operationLogsList_title: 'Operation Logs',
                  operationLogsList_operationName: 'Operation Name',
                  operationLogsList_operationContent: 'Operation Content',
                  //accountTypesList
                  accountTypesList_title: 'Account Types',
                  //contactTypesList
                  contactTypesList_title: 'Contact Types',
                  //systemFiles
                  systemFiles_title: 'System Files',
                  systemFiles_logos: 'Logos',
                  systemFiles_logo: 'Logo',
                  systemFiles_deficiencyStatusIcon: 'Deficiency Status Icons',
                  systemFiles_Icon: 'Icon',
                  //signIn
                  signIn_userName: 'Username',
                  signIn_password: 'Password',
                  signIn_logIn: 'Log In to Conspector',
                  signIn_languageCode: 'FR',
                  signIn_forgotPassword: 'Forgot your password?',
                  signIn_rememberUserName: 'Remember Username',
                  //initialPasswordReset
                  initialPasswordReset_headerLabel: 'Please enter a new password:',
                  initialPasswordReset_newPassword: 'New password',
                  initialPasswordReset_newPasswordConfirmation: 'New password confirmation',
                  initialPasswordReset_reset: 'Set new password',
                  //passwordReset
                  passwordReset_headerLabel: 'Please enter a new password:',
                  passwordReset_newPassword: 'New password',
                  passwordReset_newPasswordConfirmation: 'New password confirmation',
                  passwordReset_reset: 'Set new password',
                  passwordReset_passwordsDontMatch: "Provided passwords don't match.",
                  //companySelection
                  companySelection_heagerLabel: 'Please choose a company:',
                  //roleSelection
                  roleSelection_heagerLabel: 'Please choose a role:',
                  //forgotPassword
                  forgotPassword_heagerLabel: 'Please select what you remember:',
                  forgotPassword_userName: 'Username',
                  forgotPassword_email: 'Email',
                  forgotPassword_reset: 'Reset password',
                  forgotPassword_footerLabel: 'Having issues logging in?\nEmail us at ',
                  //contractorsList
                  contractorsList_title: 'Contractors List',
                  contractorsList_addNew: 'Add Contractor',
                  //contractorDetails
                  contractorDetails_title: 'Contractor Details',
                  contractorDetails_deletionConfirmationHeader: 'You are about to delete a contractor account.',
                  contractorDetails_deletionConfirmationContent: 'Are you sure you want to proceed ? All related contacts will be erased.',
                  contractorDetails_name: 'Name:',
                  contractorDetails_namePlaceholder: 'e.g. ABC Construction',
                  contractorDetails_phone: 'Phone:',
                  contractorDetails_secondaryPhone: 'Secondary Phone:',
                  contractorDetails_website: 'Website:',
                  contractorDetails_email: 'Email:',
                  contractorDetails_fax: 'Fax:',
                  contractorDetails_associatedProjectsAndPhases: 'Associated Projects and Phases:',
                  contractorDetails_descriptionTags: 'Description Tags:',
                  contractorDetails_billingStreet: 'Billing Street:',
                  contractorDetails_billingCity: 'Billing City:',
                  contractorDetails_billingPostalCode: 'Postal Code/ZIP:',
                  contractorDetails_billingCountry: 'Billing Country:',
                  contractorDetails_billingProvince: 'Billing State/Province:',
                  contractorDetails_shippingStreet: 'Shipping Street:',
                  contractorDetails_shippingCity: 'Shipping City:',
                  contractorDetails_shippingPostalCode: 'Postal Code/ZIP:',
                  contractorDetails_shippingCountry: 'Shipping Country:',
                  contractorDetails_shippingProvince: 'Shipping State/Province:',
                  //contactsList
                  contactsList_title: 'Contacts List',
                  contactDetails_title: 'Contact Details',
                  contactsList_addNew: 'Add Contact',
                  //contactDetails
                  contactDetails_title: 'Contact Details',
                  contactDetails_deletionConfirmationHeader: 'You are about to delete a contact.',
                  contactDetails_deletionConfirmationContent: 'Are you sure you want to proceed ?',
                  contactDetails_name: 'Name:',
                  contactDetails_namePlaceholder: 'e.g. Sara',
                  contactDetails_lastName: 'Last Name:',
                  contactDetails_lastNamePlaceholder: 'e.g. Smith',
                  contactDetails_personTitle: 'Title:',
                  contactDetails_personTitlePlaceholder: 'e.g. Ms, Director',
                  contactDetails_homePhone: 'Home Phone:',
                  contactDetails_workPhone: 'Work Phone:',
                  contactDetails_mobilePhone: 'Mobile Phone:',
                  contactDetails_email: 'Email:',
                  contactDetails_fax: 'Fax:',
                  contactDetails_associatedProjectsAndPhases: 'Associated Projects and Phases:',
                  contactDetails_associatedParentAccount: 'Parent Account:',
                  contactDetails_selectParentAccount: 'Select Parent Account',
                  contactDetails_contactType: 'Contact Type:',
                  contactDetails_selectContactType: 'Select Contact Type',
                  contactDetails_descriptionTags: 'Description Tags:',
                  contactDetails_billingStreet: 'Billing Street:',
                  contactDetails_billingCity: 'Billing City:',
                  contactDetails_billingPostalCode: 'Postal Code/ZIP:',
                  contactDetails_billingCountry: 'Billing Country:',
                  contactDetails_billingProvince: 'Billing State/Province:',
                  contactDetails_shippingStreet: 'Shipping Street:',
                  contactDetails_shippingCity: 'Shipping City:',
                  contactDetails_shippingPostalCode: 'Postal Code/ZIP:',
                  contactDetails_shippingCountry: 'Shipping Country:',
                  contactDetails_shippingProvince: 'Shipping State/Province:',
                  //clientsList
                  clientsList_title: 'Clients List',
                  clientsList_addNew: 'Add Client Account',
                  //clientDetails
                  clientDetails_title: 'Client Details',
                  clientDetails_deletionConfirmationHeader: 'You are about to delete a client account.',
                  clientDetails_deletionConfirmationContent: 'Are you sure you want to proceed ? All related contacts will be erased.',
                  clientDetails_name: 'Name:',
                  clientDetails_namePlaceholder: 'e.g. Sara Conspector',
                  clientDetails_phone: 'Phone:',
                  clientDetails_secondaryPhone: 'Secondary Phone:',
                  clientDetails_website: 'Website:',
                  clientDetails_email: 'Email:',
                  clientDetails_fax: 'Fax:',
                  clientDetails_associatedProjectsAndPhases: 'Associated Projects and Phases:',
                  clientDetails_descriptionTags: 'Description Tags:',
                  clientDetails_billingStreet: 'Billing Street:',
                  clientDetails_billingCity: 'Billing City:',
                  clientDetails_billingPostalCode: 'Postal Code/ZIP:',
                  clientDetails_billingCountry: 'Billing Country:',
                  clientDetails_billingProvince: 'Billing State/Province:',
                  clientDetails_shippingStreet: 'Shipping Street:',
                  clientDetails_shippingCity: 'Shipping City:',
                  clientDetails_shippingPostalCode: 'Postal Code/ZIP:',
                  clientDetails_shippingCountry: 'Shipping Country:',
                  clientDetails_shippingProvince: 'Shipping State/Province:',
            });

            $translateProvider.translations('fr', {
                  //global
                  global_addNew: 'Ajouter',
                  global_actions: 'Actions',
                  global_descriptionEN: 'Description EN',
                  global_descriptionFR: 'Description FR',
                  global_sortingSequence: 'Ordre',
                  global_successOperation: 'Op\u00E9ration termin\u00E9e avec succ\u00E8s',
                  global_errorOperation: 'Op\u00E9ration \u00E9chouch\u00E9e.',
                  global_errorEntityWasUpdatedBefore: 'Operation failed. Data has been modified before you, prease refresh the page and try again.',
                  global_noDefaultViewForTheRole: 'Svp contacter le support Conspector (Pas de vue associ\u00E9e \u00E0 votre utilisateur)',
                  global_noCompanyAssignment: 'Svp contacter le support Conspector (Pas de compagnie associ\u00E9e \u00E0 votre utilisateur)',
                  global_noRoleAssignment: 'Svp contacter le support Conspector (Pas de r\u00F4le associ\u00E9 \u00E0 votre utilisateur)',
                  global_noInitialPasswordProvided: 'Mot de passe manquant. La cr\u00E9ation dun utilisateur requiert un mot de passe',
                  global_changesSaveConfirmationHeader: 'Voulez vous sauvegarder les changements?',
                  global_changesSaveConfirmationContent: 'Les changements non sauvegard\u00E9s seront perdus...',
                  global_emptyFields: 'Veuillez svp remplir les champs requis',
                  global_authorizedPhases: 'Projets et phases autoris\u00E9s:',
                  global_avatar: 'Avatar:',
                  global_noTableData: 'Pas de donn\u00E9es \u00E0 afficher',
                  global_createdBy: 'Cr\u00E9\u00E9 par',
                  global_createdAt: 'Cr\u00E9\u00E9 \u00E0',
                  global_role: 'R\u00F4le',
                  global_company: 'Compagnie',
                  global_roles: 'R\u00F4le(s)',
                  global_companies: 'Compagnie(s)',
                  global_project: 'Projet',
                  global_upload: 'Charger',
                  global_icon: 'Ic\u00F4ne',
                  global_userName: 'Nom d\u0027utilisateur',
                  global_email: 'Email',
                  global_emailPlaceholder: 'e.g. sara@conspector.com',
                  global_back: 'Retour',
                  global_edit: 'Modifier',
                  global_save: 'Sauvegarder',
                  global_delete: 'Effacer',
                  global_saveAndNew: 'Sauvegarder et ajouter autre',
                  global_creationDate: 'Date de cr\u00E9ation',
                  global_lastModificationDate: 'Derni\u00E8re modification',
                  global_associatedIconFileGuid: 'Guid du fichier d\u0027ic\u00F4ne associ\u00E9',
                  global_associatedColor: 'Couleur associ\u00E9e',
                  global_password: 'Mot de passe',
                  global_passwordConfirmation: 'Confirmation du mot de passe',
                  global_continue: 'Continuer',
                  global_ok: 'Ok',
                  global_yes: 'Oui',
                  global_no: 'Non',
                  global_cancel: 'Annuler',
                  global_passwordsDontMatch: 'Les mots de passe ne correspondent pas.',
                  global_contractorName: 'Sous-traitant',
                  global_clientName: 'Client',
                  global_phone: 'T\u00E9l\u00E9phone',
                  global_phonePlaceholder: 'e.g. 514-123-1234',
                  global_tags: 'Tags',
                  global_name: 'Nom',
                  global_title: 'Titre',
                  global_secondaryT\u00E9l\u00E9phone: 'T\u00E9l\u00E9phone secondaire',
                  global_website: 'Site web',
                  global_websitePlaceholder: 'e.g. www.website.com',
                  global_fax: 'Fax',
                  global_associatedPhases: 'Projets et phases associ\u00E9s:',
                  global_selectedProjectsAndPhases: 'S\u00E9lectionner projet(s) - phase(s)',
                  global_billingStreet: 'Adresse facturation',
                  global_billingStreetPlaceholder: 'e.g. 1010 Brian #213',
                  global_billingCity: 'Ville facturation',
                  global_billingCityPlaceholder: 'e.g. Nassau',
                  global_billingPostalCode: 'Code postal facturation',
                  global_billingPostalCodePlaceholder: 'e.g. J01 E24',
                  global_billingCountry: 'Pays facturation :',
                  global_billingProvince: 'Provice/\u00E9tat facturation:',
                  global_shippingStreet: 'Adresse livraison',
                  global_shippingStreetPlaceholder: 'e.g. 1010 Brian #213 A',
                  global_shippingCity: 'Ville livraison',
                  global_shippingCityPlaceholder: 'e.g. Nassau',
                  global_shippingPostalCode: 'Code postal livraison',
                  global_shippingPostalCodePlaceholder: 'e.g. J01 E24',
                  global_shippingCountry: 'Pays livraison:',
                  global_shippingProvince: 'Province/\u00E9tat livraison:',
                  global_tags: 'Tags',
                  global_addTag: 'Ajouter un mot clef',
                  global_contactType: 'Type de contact:',
                  global_account: 'Compte',
                  global_selectCountry: 'S\u00E9lectionner pays',
                  global_selectState: 'S\u00E9lectionner province/\u00E9tat',
                  global_pleaseSaveFirst: "Pour modifier ce champ, veuillez d\u0027abord sauvegarder.",
                  //backendMessages
                  m100: 'Op\u00E9ration compl\u00E9t\u00E9e avec succ\u00E8s.',
                  m101: 'Un email contenant les instructions pour votre mot de passe vous a \u00E9t\u00E9 envoy\u00E9.',
                  m102: 'Votre mot de passe a bien \u00E9t\u00E9 modifi\u00E9.',
                  m200: 'Ce nom d\u0027utilisateur est d\u00E9j\u00E0 utilis\u00E9',
                  m201: 'Un autre utilisateur est enregistr\u00E9 avec cette adresse email.',
                  m203: 'Connexion impossible, svp v\u00E9rifier votre nom d\u0027utilisateur et mot de passe.',
                  m204: 'Email non trouv\u00E9.',
                  m205: 'Le mot de passe fourni est incorrect.',
                  m206: 'Nom d\u0027utilisateur non trouv\u00E9',
                  //app
                  app_switchCompanies: 'Changer de compagnie',
                  app_switchRoles: 'Changer de r\u00F4le',
                  app_logOut: 'Quitter',
                  app_adminPanel: 'Configuration',
                  app_profileSettings: 'R\u00E9glages utilisateur',
                  app_deficienciesTab: 'D\u00E9ficiences',
                  app_unitsTab: 'Unit\u00E9s',
                  app_contractorsTab: 'Sous-traitants',
                  app_clientsTab: 'Clients',
                  app_contactsTab: 'Contacts',
                  //profileSettings
                  profileSettings_menuHeader: 'Menu utilisateur',
                  profileSettings_contactDetails: 'Contact de l\u0027utilisateur',
                  profileSettings_profileDetails: 'R\u00E9glages utilisateur',
                  profileSettings_changePassword: 'Changement mot de de passe',
                  profileSettings_hideSidenav: 'Ouvrir menu',
                  //profileDetails
                  profileDetails_title: 'R\u00E9glages utilisateur',
                   //changePassword
                  changePassword_title: 'Changement mot de passe',
                  changePassword_resetPassword: 'Changer le mot de passe',
                  changePassword_newPassword: 'Nouveau mot de passe',
                  changePassword_newPasswordConfirmation: 'Confirmation nouveau mot de passe',
                  //adminPanel
                  adminPanel_menuHeader: 'Menu de configuration',
                  adminPanel_companies: 'Compagnies',
                  adminPanel_userManagement: 'Gestion des utilisateurs',
                  adminPanel_roles: 'R\u00F4les',
                  adminPanel_projects: 'Projets',
                  adminPanel_projectDefaultLabel: 'S\u00E9lectionner projet',
                  adminPanel_phases: 'Phases',
                  adminPanel_deficiencyStatuses: 'Statuts des d\u00E9ficiences',
                  adminPanel_deficiencyStatusIconDefaultLabel: 'S\u00E9lectionner ic\u00F4ne',
                  adminPanel_deficiencyPriorities: 'Priorit\u00E9s des d\u00E9ficiences',
                  adminPanel_systemFiles: 'Fichiers syst\u00E8mes',
                  adminPanel_operationLogs: 'Journal des op\u00E9rations',
                  adminPanel_accountTypes: 'Types de comptes',
                  adminPanel_contactTypes: 'Types de contact',
                  adminPanel_hideSidenav: 'Ouvrir menu',
                  //companiesList
                  companiesList_title: 'Compagnies',
                  companiesList_companyName: 'Nom compagnie',
                  //usersList
                  usersList_title: 'Liste des utilisateurs',
                  //userDetails
                  userDetails_title: 'D\u00E9tails de l\u0027utilisateur',
                  userDetails_deletionConfirmationHeader: 'Voulez-vous vraiment efface cet utilisateur?',
                  userDetails_deletionConfirmationContent: 'L\u0027utilisateur sera effac\u00E9...',
                  userDetails_username: 'Utilisateur:',
                  userDetails_password: 'Mot de passe:',
                  userDetails_passwordConfirmation: 'Confirmation du mot de passe :',
                  userDetails_email: 'Email :',
                  userDetails_associatedCompanies: 'Compagnies associ\u00E9es :',
                  userDetails_associatedProjectsAndPhases: 'Projets et phases associ\u00E9es :',
                  userDetails_associatedRoles: 'R\u00F4les :',
                  userDetails_avatar: 'Photo de l\u0027utilisateur :',
                  userDetails_associatedContact: 'Contact associ\u00E9 :',
                  userDetails_communicationLanguage: 'Langue de correspondance :',
                  //rolesList
                  rolesList_title: 'R\u00F4les de l\u0027utilisateur',
                  rolesList_roleName: 'Nom du r\u00F4le',
                  //projectsList
                  projectsList_title: 'Projets',
                  //phasesList
                  phasesList_title: 'Phases',
                  //deficiencyStatuses
                  deficiencyStatuses_title: 'Statuts des d\u00E9ficiences',
                  //deficiencyPriorities
                  deficiencyPriorities_title: 'Priorit\u00E9s des d\u00E9ficiences',
                  //operationLogsList
                  operationLogsList_title: 'Journal des op\u00E9rations',
                  operationLogsList_operationName: 'Operation',
                  operationLogsList_operationContent: 'Contenu',
                  //accountTypesList
                  accountTypesList_title: 'Types de comptes',
                  //contactTypesList
                  contactTypesList_title: 'Types de contacts',
                  //systemFiles
                  systemFiles_title: 'Fichiers syst\u00E8mes',
                  systemFiles_logos: 'Logos',
                  systemFiles_logo: 'Logo',
                  systemFiles_deficiencyStatusIcon: 'Ic\u00F4nes des statuts des d\u00E9ficiences',
                  systemFiles_Icon: 'Ic\u00F4ne',
                  //signIn
                  signIn_userName: 'Nom d\u0027utilisateur',
                  signIn_password: 'Mot de passse',
                  signIn_logIn: 'Connexion \u00E0 Conspector',
                  signIn_languageCode: 'EN',
                  signIn_forgotPassword: 'Mot de passe oubli\u00E9 ?',
                  signIn_rememberUserName: 'Retenir nom d\u0027utilisateur',
                  //initialPasswordReset
                  initialPasswordReset_headerLabel: 'Veuillez en choisir un nouveau mot de passe :',
                  initialPasswordReset_newPassword: 'Nouveau mot de passe',
                  initialPasswordReset_newPasswordConfirmation: 'Confirmation mot de passe',
                  initialPasswordReset_reset: 'Changer mot de passe',
                  //passwordReset
                  passwordReset_headerLabel: 'Veuillez entrer un nouveau mot de passe:',
                  passwordReset_newPassword: 'Nouveau mot de passe',
                  passwordReset_newPasswordConfirmation: 'Confirmation mot de passe',
                  passwordReset_reset: 'Changer mot de passe',
                  passwordReset_passwordsDontMatch: 'Les mots de passe ne correspondent pas.',
                  //companySelection
                  companySelection_heagerLabel: 'Veuillez choisir une compagnie :',
                  //roleSelection
                  roleSelection_heagerLabel: 'Veuillez s\u00E9lectionner un r\u00F4le:',
                  //forgotPassword
                  forgotPassword_heagerLabel: 'Veuillez s\u00E9lectionner ce que vous vous souvenez :',
                  forgotPassword_userName: 'Utilisateur',
                  forgotPassword_email: 'Email',
                  forgotPassword_reset: 'R\u00E9initialiser mot de passe',
                  forgotPassword_footerLabel: 'Un probl\u00E8me de connexion?\n\u00C9crivez \u00E0 ',
                  //contractorsList
                  contractorsList_title: 'Liste de sous-traitants',
                  contractorsList_addNew: 'Ajouter un sous-traitant',
                  //contractorDetails
                  contractorDetails_title: 'D\u00E9tails du sous-traitant',
                  contractorDetails_deletionConfirmationHeader: 'Vous \u00EAtes sur le point d\u0027effacer un compte sous-traitant.',
                  contractorDetails_deletionConfirmationContent: '\u00CAtes-vous s\u00FBr de vouloir effacer ce sous-traitant, ses contacts associ\u00E9s seront \u00E9galement effac\u00E9s.',
                  contractorDetails_name: 'Nom :',
                  contractorDetails_namePlaceholder: 'e.g. ABC Construction',
                  contractorDetails_phone: 'T\u00E9l\u00E9phone :',
                  contractorDetails_secondaryPhone: 'T\u00E9l\u00E9phone secondaire :',
                  contractorDetails_website: 'Site Web :',
                  contractorDetails_email: 'Email :',
                  contractorDetails_fax: 'Fax :',
                  contractorDetails_associatedProjectsAndPhases: 'Projets et phases associ\u00E9es :',
                  contractorDetails_descriptionTags: 'Tags descriptifs :',
                  contractorDetails_billingStreet: 'Adresse facturation :',
                  contractorDetails_billingCity: 'Ville facturation :',
                  contractorDetails_billingPostalCode: 'Code postal facturation :',
                  contractorDetails_billingCountry: 'Pays facturation :',
                  contractorDetails_billingProvince: 'Provice/\u00E9tat facturation :',
                  contractorDetails_shippingStreet: 'Adresse livraison :',
                  contractorDetails_shippingCity: 'Ville livraison :',
                  contractorDetails_shippingPostalCode: 'Code postal livraison :',
                  contractorDetails_shippingCountry: 'Pays livraison :',
                  contractorDetails_shippingProvince: 'Province/\u00E9tat livraison :',
                  //contactsList
                  contactsList_title: 'Liste des contacts',
                  contactsList_addNew: 'Ajouter contact',
                  //contactDetails
                  contactDetails_title: 'D\u00E9tail du contact',
                  contactDetails_deletionConfirmationHeader: 'Vous \u00EAtes sur le point d\u0027effacer un contact.',
                  contactDetails_deletionConfirmationContent: '\u00CAtes-vous s\u00FBr de vouloir effacer ce contact?',
                  contactDetails_name: 'Nom :',
                  contactDetails_namePlaceholder: 'e.g. Sara',
                  contactDetails_lastName: 'Nom de famille :',
                  contactDetails_lastNamePlaceholder: 'e.g. Smith',
                  contactDetails_personTitle: 'Titre :',
                  contactDetails_personTitlePlaceholder: 'e.g. Ms, Director',
                  contactDetails_homePhone: 'T\u00E9l\u00E9phone domicile :',
                  contactDetails_workPhone: 'T\u00E9l\u00E9phone travail :',
                  contactDetails_mobilePhone: 'T\u00E9l\u00E9phone mobile :',
                  contactDetails_email: 'Email :',
                  contactDetails_fax: 'Fax :',
                  contactDetails_associatedProjectsAndPhases: 'Projets et phases associ\u00E9es:',
                  contactDetails_associatedParentAccount: 'Compte associ\u00E9 :',
                  contactDetails_selectParentAccount: 'S\u00E9lectionner le compte',
                  contactDetails_contactType: 'Type de contact :',
                  contactDetails_selectContactType: 'Selectionner le type de contact',
                  contactDetails_descriptionTags: 'Tags descriptifs :',
                  contactDetails_billingStreet: 'Adresse facturation :',
                  contactDetails_billingCity: 'Ville facturation :',
                  contactDetails_billingPostalCode: 'Code postal facturation :',
                  contactDetails_billingCountry: 'Pays facturation :',
                  contactDetails_billingProvince: 'Provice/\u00E9tat facturation :',
                  contactDetails_shippingStreet: 'Adresse livraison :',
                  contactDetails_shippingCity: 'Ville livraison :',
                  contactDetails_shippingPostalCode: 'Code postal livraison :',
                  contactDetails_shippingCountry: 'Pays livraison :',
                  contactDetails_shippingProvince: 'Province/\u00E9tat livraison :',
                  //clientsList
                  clientsList_title: 'Liste de clients',
                  clientsList_addNew: 'Ajouter un compte client',
                  //clientDetails
                  clientDetails_title: 'Client Details',
                  clientDetails_deletionConfirmationHeader: 'Vous \u00EAtes sur le point d\u0027effacer un compte client.',
                  clientDetails_deletionConfirmationContent: '\u00CAtes-vous s\u00FBr de vouloir effacer ce compte client?, ses contacts associ\u00E9s seront \u00E9galement effac\u00E9s.',
                  clientDetails_name: 'Nom :',
                  clientDetails_namePlaceholder: 'e.g. Sara Conspector',
                  clientDetails_phone: 'T\u00E9l\u00E9phone :',
                  clientDetails_secondaryPhone: 'T\u00E9l\u00E9phone secondaire :',
                  clientDetails_website: 'Site Web :',
                  clientDetails_email: 'Email :',
                  clientDetails_fax: 'Fax :',
                  clientDetails_associatedProjectsAndPhases: 'Projets et phases associ\u00E9es:',
                  clientDetails_descriptionTags: 'Tags descriptifs :',
                  clientDetails_billingStreet: 'Adresse facturation :',
                  clientDetails_billingCity: 'Ville facturation :',
                  clientDetails_billingPostalCode: 'Code postal facturation :',
                  clientDetails_billingCountry: 'Pays facturation :',
                  clientDetails_billingProvince: 'Provice/\u00E9tat facturation :',
                  clientDetails_shippingStreet: 'Adresse livraison :',
                  clientDetails_shippingCity: 'Ville livraison :',
                  clientDetails_shippingPostalCode: 'Code postal livraison :',
                  clientDetails_shippingCountry: 'Pays livraison :',
                  clientDetails_shippingProvince: 'Province/\u00E9tat livraison :'
            });

            $translateProvider.preferredLanguage('en');
            $translateProvider.useCookieStorage();
      }
]);