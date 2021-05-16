Ext.define('Awe.view.awe.AweCreateWizard', {
    id: 'aweCreateWizard',
    extend: 'UX.MDSWizard',
    alias: 'widget.awecreatewizard',
    titlePrefix: 'AWE Wizard',
    includeSubTitle: true,
    requires: ['UX.form.field.ClearButton', 'MDS.form.field.ProjektbeteiligterCombobox'],
    aweTeilObject: Ext.ModelManager.getModel('Awe.model.Teil'),
    ignoreEmptyAttachment: false,
    ignoreDifferentCreator: false,
    longrunnerPassed: false,
    notificationE1: false,

    height: 560,

    statics: {
        BUTTON_PREVIOUS: 0,
        BUTTON_NEXT: 1,
        BUTTON_FINISH: 2,
        BUTTON_CANCEL: 3,
        BUTTON_SAVE: 4,
        BUTTON_REJECT: 5,
        BUTTON_STATE_DISABLED: true,
        BUTTON_STATE_ENABLED: false
    },

    config: {
        i18n: {
            previousBtnText: i18n.global.previous(),
            nextBtnText: i18n.global.next(),
            finishBtnText: i18n.global.finish(),
            cancelBtnText: i18n.global.cancel(),
            rejectBtnText: i18n.global.reject(),
            statusText: i18n.global.wizard.statusText()
        }
    },
    items: [ {
            xtype: 'awesnrfset'
        }, {
            xtype: 'awegeneralfset',
            requiredField: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? false : true

        }, {
            xtype: 'awemdsfset'
        }, {
            xtype: 'aweverteilerfset'
        }, {
        	xtype:'awepdrsfset',
    	    requiredField: true,
        	border: true,
    		width: 339
    } ],
    initComponent: function() {
        this.addEvents('reject');
        this.callParent(arguments);
    },
    setButtonState: function(button, state) {
        this.callParent(arguments);

        var cmpSelector = '',
            disabledState = state || false;

        switch (button) {
            case UX.MDSWizard.BUTTON_REJECT:
                cmsSelector = 'toolbar[dock=bottom] #reject';
                break;
            default:
                break;
        }
        if (!Ext.isEmpty(cmpSelector)) {
            var btn = this.down(cmpSelector);
            if (btn && btn.rendered) {
                btn.setDisabled(disabledState);
            }
        }
    },

    applyI18n: function(i18n) {
        this.callParent(arguments);
        if (i18n) {
            var styleDisableHandler = function(cmp) {
                cmp.addCls('x-btn-disabled');
            };
            var styleEnableHandler = function(cmp) {
                cmp.removeCls('x-btn-disabled');
            };

            this.buttons.splice(2, 0, {
                text: i18n.rejectBtnText || 'Reject',
                itemId: 'reject',
                style : 'border-color: black !important;border-width: 1px !important;',
                handler: this.rejectHandler,
                scope: this,
                disabled: false,
                hidden: true,
                listeners: {
                    disable: styleDisableHandler,
                    enable: styleEnableHandler
                }
            });
        }
    },

    setStatus: function() {

        this.callParent(arguments);
        var isLastItem = (this.getCurrentStep() == (this.getStepCount() - 1)),
            minimunSteps = isNaN(parseInt(this.mandatorySteps))
                            ? this.getStepCount()
                            : Math.min(Math.max(parseInt(this.mandatorySteps), 1), (this.getStepCount()));

        this.setButtonState(UX.MDSWizard.BUTTON_FINISH, !(isLastItem || (minimunSteps < this.getCurrentStep())));
    },

    /**
     * @private
     */
    rejectHandler: function() {
        if (this.fireEvent('reject')) {
            //this.hideHandler();
            this.hide();
        }
    }
});