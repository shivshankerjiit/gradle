var keyMapDialog;
var isAweInEditMode = false;
var isAweInExtendMode = false;
var isAweInCopyMode = false;
var shouldSkipValidation = false;
var aweEditObject = null;
var isRenewed = false;
var generalPageFirstTimeFlag = true;
var wizardTitle = i18n.awe.form.createtitle();
var kemsValidationMsg = i18n.errors.kems.notUnique();
var TEIL_RELATED_FIELDS_COUNT = 2;
var firstTeilId; // Used for validation of change of the first snr in the grid
var lastPositionids; // Used for validation of change of the positions
var multipleAwes = [];
var sammelbegriff = null;
var isCanceledLoop = true;
var isFilteredAwe = false;
var isAweSubmittedToPdrs = true;
var treiberId = null;
var zieltermin = null;
var massnahmeDesc = null;
var massnahmeTyp = null;

Ext.define('Awe.controller.AweDialogController', {
    extend: 'Ext.app.Controller',
    requires: ['MDS.Utils.Misc', 'MDS.Utils.Response'],

    stores: ['Klassifikation', 'Prioritaet', 'WerkStore',
        'BzaTypStore', 'AenderungsartStore',
        'PositionStore', 'ProjektStore', 'TeilprojektStore',
        'StuecklisteStore', 'DialogProjektStore', 'AweVarianteStore',
        'BetrBaureihenStore', 'BetrBereichStore', 'BetrProduktionslinieStore',
        'BetrGewerkeStore', 'LieferantStore', 'AttachmentStore', 'AweWerkStore'
    ],
    models: ['Awe', 'Klassifikation', 'Prioritaet', 'Werk', 'Attachment',
        'Teil', 'BzaTyp', 'Aenderungsart', 'Position',
        'ProdStru', 'Projektbeteiligter', 'DialogProjekt', 'Anlauf', 'SNR', 'BetroffeneBaureihen',
        'BetroffeneBereich', 'BetroffeneProduktionslinie', 'Gewerk', 'Lieferant', 'Treiber', 'AweWerk'
    ],
    views: ['awe.AweCreateDialog', 'awe.AweCreatePanel', 'awe.AwePositionsSearchWindow',
        'awe.AwePositionsSearchWindowWz', 'awe.AweSachnummerFSet', 'awe.AweCreateWizard',
        'awe.AweGeneralFSet', 'awe.AweVerteilerFSet', 'awe.AweDialogFSet', 'awe.AwePdrsFSet','awe.AweDialogSDR'

    ],
    refs: [{
        ref: 'aweCreateDialog',
        selector: 'awecreatedialog'
    }, {
        ref: 'aweCreateDialogWz',
        selector: 'awecreatedialogwz'
    }, {
        ref: 'mdsPage',
        selector: 'awecreatedialogwz awecreatewizard awemdsfset'
    }, {
        ref: 'generalPage',
        selector: 'awecreatedialogwz awecreatewizard awegeneralfset'
    }, {
        ref: 'pdrsPage',
        selector: 'awecreatedialogwz awecreatewizard awepdrsfset'
    }, {
        ref: 'aweCreatePanel',
        selector: 'awecreatepanel'
    }, {
        ref: 'aweCreateWizard',
        selector: 'awecreatewizard'
    }, {
        ref: 'aweList',
        selector: 'awelist'
    }, {
        ref: 'aweTopPanel',
        selector: 'awetoppanel'
    }, {
        ref: 'awePositionsSearchWindow',
        selector: 'awepositionssearchwindow'
    }, {
        ref: 'awePositionsSearchWindowWz',
        selector: 'awepositionssearchwindowwz'
    }, {
        ref: 'nextButton',
        selector: 'awecreatedialogwz awecreatewizard #next'
    }, {
        ref: 'saveAweButton',
        selector: 'awecreatedialogwz awecreatewizard #save'
    }, {
        ref: 'backButton',
        selector: 'awecreatedialogwz awecreatewizard #previous'
    }, {
        ref: 'finishButton',
        selector: 'awecreatedialogwz awecreatewizard #finish'
    }, {
        ref: 'saveButton',
        selector: 'awecreatedialog #saveButton'
    }, {
        ref: 'resetButton',
        selector: 'awecreatedialog #resetButton'
    }, {
        ref: 'searchPositionsButton',
        selector: 'awecreatedialogwz awecreatewizard #searchPositionsBtn'
    }, {
        ref: 'grundDetailsFld',
        selector: 'awecreatedialogwz awecreatewizard #grundDetails'
    }, {
        ref: 'aweAbweichungFld',
        selector: 'awecreatedialogwz awecreatewizard #aweAbweichung'
    }, {
        ref: 'aweStartFld',
        selector: 'awecreatedialogwz awecreatewizard #aweStart'
    }, {
        ref: 'aweEndeFld',
        selector: 'awecreatedialogwz awecreatewizard #aweEnde'
    }, {
        ref: 'dauerFld',
        selector: 'awecreatedialogwz awecreatewizard #dauer'
    }, {
        ref: 'stueckzahlbegrenzungFld',
        selector: 'awecreatedialogwz awecreatewizard #stueckzahlbegrenzung'
    }, {
        ref: 'aggregateIdFld',
        selector: 'awecreatedialogwz awecreatewizard #aggregateId'
    }, {
        ref: 'sammelbegriffFld',
        selector: 'awecreatedialogwz awecreatewizard #sammelbegriff'
    }, {
        ref: 'qsVerantwortlicherFld',
        selector: 'awecreatedialogwz awecreatewizard #qsVerantwortlicherId'
    }, {
        ref: 'kemVerantwortlicherFld',
        selector: 'awecreatedialogwz awecreatewizard #kemVerantwortlicherId'
    }, {
        ref: 'erstellerFld',
        selector: 'awecreatedialogwz awecreatewizard #erstellerId'
    },{
        ref: 'windowPersonFld',
        selector: 'awecreatedialogwz awecreatewizard #windowPersonId'
    }, {
        ref: 'kem1Fld',
        selector: 'awecreatedialogwz awecreatewizard #kem1'
    }, {
        ref: 'kem2Fld',
        selector: 'awecreatedialogwz awecreatewizard #kem2'
    }, {
        ref: 'kem3Fld',
        selector: 'awecreatedialogwz awecreatewizard #kem3'
    }, {
        ref: 'kem4Fld',
        selector: 'awecreatedialogwz awecreatewizard #kem4'
    }],
    attachments: [],
    isSavedAweFlag: false,

    init: function(application) {
        Ext.apply(Ext.form.field.VTypes, {
            /*
             * After a select event is triggered a listener needs to change 'isSelected' value to 'true' in order to make the field valid
             */
            comboSelect: function(val, field) {
                return field.isSelected;
            },
            comboSelectText: i18n.awe.validation.isSelectedComboMessage(),
            /*
             * This vtype method is called on blur event and checks if in the create wizzard there are duplicate of the kem description,
             * and if it does, the scripts marks the fields invalid.
             *
             *  @author: sidney.agib.ext@cellent.de
             *  @date: 21.07.2015
             */

            validateKem: function(val, field) {
                var kemsList = Ext.ComponentQuery.query('#awecreatedialogwz textfield[name=kemsList]');
                var items = Ext.Array.filter(kemsList, function(item) {
                    return ( item !== null && item.getValue() !== undefined &&
                            val !== null && item.getValue().toLowerCase() == val.toLowerCase());
                });

                if (items && items.length > 1 && field) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (item != field) {
                            item.markInvalid(kemsValidationMsg);
                        }
                    }
                }

                return (items && items.length == 1);
            },
            validateKemText: kemsValidationMsg
        });

        keyMapDialog = new Ext.util.KeyMap(Ext.getDoc(), [{
            key: Ext.EventObject.Z,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(e, eOpts) {
                if (this.getBackButton()) {
                    this.getBackButton().focus();
                    this.getBackButton().fireEvent('click', this.getBackButton());
                }
            }
        }, {
            key: Ext.EventObject.S,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getSaveButton()) {
                    this.getSaveButton().fireEvent('click', this.getSaveButton());
                    this.getSaveButton().focus();
                }
            }
        }, {
            key: Ext.EventObject.P,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getSearchPositionsButton()) {
                    this.getSearchPositionsButton().fireEvent('click', this.getSearchPositionsButton());
                    this.getSearchPositionsButton().focus();
                }
            }
        }, {
            key: Ext.EventObject.R,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getResetButton()) {
                    this.getResetButton().focus();
                    this.getResetButton().fireEvent('click', this.getResetButton());
                }
            }
        }, {
            key: Ext.EventObject.ESC,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(e, eOpts) {
                this.closeAwePanelWz();
            }
        }]);
        this.control({
            'awecreatedialog button[action=save]': {
                click: this.saveAwe
            },
            'awecreatedialog button[action=back]': {
                click: this.closeAwePanel
            },
            'awecreatedialog button[action=reset]': {
                click: this.resetForm
            },
            'awecreatedialog': {
                beforeshow: function() {
                    keyMapDialog.enable();
                },
                beforehide: function() {
                    keyMapDialog.disable();
                }
            },
            'awecreatepanel button[action=searchPositions]': {
                click: this.searchPositions
            },
            'awecreatepanel button[action=clearAllPositions]': {
                click: this.clearAllPositions
            },
            'awecreatepanel button[action=removeSelectedPositions]': {
                click: this.clearSelectedPositions
            },
            'awecreatepanel button[action=clearAllVerteilers]': {
                click: this.clearAllVerteilers
            },
            'awecreatepanel button[action=removeSelectedVerteilers]': {
                click: this.removeSelectedVerteilers
            },
            'awecreatepanel button[action=clearAllGroupVerteilers]': {
                click: this.clearAllGroupVerteilers
            },
            'awecreatepanel button[action=removeSelectedGroupVerteilers]': {
                click: this.removeSelectedGroupVerteilers
            },
            'awecreatewizard button[action=searchPositions]': {
                click: this.searchPositionsWz
            },
            'awecreatewizard button[action=clearAllPositions]': {
                click: this.clearAllPositionsInGrid
            },
            'awecreatewizard button[action=removeSelectedPositions]': {
                click: this.clearSelectedPositionsInGrid
            },
            'awepositionssearchwindow button[action=addPositions]': {
                click: this.addPositions
            },
            'awepositionssearchwindowwz button[action=addPositions]': {
                click: this.addPositionsInGrid
            },
            'awecreatewizard': {
                leave: this.onPageLeave,
                finish: this.saveAweWz,
                cancel: this.closeAwePanelWz,
                activate: this.onPageActivate,
                save: this.onIntermSave,
                reject: this.onReject
            },
            'awecreatewizard button[action = addSnr]': { // addSaveSnr
                click: this.addSnr
            },
            'awecreatewizard button[action = saveSnr]': {
                click: this.saveSnr
            },
            'awecreatewizard button[action = deleteSnr]': {
                click: this.deleteSnr
            },
            'awecreatewizard button[action = editSnr]': {
                click: this.editSnr
            },
            'awecreatewizard button[action = cancelSnr]': {
                click: this.cancelSnr
            },
            'awecreatewizard #snrsGrid': {
                beforeselect: this.isSelectionExecutable
            },
            'awecreatewizard #werkWerk': {
                blur: this.onWerkBlur,
                select: this.onDropdownSelect
            },
            'awecreatewizard #sachnummer': {
                blur: this.onSnrBlur
            },
            'awecreatewizard #ersAltteil': {
                blur: this.onErsAltteilBlur
            },
            'awecreatewizard #zgs': {
                select: this.onZgsSelect
            },
            'awecreatewizard #dauer': {
                spin: this.onDauerSpin
            },
            'awecreatewizard #lieferant': {
                beforeshow: this.onLnBeforeshow,
                select: this.onLnSelect
            },
            'awecreatewizard awegeneralfset pjbCombobox[name=kemVerantwortlicherId]': {
                select: this.onDropdownSelect,
                validitychange: this.onGenFSetValidityChange //validitychange: this.onInvalidAweValidityChange
            },
            'awecreatewizard awegeneralfset pjbCombobox[name=qsVerantwortlicherId]': {
                select: this.onDropdownSelect,
                validitychange: this.onGenFSetValidityChange //this.onInvalidAweValidityChange
            },
            'awecreatewizard awegeneralfset pjbCombobox[name=erstellerId]': {
                select: this.onDropdownSelect,
                validitychange: this.onGenFSetValidityChange //this.onInvalidAweValidityChange
            },
            'awecreatewizard awegeneralfset pjbCombobox[name=windowPersonId]': {
                select: this.onDropdownSelect,
                validitychange: this.onGenFSetValidityChange //this.onInvalidAweValidityChange
            },
            'awecreatewizard awegeneralfset combobox': { //awesnrfset combobox, removed because of different req. for this page
                validitychange: this.onGenFSetValidityChange //this.onValidityChange
            },
            "awecreatewizard awegeneralfset textfield:not([name*='grundDetails']):not([name='kemsList'])": { // this includes the textareas too
                validitychange: this.onGenFSetValidityChange //this.onValidityChange
            },
            "awecreatewizard awepdrsfset combobox[name='betroffeneBaureihen'],combobox[name='betroffeneBereichen'],combobox[name='betroffeneProduktionslinien'],combobox[name='gewerk']": { // this includes the textareas too
              validitychange: this.onPdrsFSetValidityChange //this.onValidityChange
            },
            "awecreatewizard awegeneralfset textareafield[name='grundDetails']": {
                errorchange: this.onGenFSetErrorChange
            },
            'awecreatewizard awegeneralfset #dauer,awecreatewizard awegeneralfset #aweEnde,awecreatewizard awegeneralfset #aweStart': {
                change: this.onDateChange,
                errorchange: this.onGenFSetErrorChange
            },
            "awecreatewizard awegeneralfset textfield[name='kemsList']": {
                validitychange: this.onKemsValidityChange
            },
            'awecreatewizard awepdrsfset textfield': {
                validitychange: this.onPdrsFSetValidityChange
            },
            'awecreatewizard aweverteilerfset #additionalReceivers': {
                select: this.onAdditionalReceiversSelect
            },
            'awecreatewizard aweverteilerfset #distributorGroups': {
                select: this.onVerteilerGruppenSelect
            },
            'awecreatewizard aweverteilerfset button[action=clearAllAdditReceivers]': {
                click: this.clearAllAdditReceivers
            },
            'awecreatewizard aweverteilerfset button[action=removeSelectedAdditReceivers]': {
                click: this.removeSelectedAdditReceivers
            },
            'awecreatewizard aweverteilerfset button[action=clearAllDistributorGroups]': {
                click: this.clearAllDistributorGroups
            },
            'awecreatewizard aweverteilerfset button[action=removeSelectedDistributorGroups]': {
                click: this.removeSelectedDistributorGroups
            },
            'awecreatewizard awepdrsfset #betrBaureihen': {
                select: this.onBetrBaureihenSelect,
                change: this.onBetrBaureihenChange
            },
            'awecreatewizard awepdrsfset #paev': {
                render: this.onRenderPaev
            },
            // 'awecreatewizard awegeneralfset #aweAbweichung': {
            //     validitychange: this.onInvalidAweValidityChange
            // },
            'awecreatewizard #zgs, awecreatewizard #prioritaet, awecreatewizard #lieferant, awecreatewizard #klassifikation, awecreatewizard #betrGewerke': {
                change: this.onComboChange
            },
            'awecreatedialogwz awecreatewizard #werkeList': {
                change: this.onComboChange
            }
        });

    },
    saveAwe: function() {
        this.getAweCreateDialog().setLoading(true);
        var form = this.getAweCreatePanel().getForm();
        var sachnummerField = form.findField('sachnummer');
        var daterangeObj = Ext.create('Awe.AweDaterange');
        daterangeObj.fromFilter = false;
        daterangeObj.startField = form.findField('aweStart');
        daterangeObj.endField = form.findField('aweEnde');
        daterangeObj.durationField = form.findField('dauer');
        daterangeObj.form = form;
        if (!sachnummerField.hasActiveError() && daterangeObj.isCombinationValid() && form.isValid()) {
            var jsonData = form.getValues();
            // get the positions and verteilers from the grid
            var positions = Ext.Array.pluck(Ext.getCmp('positionsGrid').getStore().getRange(), 'data');
            var empfaengerVerteilers = Ext.Array.pluck(Ext.getCmp('verteilerGrid').getStore().getRange(), 'data');
            var gruppeVerteilers = Ext.Array.pluck(Ext.getCmp('verteilerGruppenGrid').getStore().getRange(), 'data');
            var kems = undefined;
            // clear the data before sending it to the server, i.e. remove the
            // empty properties
            clearObject(jsonData, [null, ""]);

            var failureHandler = function(jsonResponse) {
              //popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');

                Ext.Msg.show({
                    title: i18n.error.title(),
                    msg: jsonResponse.errors || 'Unknown errors. Please contact MDS Toolset hotline.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    fn: function(buttonId) {
                        return false;
                    }
                });
            };

            if (jsonData.kemsList instanceof Array) {
                kems = Ext.JSON.encode(jsonData.kemsList);
            } else {
                kems = Ext.JSON.encode([jsonData.kemsList]);
            }

            var paramsObject = {
                id: jsonData.id,
                data: Ext.JSON.encode(jsonData),
                kems: kems,
                empfaengerVerteilers: Ext.JSON.encode(empfaengerVerteilers),
                gruppeVerteilers: Ext.JSON.encode(gruppeVerteilers),
                positions: Ext.JSON.encode(positions),
                info: jsonData.aweInfo,
                isRenewed: jsonData.isRenewed
            };

            if (jsonData.sieheZeichnungTeilId) {
                paramsObject.sieheZeichnungTeilId = Ext.JSON.encode(jsonData.sieheZeichnungTeilId);
            }

            if (jsonData.zeichnungsDatum) {
                paramsObject.zeichnungsDatum = Ext.JSON.encode(jsonData.zeichnungsDatum);
            }

            Ext.Ajax.request({
                scope: this,
                url: 'awe.save.action',
                method: 'POST',
                params: paramsObject,
                success: function(response, action) {
                    if (MDS.Utils.Response.isSuccessful(response)) {
                        Ext.getStore('AweDataStore').reload();
                        this.getAweCreateDialog().setLoading(false);
                        this.closeAwePanel();
                        MDS.Utils.Misc.setUserInfoMessage(i18n.global.msg.save(), i18n.global.confirm.save());
                    } else {
                        this.getAweCreateDialog().setLoading(false);

                        var jsonResponse = MDS.Utils.Response.decodeJson(response, ['errors']);

                        failureHandler(jsonResponse);
                    }
                },
                failure: function(record, operation) {
                  popupWindow(i18n.global.msg.save(), i18n.global.msg.errorConnection(), 'x-icon-error', 60000);
                }
            });
        } else {
            var fields = form.getFields().items;
            var errors = [];
            var errorsText;
            var errorstpl = new Ext.XTemplate(i18n.awe.form.validationErrorMsg() + '<br>', '<tpl if="">',
                '<tpl for="."> &nbsp;{#}. {fieldLabel} : {error}<br></tpl>', '</tpl>'
            );

            fields.each(function(field) {
                errors = errors.concat(Ext.Array.map(field.getActiveErrors(), function(error) {
                    if (field.fieldLabel) {
                        return {
                            field: field,
                            error: error,
                            fieldLabel: field.fieldLabel
                        }
                    } else {
                        return {
                            field: field,
                            error: error,
                            fieldLabel: i18n.awe.form.zusammenMit()
                        }
                    }
                }));

            });

            errorsText = errorstpl.apply(errors);
            Ext.MessageBox.show({
                title: i18n.awe.form.validationErrorMsgTitle(),
                msg: errorsText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            this.getAweCreateDialog().setLoading(false);
            errors[0].field.focus();
        }
    },

    updateListAttachments: function(contextId) {

        var self = this;
        var arrayAttachments = self.attachments;
        if (contextId) {
            if (arrayAttachments && arrayAttachments.length > 0) {

                var arrayIds = Ext.JSON.encode(arrayAttachments);
                Ext.Ajax.request({
                    scope: this,
                    url: 'awe.anhang.list.update.action',
                    method: 'POST',
                    params: {
                        attachmentsIds: arrayIds,
                        contextId: contextId
                    },
                    success: function(response, action) {
                        isCanceledLoop = false;
                        self.closeAwePanelWz();
                    },
                    failure: function() {
                        self.deleteListAttachments(arrayAttachments);
                        isAweSubmittedToPdrs = true;
                        isCanceledLoop = false;
                        popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
                    }
                });
            } else {
                isCanceledLoop = false;
                self.closeAwePanelWz();
            }

        } else {
            popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
        }
    },

    showSuccessModal: function(errors, massnahmeErrors, aweId, isPdrNumber) {
        if ( aweId && aweId.toString().length > 0 ) {

            var title = i18n.global.msg.save();
            var message = '<div style="text-align:left">' + i18n.global.confirm.save();
            var time = 5000;
            var width = 250;
            var hasMassErrors = (massnahmeErrors !== undefined && massnahmeErrors !== null);
            var hasErrors = (errors !== undefined && errors !== null && Ext.isArray(errors) && errors.length > 0);

            if (isPdrNumber) {
                var url = jspScope.pdrsDirectAccessUrl() + aweId;
                var hyperlinkStart = '<a id="pdrsLink" target="_blank" href="' + url + '">';
                var hyperlinkEnd = '</a>';

                title = i18n.awe.form.createtitle() + ' ' + aweId;

                if (hasErrors) {

                    message = '<div class="pdrs-errors"><p class="error-headline">' + i18n.awe.form.requestValidationErrorMsg() + '</p><ul>';
                    time = 7500;

                    for (var i = 0; i < errors.length; i++) {
                        var error = errors[i];
                        message = message + '<li>' + i18n.awe.pdrsErrors[error.code](error.field) + '</li>';
                    }
                    message = message + '</ul>';
                    message = message + '<p class="error-footline">' + i18n.awe.form.requestValidationErrorMsg2() + '</p>';
                    message = message + '<hr/>';
                }

                message = message + '<p>' + i18n.awe.editAweMessage(hyperlinkStart, hyperlinkEnd) + '</p>';
                width = 600;
            } else {
              if (hasErrors) {

                for (var i = 0; i < errors.length; i++) {
                  var error = errors[i];
                  if(error.code==50003){
                    message = '<div class="pdrs-errors"><p class="error-headline">' + i18n.awe.form.requestValidationErrorMsgWhile50003() + '</p><ul>';
                    message = message + '<li>' + i18n.awe.pdrsErrors[error.code](error.field) + '</li>';
                    message = message + '</ul>';
                    message = message + '<p class="error-footline">' + i18n.awe.form.requestValidationErrorMsg2While50003() + '</p>';
                  }else if(error.code==50001 || error.code==400){
                    message = '<div class="pdrs-errors"><p class="error-headline">' + i18n.awe.form.requestValidationErrorMsgWhile50001() + '</p>';
                    message = message + '<p class="error-footline">' + i18n.awe.form.requestValidationErrorMsg2While50001() + '</p>';
                  }else{
                    message = '<div class="pdrs-errors"><p class="error-headline">' + i18n.awe.form.requestValidationErrorMsg() + '</p><ul>';


                    for (var i = 0; i < errors.length; i++) {
                      var error = errors[i];
                      message = message + '<li>' + i18n.awe.pdrsErrors[error.code](error.field) + '</li>';
                    }
                    message = message + '</ul>';
                    message = message + '<p class="error-footline">' + i18n.awe.form.requestValidationErrorMsg2() + '</p>';
                  }
                }

              }

              if (massnahmeErrors=="old") {

            	  message = '<div class="pdrs-errors"><p class="error-headline">' + i18n.awe.form.requestValidationErrorMassnahme() + '</p>';

                }

                time = 7500;

                width = 600;
            }

            message = message + '</div>';

            if (hasErrors) {
                popupWindowNoHide(title, message, 'x-icon-error', width);
            } else {
                popupWindow(title, message, 'x-icon-information', time, width);
            }
        }
    },

    deleteListAttachments: function(list) {

        var self = this;
        var failureHandler = function() {
            popupWindow(i18n.awe.form.deleteTitle(), i18n.global.msg.error(), 'x-icon-error');
        }

        if (list && list.length > 0) {
            var arrayIds = Ext.JSON.encode(list);
            Ext.Ajax.request({
                scope: this,
                url: 'awe.anhang.list.delete.action',
                method: 'POST',
                params: {
                    arrayIds: arrayIds
                },
                success: function(response, action) {
                    if (MDS.Utils.Response.isSuccessful(response)) {
                        popupWindow(i18n.awe.form.deleteTitle(), i18n.global.confirm.deleteMsg(), 'x-icon-information');
                    } else {
                        this.getAweCreateDialog().setLoading(false);
                        failureHandler();
                    }
                },
                failure: failureHandler
            });
        }
    },

    deleteAttachmentWz: function(record) {

        var attachmentWindow = Ext.ComponentQuery.query('#uploadAttachmentWindow')[0];
        var attachmentsGrid = Ext.getCmp('wizzardAttachmentsGrid');
        var arrayAttIds = this.attachments;

        Ext.Msg.confirm(i18n.awe.form.deleteTitle(), i18n.awe.form.deleteConfirmation(), function(buttonId) {
            if (buttonId == 'yes') {
                var failureHandler = function() {
                    popupWindow(i18n.awe.form.deleteTitle(), i18n.global.msg.error(), 'x-icon-error');
                }

                Ext.Ajax.request({
                    scope: this,
                    url: 'awe.anhang.delete.action',
                    method: 'POST',
                    params: {
                        attachmentId: record.get('anId')
                    },
                    success: function(response, action) {
                        if (MDS.Utils.Response.isSuccessful(response)) {

                            var store = attachmentsGrid.getStore();
                            var id = record.get('anId');
                            var index = arrayAttIds.indexOf(id);
                            if (index > -1) {
                                arrayAttIds.splice(index, 1);
                            }
                            var listIds = Ext.JSON.encode(arrayAttIds);

                            store.load({
                                params: {
                                    arrayAttachments: listIds
                                },
                                callback: function(records, operation, success) {

                                    if (records != null) {
                                        if (records.length == 0) {
                                            attachmentsGrid.hide();
                                        } else {
                                            attachmentsGrid.show();
                                        }
                                    }
                                }
                            });
                            popupWindow(i18n.awe.form.deleteTitle(), i18n.global.confirm.deleteMsg(), 'x-icon-information');
                        } else {
                            this.getAweCreateDialog().setLoading(false);
                            failureHandler();
                        }
                    },
                    failure: failureHandler
                });
            }
        });
    },

    uploadAttachment: function() {

        var self = this;
        var attachmentWindow = Ext.ComponentQuery.query('#uploadAttachmentWindow')[0];
        var form = Ext.ComponentQuery.query('#fileUploadForm')[0] ? Ext.ComponentQuery.query('#fileUploadForm')[0].getForm() : null;
        var beschreibungField = form.findField('beschreibung');
        var isValidField = form.getFields().getByKey('attachmentWz').isValid();
        if (form && form.isValid() && isValidField) {
            form.submit({
                url: 'awe.anhang.upload.action',
                success: function(form, action) {
                    beschreibungField.setValue('');
                    var attachmentId = Ext.JSON.decode(action.response.responseText);
                    self.attachments.push(attachmentId['id']);

                    var arrayIds = self.attachments;
                    var listIds = arrayIds.join();
                    var arrayIdsList = Ext.JSON.encode(arrayIds);
                    form.findField('listAttachments').setValue(listIds);

                    var attachmentsGrid = Ext.getCmp('wizzardAttachmentsGrid');
                    var attachmentStore = attachmentsGrid.getStore();

                    attachmentStore.load({
                        params: {
                            arrayAttachments: arrayIdsList
                        },
                        callback: function(records, operation, success) {
                            attachmentsGrid.show();
                        }
                    });

                    popupWindow(i18n.global.msg.save(), i18n.global.confirm.save(), 'x-icon-information');
                },
                failure: function(form, action) {
                    beschreibungField.setValue('');
                    popupWindow(i18n.global.msg.save(), action.result.errors, 'x-icon-error');
                }
            });
        } else {
            popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
        }
    },

    saveAweWz: function() {
        this.getAweCreateDialogWz().setLoading(true);
        var self = this;
        var aweWizzard = this.getAweCreateWizard();
        var form = aweWizzard.getForm();
        var sachnummerField = form.findField('sachnummer');
        var daterangeObj = Ext.create('Awe.AweDaterange');
        daterangeObj.fromFilter = false;
        daterangeObj.startField = form.findField('aweStart');
        daterangeObj.endField = form.findField('aweEnde');
        daterangeObj.durationField = form.findField('dauer');
        daterangeObj.form = form;

        if ((daterangeObj.isCombinationValid() && form.isValid()) || shouldSkipValidation) {

            // get the snrs and verteilers from the grid
            var jsonData = form.getValues();
            //var jsonData = form.getFieldValues();
            var snrs = this.getStoreData(Ext.getCmp('snrsGrid').getStore());
            var empfaengerVerteilers = Ext.Array.pluck(Ext.getCmp('additionalReceiversGrid').getStore().getRange(), 'data');
            var gruppeVerteilers = Ext.Array.pluck(Ext.getCmp('distributorGroupsGrid').getStore().getRange(), 'data');
            var kems = ( jsonData.kemsList ) ? jsonData.kemsList : [];
            var betroffBaureihenList = ( jsonData.betroffeneBaureihenList ) ? convertValueToArray(jsonData.betroffeneBaureihenList) : [];
            var betroffBereichenList = ( jsonData.betroffeneBereichenList ) ? convertValueToArray(jsonData.betroffeneBereichenList) : [];
            var betroffProduktionslinienList = ( jsonData.betroffeneProduktionslinienList ) ? convertValueToArray(jsonData.betroffeneProduktionslinienList) : [];

            // Setting the values
            this.setMassnahmeRelatedFields(form);

            if( this.isAweInCopyMode || this.isRenewed ) {
                jsonData.id = null;

                // when in copy mode - unset some fields (like the PK) to generate a new entity
                if(this.isAweInCopyMode) {
                    jsonData.aweId = null;
                    jsonData.erstellungsDatum = null;
                    jsonData.aenderungsDatum = null;
                    // unset values from DIALOG got via copy mode
                    jsonData.kem = null;
                    jsonData.antragstatus = null;
                    jsonData.geprueftVon = null;
                    jsonData.beantragung = null;
                    jsonData.erfassung = null;
                    jsonData.genehmigung = null;
                    jsonData.genehmigtVon = null;
                    jsonData.dokumentiertVon = null;
                }

                if( Ext.isArray(snrs) && !Ext.isEmpty(snrs) ) {
                    for(var i = 0; i < snrs.length; i++) {
                        var snr = snrs[i];

                        if( snr === null || snr === undefined ) {
                            return;
                        }

                        if( snr.hasOwnProperty('id') ) {
                            snr.id = null;
                        }

                        if( snr.hasOwnProperty('positions') && Ext.isArray(snr.positions) && !Ext.isEmpty(snr.positions) ) {
                            for( var idx = 0; idx < snr.positions.length; idx++ ) {

                                var position = snr.positions[idx];

                                if( position.hasOwnProperty('id') ) {
                                    position.id = null;
                                }

                                if( position.hasOwnProperty('aenderungsDatum') ) {
                                  position.aenderungsDatum = Ext.Date.format(new Date(), i18n.awe.word.defaultDateFormat());
                                }

                                if( position.hasOwnProperty('erstellungsDatum') ) {
                                  position.erstellungsDatum = Ext.Date.format(new Date(), i18n.awe.word.defaultDateFormat());
                                }
                            }
                        }

                    }
                }
            }

            if (Ext.isEmpty(jsonData.id) || Ext.isEmpty(jsonData.aweId)) {
              isAweInEditMode = false;
            }

            // clear the data before sending it to the server, i.e. remove the empty properties
            if (isAweInEditMode) {
                clearObject(jsonData, [undefined, "[]", '{}']);
            } else {
                clearObject(jsonData, [undefined, null, "", "[]", '{}']);
            }

            fullClearObject(snrs, [null, undefined, "", "[]", '{}']);
            // fullClearObject(gruppeVerteilers, [null, undefined, "", "[]", '{}']);
            // fullClearObject(empfaengerVerteilers, [null, undefined, "", "[]", '{}']);
            // fullClearObject(kems, [null, undefined, "", "[]", '{}']);
            var arrayIds = Ext.JSON.encode(self.attachments);

            var paramsObject = {
                id: jsonData.id,
                data: Ext.JSON.encode(jsonData),
                kems: Ext.JSON.encode( getCorrectValueType(kems) ),
                empfaengerVerteilers: Ext.JSON.encode(empfaengerVerteilers),
                gruppeVerteilers: Ext.JSON.encode(gruppeVerteilers),
                snrs: Ext.JSON.encode(snrs),
                info: jsonData.aweInfo,
                betroffBaureihenList: Ext.JSON.encode( betroffBaureihenList ),
                betroffBereichenList: Ext.JSON.encode( betroffBereichenList ),
                betroffProduktionslinienList: Ext.JSON.encode( betroffProduktionslinienList ),
                isAweSubmittedToPdrs: isAweSubmittedToPdrs,
                isRenewed: this.isRenewed,
                treiberId: this.treiberId,
                zieltermin: this.zieltermin,
                isInformelleMassnahme: this.massnahmeTyp,
                massnahmeDesc: this.massnahmeDesc,
                attachmentsIds: arrayIds
            };
            // fullClearObject(paramsObject, [null, undefined, "", "[]", '{}']);

            var failureHandler = function(jsonResponse) {
                //popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');

                Ext.Msg.show({
                    title: i18n.error.title(),
                    msg: jsonResponse.errors || 'Unknown errors. Please contact MDS Toolset hotline.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    fn: function(buttonId) {
                        return false;
                    }
                });

                isCanceledLoop = false;
                self.closeAwePanelWz();
            }


            Ext.Ajax.request({
                scope: this,
                url: 'awe.save.action',
                method: 'POST',
                params: paramsObject,
                timeout: 120000,
                success: function(response, action) {
                    if (MDS.Utils.Response.isSuccessful(response)) {

                        var contextId = Ext.decode(response.responseText);
                        var aweId = ( contextId['pdrNumber'] ) ? contextId['pdrNumber'] : contextId['id'];
                        this.isSavedAweFlag = true;
                        this.updateListAttachments(contextId['id']);
                        this.getAweCreateDialogWz().setLoading(false);
                        this.showSuccessModal(contextId['pdrErrors'], contextId['massnahmeErrors'], aweId, !Ext.isEmpty(contextId['pdrNumber']) );
                    } else {
                        this.getAweCreateDialogWz().setLoading(false);

                        var jsonResponse = MDS.Utils.Response.decodeJson(response, ['errors']);

                        failureHandler(jsonResponse);
                    }
                    this.loadMultipleTeilsInWizard(); // check!
                },

                failure: function(record, operation) {
                    var attachmentsList = self.attachments;
                    this.deleteListAttachments(attachmentsList);
                    popupWindow(i18n.global.msg.save(), i18n.global.msg.errorConnection(), 'x-icon-error', 60000);
                    self.closeAwePanelWz();
                },

            });
        } else {
            var fields = form.getFields().items;
            var errors = [];
            var errorsText;
            var errorstpl = new Ext.XTemplate(i18n.awe.form.validationErrorMsg() + '<br>', '<tpl if="">',
                '<tpl for="."> &nbsp;{#}. {fieldLabel} : {error}<br></tpl>', '</tpl>'
            );

            fields.each(function(field) {
                errors = errors.concat(Ext.Array.map(field.getActiveErrors(), function(error) {
                    if (field.fieldLabel) {
                        return {
                            field: field,
                            error: error,
                            fieldLabel: field.fieldLabel
                        }
                    } else {
                        return {
                            field: field,
                            error: error,
                            fieldLabel: i18n.awe.form.zusammenMit()
                        }
                    }
                }));

            });

            errorsText = errorstpl.apply(errors);
            Ext.MessageBox.show({
                title: i18n.awe.form.validationErrorMsgTitle(),
                msg: errorsText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            this.getAweCreateDialogWz().setLoading(false);
            return false;
        }
    },
    resetForm: function() {
        var form = this.getAweCreatePanel().getForm();
        form.reset();
        this.getAweCreatePanel().aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');

        var kemsFields = Ext.ComponentQuery.query('[name=kemsList]');
        Ext.each(kemsFields, function(field) {
            field.setValue(null);
            field.setKemId(null);
        });
        // Remove read-only flag from QS-Verantwortlicher
        //form.findField('qsVerantwortlicherId').setReadOnly(false);

        //Clean the stores of the Projekt(MDS), Teilprojekt and Anlauf dropdowns
        form.findField('projektId').getStore().loadData([], false);
        form.findField('teilprojektId').getStore().loadData([], false);
        form.findField('stuecklisteId').getStore().loadData([], false);
        form.findField('qsVerantwortlicherId').getStore().loadData([], false);
        form.findField('qsVerantwortlicherId').setReadOnly(false);
    },
    resetWzForm: function() { //TODO check if used anywhere and remove
        //      if not important( new reset handled in ListController called on create new wizard)

    },

    searchPositionsLftJvKp: function(){
        var store = Ext.data.StoreManager.get('positionStore');

        store.getProxy().extraParams.searchSachnummer = form.findField('sachnummer').getValue();

        store.on('load', function(me, records, successful, eOpts) {
            //var positionsGrid = this.getAweDisplayPanel().down('#dispPositionsGrid');
            var positionsGrid = this.getAweCreateWizard().down('#positionsGridWz');
            if (positionsGrid) {
                positionsGrid.getView().focus();
                if (positionsGrid.getStore().count() > 0) {
                    positionsGrid.getSelectionModel().select(0);
                }
            }
        }, this);
        store.load();
    },

    searchPositions: function() {
        var store = Ext.data.StoreManager.get('PositionStore');

        /*
        var awePositionsSearchWindow = Ext.create('widget.awepositionssearchwindow');
        awePositionsSearchWindow.show();
        */

//        var aweCreateWizard = this.getAweCreateWizard();
//
//
//        var form = this.getAweCreatePanel().getForm();
        store.getProxy().extraParams.searchSachnummer = form.findField('searchSachnummer').getValue();
        store.getProxy().extraParams.searchBaureihe = form.findField('searchBaureihe').getValue();
        store.getProxy().extraParams.searchEmbodiment = form.findField('searchEmbodiment').getValue();
        store.getProxy().extraParams.searchModul = form.findField('searchModul').getValue()
        store.getProxy().extraParams.searchPositionFrom = form.findField('searchPositionFrom').getValue()
        store.getProxy().extraParams.searchPositionTo = form.findField('searchPositionTo').getValue();

        store.on('load', function(me, records, successful, eOpts) {
            //var positionsGrid = this.getAweDisplayPanel().down('#dispPositionsGrid');
            var positionsGrid = this.getAweCreateWizard().down('#positionsGridWz');
            if (positionsGrid) {
                positionsGrid.getView().focus();
                if (positionsGrid.getStore().count() > 0) {
                    positionsGrid.getSelectionModel().select(0);
                }
            }
            // hier codeaufruf einfügen wenn laden fertig
        }, this);
        store.load();
    },
    addPositions: function() {

        var selectedRecords = this.getAwePositionsSearchWindow().down('grid').getSelectionModel().getSelection();
        var positionsFormStore = this.getAweCreatePanel().down('#positionsGrid').getStore();

        Ext.each(selectedRecords, function(record) {
            if (positionsFormStore.indexOf(record) == -1) {
                positionsFormStore.add(record);
            }
        });
    },
    clearAllPositions: function() {
        var positionsFormStore = this.getAweCreatePanel().down('#positionsGrid').getStore();
        positionsFormStore.removeAll();
    },
    clearSelectedPositions: function() {
        var positionsGrid = this.getAweCreatePanel().down('#positionsGrid');
        var positionsFormStore = positionsGrid.getStore();
        var selectedPositions = positionsGrid.getSelectionModel().getSelection();
        positionsFormStore.remove(selectedPositions);
    },
    clearAllVerteilers: function() {
        var verteilersGrid = this.getAweCreatePanel().down('#verteilerGrid');
        verteilersGrid.getStore().removeAll();
    },
    removeSelectedVerteilers: function() {
        var verteilersGrid = this.getAweCreatePanel().down('#verteilerGrid');
        var verteilersFormStore = verteilersGrid.getStore();
        var selectedVerteilers = verteilersGrid.getSelectionModel().getSelection();
        verteilersFormStore.remove(selectedVerteilers);
    },
    clearAllGroupVerteilers: function() {
        var verteilersGruppenGrid = this.getAweCreatePanel().down('#verteilerGruppenGrid');
        verteilersGruppenGrid.getStore().removeAll();
    },
    removeSelectedGroupVerteilers: function() {
        var verteilerGroupGrid = this.getAweCreatePanel().down('#verteilerGruppenGrid');
        var verteilersGroupFormStore = verteilerGroupGrid.getStore();
        var selectedVerteilers = verteilerGroupGrid.getSelectionModel().getSelection();
        verteilersGroupFormStore.remove(selectedVerteilers);
    },
    closeAwePanel: function() {
        if (jspScope.requestAction() != null && jspScope.requestAction() === 'teileumfang' &&
            (!Ext.isArray(this.multipleAwes) || this.multipleAwes.length === 0)) {

            Ext.Msg.confirm(i18n.awe.grid.redirectTitle(), i18n.awe.grid.redirectMessage(), function(buttonId) {
                if (buttonId == 'yes') {
					top.DialogManager.registerDialogReloadFlag(self);
                }
				top.DialogManager.unregisterDialog(self);
            });

        }
        Ext.getStore('AweDataStore').reload();
        this.getAweCreateDialog().close();
    },

    closeAwePanelWz: function() {
        if (jspScope.requestAction() != null && jspScope.requestAction() === 'teileumfang') {

            if ((Ext.isArray(this.multipleAwes) && this.multipleAwes.length != 0) && isCanceledLoop) {
                this.closeDialog();
            } else if (!Ext.isArray(this.multipleAwes)) {
                this.closeDialog();
            }
        }


        var attachmentWindow = Ext.ComponentQuery.query('#uploadAttachmentWindow')[0];
        if (attachmentWindow) {
            var arrayAttachments = this.attachments;
            if (arrayAttachments.length > 0 && !(this.isSavedAweFlag)) {
                this.deleteListAttachments(arrayAttachments);
            }
            arrayAttachments.length = 0;
            attachmentWindow.destroy();
        }
        Ext.getStore('AweDataStore').reload(); // TODO: check if we can just don't reload the grid - because we haven't changed anything!

        // reset the calendar minDate, because while extending awe minDate is set, but it is not unset afterwards
        var aweStart = this.getAweCreateWizard().getForm().findField('aweStart');
        if (aweStart) {
            aweStart.setMinValue(null);
        }

        // reset global variables
        isAweInEditMode = false;
        isAweInExtendMode = false;
        aweEditObject = null;
        isRenewed = false;
        this.setIsRenewed(false);
        this.isSavedAweFlag = false;
        this.isAweInCopyMode = false;
        generalPageFirstTimeFlag = true;
        isAweSubmittedToPdrs = true;

        this.getAweCreateDialogWz().close();
    },
    // #1
    addSnr: function() {

        // check if the user tries to add a snr which is already assign/added!
        var form = this.getAweCreateWizard().getForm();
        var searchSachnummer = Ext.String.trim(form.findField('searchSachnummer').getValue()).toLowerCase();

        var snrStore = Ext.getStore('SachnummerStore');
        var rec = snrStore.findRecord('snr', searchSachnummer, 0, false, false, false);
        if (rec && rec.data.countPos!=0) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.grid.snrAlreadyIncluded(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }else if(rec && rec.data.countPos == 0){
        	snrStore.removeAt(snrStore.findRecord('snr', searchSachnummer, 0, false, false, false));
        }

        // don't show pos information for external users
        if (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') {
            this.getAweCreateDialogWz().setLoading(true);
            this.searchPositionsWz();
            return;
        }

        // for internal users - they see the positions grid
        this.addSnrFillPosition();

    },
    // #1
    addSnrFillPosition: function() {
        var aweCreateWizard = this.getAweCreateWizard();
        var positionsGridStore = aweCreateWizard.down('#positionsGridWz').getStore();
        var positionsCount = positionsGridStore.getCount();

        // If there are no positions selected, than we show error message (NO Supplier Message)
        if (positionsCount < 1 && (jspScope.isKP() === 'false' && jspScope.isJV() === 'false'  && jspScope.isSupplier() === 'false' )) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.grid.noPositionsSelected(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }else if (this.getWerkLoadingFlag() || this.getSnrLoadingFlag() || this.getErsAltteilLoadingFlag() || this.getTeilRelevantLoadingFlag()) { // check if fields are currently loading (synch with blur function of SNR/Werk/ersAltteil field)
            // The click is suspended for later execution .
            // Indicator for a callback function in snr and werk blur listener (onSnrBlur and onWerkBlur)

            var buttonAction = aweCreateWizard.down('#buttonAction');
            buttonAction.setValue(1);

            this.getAweCreateDialogWz().setLoading(true); //The loading will be ended in onSnrBlur or onWerkBlur
        } else {
            var form = aweCreateWizard.getForm();
            var snrStore = Ext.getStore('SachnummerStore');

            // get all top fields
            var snrField = form.findField("sachnummer");
            var zgsField = form.findField("zgs");
            var bzaTypField = form.findField("bzaTyp");
            var lieferantField = form.findField("lieferant");
            var ersAltteilField = form.findField("ersAltteil");
            var teilebenennungField = form.findField("teilBenennung");
            var werkField = form.findField("werkWerk");

            //Hidden fields
            var teilIdField = form.findField("teilId");
            var ersAltteilIdFld = form.findField("ersAltteilId");
            var zeichnungsDatumField = form.findField('zeichnungsDatum');
            var sieheZeichnungTeilField = form.findField('sieheZeichnungTeil');
            var sicherheitsRelevantField = form.findField('safetyRelevanceFlag');
            var zertifizierungsRelevantField = form.findField('certificationFlag');

            // Converting the values from String to Boolean
            var sicherheitsRelevantValue = convertStringToBoolean((sicherheitsRelevantField) ? sicherheitsRelevantField.getValue() : "");
            var zertifizierungsRelevantValue = convertStringToBoolean((zertifizierungsRelevantField) ? zertifizierungsRelevantField.getValue() : "");

            var actErrors = snrField.getActiveErrors().concat(ersAltteilField.getActiveErrors());
            if (werkField.isValid() && !Ext.isEmpty(snrField.getValue()) && actErrors.length === 0 && lieferantField.isValid()) {
                // create model for SNR
                var model = Ext.create('Awe.model.SNR', {
                    teilebenennung: teilebenennungField.getValue(),
                    zgs: zgsField.getValue(),
                    bzaTyp: bzaTypField.getValue(),
                    bzaTypValue: bzaTypField.getRawValue(),
                    snr: snrField.getValue(),
                    ersAltteilText: ersAltteilField.getValue(),
                    zeichnungsDatum: zeichnungsDatumField.getValue(),
                    sieheZeichnungTeil: sieheZeichnungTeilField.getValue(),
                    sicherheitsrelevant: sicherheitsRelevantValue,
                    zertifizierungsrelevant: zertifizierungsRelevantValue
                });

                // add related objects: werk, ersetztesAltteil, teil, lieferanten & positions
                model.setWerk(werkField.findRecordByValue(werkField.getValue()).data);

                if (!Ext.isEmpty(ersAltteilField.getValue().trim())) {
                    model.setErsetztesAltteil({
                        id: ersAltteilIdFld.getValue()
                    });
                }

                model.setErsetztesAltteil({
                    id: ersAltteilIdFld.getValue()
                });
                model.setTeil({
                    id: teilIdField.getValue()
                });

                var lieferantRecord = lieferantField.findRecordByValue(lieferantField.getValue());
                if (lieferantRecord) {
                    model.setLieferant(lieferantRecord.data);
                }

                for (var i = 0; i < positionsCount; i++) {
                    model.positions().add(positionsGridStore.getAt(i));
                }
                model.set('countPos', model.positions().getCount());

                snrStore.add(model);

                // as there is at least one item in snr grid make it read only
                werkField.setReadOnly(true);

                this.resetFieldsSnr();
                this.resetHiddenFieldsSnr();

                // enable next button
                if (snrStore.getCount() > 0) {
                    this.getNextButton().setDisabled(false);
                    this.getNextButton().focus();
                }
            } else if (Ext.isEmpty(snrField.getValue())) {
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.fieldsValidationErrorMsgMissingSnr(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    fn: function() {
                        Ext.defer(function() {
                            snrField.focus(true);
                            snrField.markInvalid(i18n.awe.form.fieldsValidationErrorMsgMissingSnr());
                        }, 50, this);
                    },
                    scope: this
                });
            } else {
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.fieldsValidationErrorMsg(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }

        if(jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true'){
            this.getAweCreateDialogWz().setLoading(false);
        }
    },
    saveSnr: function(self) {
        var aweCreateWizard = this.getAweCreateWizard();
        if (this.getAweCreateWizard().down('#positionsGridWz').getStore().getCount() == 0) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.grid.noPositionsSelected(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        // check if fields are currently loading (synch with blur function of SNR/Werk/ersAltteil field)
        if (this.getWerkLoadingFlag() || this.getSnrLoadingFlag() || this.getErsAltteilLoadingFlag() || this.getTeilRelevantLoadingFlag() ) {
            // The click is suspended for later execution .
            // Indicator for a callback function in snr and werk blur listener (onSnrBlur and onWerkBlur)
            var buttonAction = aweCreateWizard.down('#buttonAction');
            buttonAction.setValue(2);

            this.getAweCreateDialogWz().setLoading(true); //The loading will be ended in onSnrBlur or onWerkBlur
        } else {
            var form = aweCreateWizard.getForm();
            var snrsGrid = this.getAweCreateWizard().down('#snrsGrid');
            var positionsGridStore = this.getAweCreateWizard().down('#positionsGridWz').getStore();

            // get all top fields
            var snrField = form.findField("sachnummer");
            var zgsField = form.findField("zgs");
            var bzaTypField = form.findField("bzaTyp");
            var lieferantField = form.findField("lieferant");
            var ersAltteil = form.findField("ersAltteil");
            var teilebenennungField = form.findField("teilBenennung");
            var werkField = form.findField("werkWerk");

            // get hidden fields
            var teilIdField = form.findField("teilId");
            var oldSnrField = form.findField("snr");
            var ersAltteilIdFld = form.findField("ersAltteilId");
            var sicherheitsRelevantField = form.findField('safetyRelevanceFlag');
            var zertifizierungsRelevantField = form.findField('certificationFlag');

            // Converting the values from String to Boolean
            var sicherheitsRelevantValue = convertStringToBoolean((sicherheitsRelevantField) ? sicherheitsRelevantField.getValue() : "");
            var zertifizierungsRelevantValue = convertStringToBoolean((zertifizierungsRelevantField) ? zertifizierungsRelevantField.getValue() : "");

            var actErrors = snrField.getActiveErrors().concat(ersAltteil.getActiveErrors());
            if (werkField.isValid() && !Ext.isEmpty(snrField.getValue()) && actErrors.length === 0 && lieferantField.isValid()) {
                var selection = snrsGrid.getSelectionModel().getSelection();
                var recordToEdit = snrsGrid.getSelectionModel().getSelection()[0];

                recordToEdit.set('snr', snrField.getValue());
                recordToEdit.set('teilebenennung', teilebenennungField.getValue());
                recordToEdit.set('zgs', zgsField.getValue());
                recordToEdit.set('ersAltteilText', ersAltteil.getValue());
                recordToEdit.set('bzaTyp', bzaTypField.getValue());
                recordToEdit.set('bzaTypValue', bzaTypField.getRawValue());
                recordToEdit.set('sicherheitsrelevant', sicherheitsRelevantValue);
                recordToEdit.set('zertifizierungsrelevant', zertifizierungsRelevantValue);

                recordToEdit.setWerk(werkField.findRecordByValue(werkField.getValue()).data);
                if (!Ext.isEmpty(ersAltteil.getValue().trim())) {
                    recordToEdit.setErsetztesAltteil({
                        id: ersAltteilIdFld.getValue()
                    });
                } else {
                    recordToEdit.setErsetztesAltteil({
                        id: ""
                    });
                }
                recordToEdit.setTeil({
                    id: teilIdField.getValue()
                });

                var lieferantRecord = lieferantField.findRecordByValue(lieferantField.getValue());
                if (lieferantRecord) {
                    recordToEdit.setLieferant(lieferantRecord.data);
                }

                // refresh list of positions of the recordToEdit
                recordToEdit.positions().removeAll();
                for (var i = 0; i < positionsGridStore.getCount(); i++) {
                    recordToEdit.positions().add(positionsGridStore.getAt(i));
                }
                recordToEdit.set('countPos', recordToEdit.positions().getCount());

                //Trick for keeping the hihglithed row on the selection
                snrsGrid.getSelectionModel().deselect([recordToEdit]);
                snrsGrid.getSelectionModel().select([recordToEdit]);

                this.resetFieldsSnr();

                this.resetHiddenFieldsSnr();

                // as there is at least one item in snr grid make it read only
                werkField.setReadOnly(true);

                // enable next button and update control buttons (add/save, delete, edit/cancel)
                this.getNextButton().setDisabled(false);

                Ext.ComponentQuery.query('button[action = addSnr]')[0].show();
                Ext.ComponentQuery.query('button[action = cancelSnr]')[0].hide();
                Ext.ComponentQuery.query('button[action = editSnr]')[0].show();
                Ext.ComponentQuery.query('button[action = deleteSnr]')[0].setDisabled(false);
                self.hide();
            } else {
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.fieldsValidationErrorMsg(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    },
    deleteSnr: function() {
        var snrsGrid = this.getAweCreateWizard().down('#snrsGrid');
        if (snrsGrid.getSelectionModel().hasSelection()) {
            var werkField = this.getAweCreateWizard().getForm().findField("werkWerk");
            var snrStore = snrsGrid.getStore();
            var selectedSnr = snrsGrid.getSelectionModel().getSelection();
            snrStore.remove(selectedSnr);

            // if the last item from snr store was deleted enable werk to be selected
            if (snrStore.getCount() == 0) {
                werkField.setReadOnly(false);
                werkField.setRawValue('');

                var nextButton = this.getNextButton();
                if (nextButton) {
                    nextButton.setDisabled(true);
                }
            }
        } else if (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') {
          snrsGrid.getStore().removeAll();
          var werkField = this.getAweCreateWizard().getForm().findField("werkWerk");
          werkField.setReadOnly(false);
            werkField.setRawValue('');

            var nextButton = this.getNextButton();
            if (nextButton) {
                nextButton.setDisabled(true);
            }
        } else {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },
    editSnr: function(self) {
        var aweCreateWizard = this.getAweCreateWizard();
        // check if fields are currently loading (synch with blur function of SNR/Werk/ersAltteil field)
        if (this.getWerkLoadingFlag() || this.getSnrLoadingFlag() || this.getErsAltteilLoadingFlag() || this.getTeilRelevantLoadingFlag()) {
            // The click is suspended for later execution .
            // Indicator for a callback function in snr and werk blur listener (onSnrBlur and onWerkBlur)
            var buttonAction = aweCreateWizard.down('#buttonAction');
            buttonAction.setValue(3);

            this.getAweCreateDialogWz().setLoading(true); //The loading will be ended in onSnrBlur or onWerkBlur
        } else {
            var grid = this.getAweCreateWizard().down('#snrsGrid');
            if (!grid.getSelectionModel().hasSelection()) {
                if (grid.getStore().count() > 0) {
                    grid.getSelectionModel().select(0);
                }
            }
            if (grid.getSelectionModel().hasSelection()) {
                var form = this.getAweCreateWizard().getForm();
                var positionsGrid = this.getAweCreateWizard().down('#positionsGridWz');

                // get all top fields
                var snrField = form.findField("sachnummer");
                var searchSachnummerField = form.findField("searchSachnummer");
                var zgsField = form.findField("zgs");
                var bzaTypField = form.findField("bzaTyp");
                var lieferantField = form.findField("lieferant");
                var ersAltteil = form.findField("ersAltteil");
                var teilebenennungField = form.findField("teilBenennung");
                var werkField = form.findField("werkWerk");

                // get hidden fields
                var teilIdField = form.findField("teilId");
                var oldSnrField = form.findField("snr");
                var ersAltteilIdFld = form.findField("ersAltteilId");

                var model = grid.getSelectionModel().getSelection()[0];
                var data = model.data;

                // load position, lieferant & zgs stores
                if (positionsGrid && model.positions()) {
                    var recordsCount = model.positions().getCount();
                    var records = model.positions().getRange(0, recordsCount);
                    positionsGrid.getStore().loadRecords(records);

                    var aDomGridView = positionsGrid.getView().getEl().dom;
                    var aDomTr = aDomGridView.getElementsByTagName('tr');
                    for (var i = 0; i < aDomTr.length; i++) {
                        if (aDomTr[i].className.indexOf('x-grid-row') > -1) {
                            aDomTr[i].setAttribute('tabindex', "0");
                            aDomTr[i].setAttribute("onfocus","Ext.getDom('"+aDomGridView.id+"').style.border=\'1px dotted\';");
                            aDomTr[i].setAttribute("onblur","Ext.getDom('"+aDomGridView.id+"').style.border=\'none\';");
                            break;
                        }
                    }

                    positionsGrid.getView().focus();
                    if (positionsGrid.getStore().count() > 0) {
                        positionsGrid.getSelectionModel().select(0);
                    }
                }
                zgsField.bindStore(createZgsStore(data.teil.zgs));
                zgsField.setValue(data.zgs);
                this.loadLieferantStore(model.get('teil').id, form, true);

                snrField.setValue(Ext.String.trim(data.snr));
                searchSachnummerField.setValue(Ext.String.trim(data.snr));
                ersAltteil.setValue(data.ersAltteilText);
                teilebenennungField.setValue(data.teilebenennung);

                // set lieferant and bzaTyp as models
                if (data.lieferant && data.lieferant.lnId && data.lieferant.lnKname) {
                    var lieferantModel = Ext.create('Awe.model.Lieferant', {
                        lnId: data.lieferant.lnId,
                        lnKname: data.lieferant.lnKname
                    });
                    lieferantField.setValue(lieferantModel);
                }
                if (data.bzaTyp) {
                    var bzaTypModel = Ext.create('Awe.model.BzaTyp', {
                        name: data.bzaTyp,
                        value: bzaTypConverter(data.bzaTyp)
                    });
                    bzaTypField.setValue(bzaTypModel);
                }

                //Hidden field update
                teilIdField.setValue(data.teil.id);
                oldSnrField.setValue(data.snr);

                if (data.ersetztesAltteil && data.ersetztesAltteil.id) {
                    ersAltteilIdFld.setValue(data.ersetztesAltteil.id);
                }

                // if the last snr is being edited enable werk to be selected
                if (grid.getStore().getCount() === 1) {
                    werkField.setReadOnly(false);
                }

                // disable next button and update control buttons (add/save, delete, edit/cancel)
                this.getNextButton().setDisabled(true);

                Ext.ComponentQuery.query('button[action = cancelSnr]')[0].show();
                Ext.ComponentQuery.query('button[action = saveSnr]')[0].show();
                Ext.ComponentQuery.query('button[action = addSnr]')[0].hide();
                Ext.ComponentQuery.query('button[action = deleteSnr]')[0].setDisabled(true);
                self.hide();
            } else {
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.selectSingleWarning(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    },
    cancelSnr: function(self) {
        var aweCreateWizard = this.getAweCreateWizard();

        // check if fields are currently loading (synch with blur function of SNR/Werk/ersAltteil field)
        if (this.getWerkLoadingFlag() || this.getSnrLoadingFlag() || this.getErsAltteilLoadingFlag() || this.getTeilRelevantLoadingFlag()) {
            // The click is suspended for later execution.
            // Indicator for a callback function in snr and werk blur listener (onSnrBlur and onWerkBlur fn)
            var buttonAction = aweCreateWizard.down('#buttonAction');
            buttonAction.setValue(4);

            this.getAweCreateDialogWz().setLoading(true); //The loading will be ended in onSnrBlur or onWerkBlur
        } else {
            var form = this.getAweCreateWizard().getForm();
            var werkField = form.findField("werkWerk");

            this.resetFieldsSnr();

            this.resetHiddenFieldsSnr();

            werkField.setReadOnly(true); // always exist one record in snr grid so no need to reset Werk, only set readonly

            this.getNextButton().setDisabled(false);

            Ext.ComponentQuery.query('button[action = editSnr]')[0].show();
            Ext.ComponentQuery.query('button[action = saveSnr]')[0].hide();
            Ext.ComponentQuery.query('button[action = addSnr]')[0].show();
            Ext.ComponentQuery.query('button[action = deleteSnr]')[0].setDisabled(false);
            self.hide();
        }
    },
    isSelectionExecutable: function() {
        var isEditMode = Ext.ComponentQuery.query('button[action = editSnr]')[0].hidden;
        if (isEditMode) {
            return false;
        }
    },
    onWerkSelect: function(combo) {
        var form = this.getAweCreateWizard().getForm();
        this.searchBzaTyp(combo, form.findField('sachnummer'), form, true);
        //      this.setQSVerantwortlicher(combo, form.findField('sachnummer'), form);
    },
    onWerkBlur: function(combo) {
        if (combo.getValue() !== null) {
            this.onWerkSelect(combo);
            //          this.onDropdownSelect(combo);
        }
    },
    //Rerturn true if Awe.model.BzaTyp is loaded
    searchBzaTyp: function(werkField, sachnummerField, form, isFromWerk) {
        var werk = werkField.getValue();
        var sachnummer = sachnummerField.getValue();
        var bzaTyp = Ext.ModelManager.getModel('Awe.model.BzaTyp');


        if (!Ext.isEmpty(werk) && !Ext.isEmpty(sachnummer)) {
            //In order to wait for all fields to be populated before save or add
            if (isFromWerk) {
                this.setWerkLoadingFlag(true);
            }

            bzaTyp.load(1, {
                scope: this,
                params: {
                    werk: werk,
                    teil: sachnummer
                },
                success: function(record, operation) {
                    form.findField('bzaTyp').setValue(record);
                },
                callback: function() {
                    if (isFromWerk) {
                        this.setWerkLoadingFlag(false);
                    } else {
                        this.setSnrLoadingFlag(false);
                    }
                    //Remove loading flag
                    if (!this.getWerkLoadingFlag() && !this.getSnrLoadingFlag() && !this.getTeilRelevantLoadingFlag()) {
                        this.getAweCreateDialogWz().setLoading(false);
                        // execute any snr grid button click that came before or while loading
                        this.executeSuspendedAction();
                    }
                }
            });
            return true;
        } else {
            return false;
        }
    },
    setQSVerantwortlicher: function(werkField, TeilField, form) {
        var snrId = TeilField.getValue();
        var werk = werkField.getValue();
        var qsVerantwortlicherField = form.findField("qsVerantwortlicherId");
        var kemVerantwortlicherField = form.findField("kemVerantwortlicherId");
        var erstellerField = form.findField("erstellerId");
        var windowPersonField = form.findField("windowPersonId");
        var windowPerson = form.findField("werkWerk").valueModels[0].get('windowPerson');

        if (!Ext.isEmpty(snrId) && !Ext.isEmpty(werk)) {

            qsVerantwortlicherField.setLoading(true);
            kemVerantwortlicherField.setLoading(true);
            erstellerField.setLoading(true);
            windowPersonField.setLoading(true);

            // Populate Q-Planner
            Ext.Ajax.request({
                scope: this,
                url: 'awe.responsible.action',
                method: 'POST',
                timeout: 60000,
                params: {
                    snrId: snrId,
                    werk: werk,
                    isWindowPerson: windowPerson,
                    erstellerPjbId: erstellerField.getValue()
                },
                callback: function(options, success, response) {

                    if (MDS.Utils.Response.isSuccessful(response) && qsVerantwortlicherField && kemVerantwortlicherField && erstellerField && windowPersonField) {

                        var jsonData = Ext.decode(response.responseText);
                        if (jsonData.data && jsonData.data[0] && jsonData.data[0].length > 0) {

                            var data = jsonData.data[0];
                            var qualityResponsible = data.qsVerantwortlicher;
                            var kemResponsible = data.kemVerantwortlicher;
                            var ersteller = data.ersteller;
                            var windowPerson = data.windowPerson;

                            var qsStore = qsVerantwortlicherField.getStore();
                            var kemStore = kemVerantwortlicherField.getStore();
                            var erstellerStore = erstellerField.getStore();
                            var windowPersonStore = windowPersonField.getStore();

                            if (qualityResponsible !== null && qualityResponsible !== undefined) {
                                qsStore.removeAll();
                                qsStore.add(qualityResponsible);
                                qsVerantwortlicherField.setValue(qsStore.getAt(0));
                                qsVerantwortlicherField.setReadOnly(true);
                            } else {
                                qsVerantwortlicherField.setValue("");
                                qsVerantwortlicherField.setReadOnly(false);
                            }

                            if (kemResponsible !== null && kemResponsible !== undefined) {
                                kemStore.removeAll();
                                kemStore.add(qualityResponsible);
                                kemVerantwortlicherField.setValue(kemStore.getAt(0));
                                kemVerantwortlicherField.setReadOnly(true);
                            } else {
                                kemVerantwortlicherField.setValue("");
                                kemVerantwortlicherField.setReadOnly(false);
                            }

                            if (ersteller !== null && ersteller !== undefined) {
                                erstellerStore.removeAll();
                                erstellerStore.add(ersteller);
                                //erstellerField.isSelected = true;
                                erstellerField.setValue(erstellerStore.getAt(0));
                                erstellerField.setReadOnly(true);
                            } else {
                                erstellerField.setValue("");
                                erstellerField.setReadOnly(false);
                            }

                            if (windowPerson !== null && windowPerson !== undefined) {
                                windowPersonStore.removeAll();
                                windowPersonStore.add(windowPerson);
                                //erstellerField.isSelected = true;
                                windowPersonField.setValue(windowPerson.getAt(0));
                                windowPersonField.setReadOnly(true);
                            } else {
                                windowPersonField.setValue("");
                                windowPersonField.setReadOnly(false);
                            }
                        }

                    }
                    qsVerantwortlicherField.setLoading(false);
                    kemVerantwortlicherField.setLoading(false);
                    erstellerField.setLoading(false);
                    windowPersonField.setLoading(false);
                }
            });
        } else {
            qsVerantwortlicherField.setValue("");
            qsVerantwortlicherField.setReadOnly(false);
            erstellerField.setReadOnly(false);
            windowPersonField.setReadOnly(false);
        }
    },
    setAweResponsiblesWz: function() {
        var form = this.getAweCreateWizard().getForm();
        var snrId = Ext.getStore('SachnummerStore').getAt(0).get('snr');
        var werk = form.findField("werkWerk").getValue();
        var windowPerson = form.findField("werkWerk").valueModels[0].get('windowPerson');
        var qsVerantwortlicherField = form.findField("qsVerantwortlicherId");
        var kemVerantwortlicherField = form.findField("kemVerantwortlicherId");
        var erstellerField = form.findField("erstellerId");
        var windowPersonField = form.findField("windowPersonId");

//        if (Ext.isArray(this.multipleAwes) && this.multipleAwes.length > 0) {
//        	if (!Ext.isEmpty(erstellerField.getValue()) || !Ext.isEmpty(kemVerantwortlicherField.getValue()) || !Ext.isEmpty(qsVerantwortlicherField.getValue()) || !Ext.isEmpty(windowPersonField.getValue())) {
//        		return;
//        	}
//        }

        if (!Ext.isEmpty(snrId) && !Ext.isEmpty(werk)) {

            if (jspScope.selectedTeils() == "" || jspScope.selectedTeils() == undefined || jspScope.selectedTeils() == null || (Ext.isArray(this.multipleAwes) && this.multipleAwes.length > 0)) {
                qsVerantwortlicherField.setLoading(true);
                kemVerantwortlicherField.setLoading(true);
                erstellerField.setLoading(true);
                windowPersonField.setLoading(true);
            }

            // Populate Q-Planner
            Ext.Ajax.request({
                scope: this,
                url: 'awe.responsible.action',
                method: 'POST',
                timeout: 60000,
                params: {
                    snrId: snrId,
                    werk: werk,
                    isWindowPerson: windowPerson,
                    erstellerPjbId: erstellerField.getValue()
                },
                callback: function(options, success, response) {

                    try {
                        if (MDS.Utils.Response.isSuccessful(response) && qsVerantwortlicherField && kemVerantwortlicherField && erstellerField && windowPersonField) {

                            var jsonData = Ext.decode(response.responseText);
                            if (jsonData && jsonData.data && jsonData.data.length > 0) {

                                var data = jsonData.data[0];
                                var qualityResponsible = data.qsVerantwortlicher;
                                var kemResponsible = data.kemVerantwortlicher;
                                var ersteller = data.ersteller;
                                var windowPerson = data.windowPerson;

                                var qsStore = qsVerantwortlicherField.getStore();
                                var kemStore = kemVerantwortlicherField.getStore();
                                var erstellerStore = erstellerField.getStore();
                                var windowPersonStore = windowPersonField.getStore();

                                if (qualityResponsible !== null && qualityResponsible !== undefined) {
                                    qsStore.removeAll();
                                    qsStore.add(qualityResponsible);
                                    qsVerantwortlicherField.isSelected = true;
                                    qsVerantwortlicherField.setValue(qsStore.getAt(0));
                                } else {
                                    qsVerantwortlicherField.setValue("");
                                }

                                if (kemResponsible !== null && kemResponsible !== undefined) {
                                    kemStore.removeAll();
                                    kemStore.add(kemResponsible);
                                    kemVerantwortlicherField.isSelected = true;
                                    kemVerantwortlicherField.setValue(kemStore.getAt(0));
                                } else {
                                    kemVerantwortlicherField.setValue("");
                                }

                                if (ersteller !== null && ersteller !== undefined) {
                                    erstellerStore.removeAll();
                                    erstellerStore.add(ersteller);
                                    erstellerField.isSelected = true;
                                    erstellerField.setValue(erstellerStore.getAt(0));
                                } else {
                                    erstellerField.setValue("");
                                }

                                if (windowPerson !== null && windowPerson !== undefined) {
                                    windowPersonStore.removeAll();
                                    windowPersonStore.add(windowPerson);
                                    windowPersonField.isSelected = true;
                                    windowPersonField.setValue(windowPersonStore.getAt(0));
                                } else {
                                    windowPersonField.setValue("");
                                }
                            } else {
                                qsVerantwortlicherField.setValue("");
                                kemVerantwortlicherField.setValue("");
                                erstellerField.setValue("");
                                windowPersonField.setValue("");
                            }

                        }
                    } catch (e) {
                        Ext.MessageBox.show({
                            title: i18n.awe.message.errorTitle(),
                            msg: i18n.awe.form.errors.responsiblesLoading(),
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }

                    if (jspScope.selectedTeils() == "" || jspScope.selectedTeils() == undefined || jspScope.selectedTeils() == null || (Ext.isArray(this.multipleAwes) && this.multipleAwes.length > 0)) {
                        qsVerantwortlicherField.setLoading(false);
                        kemVerantwortlicherField.setLoading(false);
                        erstellerField.setLoading(false);
                        windowPersonField.setLoading(false);
                    } else {
                        this.getAweCreateDialogWz().setLoading(false);
                    }

                  }
            });
        }
    },

    onInvalidAweValidityChange: function(field, isValid, options) {
        // We get the current wizzard page
        var currentPage = null;
        if (this.getAweCreateWizard() && this.getAweCreateWizard().layout && this.getAweCreateWizard().layout.activeItem) {
            currentPage = this.getAweCreateWizard().layout.activeItem;
            var currentItemXtype = (currentPage) ? currentPage.getXType() : '';

            this.validateSaveBtn(currentItemXtype, '', false);
        }
    },

    onSnrBlur: function(field, event, options) {
        var value = field.getValue();
        var form = field.findParentByType('form').getForm();
        var oldTeilSnr = form.findField('snr').getValue();
        var oldTeilId = form.findField('teilId').getValue();
        var aweTeilObject = this.getAweCreateWizard().aweTeilObject;
        if (value.length > 0) {
            //if (Ext.String.trim(value) != Ext.String.trim(oldTeilSnr)) {
                //In order to wait for all fields to be populated before button is clicked
                this.setSnrLoadingFlag(true);

                aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');
                this.getAweCreateDialogWz().setLoading(true);
                aweTeilObject.load(value, {
                    scope: this,
                    failure: function(record, operation) {
                      this.getAweCreateDialogWz().setLoading(false);
                        field.markInvalid(i18n.awe.form.snrNotFound());
                        field.setActiveError(i18n.awe.form.snrNotFound());
                        this.clearFieldsOnTeilChange(field);

                        //After all fields are populated set loading flag needed for the grid buttons
                        this.setSnrLoadingFlag(false);

                        //Check if werk blur event is has called loading fns
                        if (!this.getWerkLoadingFlag()) {
                            this.getAweCreateDialogWz().setLoading(false);

                            this.executeSuspendedAction();
                        }
                    },
                    success: function(record, operation) {
                      this.getAweCreateDialogWz().setLoading(false);
                        var isBzaTypModelLoaded = this.onAweTeilObjectSuccess(record, field, form, oldTeilId, aweTeilObject); //TODO: no teilprojects

                        //Checks if searchBzaTyp() was called and if not, call the load ending methods.
                        //If yes the load ending methods will be called there
                        if (!isBzaTypModelLoaded) {
                            //After all fields are populated set loading flag needed for the grid buttons
                            this.setSnrLoadingFlag(false);

                            //Check if werk blur event is has called loading fns
                            if (!this.getWerkLoadingFlag()) {
                                this.getAweCreateDialogWz().setLoading(false);

                                this.executeSuspendedAction();
                            }
                        }

                        this.getAweCreateWizard().down('#searchSachnummer').setValue(field.getValue());
                        this.getAweCreateWizard().down('#searchPositionsBtn').focus();
                    },
                    callback: function(record, operation) {
                        //test if it can be deleted
                    }
                });
            //}

        } else {
            this.clearFieldsOnTeilChange(field);
        }
    },
    onErsAltteilBlur: function(field, event, options) {
        var value = field.getValue();
        var form = field.findParentByType('form').getForm();
        var oldErsAltteilShow = form.findField('ersAltteilShow').getValue();
        var oldErsAltteilId = form.findField('ersAltteilId').getValue();

        if (value.length > 0 && (Ext.String.trim(value) != Ext.String.trim(oldErsAltteilShow))) {
            // In order to wait for field to be populated before button from grid is clicked
            this.setErsAltteilLoadingFlag(true);

            aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');
            aweTeilObject.load(value, {
                scope: this,
                success: function(record, operation) {
                    field.setValue(Ext.String.trim(record.get('snrShow')));
                    form.findField('ersAltteilShow').setValue(Ext.String.trim(record.get('snrShow')));
                    form.findField('ersAltteilId').setValue(record.get('id'));

                    // After the field is populated unset loading flag needed for the grid buttons
                    this.setErsAltteilLoadingFlag(false);
                },
                failure: function(record, operation) {
                    field.markInvalid(i18n.awe.form.ersAltteilNotFound());
                    field.setActiveError(i18n.awe.form.ersAltteilNotFound());

                    // After the field is populated unset loading flag needed for the grid buttons
                    this.setErsAltteilLoadingFlag(false);
                },
                callback: function(record, operation) {
                    this.getAweCreateDialogWz().setLoading(false);
                    this.executeSuspendedAction();
                }
            });
        }
    },
    onAweTeilObjectSuccess: function(record, field, form, oldTeilId, aweTeilObject) {
        // If only case sensitive difference case set the field to origin value
        form.findField('sachnummer').setValue(Ext.String.trim(record.get('snrShow')));

        // Populate readonly fields based on the loaded teil if it is not different the the privious value
        if (record.get('id') != oldTeilId) {
            // Always show the snrShow in the sachnummer field
            this.setSnrDependantValues(form, record);
            this.loadLieferantStore(record.get('id'), form);
            this.getAweCreateWizard().aweTeilObject = record;

            // Load new bzaTyp
            // this.searchZeichnung(record, form.findField('zgs'), form);
            // this.setQSVerantwortlicher(form.findField('werkWerk'), field, form); /*TODO: edit in the task for setting qs */
            Ext.getCmp('positionsGrid').getStore().removeAll(); //TODO: is this now relevant?

            return this.searchBzaTyp(form.findField('werkWerk'), field, form);
        } else {
            return false;
        }
    },
    setSnrDependantValues: function(form, record) {

        form.findField('zgs').bindStore(createZgsStore(record.get('zgs')));
        form.findField('zgs').setValue(record.get('zgs'));
        form.findField('teilBenennung').setValue(record.get('teilBez'));
        //form.findField('betroffenerUmfang').setValue(record.get('teilBez'));
        form.findField('teilId').setValue(record.get('id'));
        form.findField('snr').setValue(Ext.String.trim(record.get('snrShow')));
        form.findField('zeichnungsDatum').setValue(record.get('zeichnungsDatum'));
        form.findField('sieheZeichnungTeil').setValue(record.get('sieheZeichnungId'));

        this.setTeilRelevantValues(form);

//
//        // check if the user tries to add a snr which is already assign/added!
//        var form = this.getAweCreateWizard().getForm();
//        var searchSachnummer = Ext.String.trim(form.findField('searchSachnummer').getValue()).toLowerCase();
//
//        var snrStore = Ext.getStore('SachnummerStore');
//        var rec = snrStore.findRecord('snr', searchSachnummer, 0, false, false, false);
//        if (rec && rec.data.countPos!=0) {
//            Ext.MessageBox.alert({
//                title: i18n.awe.message.errorTitle(),
//                msg: i18n.awe.form.grid.snrAlreadyIncluded(),
//                buttons: Ext.MessageBox.OK,
//                icon: Ext.MessageBox.ERROR
//            });
//            return false;
//        }else if(rec && rec.data.countPos == 0){
//        	snrStore.removeAt(snrStore.findRecord('snr', searchSachnummer, 0, false, false, false));
//        	//snrStore.removeAll();
//        }
//
//        // don't show pos information for external users
//        if (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') {
//            this.getAweCreateDialogWz().setLoading(true);
//            this.searchPositionsWz();
//            return;
//        }
//
//        // for internal users - they see the positions grid
//        this.addSnrFillPosition();
    },
    setTeilRelevantValues: function(form) {
        if (form) {

            var teilId = (form.findField('teilId')) ? form.findField('teilId').getValue() : '';

            var controller = this;
            this.setTeilRelevantLoadingFlag(true);

            Ext.Ajax.request({
                type: 'ajax',
                url: 'awe.partfields.action',
                params: {
                    teilId: teilId
                },
                success: function(response) {
                    if (response && response.responseText && response.responseText.length > 0) {

                        var resp = Ext.JSON.decode(response.responseText);
                        controller.setTeilRelevantLoadingFlag(false);
                        /*
                         * As the named query always returns 1 row with two columns we need to be sure that this is everything we need.
                         */
                        if (resp && resp.data && resp.data.length == TEIL_RELATED_FIELDS_COUNT) {

                            var data = resp.data;

                            // Setting the values
                            form.findField('certificationFlag').setValue(data[0]);
                            form.findField('safetyRelevanceFlag').setValue(data[1]);
                        }
                    }
                }
            });
        }
    },
    clearProjectRelatedFields: function(form, teilprojektStore, stuecklisteStore) {
        form.findField('projektId').clearValue();
        form.findField('teilprojektId').clearValue();
        form.findField('stuecklisteId').clearValue();

        teilprojektStore.removeAll();
        stuecklisteStore.removeAll();
    },
    processTeilProjekt: function(teilId, form, teilprojektStore, stuecklisteStore, selectedProject,
        selectedTeilProjekt, selectedStueckliste) {
        //Load the store and if there was a previos selection set it anew. Then go on with the anlauf field
        form.findField('teilprojektId').setLoading(true);
        teilprojektStore.load({
            scope: this,
            params: {
                teil: teilId, //before record.get('id'),
                apjId: selectedProject
            },
            callback: function(records, operation, success) {
                form.findField('teilprojektId').setLoading(false);
                if (selectedTeilProjekt != null && teilprojektStore.find('pdsId', selectedTeilProjekt) >= 0) {
                    //Check if the selected teilproject is in the new teilproject store for this teil and project combination

                    form.findField('teilprojektId').setValue(selectedTeilProjekt);
                    this.processAnlauf(teilId, form, stuecklisteStore, selectedProject,
                        selectedTeilProjekt, selectedStueckliste);
                }
            }
        });
    },
    processAnlauf: function(teilId, form, stuecklisteStore, selectedProject,
        selectedTeilProjekt, selectedStueckliste) {
        //Reload the stueckliste store if the old selected teilproject is in the new teilproject store and if we have old selection for stueckliste

        form.findField('stuecklisteId').setLoading(true);
        stuecklisteStore.load({
            params: {
                teil: teilId, //before record.get('id'),
                apjId: selectedProject,
                tpjId: selectedTeilProjekt
            },
            callback: function(records, operation, success) {

                form.findField('stuecklisteId').setLoading(false);
                //Check if the selected stueckliste is in the new stueckliste store for this teil, project and teilproject combination
                if (selectedStueckliste != null && stuecklisteStore.find('pdsId', selectedStueckliste) >= 0) {
                    form.findField('stuecklisteId').setValue(selectedStueckliste);
                }
            }
        });


    },
    loadLieferantStore: function(part, form, loadingMask) {
        if (part) {
            var lieferantStore = Ext.getStore('LieferantStore');
            var lieferantField = form.findField('lieferant');
            var elementToMask;

            if (loadingMask) {
                elementToMask = this.getAweCreateWizard().down('awesnrfset');
            } else {
                elementToMask = lieferantField;
            }
            elementToMask.setLoading(true);

            lieferantStore.load({
                scope: this,
                params: {
                    id: part
                },
                callback: function(records, operation, success) {
                    elementToMask.setLoading(false);
                    if (success && records.length > 0) {
                        lieferantField.setValue(records[0]);
                    }
                }
            });
        }
    },
    loadDialogProjektStore: function() {
        if (Ext.getStore('DialogProjektStore')) {
            Ext.getStore('DialogProjektStore').load({});
        }
    },

    clearFieldsOnTeilChange: function(field) {
        //Clear readonly fields based on the loaded teil
        var form = field.findParentByType('form').getForm();
        form.findField('teilId').setValue("");
        form.findField('zgs').setValue("");
        form.findField('teilBenennung').setValue("");
        //form.findField('betroffenerUmfang').setValue("");
        form.findField('zeichnungsDatum').setValue("");
        form.findField('sieheZeichnungTeil').setValue("");

        //Clear stores
        Ext.getStore('ProjektStore').removeAll();
        Ext.getStore('TeilprojektStore').removeAll();
        Ext.getStore('StuecklisteStore').removeAll();
        Ext.getCmp('positionsGrid').getStore().removeAll();
        form.findField('zgs').getStore().removeAll();
    },
    onZgsSelect: function(combo, records, item, index, e) {
        var form = this.getAweCreateWizard().getForm();
        //      this.searchZeichnung(this.getAweCreateWizard().aweTeilObject, combo, form);
    },
    onDauerSpin: function(spinner, direction) {
        if (!Ext.isEmpty(spinner.getValue()) && spinner.getValue() != parseInt(spinner.getValue())) {
            if (direction == 'up') {
                var nextValue = parseInt(spinner.getValue()) + 1;
                spinner.step = nextValue - spinner.getValue();
            } else if (direction == 'down') {
                var step = spinner.getValue() - parseInt(spinner.getValue());
                spinner.step = step;
            }
        } else {
            spinner.step = 1;
        }
    },
    onLnBeforeshow: function(picker) {
        picker.minwidth = picker.up('combobox').getSize().width;
    },
    onLnSelect: function(combo, records, options) {
        var lnId = "";
        var lnKname = "";
        if (records.length > 0) {
            lnId = records[0].data.lnId;
            lnKname = records[0].data.lnKname;
        }

        var rawValue = Ext.util.Format.trim(lnId) + ' - ' + Ext.util.Format.trim(lnKname);

        combo.setRawValue(rawValue);

        if (combo.getValue().length > 0) {
            new Ext.ToolTip({
                target: combo.getEl(),
                html: rawValue,
                componentLayout: 'auto'
            });
        }
    },
    loadProjectStore: function() {
        var form = this.getAweCreateWizard().getForm();

        // teilId of the first snr is used to load projectStore
        var teilId = Ext.getStore('SachnummerStore').getAt(0).get('teil').id;

        //Load the project stores
        var projektStore = Ext.getStore('ProjektStore');
        var teilprojektStore = Ext.getStore('TeilprojektStore');
        var stuecklisteStore = Ext.getStore('StuecklisteStore');
        var selectedProject = form.findField('projektId').getValue();
        var selectedTeilProjekt = form.findField('teilprojektId').getValue();
        var selectedStueckliste = form.findField('stuecklisteId').getValue();

        //Load the project store for the new teil
        form.findField('projektId').setLoading(true);
        projektStore.load({
            scope: this,
            params: {
                teil: teilId
            },
            callback: function(records, operation, success) {
                this.clearProjectRelatedFields(form, teilprojektStore, stuecklisteStore);

                //Check if the selected project is in the new project store for this teil
                if (selectedProject != null && projektStore.find('pdsId', selectedProject) >= 0) {
                    form.findField('projektId').setValue(selectedProject);
                    this.processTeilProjekt(teilId, form, teilprojektStore, stuecklisteStore, selectedProject,
                        selectedTeilProjekt, selectedStueckliste);
                }
                form.findField('projektId').setLoading(false);
            }
        });
    },
    controlPartCount: function() {
        var form = this.getAweCreateWizard().getForm();
        var partCountField = form.findField('stueckzahlbegrenzung');
        var windowPersonCombo = form.findField('windowPersonId');
        var werk = form.findField("werkWerk").getValue();
        var windowPerson = form.findField("werkWerk").valueModels[0].get('windowPerson');

        windowPersonCombo.getStore().getProxy().extraParams.werk = werk;
        windowPersonCombo.getStore().getProxy().extraParams.isWindowPerson = windowPerson;

        if (Ext.getStore('SachnummerStore').getCount() > 1) {
            partCountField.setDisabled(true);
            // reset to null in case any number has been entered into that field
            partCountField.setValue();
        } else {
            partCountField.setDisabled(false);
        }
    },
    onPageLeave: function(currentItem, nextItem, forward) {
        // Extending the timeout on click of the next or previous button.
       jQuery.ajax({
           url: 'ajax.getSessionTimeOut.action',
           type: "GET",
           contentType: "application/json; charset=utf-8",
           cache: false,
           async: true,
           success: function(data) {
             calculateTimeout(data);
           },
           error: function(error) {
               console.log(error);
           }
       });

       var aweWizzard = this.getAweCreateWizard();

        if (forward) {
            if (currentItem.getXType() == 'awesnrfset') {
              aweWizzard.down('#snrsGrid').getStore().data.each(function(item, index, totalItems ) {
                  if (item.data.countPos < 1) {
                    Ext.MessageBox.alert({
                            title: i18n.awe.message.errorTitle(),
                            msg: i18n.awe.message.sachnummerOhnePositionenError(),
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                    });
                      this.getNextButton().setDisabled(true);
                      return false;
                  }
                });
                this.controlPartCount();
            } else if (!this.validatePage(currentItem)) {
              this.getNextButton().setDisabled(true);
              return false;
            } else if (currentItem.getXType() === 'awegeneralfset') {


              var erstellerIDx = this.getAweCreateWizard().down('#erstellerId').getValue();
              var windowPersonIdx  = this.getAweCreateWizard().down('#windowPersonId').getValue();
              var currentUserIdx = jspScope.currentUserId();
              // alert("ERSTELLER: " + erstellerIDx);
              // alert("windowPersonId: " + windowPersonIdx);


              var popupSeq = true;
              // show warning if the creator is not equal to the current user!
              // important: currentUserId is of type String and the userId in the model is of type number - so explicitly don't use !== operator here!
              if ((currentUserIdx != windowPersonIdx) && (currentUserIdx != erstellerIDx) && !aweWizzard.ignoreDifferentCreator) {
                popupSeq = false;
                Ext.MessageBox.alert({
                        title: i18n.awe.message.warningTitle(),
                        msg: i18n.awe.message.differentCreator(),
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.WARNING,
                        fn: function(btn, text) {
                            if (btn === 'yes' || btn === 'ja') {
                              aweWizzard.ignoreDifferentCreator = true;
                              popupSeq = true;
                              aweWizzard.moveNext();
                              aweWizzard.ignoreDifferentCreator = false
                              return true;
                            } else {
                              aweWizzard.ignoreDifferentCreator = false;
                              this.getNextButton().setDisabled(false);
                              return false;
                            }
                        },
                        scope: this
                    });
              }

                // check for longrunner - use only last snr added

              if (!aweWizzard.longrunnerPassed && popupSeq) {

                  var snrs = this.getStoreData(Ext.getCmp('snrsGrid').getStore());
                  var snr1 = snrs.last().teil.id;

                  var snr = [];
                  snrs.each(function(record) {
                    snr.push(record.teil.id);
                  });

                  var teile = snr.toString();

                  var form = this.getAweCreateWizard().getForm();
                  var aweStart = form.findField('aweStart').rawValue;
                  var aweEnde =  form.findField('aweEnde').rawValue;

                  var paramsObject = { snrs: teile,
                             aweStart: aweStart,
                             aweEnde: aweEnde
                            };
                  Ext.Ajax.request({
                      scope: this,
                      url: 'awe.longrunner.check.action',
                      method: 'POST',
                      params: paramsObject,
                      success: function(response, action) {

                          if (MDS.Utils.Response.isSuccessful(response)) {

                           var awes  = Ext.decode(response.responseText).data;
                             if(awes && awes.length > 0 ) {
//	    	                         aweWizzard.notificationE1 = true;
                               var tpl = new Ext.XTemplate(
                                   i18n.awe.message.longrunner() + '<br><br>' +
                                       '<div class="x-combo-list-item" style="display: table">' +
                                         '<div style="display: table-header-group">' +
                                           '<div style="display: table-cell; width: 120px;"><b>' + i18n.awe.grid.aweId() + '</b></div>' +
                                           '<div style="display: table-cell; width: 120px;"><b>' + i18n.awe.grid.antragsstatus() + '</b></div>' +
                                           '<div style="display: table-cell; width: 120px;""><b>' + i18n.awe.form.plannedStart() + '</b></div>' +
                                           '<div style="display: table-cell"><b>' + i18n.awe.form.plannedEnd() + '</b></div>' +
                                         '</div>' +
                                       '<tpl for=".">' +
                                           '<div style="display: table-row">' +
                                               '<div style="display: table-cell; width: 120px;">{aweId}</div>' +
                                               '<div style="display: table-cell; width: 120px;">{antragstatus}</div>' +
                                               '<div style="display: table-cell; width: 120px;"">{aweStart}</div>' +
                                               '<div style="display: table-cell">{aweEnde}</div>' +
                                           '</div>' +
                                       '</tpl>' +
                                       '</div>' + '<br>' +
                                       i18n.awe.grid.langlaefer()  + '<br>'

                                 );

                               var text = tpl.apply(awes);

                               Ext.MessageBox.alert({
                                   title: i18n.awe.message.infoTitle(),
                                   msg: text,
                                   // buttons: Ext.MessageBox.OK,
                                   buttons: Ext.MessageBox.YESNO,
                                   icon: Ext.MessageBox.INFO,
                                   fn: function(btn, text) {
                                       if (btn === 'yes' || btn === 'ja') {
                                        aweWizzard.longrunnerPassed = true;
                                        aweWizzard.ignoreDifferentCreator = true;
                                         aweWizzard.moveNext();
                                         aweWizzard.longrunnerPassed = false;
                                         aweWizzard.ignoreDifferentCreator = false;
                                         return true;
                                       } else {
                                         return false;
                                       }
                                   }
                               });
                            } else {
                                aweWizzard.longrunnerPassed = true
                                aweWizzard.ignoreDifferentCreator = true;
//	    	                        aweWizzard.notificationE1 = false;
                            }
                          }
                      },
                      failure: function(record, operation) {
                        popupWindow(i18n.global.msg.save(), i18n.global.msg.errorConnection(), 'x-icon-error', 60000);
                      }
                  });
              }

              this.getNextButton().setDisabled(false);
            //	alert("RETURNING:" + (jspScope.currentUserId() == this.getAweCreateWizard().down('#erstellerId').getValue() || aweWizzard.ignoreDifferentCreator) && aweWizzard.longrunnerPassed);
              return (jspScope.currentUserId() == this.getAweCreateWizard().down('#erstellerId').getValue() || aweWizzard.ignoreDifferentCreator) && aweWizzard.longrunnerPassed;

            } else if (currentItem.getXType() === 'awemdsfset') {

                var attachmentCount = Ext.getStore('AttachmentStore').getCount();
                if (attachmentCount < 1) {
                    if (this.getAweCreateWizard().down('#deviationSheet').getValue()) {
                        Ext.MessageBox.alert({
                            title: i18n.awe.message.errorTitle(),
                            msg: i18n.awe.message.missingDeviationSheet(),
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            fn: function(btn, text) {
                                aweWizzard.ignoreEmptyAttachment = false;
                                //this.getNextButton().setDisabled(true);
                                return false;
                            },
                            scope: this
                        });
                    } else if (!aweWizzard.ignoreEmptyAttachment) {
                        // BUG-1013
                        Ext.MessageBox.alert({
                            title: i18n.awe.message.warningTitle(),
                            msg: i18n.awe.message.missingAttachment(),
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.WARNING,
                            fn: function(btn, text) {
                                if (btn === 'yes' || btn === 'ja') {
                                  aweWizzard.ignoreEmptyAttachment = true;
                                  aweWizzard.moveNext();
                                  aweWizzard.ignoreEmptyAttachment = true;
                                  return true;
                                } else {
                                  aweWizzard.ignoreEmptyAttachment = false;
                                  this.getNextButton().setDisabled(false);
                                  return false;
                                }
                            },
                            scope: this
                        });
                  }
                }

              this.getNextButton().setDisabled(false);
              return attachmentCount > 0 || aweWizzard.ignoreEmptyAttachment;
            }
        } else {
          this.getAweCreateWizard().ignoreEmptyAttachment = false;
            if (this.getSaveAweButton().isDisabled() && nextItem.getXType() != 'awesnrfset') { // Check if we do not reset the wizard
                this.getBackButton().setDisabled(true);
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.fieldsValidationErrorMsg(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
                return false;
            }
        }
        var currentItemXType = (currentItem) ? currentItem.getXType() : '';
        var nextItemXType = (nextItem) ? nextItem.getXType() : '';

        this.validateSaveBtn(currentItemXType, nextItemXType, true);

        var dialog = this.getAweCreateDialogWz();

        // wizardTitle is a global variable
        switch (nextItem.getXType()) {
            case 'awesnrfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.snrtitle());
                break;
            case 'awegeneralfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.awetitle());
                break;
            case 'awemdsfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.mdstitle());
                break;
            case 'aweverteilerfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.verteilertitle());
                break;
            case 'awepdrsfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.pdrstitle());
                break;
            case 'awedialogfset':
                dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.dialogtitle());
                break;
        }
    },
    onValidityChange: function(el, isValid) {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() != 'awesnrfset') { // check for 'awesnrfset' because betrUmfang can be set by onSnrBlur() in this page
            if (isValid && this.validatePage(currentPage)) {
                this.getNextButton().setDisabled(false);
            } else {
                this.getNextButton().setDisabled(true);
            }
        }
    },
    onDateChange: function() {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() == 'awegeneralfset') {
            var daterangeObj = Ext.create('Awe.AweDaterange');
            var form = this.getAweCreateWizard().getForm();
            daterangeObj.fromFilter = false;
            daterangeObj.startField = form.findField('aweStart');
            daterangeObj.endField = form.findField('aweEnde');
            daterangeObj.durationField = form.findField('dauer');
            daterangeObj.form = form;

            if (!daterangeObj.checkStartEndRange() || !daterangeObj.checkStartDate()) {
                daterangeObj.markFields();
            }
        }
    },
    validatePage: function(fieldset) {
        var fieldsIsValid = true;
        var fields = fieldset.query('textfield, textareafield, combobox, datefield');
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].validate() && fieldsIsValid) {
                fieldsIsValid = false;
            }
        }
        if (fieldset.getXType() == 'awegeneralfset') {
            var daterangeObj = Ext.create('Awe.AweDaterange');
            var form = this.getAweCreateWizard().getForm();
            daterangeObj.fromFilter = false;
            daterangeObj.startField = form.findField('aweStart');
            daterangeObj.endField = form.findField('aweEnde');
            daterangeObj.durationField = form.findField('dauer');
            daterangeObj.form = form;

            if ((!daterangeObj.checkStartEndRange() || !daterangeObj.checkStartDate()) && fieldsIsValid) {
                daterangeObj.markFields();
                fieldsIsValid = false;
            }
        }
        return fieldsIsValid;
    },
    onDropdownSelect: function(combo) {
        combo.isSelected = true;
        combo.validate();
    },
    addPositionsInGrid: function() {
        var self = this;
        var selectedRecords = this.getAwePositionsSearchWindowWz().down('grid').getSelectionModel().getSelection();
        var positionsFormStore = this.getAweCreateWizard().down('#positionsGridWz').getStore();

        Ext.each(selectedRecords, function(record) {
            if (positionsFormStore.indexOf(record) == -1 && !self.checkIfPositionIsAdded(record, positionsFormStore)) {
                positionsFormStore.add(record);
            }
        });
    },
    checkIfPositionIsAdded: function(position, store) {
        // because positions do not have a unique property (id) we compare all properties to guarantee that a position has not been added to the position grid
        for (var i = 0; i < store.getCount(); i++) {
            if (store.getAt(i).get('baureihe') === position.get('baureihe') && store.getAt(i).get('ausfuehrungsart') === position.get('ausfuehrungsart') &&
                store.getAt(i).get('modul') === position.get('modul') && store.getAt(i).get('posE') === position.get('posE') &&
                store.getAt(i).get('posV') === position.get('posV') && store.getAt(i).get('coderegel') === position.get('coderegel') &&
                store.getAt(i).get('werk') === position.get('werk') && store.getAt(i).get('lenkung') === position.get('lenkung') && store.getAt(i).get('wahlweise') === position.get('wahlweise')) {
                return true;
            }
        }
        return false;
    },
    // #1
    searchPositionsWz: function() {
        var store = Ext.data.StoreManager.get('PositionStore');
        // store.removeAll();
        var form = this.getAweCreateWizard().getForm();
        var searchSachnummer = form.findField('searchSachnummer').getValue();
        var searchBaureihe = form.findField('searchBaureihe').getValue();
        var searchEmbodiment = form.findField('searchEmbodiment').getValue();

        if (!this.validateMandatoryCriteria(searchSachnummer, searchBaureihe, searchEmbodiment)) {
            Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.errors.criteriaValidation(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            return false;
        }
        /*
        var awePositionsSearchWindowWz = Ext.create('widget.awepositionssearchwindowwz');
        awePositionsSearchWindowWz.show();
        var positionsGridCoordinates = Ext.getCmp('positionsGridWz').getPosition();
        awePositionsSearchWindowWz.setPagePosition(positionsGridCoordinates[0] - 10, positionsGridCoordinates[1] + 160);
        */

        store.getProxy().extraParams.searchSachnummer = searchSachnummer;
        store.getProxy().extraParams.searchBaureihe = searchBaureihe;
        store.getProxy().extraParams.searchEmbodiment = searchEmbodiment;
        store.getProxy().extraParams.searchModul = form.findField('searchModul').getValue();
        store.getProxy().extraParams.searchPositionFrom = form.findField('searchPositionFrom').getValue();
        store.getProxy().extraParams.searchPositionTo = form.findField('searchPositionTo').getValue();

        store.on('load', function(me, records, successful, eOpts) {
            var positionsGrid = this.getAweCreateWizard().down('#positionsGridWz');
            if (positionsGrid) {
                var aDomGridView = positionsGrid.getView().getEl().dom;
                var aDomTr = aDomGridView.getElementsByTagName('tr');
                for (var i = 0; i < aDomTr.length; i++) {
                    if (aDomTr[i].className.indexOf('x-grid-row') > -1) {
                        aDomTr[i].setAttribute('tabindex', "0");
                        aDomTr[i].setAttribute("onfocus","Ext.getDom('"+aDomGridView.id+"').style.border=\'1px dotted\';");
                        aDomTr[i].setAttribute("onblur","Ext.getDom('"+aDomGridView.id+"').style.border=\'none\';");
                        break;
                    }
                }

                positionsGrid.getView().focus();
                if (positionsGrid.getStore().count() > 0) {
                    positionsGrid.getSelectionModel().select(0);
                }
            }
            if(jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true'){
                    this.addSnrFillPosition();
            }
        }, this, {single: true});
        store.load();
    },
    clearAllPositionsInGrid: function() {
        var positionsFormStore = this.getAweCreateWizard().down('#positionsGridWz').getStore();
        positionsFormStore.removeAll();
    },
    clearSelectedPositionsInGrid: function() {
        var positionsGrid = this.getAweCreateWizard().down('#positionsGridWz');
        var positionsFormStore = positionsGrid.getStore();
        var selectedPositions = positionsGrid.getSelectionModel().getSelection();
        positionsFormStore.remove(selectedPositions);
    },
    onAdditionalReceiversSelect: function(combo, record, index) {
        var store = Ext.getStore('AdditionalReceiversStore');
        var isRecordExists = store.find('id', record[0].get('id'));
        if (isRecordExists == -1) {
            store.add(record);
            store.sync();
        }
        combo.clearValue();
    },
    onVerteilerGruppenSelect: function(combo, record, index) {
        var store = Ext.getStore('VerteilergruppenStore');
        var isRecordExists = store.find('id', record[0].get('id'));
        if (isRecordExists == -1) {
            store.add(record);
            store.sync();
        }
        combo.clearValue();
    },
    clearAllAdditReceivers: function() { // prev Name - clearAllVerteilers
        var additionalReceiversGrid = this.getAweCreateWizard().down('#additionalReceiversGrid');
        additionalReceiversGrid.getStore().removeAll();
    },
    removeSelectedAdditReceivers: function() { // prev Name  - removeSelectedVerteilers
        var additionalReceiversGrid = this.getAweCreateWizard().down('#additionalReceiversGrid');
        var distributorsFormStore = additionalReceiversGrid.getStore();
        var selectedDistributors = additionalReceiversGrid.getSelectionModel().getSelection();
        distributorsFormStore.remove(selectedDistributors);
    },
    clearAllDistributorGroups: function() { // prev Name  - clearAllGroupVerteilers
        var distributorGroupsGrid = this.getAweCreateWizard().down('#distributorGroupsGrid');
        distributorGroupsGrid.getStore().removeAll();
    },
    removeSelectedDistributorGroups: function() { // prev Name  - removeSelectedGroupVerteilers
        var distributorGroupsGrid = this.getAweCreateWizard().down('#distributorGroupsGrid');
        var distributorsGroupFormStore = distributorGroupsGrid.getStore();
        var selectedDistributors = distributorGroupsGrid.getSelectionModel().getSelection();
        distributorsGroupFormStore.remove(selectedDistributors);
    },
    onBetrBaureihenChange: function(combo, newValue, oldValue, eOpts) {
        if (Ext.isEmpty(newValue)) {
            var form = this.getAweCreateWizard().getForm();

            var bereichField = form.findField('betroffeneBereichen');
            if (bereichField) {
                bereichField.setValue('');
                if (bereichField.store) {
                    Ext.getStore(bereichField.store).removeAll();
                }
            }
            var produktionslineField = form.findField('betroffeneProduktionslinien');
            if (produktionslineField) {
                produktionslineField.setValue('');
                if (produktionslineField.store) {
                    Ext.getStore(produktionslineField.store).removeAll();
                }
            }
            var gewerkField = form.findField('gewerk');
            if (gewerkField) {
                gewerkField.setValue('');
                if (gewerkField.store) {
                    Ext.getStore(gewerkField.store).removeAll();
                }
            }
        }
    },
    onBetrBaureihenSelect: function(combo, records) {
        var form = this.getAweCreateWizard().getForm();

        var recordsIds = [];

        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record && record.data && record.data.id) {
                    recordsIds.push(record.data.id);
                }
            }
        }
        var arrayIdsList = Ext.JSON.encode(recordsIds);
        var bereichField = form.findField('betroffeneBereichen');
        if (!bereichField) {
            return;
        }
        var betrBereichStore = null;
        if (bereichField && bereichField.store) {
            betrBereichStore = Ext.getStore(bereichField.store);
        }

        form.findField('betroffeneBereichen').setLoading(true);
        form.findField('betroffeneBereichen').reset();
        betrBereichStore.load({
            params: {
                baureihenIds: arrayIdsList
            },
            callback: function(records, operation, success) {
                form.findField('betroffeneBereichen').setLoading(false);
                if (success) {
                    var standardEntry = records[0];
                    Ext.each(records, function(item, index, allItems) {
                        if (item.get('name').indexOf('Standard') === 0) {
                            standardEntry = item;
                            return false;
                        }
                    }, this);
                    bereichField.setValue(standardEntry);
                }
            }
        });

        // pre-select Betroffene Produktionslinien
        var produktionslineField = form.findField('betroffeneProduktionslinien');
        if (!produktionslineField) {
            return;
        }
        var betrProduktionslineStore = null;
        if (produktionslineField && produktionslineField.store) {
            betrProduktionslineStore = Ext.getStore(produktionslineField.store);
        }

        produktionslineField.setLoading(true);
        produktionslineField.reset();
        betrProduktionslineStore.load({
            callback: function(records, operation, success) {
                produktionslineField.setLoading(false);
                if (success) {
                    var standardEntry = records[0];
                    Ext.each(records, function(item, index, allItems) {
                        if (item.get('name').indexOf('Standard') === 0) {
                            standardEntry = item;
                            return false;
                        }
                    }, this);
                    produktionslineField.setValue(standardEntry);
                }
            }
        });

        // pre-select Betroffene Gewerke
        var gewerkField = form.findField('gewerk');
        if (!gewerkField) {
            return;
        }
        var betrGewerkStore = null;
        if (gewerkField && gewerkField.store) {
            betrGewerkStore = Ext.getStore(gewerkField.store);
        }

        gewerkField.setLoading(true);
        gewerkField.reset();
        betrGewerkStore.load({
            callback: function(records, operation, success) {
                gewerkField.setLoading(false);
                if (success) {
                    var standardEntry = records[0];
                    Ext.each(records, function(item, index, allItems) {
                        if (item.get('name').indexOf('Standard') === 0) {
                            standardEntry = item;
                            return false;
                        }
                    }, this);
                    gewerkField.setValue(standardEntry);
                }
            }
        });
    },
    onRenderPaev: function(combo) {
        Ext.create('Ext.tip.ToolTip', {
            target: combo.getEl(),
            html: i18n.awe.form.paevTooltip(),
            componentLayout: 'auto'
        });
    },
    disableSnrGridButtons: function(button) {
        var addSnrButton = this.getAweCreateWizard().down('button[action = addSnr]');
        var saveSnrButton = this.getAweCreateWizard().down('button[action = saveSnr]');
        var editSnrButton = this.getAweCreateWizard().down('button[action = editSnr]');
        var cancelSnrButton = this.getAweCreateWizard().down('button[action = cancelSnr]');

        var buttons = [addSnrButton, saveSnrButton, editSnrButton, cancelSnrButton];
        var i;
        for (i = 0; i < buttons.length; i++) {
            buttons[i].disable();
            buttons[i].setTooltip(i18n.awe.form.loadingDataTooltip());
        }
    },
    enableSnrGridButtons: function() {
        var addSnrButton = this.getAweCreateWizard().down('button[action = addSnr]');
        var saveSnrButton = this.getAweCreateWizard().down('button[action = saveSnr]');
        var editSnrButton = this.getAweCreateWizard().down('button[action = editSnr]');
        var cancelSnrButton = this.getAweCreateWizard().down('button[action = cancelSnr]');

        var buttons = [addSnrButton, saveSnrButton, editSnrButton, cancelSnrButton];
        var i;
        for (i = 0; i < buttons.length; i++) {
            buttons[i].enable();
            buttons[i].setTooltip('');
        }
    },
    //Sets flag if snr blur event has started/finished calling loading fns
    setSnrLoadingFlag: function(isSnrLoading) {
        var snrLoadingFlagField = this.getAweCreateWizard().down('#snrLoadingFlag');
        snrLoadingFlagField.setValue(isSnrLoading);
    },
    //Check flag if snr blur event  has called loading fns
    getSnrLoadingFlag: function() {
        var snrLoadingFlagField = this.getAweCreateWizard().down('#snrLoadingFlag');
        if (snrLoadingFlagField.getValue() == 'true') {
            return true;
        } else {
            return false;
        }
    },
    //Sets flag if werk blur event has started/finished calling loading fns
    setWerkLoadingFlag: function(isWerkLoading) {
        var werkLoadingFlagField = this.getAweCreateWizard().down('#werkLoadingFlag');
        werkLoadingFlagField.setValue(isWerkLoading);
    },
    //Check flag if werk blur event  has called loading fns
    getWerkLoadingFlag: function() {
        var werkLoadingFlagField = this.getAweCreateWizard().down('#werkLoadingFlag');
        if (werkLoadingFlagField.getValue() == 'true') {
            return true;
        } else {
            return false;
        }
    },
    setErsAltteilLoadingFlag: function(isErsAltteilLoading) {
        var ersAltteilLoadingFlagField = this.getAweCreateWizard().down('#ersAltteilLoadingFlag');
        ersAltteilLoadingFlagField.setValue(isErsAltteilLoading);
    },
    // Check flag if ersAltteil blur event has called loading fns
    getErsAltteilLoadingFlag: function() {
        var ersAltteilLoadingFlagField = this.getAweCreateWizard().down('#ersAltteilLoadingFlag');
        if (ersAltteilLoadingFlagField && ersAltteilLoadingFlagField.getValue() == 'true') {
            return true;
        } else {
            return false;
        }
    },
    setTeilRelevantLoadingFlag: function(isSnrLoading) {
        var teilRelevantLoadingFlagField = this.getAweCreateWizard().down('#teilRelevantValuesLoadingFlag');
        if(teilRelevantLoadingFlagField){
            teilRelevantLoadingFlagField.setValue(isSnrLoading);
        }
    },
    getTeilRelevantLoadingFlag: function() {
        var teilRelevantLoadingFlagField = this.getAweCreateWizard().down('#teilRelevantValuesLoadingFlag');
        if (teilRelevantLoadingFlagField && teilRelevantLoadingFlagField.getValue() == 'true') {
            return true;
        } else {
            return false;
        }
    },
    //The hidden field buttonAction indicates if any button above the Snr grid is called meanwhile
    //If yes it also contains which one. So the button action was suspended while loading the fields.
    //Now is the time to be executed
    executeSuspendedAction: function() {
        var buttonAction = this.getAweCreateWizard().down('#buttonAction');

        if (buttonAction.getValue()) {
            switch (buttonAction.getValue()) {
                case '1':
                    this.executeSuspendedClick('addSnr');
                    break;
                case '2':
                    this.executeSuspendedClick('saveSnr');
                    break;
                case '3':
                    this.executeSuspendedClick('editSnr');
                    break;
                case '4':
                    this.executeSuspendedClick('cancelSnr');
                    break;
            }
            //Reset the flag
            buttonAction.setValue(null);
        }
    },
    executeSuspendedClick: function(suspendedAction) {
        var queryString = 'button[action =' + suspendedAction + ']';
        var suspendedButton = this.getAweCreateWizard().down(queryString);
        suspendedButton.fireEvent('click', suspendedButton);
    },
    //Gets the entire nested object graph for a model
    getModelData: function(model) {
        var data = {};
        for (var p in model.data) {
            data[p] = model.data[p];
        }

        for (var i = 0; i < model.associations.length; i++) {
            if (model.associations.items[i].type == "hasMany") {
                var name = model.associations.items[i].name;
                data[name] = this.getStoreData(model[name]());
            }
        }

        return data;
    },
    //Gets the entire nested object graph for each model in a store
    getStoreData: function(store) {
        var count = store.getCount();
        var values = [];
        for (var i = 0; i < count; i++) {
            values.push(this.getModelData(store.data.items[i]));
        }

        return values;
    },
    resetHiddenFieldsSnr: function() {
        var form = this.getAweCreateWizard().getForm();

        var teilIdField = form.findField("teilId");
        var oldSnrField = form.findField("snr");
        var ersAltteilIdFld = form.findField("ersAltteilId");
        var ersAltteilShowField = form.findField('ersAltteilShow');

        teilIdField.setValue('');
        oldSnrField.setValue('');
        ersAltteilShowField.setValue('');
        ersAltteilIdFld.setValue('');
    },
    //without Werk
    resetFieldsSnr: function() {
        var form = this.getAweCreateWizard().getForm();
        var aweCreateWizard = this.getAweCreateWizard();
        var snrField = form.findField("sachnummer");
        var zgsField = form.findField("zgs");
        var bzaTypField = form.findField("bzaTyp");
        var lieferantField = form.findField("lieferant");
        var ersAltteil = form.findField("ersAltteil");
        var teilebenennungField = form.findField("teilBenennung");

        snrField.setValue('');
        zgsField.setValue('');
        bzaTypField.setValue('');
        lieferantField.setValue('');
        ersAltteil.setValue('');
        teilebenennungField.setValue('');

        // remove position, lieferant & zgs stores
        if (zgsField.getStore()) {
            zgsField.getStore().removeAll();
        }
        this.getAweCreateWizard().down('#positionsGridWz').getStore().removeAll();
        aweCreateWizard.down('#lieferant').getStore().removeAll();

        // clear fields in center
        var set = this.getAweCreateWizard().down('#positionsSearchFSet');
        set.query("#searchSachnummer")[0].setValue('');
        set.query("#searchBaureihe")[0].setValue('');
        set.query("#searchEmbodiment")[0].setValue('');
        set.query("#searchModul")[0].setValue('');
        set.query("#searchPositionFrom")[0].setValue('');
        set.query("#searchPositionTo")[0].setValue('');
    },
    setIsRenewed: function(isRenewed) {
        this.isRenewed = isRenewed;
    },
    // This function is to change the state of the button when we switch the current page to the second one, we run the validation
    validateSaveBtn: function(currentPage, nextPage, isFromWz) {
        var form = this.getAweCreateWizard().getForm();
        // Calling the hasDbRequiredFieldsError from AweUtils which checks the database not-null fields for error.
        shouldSkipValidation = !hasDbRequiredFieldsError(currentPage, nextPage, form, isFromWz);
        this.getSaveAweButton().setDisabled(!shouldSkipValidation);
    },
    onComboChange: function(combobox) {
        if (Ext.isEmpty(combobox.getValue())) {
            combobox.clearValue();
        }
    },
    onPageActivate: function(activeItem) {

      // alert("onPageActivate: = " + activeItem.getXType());
        if (activeItem.getXType() == 'awegeneralfset') {

            var firstSnrData = this.getAweCreateWizard().down('#snrsGrid').getStore().first().data;

            this.validateAndPopulateAffPlants();

            if (firstSnrData.teil && firstSnrData.teil.id) { //Extra validation

                //Checks if there is a change of the teil of the first Snr in the grid
                if (!(firstTeilId && firstTeilId == firstSnrData.teil.id) || (Ext.isArray(this.multipleAwes) && this.multipleAwes.length > 0)) {
                    this.setAweResponsiblesWz();

                    this.loadProjectStore();

                    firstTeilId = firstSnrData.teil.id; //firstTeilId is reset on wizard open
                }
            }

            if (generalPageFirstTimeFlag && !isAweInEditMode && !isAweInExtendMode && !this.isAweInCopyMode) {
                var aweWizzard = this.getAweCreateWizard();
                if (aweWizzard && aweWizzard.down('#klassifikation')) {
                    var klassifikationField = aweWizzard.down('#klassifikation');
                    if (klassifikationField && klassifikationField.getStore().getCount() === 0) {

                        klassifikationField.setLoading(true);
                        klassifikationField.getStore().load({
                            scope: this,
                            callback: function(records, operation, success) {
                                klassifikationField.setLoading(false);
                                if (klassifikationField.getValue() == null) {
                                    for (var i = 0; i < records.size(); i++) {
                                        var record = records[i];
                                        var valueKlas = record.data.name;
                                        if (valueKlas == 'PRODUKTAENDERUNG') {
                                            klassifikationField.setValue(valueKlas);
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        var klasifStore = klassifikationField.getStore();
                        if (klasifStore) {
                            var records = klasifStore.getRange();

                            if (klassifikationField.getValue() == null) {
                                for (var i = 0; i < records.size(); i++) {
                                    var record = records[i];
                                    var valueKlas = record.data.name;
                                    if (valueKlas == 'PRODUKTAENDERUNG') {
                                        klassifikationField.setValue(valueKlas);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            generalPageFirstTimeFlag = false;
        } else if (activeItem.getXType() == 'aweverteilerfset') {
          //AdditionalReceiversStore
          //var form = this.getAweCreateWizard().getForm();

            var store = Ext.getStore('AdditionalReceiversStore');
            if (this.getQsVerantwortlicherFld().lastSelection.size() > 0) {
              var isRecordExists = store.find('id', this.getQsVerantwortlicherFld().lastSelection[0].get('id'));
              if (isRecordExists == -1) {
                store.add(this.getQsVerantwortlicherFld().lastSelection[0]);
                store.sync();
              }
            }
            if (this.getWindowPersonFld().lastSelection.size() > 0) {
                var isRecordExists = store.find('id', this.getWindowPersonFld().lastSelection[0].get('id'));
                if (isRecordExists == -1) {
                    store.add(this.getWindowPersonFld().lastSelection[0]);
                    store.sync();
                }
            }
            if(jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true'){
                this.getNextButton().setDisabled(true);
            }
            if(jspScope.isKP() != 'true' && jspScope.isJV() != 'true' && jspScope.isSupplier() != 'true'){
                this.getFinishButton().setDisabled(true);
            }
        } else if (activeItem.getXType() == 'awemdsfset') {
            this.loadDialogProjektStore();
        }

        var form = this.getAweCreateWizard().getForm();
        var firstField = null;

        // Setting the focus based on the current page
        switch (activeItem.getXType()) {
            case 'awesnrfset':
                if (form && form.findField('werkWerk')) {
                    firstField = form.findField('werkWerk');
                }
                break;
            case 'awegeneralfset':
                if (form && form.findField('abweichungsGrund')) {
                    firstField = form.findField('abweichungsGrund');
                }
                break;
            case 'awemdsfset':
                if (form && form.findField('dialogProjekt')) {
                    firstField = form.findField('dialogProjekt');
                }
                break;
            case 'aweverteilerfset':
                if (form && form.findField('additionalReceivers')) {
                    firstField = form.findField('additionalReceivers');
                }
                break;
            case 'awepdrsfset':
              if ((this.isAweInCopyMode || this.isRenewed) && form && form.findField('betroffeneBaureihen')) {
                form.findField('betroffeneBaureihen').setValue('');
              }

                if (form && form.findField('betroffeneBaureihen') && Ext.isEmpty(form.findField('betroffeneBaureihen').getValue())) {
                    firstField = form.findField('betroffeneBaureihen');

                    var minBaureihe = 'ZZZZZ';
                    var minBaureiheNeu = 'ZZZZZ';
                    var minAA = 'ZZ';

                    var brAAs = [];

                    // pre-set the baureihe from the selected positions on the first wizard page
                    Ext.getStore('SachnummerStore').each(function(recSnr) {
                        if (recSnr.positions().count() > 0) {
                            recSnr.positions().each(function(recPos) {
                                minBaureihe = Ext.String.trim(recPos.get('baureihe'));
                                minAA = Ext.String.trim(recPos.get('ausfuehrungsart'));
                                brAAs.push(minBaureihe + ' ' + minAA);
                            }, this);
                        }
                    }, this);
                    var uniqueBrAAs = Ext.Array.unique(brAAs);
                    if (uniqueBrAAs.length > 0) {

                        // pre-load store if field is empty
                        if (Ext.isEmpty(firstField.getValue())) {
                            firstField.getStore().mon(firstField.getStore(), 'load', function(cmp, records, successful, eOpts) {
                                // try to get the preset value using the new pattern (BR_AA)
                                var allPresetRecords = [];
                                Ext.Array.each(uniqueBrAAs, function(name, index, allItems) {
                                    var presetRecord = cmp.findRecord('name', name);
                                    if (presetRecord !== null) {
                                        allPresetRecords.push(presetRecord);
                                    }
                                });
                                if (allPresetRecords.length > 0) {
                                    firstField.setValue(allPresetRecords);
                                    firstField.fireEvent('select', firstField, [ allPresetRecords ]);
                                }
                            }, {
                                single: true
                            });
                          firstField.getStore().load();
                        }
                    }

                    if (jspScope.isRequester() == 'true') {
                        this.getFinishButton().setDisabled(false);
                    } else {
                        this.getFinishButton().setDisabled(true);
                    }
                    this.getNextButton().setDisabled(true);
                } else {
                    if (jspScope.isRequester() == 'true') {
                        this.getFinishButton().setDisabled(false);
                    } else {
                        this.getFinishButton().setDisabled(true);
                    }
                    this.getNextButton().setDisabled(true);

                    var fld = form.findField('betroffeneBaureihen');
                    var valid = fld.validate();
                    if (!valid) {
                        fld.fireEvent('validitychange', fld, false);
                    }
                }

                break;
            case 'awedialogfset':
                if (form && form.findField('erfassung')) {
                    firstField = form.findField('erfassung');
                }
                break;
        }

        if (firstField && firstField.focus() !== "undefined") {
            firstField.focus(false, 1000);
        }
    },
    setMultipleAwes: function(multipleAwes) {
        this.multipleAwes = multipleAwes;
    },
    setSammelbegriff: function(sammelbegriff) {
        this.sammelbegriff = sammelbegriff;
    },
    loadMultipleTeilsInWizard: function() {

        // Checking if we this is array, and it has values, then we call every element in the array
        if (Ext.isArray(this.multipleAwes) && this.multipleAwes.length > 0 && !Ext.isEmpty(this.sammelbegriff)) {

            var multiDialogCtrl = this.getController('AweMultiCreateDialogController');
            var aweListCtrl = this.getController('AweListController');

            // Removing the first element, of the array
            this.multipleAwes.shift();

            // Checking if the array has values, then we are reseting the values in the form and reseting the card layout
            if (this.multipleAwes.length > 0) {

                var prevAweForm = this.getAweCreateWizard().getForm();
                var prevAweFormValues = this.getAweCreateWizard().getForm().getValues();
                var additionalReceiversObjects = this.getAweCreateWizard().down('#additionalReceiversGrid').getStore().getRange();
                var distributorGroupsObjects = this.getAweCreateWizard().down('#distributorGroupsGrid').getStore().getRange();

                // Resetting the values of the form in the wizard
                aweListCtrl.resetWizard();

                // Resetting the card layout
                this.getAweCreateWizard().resetMdsWizard();

                Ext.getStore('AdditionalReceiversStore').removeAll();
                Ext.getStore('VerteilergruppenStore').removeAll();

                // Loading the first, value from the array
                multiDialogCtrl.loadMultipleTeilsInWizard(this.multipleAwes[0], this.sammelbegriff, prevAweForm, prevAweFormValues, additionalReceiversObjects, distributorGroupsObjects);

            } else {
                // We close the window if we have no more values
                if (multiDialogCtrl) {
                    multiDialogCtrl.closeDialog();
                }
            }
        }

    },
    setMassnahmeRelatedFields: function(form) {

        if(!form) {
            form = this.getAweCreateWizard().getForm();
        }

        var treiberFld = form.findField('treiber');
        var zielterminFld = form.findField('zieltermin');
        var messnahmeFld = form.findField('massnahme');
        var massnahmeTypFld = form.findField('massnahmeTyp');

        if( messnahmeFld ) {
            this.massnahmeDesc = messnahmeFld.getValue();
        }
        if( massnahmeTypFld ) {
            this.massnahmeTyp = ( massnahmeTypFld.getValue() && massnahmeTypFld.getValue().massnahmeType && massnahmeTypFld.getValue().massnahmeType === 1 );
        }
        if( zielterminFld ) {
            this.zieltermin = zielterminFld.getSubmitValue();
        }
        if( treiberFld ) {
            this.treiberId = treiberFld.getValue();
        }
    },
    checkHasExceptBlankErrError: function(field) {
        if (field.getActiveErrors().length == 0) {
            return false;
        } else {
            if (field.getActiveErrors().length == 1 && field.getActiveErrors()[0] == field.blankText) {
                return false;
            } else {
                return true;
            }
        }
    },
    checkAllValid: function(fieldset) {
        var fieldsAreValid = true;
        var fields = fieldset.query('textfield, textareafield, combobox, datefield, numberfield');
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].getActiveErrors().length != 0 && fieldsAreValid) {
                fieldsAreValid = false;
                break;
            }
        }

        return fieldsAreValid;
    },
    onGenFSetValidityChange: function(el, isValid) {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() == 'awegeneralfset') {
            if (isValid) {
                if (!this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(false);
                    this.getBackButton().setDisabled(false);
                    if (this.checkAllValid(currentPage)) {
                        this.getNextButton().setDisabled(false);
                    }
                }
            } else {
                this.getNextButton().setDisabled(true);
                if (this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(true);
                }
            }
        }
    },
    onGenFSetErrorChange: function(el, error) {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() == 'awegeneralfset') {
            if (!error) {
                if (!this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(false);
                    this.getBackButton().setDisabled(false);
                    if (this.checkAllValid(this.getGeneralPage())) {
                        this.getNextButton().setDisabled(false);
                    }
                }
            } else {
                if (this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(true);
                } else {
                    this.getSaveAweButton().setDisabled(false);
                    this.getBackButton().setDisabled(false);
                }
                this.getNextButton().setDisabled(true);
            }
        }
    },
    checkAllHasExceptBlankErError: function() {
        var hasExceptBlankErError = false;
        var isValidFields = [this.getAweAbweichungFld(), this.getKemVerantwortlicherFld(), this.getQsVerantwortlicherFld(), this.getErstellerFld(),
            this.getAggregateIdFld(), this.getStueckzahlbegrenzungFld(), this.getSammelbegriffFld(), this.getKem1Fld(),
            this.getKem2Fld(), this.getKem3Fld(), this.getKem4Fld()
        ]; /*, this.getTeilProjektField(), this.getMdsProjektField(), this.getAnlaufField() these fields does not require validation so far, because they are force selection*/

        Ext.each(isValidFields, function(el) {
            if (el.getActiveErrors().length != 0) {
                hasExceptBlankErError = true;
                return;
            }
        }, this);

        if (!hasExceptBlankErError) {
            var isValidExceptBlankErrFields = [this.getGrundDetailsFld(), this.getAweStartFld(), this.getAweEndeFld(), this.getDauerFld()];
            Ext.each(isValidExceptBlankErrFields, function(el) {
                if (this.checkHasExceptBlankErrError(el)) {
                    hasExceptBlankErError = true;
                    return;
                }
            }, this);
        }

        return hasExceptBlankErError;
    },
    onReject: function() {
        var self = this;

        var form = this.getAweCreateWizard().getForm();

        if (form.getValues().aweId !== '') {
            Ext.Ajax.request({
                scope: this,
                url: 'awe.reject.action',
                method: 'POST',
                params: {
                    aweId: form.getValues().aweId
                },
                success: function(response, action) {
                    isCanceledLoop = false;
                    self.closeAwePanelWz();
                },
                failure: function() {
                    self.deleteListAttachments(arrayAttachments);
                    isAweSubmittedToPdrs = true;
                    isCanceledLoop = false;
                    popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
                }
            });
        }
    },
    onIntermSave: function() {
        //If we have clicked save button then the only thing we need to check is the required fields. Other errors are checked during input time
        if (this.validateDbSaveRequiredFields()) {
            shouldSkipValidation = true;
            isAweSubmittedToPdrs = false;
            this.saveAweWz();
        } else {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.fieldsValidationErrorMsg(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }
    },
    validateDbSaveRequiredFields: function() {
        var form = this.getAweCreateWizard().getForm();
        var qsVerantwortlichervVal = form.findField('qsVerantwortlicherId').validate();
        var kemVerantwortlicherVal = form.findField('kemVerantwortlicherId').validate();
        var erstellerVal = form.findField('erstellerId').validate();
        var abweichungVal = form.findField('abweichungsGrund').validate();
        return (qsVerantwortlichervVal && kemVerantwortlicherVal && abweichungVal && erstellerVal);
    },
    onPdrsFSetValidityChange: function(field, isValid) {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() == 'awepdrsfset') {
            if (isValid) {
                if (this.checkAllValid(currentPage)) {
                    this.getSaveAweButton().setDisabled(false);
                    this.getBackButton().setDisabled(false);
                    this.getFinishButton().setDisabled(false);
                }
            } else {
                this.getSaveAweButton().setDisabled(true);
                this.getFinishButton().setDisabled(true);
            }
        }
    },
    onKemsValidityChange: function(field, isValid) {
        var currentPage = this.getAweCreateWizard().layout.activeItem;
        if (currentPage && currentPage.getXType() == 'awegeneralfset') {
            if (isValid) {
                var kemsFields = this.getGeneralPage().query('textfield[name=kemsList]');
                Ext.each(kemsFields, function(kemFld) {
                    if (kemFld.getActiveErrors().length != 0)
                        kemFld.validate();
                });
                if (!this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(false);
                    this.getBackButton().setDisabled(false);
                    if (this.checkAllValid(this.getMdsPage())) {
                        this.getNextButton().setDisabled(false);
                    }
                }
            } else {
                this.getNextButton().setDisabled(true);
                if (this.checkAllHasExceptBlankErError()) {
                    this.getSaveAweButton().setDisabled(true);
                }
            }
        }
    },
    closeDialog: function() {
        Ext.Msg.confirm(i18n.awe.grid.redirectTitle(), i18n.awe.grid.redirectMessage(), function(buttonId) {
            if (buttonId == 'yes') {
                top.DialogManager.registerDialogReloadFlag(self);
                }
				top.DialogManager.unregisterDialog(self);
        });
    },
    validateAndPopulateAffPlants: function() {

        var currentPositionIds = this.getAllPositionIdsFromSNRs();
        var affectedPlantsField = this.getAweCreateWizard().down('#werkeList');
        var affPlntStore = affectedPlantsField.getStore();

        affectedPlantsField.setLoading(true);

        affPlntStore.getProxy().extraParams.positionIds = Ext.JSON.encode(currentPositionIds);

        affPlntStore.load({
            scope: this,
            params: {
                positionIds: Ext.JSON.encode(currentPositionIds)
            },
            callback: function(records, operation, success) {
                if ( !isAweInEditMode && !isAweInExtendMode && !this.isAweInCopyMode ) {
                    affectedPlantsField.setValue(records);
                }

                if (jspScope.isKP() == 'true' || jspScope.isJV() == 'true') {
                    affectedPlantsField.setReadOnly(true);
                    affectedPlantsField.plugins[0].handleDestroy();

                    // TODO: don't allow to focus the cell!
                }
                affectedPlantsField.setLoading(false);
            }
        });
    },
    loadBetroffeneWerkField: function(records, werkIds, field) {
        var values = [];
        if (records && records !=null) {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record.data && record.data.werk) {
                    if (Ext.isEmpty(record.data.werk)) {
                        continue;
                    }

                    var werkValue = Ext.util.Format.trim(record.data.werk);

                    while ((werkValue.length < 4)) {
                        werkValue = werkValue + '0';
                    }

                    if (werkValue && werkIds.indexOf(werkValue) > -1) {
                        values.push(record.data.werk);
                    }
                }
            }
        }

        if (values.length > 0) {
            field.setValue(values);
        }
    },
    getAllPositionIdsFromSNRs: function() {
        var snrs = this.getAweCreateWizard().down('#snrsGrid').getStore().getRange();
        var allPositionIds = [];
        Ext.each(snrs, function(snrModel) {
            Ext.each(snrModel.positions().getRange(), function(position) {
                allPositionIds.push(position.data.posId);
            });
        });
        return allPositionIds;
    },
    validateMandatoryCriteria: function(searchSachnummer, searchBaureihe, searchEmbodiment) {
        return this.isSearchValid(searchSachnummer) || (this.isSearchValid(searchBaureihe) && this.isSearchValid(searchEmbodiment));
    },
    isSearchValid: function(value) {
         if ( value && (value.trim() && value.trim() !='%' && value.trim() !='?')) {
             return true;
         }
         return false;
    },
    setIsAweInCopyMode: function(isAweInCopyMode) {
        if (Ext.isBoolean(isAweInCopyMode)) {
            this.isAweInCopyMode = isAweInCopyMode;
        }
    },
    setIsAweInExtendMode: function(isAweInExtendMode) {
        if (Ext.isBoolean(isAweInExtendMode)) {
            this.isAweInExtendMode = isAweInExtendMode;
        }
    }
});