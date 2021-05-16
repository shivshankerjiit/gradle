MN.Namespace.create('Profile');

Profile = function() {

  return {

    buttonId : 'profileBtn',
    waitClass : 'imageWait_blue',
    buttonClass : 'buttonProfil_small',
    system: 'Base',
    /**
     * initBtn
     * @param {type} btnId
     */
    initBtn : function(btnId) {
      if (btnId) {
        Profile.buttonId = btnId;
      }
      profileBtn = $(Profile.buttonId);
      if (profileBtn) {
        profileBtn.observe('click', Profile.saveSettings);
      }
    },

    saveSettings : function() {
      profileBtn = $(Profile.buttonId);
      profileBtn.removeClassName(Profile.buttonClass);
      profileBtn.addClassName(Profile.waitClass);
      // systemModule takes the value of the current System
      // If method is called from ZKS , ZpsAjaxAccessImpl.java is invoked ,
      // If method is called from RATSD , RatAjaxAccessImpl.java is invoked
      // else BaseAjaxAccessImpl.java is invoked
      if(jQuery('#systemModule')){
        system = jQuery('#systemModule').val();
      }

      jQuery
          .post( system + 'AjaxAccess.saveProfileProperties.do',
              function(data) {
                MN.LOG_ON() ? console
                    .error('Profile settings was saved successfully!')
                    : '';
                profileBtn.removeClassName(Profile.waitClass);
                profileBtn.addClassName(Profile.buttonClass);
              });

    }
  };

}();