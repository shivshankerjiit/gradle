Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'MDS': 'js/components/MDS',
        'UX': 'js/components/UX'
    }
});

Ext.require(['Ext.container.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.env.*',
    'Ext.Browser.*',
    'Ext.grid.*',
    'Ext.form.Panel',
    'Ext.panel.Panel',
    'Ext.window.*',
    'Awe.*',
    'MDS.button.TimeoutButton',
    'widget.*'
]);

Ext.application({
    name: 'Awe',
    appFolder: 'js/awe/app',
    controllers: ['AweListController', 'AweDialogController', 'AweFiltersController', 'AweAttachmentsController',
                  'wizardpages.MdsController', 'AweMultiCreateDialogController', 'AweDisplayPanelController'],

    views: [
            'Awe.view.awe.AweTopPanel',
            'Awe.view.awe.AweList',
            'Awe.view.awe.AweCreateDialog',
            'Awe.view.awe.AweCreateDialogWz',
            'Awe.view.awe.AweDisplayDialog'
    ],

    refs: [{
        ref: 'aweCreateDialogWz',
        selector: 'awecreatedialogwz'
    }, {
        ref: 'aweCreateDialog',
        selector: 'awecreatedialog'
    }, {
        ref: 'aweList',
        selector: 'awelist'
    }, {
        ref: 'aweTopPanel',
        selector: 'awetoppanel'
    }],

    launch: function() {
    	Awe.app = this;

        Ext.QuickTips.init();

        // set our globally used session reset url (triggered manually when clicking on the button)
        MDS.button.TimeoutButton.DEFAULT_SESSION_RESET_URL = 'awe.session.renew.action';

        this.startSessionTimer();
        
        Ext.create('Awe.view.awe.AweViewport');

        // Manually set the default button in a "pressed" state
        Ext.getCmp(Awe.sharedData.defaultTab).toggle(true);

        if (jspScope.selectedTeils()) {
            var selectedTeils = Ext.decode(jspScope.selectedTeils());
            if (jspScope.requestAction() && jspScope.requestAction() === 'teileumfang') {
                this.getAweList().hide();
                this.getAweTopPanel().hide();

                // if only one teil was selected open it directly in wizard, otherwise open multicreate dialog
                if (selectedTeils.length === 1) {
                    this.getController('AweListController').loadSingleTeilInWizard(Ext.getCmp('aweCreateWizard').getForm(), selectedTeils[0].snrShow, jspScope.projekt(), jspScope.teilprojekt(), jspScope.anlauf());
                } else {
                    var multiSelectWindow = Ext.create('Awe.view.awe.AweMultiCreateDialog');
                    multiSelectWindow.show();
                    this.getController('AweMultiCreateDialogController').loadMultipleTeilsInGrid(selectedTeils, jspScope.werk());
                }
            }
        }
    },

    startSessionTimer: function() {
        // show the session timeout page after 30 minutes (60000 are 1 minute)
        this.pinger = Ext.create('UX.Pinger', {
            url: MDS.button.TimeoutButton.DEFAULT_SESSION_RESET_URL, // here in our usecase: not really necessary
            timer: 1800000, // 30 minutes = 1800000
            autoStart: true,
            autoStartSilent: true,
            restartOnAjaxCalls: true,

            listeners: {
                afterping: function(options, success, response) {
                    if (Ext.isGecko) {
                        console.debug('Renewed the session after ' + (this.timer/60000) + ' minutes with the following result: ' + success);
                    }
                },
                ajaxcall: function() {
                    /*
                     * Update all existing timeoutbutton texts to show that the session times out in 30 minutes starting
                     * from now on (showing the exact client time when the session will be invalidated).
                     */

                    var timeoutButtons = Ext.ComponentQuery.query('timeoutbutton');
                    Ext.Array.forEach(timeoutButtons, function(item, index, allItems) {
                        if (item.setTimeoutText) {
                            item.setTimeoutText();
                        }
                    });
                    return true; // return true to allow reseting the timer and start counting from the beginning
                },
                beforeping: function() {
                    // here we can implement a message query if the user want's to renew the session
                    // currently this is not the desired behaviour
                    if (Ext.isGecko) {
                        console.debug('Now showing the session timeout msgbox...');
                    }

                    var customMsgBox = Ext.create('Ext.window.MessageBox', {
                        iconHeight: 120,
                        iconWidth: 120
                    });

                    customMsgBox.show({
                        title: 'Session Timeout',
                        msg: '<p class="msg-area">Ihre Session ist abgelaufen.<br/>Bitte loggen Sie sich erneut ein:<br/><a target="_top" href="' + jspScope.loginUrl() + '">' + jspScope.loginUrl() + '</a></p>',
                        buttons: Ext.Msg.OK,
                        modal: true,
                        width: 460,
                        closable: false,
                        fn: function(buttonId, text) {
                            if (Ext.isGecko) {
                                console.debug('Now redirecting to the portal login page...');
                            }
                            Ext.getBody().mask();
                            top.location.href = jspScope.loginUrl();
                        },
                        animEl: 'elId',
                        cls: 'session-timeout-msgbox',
                        iconHeight: 120,
                        iconWidth: 120,
                        icon: 'logout-bg-icon-pmoam'
                    });
                    this.stop();
                    return false;
                }
            }
        });
    }
});