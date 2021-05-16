var keyMapTopPanel;
Ext.define('Awe.controller.AweListController', {
    extend: 'Ext.app.Controller',
    requires: ['MDS.Utils.Misc', 'MDS.Utils.Response'],

    stores: ['AweDataStore'],
    models: ['AweData'],
    views: [
        'awe.AweList',
        'awe.AweTopPanel'
    ],
    refs: [{
        ref: 'aweHolder',
        selector: 'aweHolder'
    }, {
        ref: 'aweCreateDialog',
        selector: 'awecreatedialog'
    }, {
        ref: 'aweDisplayDialog',
        selector: 'awedisplaydialog'
    }, {
        ref: 'aweCreateDialogWz',
        selector: 'awecreatedialogwz'
    }, {
        ref: 'aweCreatePanel',
        selector: 'awecreatepanel'
    }, {
        ref: 'aweDisplayPanel',
        selector: 'awedisplaydialog awedisplaypanel'
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
        ref: 'awePositionsSearchWindow', //TODO: unused
        selector: 'awepositionssearchwindow'
    }, {
        ref: 'newButton',
        selector: 'awetoppanel #newButton'
    }, {
        ref: 'mdsPage',
        selector: 'awecreatedialogwz awemdsfset'
    }, {
        ref: 'openButton',
        selector: 'awetoppanel #openButton'
    }, {
        ref: 'editButton',
        selector: 'awetoppanel #editButton'
    }, {
        ref: 'copyButton',
        selector: 'awetoppanel #copyButton'
    }, {
        ref: 'extendAweButton',
        selector: 'awetoppanel #extendAweButton'
    }, {
        ref: 'deleteButton',
        selector: 'awetoppanel #deleteButton'
    }, {
        ref: 'filterButton',
        selector: 'awetoppanel #filterButton'
    }, {
        ref: 'closeButton',
        selector: 'awetoppanel #closeButton'
    }, {
        ref: 'excelExportButton',
        selector: 'awetoppanel #excelExportButton'
    }, {
        ref: 'helpButton',
        selector: 'awetoppanel #helpButton'
    } , {
        ref: 'checkButton',
        selector: 'awetoppanel #checkButton'
    }],
    init: function(application) {
        keyMapTopPanel = new Ext.util.KeyMap(Ext.getDoc(), [{
            key: Ext.EventObject.N,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(e, eOpts) {
                if (this.getNewButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getNewButton().focus();
                    this.getNewButton().fireEvent('click', this.getNewButton());
                }
            }
        }, {
            key: Ext.EventObject.O,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getOpenButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getOpenButton().focus();
                    this.getOpenButton().fireEvent('click', this.getOpenButton());
                }

            }
        }, {
            key: Ext.EventObject.E,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getEditButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getEditButton().focus();
                    this.getEditButton().fireEvent('click', this.getEditButton());
                }

            }
        }, {
            key: Ext.EventObject.C,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getCopyButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getCopyButton().focus();
                    this.getCopyButton().fireEvent('click', this.getCopyButton());
                }

            }
        }, {
            key: Ext.EventObject.B,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getExtendAweButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getExtendAweButton().focus();
                    this.getExtendAweButton().fireEvent('click', this.getExtendAweButton());
                }
            }
        }, {
            key: Ext.EventObject.D,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getDeleteButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getDeleteButton().focus();
                    this.getDeleteButton().fireEvent('click', this.getDeleteButton());
                }

            }
        }, {
            key: Ext.EventObject.F,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getFilterButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getFilterButton().focus();
                    this.getFilterButton().fireEvent('click', this.getFilterButton());
                }
            }
        }, {
            key: Ext.EventObject.X,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getCloseButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getCloseButton().focus();
                    this.getCloseButton().fireEvent('click', this.getCloseButton());
                }
            }
        }, {
            key: Ext.EventObject.U,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getExcelExportButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getExcelExportButton().focus();
                    this.getExcelExportButton().fireEvent('click', this.getExcelExportButton());
                }
            }
        }, {
            key: Ext.EventObject.H,
            alt: true,
            scope: this,
            defaultEventAction: 'stopEvent',
            handler: function(key, event) {
                if (this.getHelpButton() && Ext.WindowManager.getActive() === undefined) {
                    this.getHelpButton().focus();
                    this.getHelpButton().fireEvent('click', this.getHelpButton());
                }
            }
        }]);

        this.control({
            'awetoppanel button[action=new]': {
                click: this.createAweInPanel
            },
            'awetoppanel button[action=newWz]': {
                click: this.createAweInPanelWz
            },
            'awetoppanel button[action=open]': {
                click: this.openAweInPanel
            },
            'awetoppanel button[action=edit]': {
                click: this.editAweInPanel
            },
            'awetoppanel button[action=delete]': {
                click: this.deleteAwe
            },
            'awetoppanel button[action=copy]': {
                click: this.copyAwe
            },
            'awetoppanel button[action=extend]': {
                click: this.extendAwe
            },
            'awetoppanel button[action=check]': {
           click: this.closeDialogAwe
            },
            'awetoppanel button[action=filter]': {
                click: this.showAweFilter
            },
            'awetoppanel button[action=excelExport]': {
                click: this.excelExport
            },
            'awetoppanel button[action=close]': {
                click: this.closeAwe
            },
            'awetoppanel': {
                beforeshow: function() {
                    keyMapTopPanel.enable();
                },
                beforehide: function() {
                    keyMapTopPanel.disable();
                }
            },
            'awedisplaydialog awedisplaypanel awedisplaysnrfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedisplaygeneralfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedisplaymdsfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedisplayverteilerfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedisplaypdrsfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedialogfset': {
                activate: this.onAweDisplayDialog
            },
            'awedisplaydialog awedisplaypanel awedialogsdr': {
                activate: this.onAweDisplayDialog
            },
            'awelist #aweIdColumn': {
                click: jspScope.isJustSupplier() === 'true' ? '' : this.onAweIdColumnClick
            }
        });

        if (jspScope.successMessage()) {
            MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.infoTitle(), jspScope.successMessage(), 'x-icon-information');
            jspScope.successMessage() == null;
        }

        if (jspScope.errorMessage()) {
            MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.errorTitle(), jspScope.errorMessage(), 'x-icon-error');
            jspScope.errorMessage() == null;
        }
        Ext.Ajax.on({
            requestcomplete: function(conn, response, options) {
                Ext.isFirebug ? console.debug('Hit the global requestcomplete listener to reset the session timeout flag!') : '';
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
            }
        });
    },
    /*
     * Describes dependent fields
     * Every set of dependent fields should be in array
     * For example [start, end, duration] or [start, end]
     * Where start, end, duration is the id of the field
     */
    dependentFieldsArray: {
        'createView': [
            ['aweStart', 'aweEnde', 'dauer']
        ],
        'filterView': [
            ['aweStartVon', 'aweStartBis'],
            ['aweEndeVon', 'aweEndeBis'],
            ['erfassungVon', 'erfassungBis'],
            ['beantragungVon', 'beantragungBis'],
            ['genehmigungVon', 'genehmigungBis']
        ]
    },
    /*
     * Event handler for blur from date field and change of the duration.
     */
    onDependentFieldEvent: function() {
        var rangeObj = arguments[0];
        var form = rangeObj.form;
        rangeObj.fromField = arguments[1];
        var field = form.findField(arguments[1]);
        if (field.isValid()) {
            // If we are from the duration and the value that the user sets is not integer we marking it invalid
            if (rangeObj.fromField == 'dauer' && field.getValue() != parseInt(field.getValue()) && !Ext.isEmpty(field.getValue()) && !field.fromEndField) {
                field.markInvalid(i18n.awe.validation.invalidDurationInput());
                field.setActiveError(i18n.awe.validation.invalidDurationInput());
                field.setValue(parseInt(field.getValue()));
                return;
            }
            rangeObj.buildFields();
        }
    },
    /*
     * Uses the dependentFields object to bind events on them
     * All the fields uses the onDependentFieldEvent method for event handler on blur and change.
     *
     * See: http://docs.sencha.com/extjs/4.1.1/#!/api/Ext.Function-method-pass
     */
    bindDependentFieldEvents: function(form, isFilter) {
        var depFieldsArray = undefined;
        if (isFilter) {
            depFieldsArray = this.dependentFieldsArray.filterView;
        } else {
            depFieldsArray = this.dependentFieldsArray.createView;
        }
        for (i in depFieldsArray) {
            if (depFieldsArray.hasOwnProperty(i)) {
                var dependentFields = Ext.create('Awe.AweDaterange');
                dependentFields.form = form;
                dependentFields.fromFilter = isFilter;
                dependentFields.startField = form.findField(depFieldsArray[i][0]);
                dependentFields.endField = form.findField(depFieldsArray[i][1]);
                if (!isFilter) {
                    dependentFields.durationField = form.findField(depFieldsArray[i][2]);
                }
                var startFieldHandler = Ext.Function.pass(this.onDependentFieldEvent, [dependentFields, dependentFields.startField.name]);
                dependentFields.startField.on('blur', startFieldHandler, this);
                var endFieldHandler = Ext.Function.pass(this.onDependentFieldEvent, [dependentFields, dependentFields.endField.name]);
                dependentFields.endField.on('blur', endFieldHandler, this);
                if (!isFilter) {
                    var durationFieldHandler = Ext.Function.pass(this.onDependentFieldEvent, [dependentFields, dependentFields.durationField.name]);
                    dependentFields.durationField.on('change', durationFieldHandler, this);
                }
            }
        }
    },


    createAweInPanelWz: function(button, event, eOpts, model) {
        this.resetWizard();
        // alert("createAweInPanelWz: + button:"+button + " event:"+event + " eopts:" +eOpts + " model:"+model);
        var form = this.getAweCreateWizard().getForm();

        if (this.validateUserPermission(model, false, false)) {

            if (model) {
                form.loadRecord(model);
                if (model.data && model.data.aweId) {
                    this.setStartTitle(model.data.aweId);
                } else {
                    this.setStartTitle();
                }
            } else {
                form.loadRecord(Ext.create('Awe.model.AweData'));
                //form.findField
                this.setStartTitle();
            }
            this.getAweCreateWizard().move(0);
            this.showAwePanelWz();
            this.getAweCreateDialogWz().setLoading(false);
            this.validateSnrStore();


        }
    },
    setGlobalListenerToComboboxes: function() {

        var aweWizard = this.getAweCreateWizard();
        var listComboBoxes = null;
        if (aweWizard) {
            listComboBoxes = aweWizard.query('combobox');
        }

        for (var i = 0; i < listComboBoxes.size(); i++) {
            var combo = listComboBoxes[i];
            var comboId = combo.getItemId();
            if (comboId != 'werkWerk' && comboId != 'kemVerantwortlicherId' && comboId != 'qsVerantwortlicherId' && comboId != 'erstellerId' && comboId != 'windowPersonId') {
                combo.on({
                    change: function(combobox) {
                        if (combobox.getValue() === null) {
                            combobox.reset();
                        }
                    }
                });
            }
        }
    },
    validateSnrStore: function() {
        var snrStore = Ext.getStore('SachnummerStore');
        var aweWizard = this.getAweCreateWizard();
        var aweCreateWizardNextButton = null;

        if (aweWizard && aweWizard.query('#next') && aweWizard.query('#next').length > 0) {
            aweCreateWizardNextButton = aweWizard.query('#next').first();
        }

        if (snrStore && snrStore.getCount() === 0 && aweCreateWizardNextButton != null) {
            aweCreateWizardNextButton.setDisabled(true);
        } else {
            aweCreateWizardNextButton.setDisabled(false);
        }
    },
    openAweInPanel: function() {

        // alert("openAweInPanel");
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (!this.isOneRecordSelctedValidation(selectedAwes)) {
            return;
        }

        var selectedAwe = selectedAwes[0];

        var callbackFn = function(awe) {
            this.loadAweInDisplayPan(awe);

            // Reset panel on first tab
            var firstTab = this.getAweDisplayPanel().down('#0');
            firstTab.fireEvent('click', firstTab);
            firstTab.toggle(true);

            this.getAweDisplayPanel().show();
            //      this.getAweDisplayPanel().show();
            var dialog = this.getAweDisplayDialog();
            this.setDisplayTitle(awe.data.aweId);
            dialog.show();
        };

        this.loadAweObject(selectedAwe.get('id'), callbackFn);
    },
    editAweInPanel: function(btn, event, options, isAweRenewedFlag) {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();

        // this.setGlobalListenerToComboboxes();

        if (isAweInExtendMode) {
            isAweInEditMode = false;
        } else {
            isAweInEditMode = true;
        }

        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            isAweInExtendMode = false;
            isAweInEditMode = false;
            return;
        }

        var aweStatus = selectedAwes[0].get('antragstatus');
        var isLockedBecauseManuallyRejected = jspScope.aweStatusManuallyRejected() == aweStatus &&
        (jspScope.isSupplier() === 'true' || jspScope.isJV() === 'true' || jspScope.isKP() === 'true');

        if ((jspScope.isRequester() != 'true' && aweStatus != jspScope.aweStatusCreated()
              && aweStatus != jspScope.aweStatusCreatedExtern()
            && selectedAwes[0].get('aweId').indexOf('M') > 0) || isLockedBecauseManuallyRejected) {

            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.editNotAllowed(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }

        if (this.validateUserPermission(selectedAwes[0], false, true)) {
            this.loadAweInWizard(selectedAwes[0], isAweRenewedFlag, true);
        }
    },
    loadAweInWizard: function(aweData, isAweRenewedFlag, isInCopyMode) {
        // TODO: awe is of type Awe.model.AweData! not Awe.model.Awe anymore!
        // So we have to get the real Awe.model.Awe here now to proceed!
        // alert("LOAD AWE IN WIZAR");
        var callbackFn = function(awe, ignoreMissingSnr) {
            var form = this.getAweCreateWizard().getForm();

            // ======== third page - awemdsfset ========

            // set global variables (located in AweDialogController.js) to stored data in the backend to load projekt, teilprojekt & anlauf stores
            // isAweInEditMode = true;


            // ======== third page end ========

            if (!ignoreMissingSnr && awe && awe.snrs() && awe.snrs().getCount() == 0 ) {

                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.errors.snrgridInit(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
                return false;
            }

            this.createAweInPanelWz(null, null, null, awe);

            // ======== first page - awesachnummerfset ========
            var snrStore = Ext.getStore('SachnummerStore');
            var werkField = form.findField('werkWerk');
            var werkFieldStore = form.findField('werkWerk').getStore();

            // load awe snrs to snrGrid
            var snrsCount = awe.snrs().getCount();
            var snrs = awe.snrs().getRange(0, snrsCount);
            snrStore.loadRecords(snrs);
            for (var i = 0; i < snrs.size(); i++) {
                snrs[i].commit();
            }
            // load werk in combobox, set it to read only and make it valid
            if (snrStore.getAt(0) && snrStore.getAt(0).get('werk') && snrStore.getAt(0).get('werk').werk) {
                werkFieldStore.load({
                    callback: function(records, operation, success) {
                        var record = werkFieldStore.findRecord('werk', snrStore.getAt(0).get('werk').werk);
                        werkField.setValue(record);
                        werkField.setReadOnly(true);
                        werkField.isSelected = true;
                        werkField.validate();
                    }
                });
            }


            if (snrStore.first() && snrStore.first().data && snrStore.first().data.teil && snrStore.first().data.teil.id) {
                firstTeilId = snrStore.first().data.teil.id; //set global variable
            } else if (!ignoreMissingSnr) {
                Ext.MessageBox.alert({
                    title: i18n.awe.message.errorTitle(),
                    msg: i18n.awe.form.errors.snrgridInit(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
                return false;
            }

            // ======== first page end ========

            // ======== second page - awegeneralfset ========


            if (awe.get('aweStart')) {
                var aweStartDate = Ext.Date.parse(awe.get('aweStart'), i18n.awe.word.defaultDateFormat());
                var aweStartField = form.findField('aweStart');
                if (aweStartField) {
                  if(isAweInEditMode){
                    aweStartField.setValue(aweStartDate);
                  }else{
                    aweStartField.setValue(null);
                  }
                }
            }

            if (awe.get('aweEnde')) {
                var aweEndDate = Ext.Date.parse(awe.get('aweEnde'), i18n.awe.word.defaultDateFormat());
                var aweEndField = form.findField('aweEnde');
                if (aweEndField) {
                  if(isAweInEditMode){
                    aweEndField.setValue(aweEndDate);
                  }else{
                    aweEndField.setValue(null);
                  }
                }
            }

            if (awe.get('dauer')) {
                var aweDauer = awe.get('dauer');
                var aweDauerField = form.findField('dauer');
                if (aweDauerField) {
                  if(isAweInEditMode){
                    aweDauerField.setValue(aweDauer);
                  }else{
                    aweDauerField.setValue(null);
                  }
                }
            }


            // set minDate on calendar if awe is being renewed
            if (isAweRenewedFlag) {
                // Here we convert the string of the AWE start date to a real date object
                var minDate = Ext.Date.parse(awe.get('aweStart'), i18n.awe.word.defaultDateFormat());

                var aweStart = form.findField('aweStart');
                if (aweStart) {
                    aweStart.setMinValue(minDate);
                }
            }


            if (awe.get('betroffeneWerke')) {
                this.initBetrWerke(awe.get('betroffeneWerke'), form);
            }


            // load klassifikation & prioritaet comboboxes
            var klassifikationField = form.findField('klassifikation');
            var prioritaetField = form.findField('prioritaet');

            //Load klassifikation and prioritaet stores and set values. If already loaded form.setRecord() will set
            if (awe.get('klassifikation') && klassifikationField.getStore().count() === 0) {
                klassifikationField.setLoading(true);
                klassifikationField.getStore().load({
                    scope: this,
                    callback: function(records, operation, success) {
                        klassifikationField.setLoading(false);
                        klassifikationField.setValue(awe.get('klassifikation'));
                    }
                });
            };

            if (awe.get('prioritaet') && prioritaetField.getStore().count() === 0) {
                prioritaetField.setLoading(true);
                prioritaetField.getStore().load({
                    scope: this,
                    callback: function(records, operation, success) {
                        prioritaetField.setLoading(false);
                        prioritaetField.setValue(awe.get('prioritaet'));
                    }
                });
            };

            //TODO if not wtorking to be added
            //Load stueckzahlbegrenzung field
            // var stueckzahlbegrenzung = form.findField('stueckzahlbegrenzung');
            // if(awe.get('stueckzahlbegrenzung')){
            //     stueckzahlbegrenzung.setValue(awe.get('stueckzahlbegrenzung'));
            // }

            // load qsVerantwortlicher & kemVerantwortlicher comboboxes; validate them
            if (awe.getAssociatedData().kemVerantwortlicher && awe.getAssociatedData().kemVerantwortlicher.id) {
                var kemVerantwortlicherField = form.findField('kemVerantwortlicherId');
                var kemVerantwortlicherStore = form.findField('kemVerantwortlicherId').getStore();
                var aweKemVerant = awe.getAssociatedData().kemVerantwortlicher;

                kemVerantwortlicherStore.add(aweKemVerant);
                kemVerantwortlicherField.setValue(kemVerantwortlicherStore.findRecord('id', aweKemVerant.id));
                kemVerantwortlicherField.isSelected = true;
                kemVerantwortlicherField.validate();
            }

            if (awe.getAssociatedData().qsVerantwortlicher && awe.getAssociatedData().qsVerantwortlicher.id) {
                var qsVerantwortlicherField = form.findField('qsVerantwortlicherId');
                var qsVerantwortlicherStore = form.findField('qsVerantwortlicherId').getStore();
                var aweQsVerant = awe.getAssociatedData().qsVerantwortlicher;

                qsVerantwortlicherStore.add(aweQsVerant);
                qsVerantwortlicherField.setValue(qsVerantwortlicherStore.findRecord('id', aweQsVerant.id));
                qsVerantwortlicherField.isSelected = true;
                qsVerantwortlicherField.validate();
            }

            if (awe.getAssociatedData().ersteller && awe.getAssociatedData().ersteller.id) {
                var erstellerField = form.findField('erstellerId');
                var erstellerStore = form.findField('erstellerId').getStore();
                var aweErsteller = awe.getAssociatedData().ersteller;

                erstellerStore.add(aweErsteller);
                erstellerField.setValue(erstellerStore.findRecord('id', aweErsteller.id));
                erstellerField.isSelected = true;
                erstellerField.validate();
            }

            if (awe.getAssociatedData().windowPerson && awe.getAssociatedData().windowPerson.id) {
                var windowPersonField = form.findField('windowPersonId');
                var windowPersonStore = form.findField('windowPersonId').getStore();
                var aweWindowPerson = awe.getAssociatedData().windowPerson;

                windowPersonStore.add(aweWindowPerson);
                windowPersonField.setValue(windowPersonStore.findRecord('id', aweWindowPerson.id));
                windowPersonField.isSelected = true;
                windowPersonField.validate();
            }


            // manually add the "Kems" objects since ExtJs does not support binding arrays to separate fields
            var kems = awe.kems().getRange();
            kems.sort(function(firstEl, secondEl) {
                return firstEl.data.id - secondEl.data.id
            });
            var kemsFields = this.getAweCreateWizard().query('[name=kemsList]');
            Ext.each(kems, function(kem, ind) {
                kemsFields[ind].setValue(kem.get('kemDruckformat'));
                kemsFields[ind].setKemId(kem.get('id'));
            });

            // ======== second page end ========


            // ======== third page - awemdsfset ========

            //snrStore.getAt(0) && snrStore.getAt(0).getAssociatedData().massnahme && snrStore.getAt(0).getAssociatedData().massnahme.description

            var aweSelectedProjekt = awe.getAssociatedData().projekt ? awe.getAssociatedData().projekt.pdsId : "";
            var aweSelectedTeilprojekt = awe.getAssociatedData().teilprojekt ? awe.getAssociatedData().teilprojekt.pdsId : '';
            var aweSelectedStueckliste = awe.getAssociatedData().stueckliste ? awe.getAssociatedData().stueckliste.slId : '';

            if(snrStore && snrStore.first() && snrStore.getAt(0)) {
              this.loadAndSetProjectRelatedFieldsWiz(aweSelectedProjekt, aweSelectedTeilprojekt, aweSelectedStueckliste);
                this.setMassnahmeRelatedFields(snrStore.getAt(0), form, 'massnahme', 'massnahmeTyp', 'treiber', 'zieltermin', 'massnahmeType');
            }

            // ======== third page end ========

            //Global variable used to show the correct uploadAttachment window in MDSController
            aweEditObject = awe;
            // ======== fourth page - aweverteilerfset ========

            // get awe verteilers put them into the corresponding grid (additionalReceiversGrid or distributorGroupsGrid)
            var empfaengers = [];
            var verteilersGruppe = [];

            awe.verteiler().each(function(record) {
                if (record.get('verteilerTyp') == jspScope.verteilerTypeEmpfaenger()) {
                    empfaengers.push(record.getAssociatedData().empfaenger);
                } else if (record.get('verteilerTyp') == jspScope.verteilerTypeGruppe()) {
                    verteilersGruppe.push(record.getAssociatedData().empfaenger);
                }
            });

            if (empfaengers.length > 0) {
                Ext.getStore('AdditionalReceiversStore').loadData(empfaengers);
            }
            if (verteilersGruppe.length > 0) {
                Ext.getStore('VerteilergruppenStore').loadData(verteilersGruppe);
            }

            // ======== fourth page end ========

            // ======== fifth page - awepdrsfset ========

            // set value to ncm checkbox
            form.findField('ncmRel').setValue(awe.data.ncmNummer);

            // load Baureihen, Produktionslinie & Gewerk comboboxes

            var arrayBaureihenIds = [];
            if (awe.betroffeneBaureihen() && awe.betroffeneBaureihen().data && awe.betroffeneBaureihen().data.items) {
                var aweBaurieheData = awe.betroffeneBaureihen().data;
                var baureihenArray = awe.betroffeneBaureihen().data.items;
                this.loadPdrsStores(aweBaurieheData, form, 'betroffeneBaureihen', baureihenArray);
            }
            if (awe.betroffeneProduktionslinien().data && awe.betroffeneProduktionslinien().data.items) {
                var aweProduktionslinieData = awe.betroffeneProduktionslinien().data;
                var produktionslinieArray = awe.betroffeneProduktionslinien().data.items;
                this.loadPdrsStores(aweProduktionslinieData, form, 'betroffeneProduktionslinien', produktionslinieArray);
            }

            this.loadPdrsComboboxes(awe.getAssociatedData().gewerk, 'gewerk');

            // load Bereich combobox
            if (awe.getAssociatedData() && awe.getAssociatedData().betroffeneBaureihen && awe.getAssociatedData().betroffeneBereichen) {
                var aweBereicheData = awe.betroffeneBereichen().data;
                var bereichenArray = awe.betroffeneBereichen().data.items;
                if (baureihenArray) {
                    for (i = 0; i < baureihenArray.size(); i++) {
                        if (baureihenArray[i] && baureihenArray[i].raw && baureihenArray[i].raw.aweBaureiheId && baureihenArray[i].raw.aweBaureiheId.baureiheId) {
                            arrayBaureihenIds.push(baureihenArray[i].raw.aweBaureiheId.baureiheId);
                        }
                    }
                }


                var arrayIdsList = Ext.JSON.encode(arrayBaureihenIds);
                var betrBereichField = form.findField('betroffeneBereichen');
                var betrBereichStore = betrBereichField.getStore();
                betrBereichField.setLoading(true);
                betrBereichField.reset();
                betrBereichStore.load({
                    scope: this,
                    params: {
                        baureihenIds: arrayIdsList
                    },
                    callback: function(records, operation, success) {
                        //The bereichStore is already loaded so it doesn't reload in else statemnt in loadPdrsStores()
                        this.loadPdrsStores(aweBereicheData, form, 'betroffeneBereichen', bereichenArray);
                        betrBereichField.setLoading(false);
                    }
                });
            }

            // ======== fifth page end ========

            this.validateSnrStore();
        };

        var aweObj = Ext.ModelManager.getModel('Awe.model.Awe');
        aweObj.load(1, {
            scope: this,
            params: {
                id: aweData.get('id'),
                isInCopyMode: isInCopyMode
            },
            success: function(record, operation) {
                // do only after async callback!
              var message = operation.resultSet.message;
              var ignoreMissingSnr = message != null && message != undefined && message == i18n.awe.form.warnings.snrsRemoved();
              callbackFn.apply(this, [ record, ignoreMissingSnr ]);
              if (message != null && message != undefined && message != '') {
              Ext.MessageBox.alert({
                        title: i18n.awe.message.warningTitle(),
                        msg: message,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARN,
                        modal: true,
                        animateTarget: 'awecreatedialogwz'
                    });
              }
            },
            scope: this
        });
    },
    loadBetroffeneWerkField: function(records, werkIds, field, antragstatus) {
        var values = [];
        if(records && records !=null){
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
    loadPdrsStores: function(fieldData, form, fieldName, fieldArray) {


        if (fieldData && fieldArray && form) {
            var field = form.findField(fieldName);
            var fieldStore = null;
            if (field) {
                fieldStore = field.getStore();
            }
            var arrayIds = [];
            if (fieldName == 'betroffeneBaureihen') {
                for (var i = 0; i < fieldArray.size(); i++) {
                    if (fieldArray[i] && fieldArray[i].raw && fieldArray[i].raw.aweBaureiheId && fieldArray[i].raw.aweBaureiheId.baureiheId) {
                        arrayIds.push(fieldArray[i].raw.aweBaureiheId.baureiheId);
                    }
                }
            } else if (fieldName == 'betroffeneProduktionslinien') {
                for (var i = 0; i < fieldArray.size(); i++) {
                    if (fieldArray[i] && fieldArray[i].raw && fieldArray[i].raw.aweProduktionslinieId && fieldArray[i].raw.aweProduktionslinieId.produktionslinieId) {
                        arrayIds.push(fieldArray[i].raw.aweProduktionslinieId.produktionslinieId);
                    }
                }
            } else if (fieldName == 'betroffeneBereichen') {
                for (var i = 0; i < fieldArray.size(); i++) {
                    if (fieldArray[i] && fieldArray[i].raw && fieldArray[i].raw.aweBereichId && fieldArray[i].raw.aweBereichId.bereichId) {
                        arrayIds.push(fieldArray[i].raw.aweBereichId.bereichId);
                    }
                }
            }

            if (fieldStore && fieldStore.getCount() > 0) {
                var records = fieldStore.getRange(0, fieldStore.getCount());
                this.loadMultiselectPdrsComboboxes(records, arrayIds, field);
            } else {
                fieldStore.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        this.loadMultiselectPdrsComboboxes(records, arrayIds, field);
                    }
                });
            }
        }

    },


    loadMultiselectPdrsComboboxes: function(records, ids, field) {

        //This checks if the records are loaded in the Store
        var values = [];
        if (records && records != null) {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record.data && record.data.id) {
                    if (Ext.isEmpty(record.data.id)) {
                        continue;
                    }

                    var nameValue = record.data.id;

                    if (nameValue && ids.indexOf(nameValue) > -1) {
                        values.push(record.data.id);
                    }
                }
            }
        }

        if (values.length > 0) {
            field.setValue(values);
        }
    },
    loadPdrsComboboxes: function(data, fieldName) {
        if (data) {
            var field = this.getAweCreateWizard().getForm().findField(fieldName);
            field.setLoading(true);
            field.getStore().load({
                callback: function(records, operation, success) {
                    field.setValue(field.getStore().findRecord('id', data.id));
                    field.setLoading(false);
                }
            });
        }
    },
    loadCombobox: function(data, field) {
        if (data) {
            field.setLoading(true);
            field.getStore().load({
                callback: function(records, operation, success) {
                    field.setValue(field.getStore().findRecord('id', data.id));
                    field.setLoading(false);
                }
            });
        }
    },

    loadAweObject: function(aweId, callbackFn) {
        var aweObj = Ext.ModelManager.getModel('Awe.model.Awe');
        aweObj.load(1, {
            scope: this,
            params: {
                id: aweId
            },
            success: function(record, operation) {
                // do only after async callback!
                callbackFn.apply(this, [ record ]);
            },
            scope: this
        });
        return aweObj;
    },

    loadAweInDisplayPan: function(awe) {
        var panel = this.getAweDisplayPanel();
        var form = panel.getForm();

        // ======== third page end ========


        // this.createAweInPanelWz(null, null, null, awe);
        this.resetDisplayForm();
        form.loadRecord(awe);

        // ======== first page - awesachnummerfset ========
        var snrStore = panel.down('#displSnrsGrid').getStore();
        var werkField = form.findField('werkWerk');
        var werkFieldStore = form.findField('werkWerk').getStore();


        // load awe snrs to snrGrid
        var snrsCount = awe.snrs().getCount();
        var snrs = awe.snrs().getRange(0, snrsCount);
        snrStore.loadRecords(snrs);
        for (var i = 0; i < snrs.size(); i++) {
            snrs[i].commit();
        }

        // load werk in combobox
        werkFieldStore.load({
            callback: function(records, operation, success) {
              var record;
              if (snrStore.getAt(0) && snrStore.getAt(0).get('werk') && snrStore.getAt(0).get('werk').werk) {
                record = werkFieldStore.findRecord('werk', snrStore.getAt(0).get('werk').werk);
              } else {
                record = werkFieldStore.findRecord('werk', werkFieldStore.getAt(0));
              }
                werkField.setValue(record);
            }
        });

        var snrsGrid = panel.down('#displSnrsGrid');
        if (snrsGrid) {
            snrsGrid.getView().on('viewready', function(cmp, eOpts) {
                var aDomGridView = cmp.getEl().dom;
                var aDomTr = aDomGridView.getElementsByTagName('tr');
                for (var i = 0; i < aDomTr.length; i++) {
                    if (aDomTr[i].className.indexOf('x-grid-row') > -1) {
                        aDomTr[i].setAttribute('tabindex', "0");
                        aDomTr[i].setAttribute("onfocus","Ext.getDom('"+aDomGridView.id+"').style.border=\'1px dotted\';");
                        aDomTr[i].setAttribute("onblur","Ext.getDom('"+aDomGridView.id+"').style.border=\'none\';");
                        break;
                    }
                }
            });

            snrsGrid.getView().focus();
            if (snrsGrid.getStore().count() > 0) {
                snrsGrid.getSelectionModel().select(0);
            }
        }

        // ======== first page end ========

        // ======== second page - awegeneralfset ========

        if(awe.get('kem')){
            var kemField = form.findField('kemDisplayFSet');
            if(kemField){
                kemField.setValue(awe.get('kem'));
            }
        }

        if(awe.get('antragstatus')){
            var antragstatusField = form.findField('antragstatusDisplayFSet');
            if(antragstatusField){
                antragstatusField.setValue(awe.get('antragstatus'));
            }
        }

        if (awe.get('aweStart')) {
            var aweStartDate = Ext.Date.parse(awe.get('aweStart'), i18n.awe.word.defaultDateFormat());
            var aweStartField = form.findField('aweStart');
            if (aweStartField) {
                aweStartField.setValue(aweStartDate);
            }
        }

        if (awe.get('aweEnde')) {
            var aweEndDate = Ext.Date.parse(awe.get('aweEnde'), i18n.awe.word.defaultDateFormat());
            var aweEndField = form.findField('aweEnde');
            if (aweEndField) {
                aweEndField.setValue(aweEndDate);
            }
        }

        if (awe.get('dauer')) {
            var aweDauer = awe.get('dauer');
            var aweDauerField = form.findField('dauer');
            if (aweDauerField) {
                aweDauerField.setValue(aweDauer);
            }
        }

        // load betroffeneWerke store & data
        if (awe.get('betroffeneWerke')) {
            this.initBetrWerke(awe.get('betroffeneWerke'), form);
        }

        // load klassifikation & prioritaet comboboxes
        var klassifikationField = form.findField('klassifikation');
        var prioritaetField = form.findField('prioritaet');

        if (awe.get('klassifikation')) {
            var klassifikationModel = Ext.create('Awe.model.Klassifikation', {
                value: i18n.awe.enums.klassifikation[awe.get('klassifikation')]()
            });
            klassifikationField.setValue(klassifikationModel);
        }

        if (awe.get('prioritaet')) {
            var prioritaetModel = Ext.create('Awe.model.Prioritaet', {
                value: i18n.awe.enums.prioritaet[awe.get('prioritaet')]()
            });
            prioritaetField.setValue(prioritaetModel);
        }

        // load qsVerantwortlicher & kemVerantwortlicher comboboxes; validate them
        if (awe.getAssociatedData().kemVerantwortlicher && awe.getAssociatedData().kemVerantwortlicher.id) {
            var kemVerantwortlicherField = form.findField('kemVerantwortlicherId');
            var kemVerantwortlicherStore = form.findField('kemVerantwortlicherId').getStore();
            var aweKemVerant = awe.getAssociatedData().kemVerantwortlicher;

            kemVerantwortlicherStore.add(aweKemVerant);
            kemVerantwortlicherField.setValue(kemVerantwortlicherStore.findRecord('id', aweKemVerant.id));
        }

        if (awe.getAssociatedData().qsVerantwortlicher && awe.getAssociatedData().qsVerantwortlicher.id) {
            var qsVerantwortlicherField = form.findField('qsVerantwortlicherId');
            var qsVerantwortlicherStore = form.findField('qsVerantwortlicherId').getStore();
            var aweQsVerant = awe.getAssociatedData().qsVerantwortlicher;

            qsVerantwortlicherStore.add(aweQsVerant);
            qsVerantwortlicherField.setValue(qsVerantwortlicherStore.findRecord('id', aweQsVerant.id));
        }

        if (awe.getAssociatedData().ersteller && awe.getAssociatedData().ersteller.id) {
            var erstellerField = form.findField('erstellerId');
            var erstellerStore = form.findField('erstellerId').getStore();
            var aweErsteller = awe.getAssociatedData().ersteller;

            erstellerStore.add(aweErsteller);
            erstellerField.setValue(erstellerStore.findRecord('id', aweErsteller.id));
        }

        if (awe.getAssociatedData().windowPerson && awe.getAssociatedData().windowPerson.id) {
            var windowPersonField = form.findField('windowPersonId');
            var windowPersonStore = form.findField('windowPersonId').getStore();
            var windowPerson = awe.getAssociatedData().windowPerson;

            windowPersonStore.add(windowPerson);
            windowPersonField.setValue(windowPersonStore.findRecord('id', windowPerson.id));
        }

        // manually add the "Kems" objects since ExtJs does not support binding arrays to separate fields
        var kems = awe.kems().getRange();
        var kemsFields = this.getAweDisplayPanel().query('[name=kemsList]');
        Ext.each(kems, function(kem, ind) {
            kemsFields[ind].setValue(kem.get('kemDruckformat'));
            kemsFields[ind].setKemId(kem.get('id'));
        });

        // ======== second page end ========

        // ======== third page - awemdsfset ========

        if (snrStore.getAt(0) && snrStore.getAt(0).get('teil')) {
            this.loadAndSetProjekrRelatedFields(form, awe.get('projektId'), awe.get('teilprojektId'), awe.get('stuecklisteId'));
        }

        var attachmentsGrid = panel.down('#displayAttachmentsGrid');
        var attachmentStore = attachmentsGrid.getStore();
        attachmentStore.load({
            params: {
                aweId: awe.get('id')
            }
        });

        if (snrStore.getAt(0) && snrStore.getAt(0).getAssociatedData()) {
            this.setMassnahmeRelatedFields(snrStore.getAt(0), form, 'massnahmeDispl', 'massnahmeTypDispl', 'treiberDispl', 'zielterminDispl', 'massnahmeTypeDispl');
        }


        if(awe.get('notificationE1')){
            var notificationE1 = form.findField('notificationE1DisplayMdsFSet');
            notificationE1.setValue(awe.get('notificationE1'));
        }

        if(awe.get('deviationSheet')){
            var deviationSheet = form.findField('deviationSheetDisplayMdsFSet');
            deviationSheet.setValue(awe.get('deviationSheet'));
        }

        // ======== fourth page - aweverteilerfset ========

        // get awe verteilers put them into the corresponding grid (additionalReceiversGrid or distributorGroupsGrid)
        var empfaengers = [];
        var verteilersGruppe = [];

        awe.verteiler().each(function(record) {
            if (record.get('verteilerTyp') == jspScope.verteilerTypeEmpfaenger()) {
                empfaengers.push(record.getAssociatedData().empfaenger);
            } else if (record.get('verteilerTyp') == jspScope.verteilerTypeGruppe()) {
                verteilersGruppe.push(record.getAssociatedData().empfaenger);
            }
        });

        if (empfaengers.length > 0) {
            panel.down('#additionalReceiversGrid').getStore().loadData(empfaengers);
        }
        if (verteilersGruppe.length > 0) {
            panel.down('#distributorGroupsGrid').getStore().loadData(verteilersGruppe);
        }

        // ======== fourth page end ========

        // ======== fifth page - awepdrsfset ========

        // set value to ncm checkbox
        form.findField('ncmRel').setValue(awe.data.ncmNummer);

        // load Baureihen, Produktionslinie & Gewerk comboboxes
        var arrayBaureihenIds = [];
        if (awe.betroffeneBaureihen() && awe.betroffeneBaureihen().data && awe.betroffeneBaureihen().data.items) {
            var aweBaurieheData = awe.betroffeneBaureihen().data;
            var baureihenArray = awe.betroffeneBaureihen().data.items;
            this.loadPdrsStores(aweBaurieheData, form, 'betroffeneBaureihen', baureihenArray);
        }
        if (awe.betroffeneProduktionslinien().data && awe.betroffeneProduktionslinien().data.items) {
            var aweProduktionslinieData = awe.betroffeneProduktionslinien().data;
            var produktionslinieArray = awe.betroffeneProduktionslinien().data.items;
            this.loadPdrsStores(aweProduktionslinieData, form, 'betroffeneProduktionslinien', produktionslinieArray);
        }
        this.loadCombobox(awe.getAssociatedData().gewerk, form.findField('gewerk'));

        // load Bereich combobox
        if (awe.getAssociatedData().betroffeneBaureihen && awe.getAssociatedData().betroffeneBereichen) {
            var aweBereicheData = awe.betroffeneBereichen().data;
            var bereichenArray = awe.betroffeneBereichen().data.items;
            if (baureihenArray) {
                for (i = 0; i < baureihenArray.size(); i++) {
                    if (baureihenArray[i] && baureihenArray[i].raw && baureihenArray[i].raw.aweBaureiheId && baureihenArray[i].raw.aweBaureiheId.baureiheId) {
                        arrayBaureihenIds.push(baureihenArray[i].raw.aweBaureiheId.baureiheId);
                    }
                }
            }

            var arrayIdsList = Ext.JSON.encode(arrayBaureihenIds);
            var betrBereichField = form.findField('betroffeneBereichen');
            var betrBereichStore = betrBereichField.getStore();
            betrBereichField.setLoading(true);
            betrBereichField.reset();
            betrBereichStore.load({
                scope: this,
                params: {
                    baureihenIds: arrayIdsList
                },
                callback: function(records, operation, success) {
                    //The bereichStore is already loaded so it doesn't reload in else statemnt in loadPdrsStores()
                    this.loadPdrsStores(aweBereicheData, form, 'betroffeneBereichen', bereichenArray);
                    betrBereichField.setLoading(false);
                }
            });
        }

        // ======== fifth page end ========
    },
    copyAwe: function() {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });

            return;
        }

        // make the ID of the selected awe null so that its treated as a new one in the server and
        // therefore make a copy of it
        if (selectedAwes.length > 0) {
            var selectedAwe = selectedAwes[0];

            if (this.validateUserPermission(selectedAwe, false, false)) {
                if (selectedAwe) {
                    this.loadAweInWizard(selectedAwe, false, true);

                    // We fetch the AweDialogController
                    var aweDialogController = this.getController('AweDialogController');

                    if (aweDialogController) {
                        // We set the date to a property, of the AweDialogController, because seems that ExtJs just keeps an reference.
                        aweDialogController.setIsRenewed(false);
                        aweDialogController.setIsAweInCopyMode(true);
                    }
                }
            }
        }
    },
    extendAwe: function() {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });

            return;
        }

        // make the ID of the selected awe null so that its treated as a new one in the server and
        // therefore make a copy of it
        if (selectedAwes.length > 0) {
            var selectedAwe = (selectedAwes[0]) ? selectedAwes[0].copy() : null;

            if (this.validateUserPermission(selectedAwe, false, false)) {
                if (selectedAwe) {
                    selectedAwe.set('id', null);
                    isAweInExtendMode = true;
                    this.editAweInPanel(null, null, null, true);

                    // We fetch the AweDialogController
                    var aweDialogController = this.getController('AweDialogController');

                    if (aweDialogController) {
                        // We set the date to a property, of the AweDialogController, because seems that ExtJs just keeps an reference.
                        aweDialogController.setIsRenewed(true);
                    }
                }
            }
        }
    },
    makeWindowEditable: function() {
        var form = this.getAweCreatePanel().getForm();
        var fields = form.getFields();
        var i;
        var length = fields.getCount();
        Ext.suspendLayouts();
        for (i = 0; i < length; i++) {

            if (fields.getAt(i).getItemId() == "erfassung") {
                for (; i < length; i++) {
                    fields.getAt(i).removeCls('field-grey');
                }
                break;
            }
            fields.getAt(i).setReadOnly(false);
            fields.getAt(i).setFieldStyle(undefined);
            fields.getAt(i).removeCls('field-grey');
        }
        form.findField('teilBenennung').setReadOnly(true);
        form.findField('sieheZeichnungTeilSachnummer').setReadOnly(true);
        form.findField('zeichnungsDatum').setReadOnly(true);
        form.findField('sonderprozessBemusterung').setReadOnly(true);
        form.findField('bzaTyp').setReadOnly(true);

        var dialog = this.getAweCreateDialog();
        var buttons = dialog.query('button');
        buttons.each(function(button) {
            button.setVisible(true);
        });
        Ext.resumeLayouts();
        this.getAweCreatePanel().isReadOnly = false;
    },

    loadStores: function(form, fields) {
        for (index in fields) {
            if (fields.hasOwnProperty(index)) {
                var field = form.findField(fields[index]);
                if (field !== undefined && field !== null) {
                    if (field.getStore() !== undefined) {
                        form.findField(fields[index]).getStore().load();
                    }
                }
            }
        }
    },

    loadAweInForm: function(form, awe) {
        this.getAweList().setLoading(true);
        this.resetForm();
        this.loadStores(form, ['werkWerk', 'klassifikation', 'prioritaet', 'grundId', 'aenderungsArt', 'bzaTyp', 'treiber']); //, 'dialogProjekt' - loaded on showAwe
        // manually add "Teil", "Kem Verantwortlicher" and "Positions" to their stores so that
        // they can be later selected when the form is loaded up with the selected AWE
        form.findField('sachnummer').setValue(awe.get('sachnummer'));

        var aweTeilObject = this.getAweCreatePanel().aweTeilObject;
        aweTeilObject.load(awe.get('sachnummer'), {
            scope: this,
            failure: function(record, operation) {
                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.errorTitle(), i18n.awe.message.teilError(), 'x-icon-error');
            },
            success: function(record, operation) {

                //Populate hidden fields
                form.findField('teilId').setValue(record.get('id'));
                form.findField('snr').setValue(awe.get('sachnummer'));

                form.findField('kemVerantwortlicherId').getStore().add(awe.get('kemVerantwortlicher'));
                if (awe.get('qsVerantwortlicher')) {
                    form.findField('qsVerantwortlicherId').getStore().add(awe.get('qsVerantwortlicher'));
                }

                if (form.findField('qsVerantwortlicherId').getStore().getCount() === 1) {
                    form.findField('qsVerantwortlicherId').setReadOnly(true);
                }

                if (awe.get('ersteller')) {
                    form.findField('erstellerId').getStore().add(awe.get('ersteller'));
                }


                Ext.getCmp('positionsGrid').getStore().loadData(awe.get('positions'));

                // get verteilers array and parse them to get the empfaengers then load them in the grid.
                var verteilers = awe.get('verteiler');
                var empfaengers = new Array();
                var verteilersGruppe = new Array();
                verteilers.map(function(verteiler) {
                    if (verteiler.verteilerTyp == jspScope.verteilerTypeEmpfaenger()) {
                        empfaengers.push(verteiler.empfaenger);
                    }
                });
                verteilers.map(function(verteiler) {
                    if (verteiler.verteilerTyp == jspScope.verteilerTypeGruppe()) {
                        verteilersGruppe.push(verteiler.empfaenger);
                    }
                });

                // Instead of loading the store with verteilers, we need Projektbeteiligters array
                // Ext.getCmp('verteilerGrid').getStore().loadData(awe.get('verteiler'));
                Ext.getCmp('verteilerGrid').getStore().loadData(empfaengers);
                Ext.getCmp('verteilerGruppenGrid').getStore().loadData(verteilersGruppe);

                //Load the project, teilproject and anlauf for the teil
                var projektStore = Ext.getStore('ProjektStore');
                var teilprojektStore = Ext.getStore('TeilprojektStore');
                var stuecklisteStore = Ext.getStore('StuecklisteStore');
                form.findField('projektId').setLoading(true);
                projektStore.load({
                    params: {
                        teil: record.get('id')
                    },
                    callback: function(records, operation, success) {
                        //set the project value in the project field
                        if (awe.get('projekt')) {
                            form.findField('projektId').setValue(projektStore.getAt(projektStore.find('pdsId', awe.get('projekt').pdsId)));
                            form.findField('teilprojektId').setLoading(true);
                            //load the teilproject based on the project selection
                            teilprojektStore.load({
                                params: {
                                    teil: record.get('id'),
                                    apjId: awe.get('projekt').pdsId
                                },
                                callback: function(records, operation, success) {
                                    //set the teilprojekt value in the project field
                                    if (awe.get('teilprojekt')) {
                                        form.findField('teilprojektId').setValue(teilprojektStore.getAt(teilprojektStore.find('pdsId', awe.get('teilprojekt').pdsId)));
                                        form.findField('stuecklisteId').setLoading(true);
                                        //load the anlaufe based on the project and teilproject selection
                                        stuecklisteStore.load({
                                            params: {
                                                teil: record.get('id'),
                                                apjId: awe.get('projekt').pdsId,
                                                tpjId: awe.get('teilprojekt').pdsId
                                            },
                                            callback: function(records, operation, success) {
                                                //set the anlauf value in the project field
                                                if (awe.get('stueckliste')) {
                                                    form.findField('stuecklisteId').setValue(stuecklisteStore.getAt(stuecklisteStore.find('pdsId', awe.get('stueckliste').slId)));
                                                }
                                                form.findField('stuecklisteId').setLoading(false);
                                            }
                                        });
                                    }
                                    form.findField('teilprojektId').setLoading(false);
                                }
                            });
                        }
                        form.findField('projektId').setLoading(false);
                    }
                });


                // manually add the "Kems" objects since ExtJs does not support binding arrays to separate fields
                var kems = awe.get('kems');
                var kemsFields = Ext.ComponentQuery.query('[name=kemsList]');
                Ext.each(kems, function(kem, ind) {
                    kemsFields[ind].setValue(kem.kemDruckformat);
                    kemsFields[ind].setKemId(kem.id);
                });

                var zgs = form.findField('zgs');
                zgs.bindStore(createZgsStore(awe.get('teil').zgs));

                if (!Ext.isEmpty(awe.get('sieheZeichnungTeil'))) {
                    form.findField('sieheZeichnungTeilSachnummer').setValue(awe.get('sieheZeichnungTeil').snrShow);
                    form.findField('sieheZeichnungTeilId').setValue(awe.get('sieheZeichnungTeil').id);
                    form.findField('zeichnungsDatum').hide();
                    form.findField('sieheZeichnungTeilSachnummer').show();
                }

                if (!Ext.isEmpty(awe.get('zeichnungsDatum'))) {
                    form.findField('zeichnungsDatum').setValue(awe.get('zeichnungsDatum'));
                    form.findField('sieheZeichnungTeilSachnummer').hide();
                    form.findField('zeichnungsDatum').show();
                }

                // load the the selected AWE into the form and show the creating dialog
                form.findField('dauer').suspendEvents();
                this.getAweCreatePanel().aweTeilObject = record;
                form.loadRecord(awe);
                this.showAwePanel();
                //                var userId = jspScope.currentUserId();
                //                var creatorId = (awe.get('ersteller').id).toString();
                //                var isCreated = (awe.get('antragstatus') == jspScope.aweStatusCreated());
                //                var isCreator = (creatorId == userId);
                //                var proxies = jspScope.proxies().replace("[", "").replace("]", "").split(",");
                //                var isProxy = (proxies.indexOf(creatorId) > -1);

                this.setReadOnlyForForm(form, (!isCreated || !isCreator && !isProxy), awe.get('aweId'));
                form.findField('dauer').resumeEvents(false);
            },
            callback: function(record, operation) {
                this.getAweList().setLoading(false);
            }
        });
    },
    highlightFields: function(validationErrors) {
        var form = this.getAweCreatePanel().getForm();
        if (validationErrors && validationErrors.items.length > 0) {
            validationErrors.each(function(item, _) {
                if (item.field == "aweStart" || item.field == "aweEnde" || item.field == "dauer") {
                    Ext.apply(form.findField(item.field), {
                        isRequest: true
                    });
                }
                form.findField(item.field).markInvalid(item.message);
            });
        }
    },

    loadTeilInForm: function(form, sachnummer, projectId, teilprojectId, anlaufId) {
        var aweHolder = Ext.getCmp('aweHolder');
        aweHolder.setLoading(true);
        this.resetForm();

        this.loadStores(form, ['werkWerk', 'grundId']);

        form.findField('sachnummer').setValue(sachnummer);

        var aweTeilObject = this.getAweCreatePanel().aweTeilObject;
        aweTeilObject.load(sachnummer, {
            scope: this,
            failure: function(record, operation) {
                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.errorTitle(), i18n.awe.message.teilError(), 'x-icon-error');
            },
            success: function(record, operation) {

                //Populate fields
                form.findField('zgs').bindStore(createZgsStore(record.get('zgs')));
                form.findField('zgs').setValue(record.get('zgs'));
                form.findField('teilBenennung').setValue(record.get('teilBez'));
                form.findField('betroffenerUmfang').setValue(record.get('teilBez'));
                form.findField('teilId').setValue(record.get('id'));
                form.findField('snr').setValue(sachnummer);

                if (!Ext.isEmpty(record.get('sieheZeichnungId'))) {
                    form.findField('sieheZeichnungTeilSachnummer').setValue(record.get('sieheZeichnungShow'));
                    form.findField('sieheZeichnungTeilId').setValue(record.get('sieheZeichnungId'));
                    form.findField('zeichnungsDatum').hide();
                    form.findField('sieheZeichnungTeilSachnummer').show();
                }

                if (!Ext.isEmpty(record.get('zeichnungsDatum'))) {
                    form.findField('zeichnungsDatum').setValue(record.get('zeichnungsDatum'));
                    form.findField('sieheZeichnungTeilSachnummer').hide();
                    form.findField('zeichnungsDatum').show();
                }

                //Load the werk
                form.findField('werkWerk').setValue(jspScope.werk());

                //fire the select event on the werk field in order to populate the bzaTyp and QS responsible
                form.findField('werkWerk').fireEvent('select');

                //Load the grund
                if (jspScope.hasGrund() === 'true') {
                    var grundCombo = form.findField('grundId');
                    var grundStore = grundCombo.getStore();
                    grundCombo.select(grundStore.getAt(grundStore.find('id', i18n.awe.form.grund.componentNotSampledId())));
                    form.findField('sonderprozessBemusterung').setValue(true);
                }

                //Load the positions associated with this teil in the positions grid
                var store = Ext.data.StoreManager.get("PositionStore");
                store.load({
                    params: {
                        searchSachnummer: record.get('snrShow')
                    },
                    callback: function(records, operation, success) {
                        Ext.getCmp('positionsGrid').getStore().loadRecords(records);
                        Ext.getCmp('positionsSearchFieldset').setLoading(false);
                    }
                });

                //Load the project, teilproject and anlauf for the teil
                var projektStore = Ext.getStore('ProjektStore');
                var teilprojektStore = Ext.getStore('TeilprojektStore');
                var stuecklisteStore = Ext.getStore('StuecklisteStore');
                projektStore.load({
                    params: {
                        teil: record.get('id')
                    },
                    callback: function(records, operation, success) {
                        //set the project value in the project field
                        if (projectId) {
                            form.findField('projektId').setValue(projektStore.getAt(projektStore.find('pdsId', projectId)));
                            //load the teilproject based on the project selection
                            teilprojektStore.load({
                                params: {
                                    teil: record.get('id'),
                                    apjId: projectId
                                },
                                callback: function(records, operation, success) {
                                    //set the teilprojekt value in the project field
                                    if (teilprojectId) {
                                        form.findField('teilprojektId').setValue(teilprojektStore.getAt(teilprojektStore.find('pdsId', teilprojectId)));
                                        //load the anlaufe based on the project and teilproject selection
                                        stuecklisteStore.load({
                                            params: {
                                                teil: record.get('id'),
                                                apjId: projectId,
                                                tpjId: teilprojectId
                                            },
                                            callback: function(records, operation, success) {
                                                //set the anlauf value in the project field
                                                if (anlaufId) {
                                                    form.findField('stuecklisteId').setValue(stuecklisteStore.getAt(stuecklisteStore.find('pdsId', anlaufId)));
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });


                // load the the selected AWE into the form and show the creating dialog
                this.getAweCreatePanel().aweTeilObject = record;
                aweHolder.setLoading(false);
                this.showAwePanel();
                this.getAweCreateDialog().setPagePosition(0, 0);

                //As the load of positions takes a while - show the loader, which is later cleared in the callback of the positionsGrid's store load function
                Ext.getCmp('positionsSearchFieldset').setLoading(true);
            }
        });
    },
    loadSingleTeilInWizard: function(form, sachnummer, projectId, teilprojectId, anlaufId) {
        var aweTeilObject = this.getAweCreateWizard().aweTeilObject;
        aweTeilObject.load(sachnummer, {
            scope: this,
            failure: function(record, operation) {
                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.errorTitle(), i18n.awe.message.teilError(), 'x-icon-error');
            },
            success: function(record, operation) {
                var snrStore = Ext.getStore('SachnummerStore');
                var werkField = form.findField("werkWerk");
                var werkFieldStore = werkField.getStore();

                // set value to betroffenerUmfang text field on the second page
                form.findField('betroffenerUmfang').setValue(record.get('teilBez'));

                var model = Ext.create('Awe.model.SNR', {
                    teilebenennung: record.get('teilBez'),
                    zgs: record.get('zgs'),
                    snr: sachnummer,
                    zeichnungsDatum: record.get('zeichnungsDatum'),
                    sieheZeichnungTeil: record.get('sieheZeichnungId')
                });

                // load werk in combobox, set it to read only and make it valid
                var werkIsReadOnly = true;
                if(jspScope.werk().indexOf(",") > -1){
                    werkFieldStore.proxy.extraParams = {requestAction : 'teilestatus', werke : jspScope.werk()};
                    werkIsReadOnly = false;
                }

                werkFieldStore.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        var werk = jspScope.werk().split(",");
                        var record = werkFieldStore.findRecord('werk', werk[0]);
                        model.setWerk(record.data);
                        werkField.setValue(record);
                        werkField.setReadOnly(werkIsReadOnly);
                        werkField.isSelected = true;
                        werkField.validate();
                        this.getController("AweDialogController").setAweResponsiblesWz();
                    }
                });

                // load bzaTyp & set it to the snr model
                var bzaTyp = Ext.ModelManager.getModel('Awe.model.BzaTyp');
                bzaTyp.load(1, {
                    scope: this,
                    params: {
                        werk: jspScope.werk(),
                        teil: sachnummer
                    },
                    success: function(record, operation) {
                        model.set('bzaTyp', record.get('name'));
                        model.set('bzaTypValue', record.get('value'));
                    }
                });

                // set teil to snr model
                model.setTeil({
                    id: record.get('id')
                });

                //Load the positions associated with this teil in the positions grid
                var store = Ext.data.StoreManager.get("PositionStore");
                var self = this;
                store.load({
                    params: {
                        searchSachnummer: record.get('snrShow')
                    },
                    callback: function(records, operation, success) {
                        for (var i = 0; i < records.length; i++) {
                            model.positions().add(records[i]);
                        }
                        model.set('countPos', model.positions().getCount());
                        // self.getAweCreateDialogWz().setLoading(false);
                    }
                });

                snrStore.add(model);

                if (snrStore.first() && snrStore.first().data && snrStore.first().data.teil && snrStore.first().data.teil.id) {
                    firstTeilId = snrStore.first().data.teil.id;
                } else {
                    Ext.MessageBox.alert({
                        title: i18n.awe.message.errorTitle(),
                        msg: i18n.awe.form.errors.snrgridInit(),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return false;
                }



                this.loadAweProjekts(projectId, teilprojectId, anlaufId, form, record.get('id'));

                // load the the selected AWE into the form and show the creating dialog
                this.getAweCreateWizard().aweTeilObject = record;
                this.showAwePanelWz();
                this.getAweCreateDialogWz().setPagePosition(0, 0);
                this.getAweCreateDialogWz().setLoading(true);
            }
        });
    },
    loadAweProjekts: function(projectId, teilprojectId, anlaufId, form, recordId) {

        //Load the project, teilproject and anlauf for the teil
        var projektStore = Ext.getStore('ProjektStore');
        var teilprojektStore = Ext.getStore('TeilprojektStore');
        var stuecklisteStore = Ext.getStore('StuecklisteStore');
        projektStore.load({
            params: {
                teil: recordId
            },
            callback: function(records, operation, success) {
                //set the project value in the project field
                if (projectId) {
                    form.findField('projektId').setValue(projektStore.getAt(projektStore.find('pdsId', projectId)));
                    //load the teilproject based on the project selection
                    teilprojektStore.load({
                        params: {
                            teil: recordId,
                            apjId: projectId
                        },
                        callback: function(records, operation, success) {
                            //set the teilprojekt value in the project field
                            if (teilprojectId) {
                                form.findField('teilprojektId').setValue(teilprojektStore.getAt(teilprojektStore.find('pdsId', teilprojectId)));
                                //load the anlaufe based on the project and teilproject selection
                                stuecklisteStore.load({
                                    params: {
                                        teil: recordId,
                                        apjId: projectId,
                                        tpjId: teilprojectId
                                    },
                                    callback: function(records, operation, success) {
                                        //set the anlauf value in the project field
                                        if (anlaufId) {
                                            form.findField('stuecklisteId').setValue(stuecklisteStore.getAt(stuecklisteStore.find('pdsId', anlaufId)));
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    showAwePanelWz: function() {
        this.getAweCreateWizard().show();
        this.getAweCreateDialogWz().show();
        var form = this.getAweCreateWizard().getForm();
        this.bindDependentFieldEvents(form, false);
    },
    deleteAwe: function() {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }
        var selectedAwe = selectedAwes[0];
        var aweStatus = selectedAwe.get('antragstatus');
        if (aweStatus != jspScope.aweStatusCreated() && aweStatus != jspScope.aweStatusCreatedExtern()) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.deleteNotAllowed(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            isAweInExtendMode = false;
            isAweInEditMode = false;
            return;
        }

        // Validating if the user has permission for this action
        if (this.validateUserPermission(selectedAwe, false, true)) {
            Ext.Msg.confirm(i18n.awe.form.deleteTitle(), i18n.awe.form.deleteConfirmation(), function(buttonId) {
                if (buttonId == 'yes') {

                    var failureHandler = function() {
                        MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.deleteTitle(), i18n.global.msg.error(), 'x-icon-error');
                    }
                    Ext.Ajax.request({
                        scope: this,
                        url: 'awe.delete.action',
                        method: 'POST',
                        params: {
                            aweId: selectedAwe.get('id')
                        },
                        success: function(response, action) {
                            if (MDS.Utils.Response.isSuccessful(response)) {
                                Ext.getStore('AweDataStore').reload();
                                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.deleteTitle(), i18n.global.confirm.deleteMsg());
                            } else {
                                failureHandler();
                            }
                        },
                        failure: failureHandler
                    });
                }
            });
        }
    },
    closeDialogAwe: function() {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }
        var selectedAwe = selectedAwes[0];
        var aweId = selectedAwe.get('aweId');

        var isDialogAwe = aweId.indexOf('D') == 4 ? true : false;

        var currentUserId = jspScope.currentUserId();
        var isAdmin = jspScope.isAdmin();

         var qsId = selectedAwe.get('qsVerantwortlicherId');
         var erstellerId = selectedAwe.get('erstellerId');

        if(isDialogAwe) {

          if( isAdmin == 'true' || currentUserId == erstellerId || currentUserId == qsId ) {

            Ext.Msg.confirm(i18n.awe.form.closeTitle(), i18n.awe.form.closeConfirmation(), function(buttonId) {
                if (buttonId == 'yes') {

                    var failureHandler = function() {
                        MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.closeTitle(), i18n.global.msg.error(), 'x-icon-error');
                    }
                    Ext.Ajax.request({
                        scope: this,
                        url: 'awe.closedialog.action',
                        method: 'POST',
                        params: {
                            id: selectedAwe.get('id')
                        },
                        success: function(response, action) {
                            if (MDS.Utils.Response.isSuccessful(response)) {
                                Ext.getStore('AweDataStore').reload();
                                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.closeTitle(), i18n.awe.form.closeMsg());
                            } else {
                                failureHandler();
                            }
                        },
                        failure: failureHandler
                    });
                }
            });

          } else {
            Ext.MessageBox.alert({
                    title: i18n.awe.message.infoTitle(),
                    msg: i18n.awe.form.closeDialogAweInfo(),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
          }
        }



    },
    closeAwe: function() {
        var selectedAwes = this.getAweList().getSelectionModel().getSelection();
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }
        var selectedAwe = selectedAwes[0];
        var aweStatus = selectedAwe.get('antragstatus');
        if (aweStatus != jspScope.aweStatusApproved() && aweStatus != jspScope.aweStatusDiscontinuing() && aweStatus != jspScope.aweStatusDiscontinuingConfirmed() && aweStatus != jspScope.aweStatusWaitingPeriod()) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.closeNotAllowed(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }

        // Validating if the user has permission for this action
        if (this.validateUserPermission(selectedAwe, false, false)) {
            Ext.Msg.confirm(i18n.awe.form.closeTitle(), i18n.awe.form.closeConfirmation(), function(buttonId) {
                if (buttonId == 'yes') {

                    var failureHandler = function() {
                        MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.closeTitle(), i18n.global.msg.error(), 'x-icon-error');
                    }
                    Ext.Ajax.request({
                        scope: this,
                        url: 'awe.close.action',
                        method: 'POST',
                        params: {
                            id: selectedAwe.get('id')
                        },
                        success: function(response, action) {
                            if (MDS.Utils.Response.isSuccessful(response)) {
                                Ext.getStore('AweDataStore').reload();
                                MDS.Utils.Misc.setUserInfoMessage(i18n.awe.form.closeTitle(), i18n.awe.form.closeMsg());
                            } else {
                                failureHandler();
                            }
                        },
                        failure: failureHandler
                    });
                }
            });
        }
    },

    excelExport: function() {
        MDS.Utils.Response.postIntoIFrame('awe.export.action');
    },
    resetWzForm: function() {
        var form = this.getAweCreateWizard().getForm();
        form.reset();
        this.getAweCreateWizard().aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');

        var kemsFields = this.getAweCreateWizard().query('[name=kemsList]');
        Ext.each(kemsFields, function(field) {
            field.setValue(null);
            field.setKemId(null);
        });

        ///form.findField('qsVerantwortlicherId').getStore().loadData([], false); /// TODO - anschauen ob das der Grund ist, dass beim 2ten mal der Combo aufgeht und leer ist!!!! Store setzen, dass er nicht loaded ist!!!
        form.findField('qsVerantwortlicherId').isSelected = false;
        form.findField('kemVerantwortlicherId').isSelected = false;
        form.findField('windowPersonId').isSelected = false;
        ///form.findField('erstellerId').getStore().loadData([], false);
        form.findField('erstellerId').isSelected = false;
        form.findField('treiber').isSelected = false;
        form.findField('werkWerk').setReadOnly(false);
        form.findField('lieferant').getStore().removeAll();


        // Clean the stores of the Projekt(MDS), Teilprojekt and Anlauf dropdowns
        Ext.getStore('ProjektStore').removeAll();
        Ext.getStore('TeilprojektStore').removeAll();
        Ext.getStore('StuecklisteStore').removeAll();

        this.getAweCreateWizard().query('#positionsGridWz')[0].getStore().removeAll();
        this.getAweCreateWizard().query('#snrsGrid')[0].getStore().removeAll();
        this.getAweCreateWizard().query('#additionalReceiversGrid')[0].getStore().removeAll();
        this.getAweCreateWizard().query('#distributorGroupsGrid')[0].getStore().removeAll();

        // Set snr grid control buttons (add/save, delete, edit/cancel)
        this.getAweCreateWizard().query('button[action = editSnr]')[0].show();
        this.getAweCreateWizard().query('button[action = saveSnr]')[0].hide();
        this.getAweCreateWizard().query('button[action = addSnr]')[0].show();
        this.getAweCreateWizard().query('button[action = deleteSnr]')[0].setDisabled(false);
        this.getAweCreateWizard().query('button[action = cancelSnr]')[0].hide();
    },
    resetDisplayForm: function() {
        var form = this.getAweDisplayPanel().getForm();
        var panel = this.getAweDisplayPanel();
        var kemsFields = this.getAweDisplayPanel().query('[name=kemsList]');

        form.reset();
        Ext.each(kemsFields, function(field) {
            field.setValue(null);
            field.setKemId(null);
        });

        form.findField('qsVerantwortlicherId').getStore().loadData([], false);
        form.findField('erstellerId').getStore().loadData([], false);
        form.findField('lieferant').getStore().removeAll();


        // Clean the stores of the Projekt(MDS), Teilprojekt and Anlauf dropdowns
        form.findField('projektId').getStore().removeAll();
        form.findField('teilprojektId').getStore().removeAll();
        form.findField('stuecklisteId').getStore().removeAll();

        panel.query('#dispPositionsGrid')[0].getStore().removeAll();
        panel.query('#displSnrsGrid')[0].getStore().removeAll();
        panel.query('#additionalReceiversGrid')[0].getStore().removeAll();
        panel.query('#distributorGroupsGrid')[0].getStore().removeAll();
    },
    showAweFilter: function() {

        var filtersWindow = Ext.getCmp('AweFiltersView');

        if (!filtersWindow) {
            filtersWindow = Ext.widget('AweFiltersView');
        }
        var form = filtersWindow.down('form').getForm();
        form.findField('projektDiaCombo').getStore().clearFilter();
        this.loadStores(form, ['antragstatus', 'bzaTyp', 'projektDiaCombo', 'projektId']);

        //Binds events on filter view dependent datefields
        this.bindDependentFieldEvents(form, true);
        filtersWindow.show();

        this.populateAweUserFilter(filtersWindow);
    },
    validateUserPermission: function(selectedAwe, isRequestAction, isUpdateOrDelete) {

        var currentUserId = jspScope.currentUserId();
        var proxies = jspScope.proxies().replace("[", "").replace("]", "").split(",");
        var isProxy = false;
        var aweCreatorId = null;
        var isCreator = (jspScope.isCreator() === true || jspScope.isCreator() === "true");
        var isRequester = (jspScope.isRequester() === true || jspScope.isRequester() === "true");
        var aweId = ( selectedAwe !== undefined && selectedAwe !== null && selectedAwe.get('aweId') ) ? selectedAwe.get('aweId') : null;
        var errorTitle = i18n.global.msg.noauthority.title();
        var errorMessage = i18n.global.msg.noauthority();

        if (selectedAwe && selectedAwe.getAssociatedData() && selectedAwe.getAssociatedData().ersteller && selectedAwe.getAssociatedData().ersteller.id) {
            aweCreatorId = selectedAwe.getAssociatedData().ersteller.id

            for (var i = 0; i < proxies.length; i++) {
                if (Ext.String.trim(proxies[i]) == aweCreatorId) {
                    isProxy = true;
                    break;
                }
            }
        }

        if ((!isRequester && !isCreator && currentUserId != aweCreatorId && !isProxy) || !isRequester && isCreator && isRequestAction) {
            if( isUpdateOrDelete ) {
                errorTitle = i18n.awe.message.errorTitle();
                errorMessage = i18n.word.noPermissionToEditAwe();
            }
            Ext.MessageBox.alert({
                title: errorTitle,
                msg: errorMessage,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }

        if (aweId !== null && aweId.indexOf('M') < 0 && isUpdateOrDelete) {
            this.showLinkWindowToPdrs(aweId);

            return false;
        }

        return true;
    },

    showLinkWindowToPdrs: function(aweId) {
        var url = jspScope.pdrsDirectAccessUrl() + aweId;
        var hyperlinkStart = '<a id="pdrsLink" target="_blank" href="' + url + '">';
        var hyperlinkEnd = '</a>';

        Ext.create('Ext.Window', {
            title: i18n.awe.editAweTitle(aweId),
            width: 550,
            height: 100,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            modal: true,
            items: [{
                xtype: 'label',
                html: i18n.awe.editAweMessage(hyperlinkStart, hyperlinkEnd),
            }],
            listeners: {
                afterrender: function() {
                    var me = this;
                    var element = Ext.get('pdrsLink');
                    this.mon(element, 'click', function() {
                        me.destroy();
                    });
                }
            }
        }).show();
    },

    populateAweUserFilter: function(view) {
        var aweListController = this;
        var form = view.down('form').getForm();
        var store = null;
        Ext.Ajax.request({
            url: 'awe.userfilter.populate.action',
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                var data = json["data"];
                var success = json["success"];

                if (MDS.Utils.Response.isSuccessful(response)) {
                    var dataArray = Ext.decode(data);

                    var meineAwesField = form.findField('meineAwes');
                    meineAwesField.focus('', 10);
                    if (dataArray["meineAwes"] === undefined) {
                        meineAwesField.setValue(false);
                    } else {
                        meineAwesField.setValue(true);
                    }

                    for (key in dataArray) {
                        var value = dataArray[key];
                        var newValue = null;

                        switch (key) {
                            case 'werk':
                                key = "werkWerk";
                                break;
                            case 'kemVerantwortlicher':
                                key = "kemVerantwortlicherId";
                                break;
                            case 'qsVerantwortlicher':
                                key = "qsVerantwortlicherId";
                                break;
                            case 'windowPerson':
                                key = "windowPersonFilterId";
                                break;
                            case 'projekt':
                                key = "projektId";
                                break;
                            case 'teilprojekt':
                                key = "teilprojektId";
                                break;
                            case 'stueckliste':
                                key = "stuecklisteId";
                                break;
                        }
                        //Setting the global vaiable about the filter for the SNR change
                        isFilteredAwe = true;

                        var field = form.findField(key);

                        if (field.store !== null && field.store !== undefined && key != "antragstatus" && key != "bzaTyp") {

                            store = Ext.getStore(field.store);
                            store.getProxy().extraParams.storeValue = value;
                            store.getProxy().extraParams.storeField = field.itemId;

                            var optArray = [];
                            if (key != "projektId" && key != "teilprojektId" && key != "stuecklisteId") {

                                if (key == "betroffeneBaureihen") {

                                    optArray["betrBaureihen"] = dataArray["betroffeneBaureihen"];
                                    optArray["betrBereich"] = dataArray["betroffeneBereichen"];

                                    aweListController.setBetroffeneBaureihenAndBetroffeneBereichen(optArray, form);

                                } else if (key != "betroffeneBereichen") {
                                    aweListController.setNewValueFromStore(store, form);
                                }
                            }

                        } else {
                            newValue = getCorrectValueType(value);
                        }

                        if (key === 'varianteTeil') {

                            var varianteStore = field.getStore();
                            field.reset();
                            varianteStore.load({
                                params: {
                                    teil: dataArray['varianteTeil']
                                }
                            });

                            field.setValue(value);
                        }

                        if (key === 'projektId') {
                            field.setValue(value);
                        }

                        if (key === 'teilprojektId') {

                            var teilprojectStore = field.getStore();
                            field.reset();
                            teilprojectStore.load({
                                params: {
                                    apjId: dataArray['projekt']
                                }
                            });

                            field.setValue(value);
                        }

                        if (key === 'stuecklisteId') {
                            var anlaufStore = field.getStore();
                            form.findField('stuecklisteId').setLoading(true);
                            field.reset();
                            anlaufStore.load({
                                params: {
                                    apjId: dataArray['projekt'],
                                    tpjId: dataArray['teilprojekt']
                                },
                                callback: function(records, operation, success) {
                                    form.findField('stuecklisteId').setLoading(false);
                                }
                            });

                            field.setValue(value);
                        }

                        if (newValue !== null && newValue !== undefined && newValue != "null") {
                            field.setValue(newValue);
                            if (key == "snr") {
                                var options = [];
                                var args = [];
                                options["projektId"] = dataArray["projekt"];
                                options["teilprojektId"] = dataArray["teilprojekt"];
                                options["stuecklisteId"] = dataArray["stueckliste"];
                                args['eOpts'] = options;
                                args['this'] = field;
                                field.fireEvent('blur', args);
                            }
                        }
                    }
                }
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    setNewValueFromStore: function(store, form) {
        var fieldName = store.getProxy().extraParams.storeField;
        var newValue = null;
        var storeValue = store.getProxy().extraParams.storeValue;

        if (fieldName == 'betrProduktionslinie') {
            fieldName = 'betroffeneProduktionslinien';
        }
        if (fieldName == 'betrGewerke') {
            fieldName = 'gewerk';
        }

        var storeField = form.findField(fieldName);

        if (!store.isLoading() && store.getCount() < 1) {
            storeField.setLoading(true);
            store.load({
                callback: function(records, operation, success) {

                    if (success && records.length > 0) {
                        newValue = getCorrectValueType(storeValue, fieldName);
                        storeField.setValue(newValue);
                    }
                    storeField.setLoading(false);
                },
                scope: this
            });
        } else if (storeValue == -1) {
            if (storeField) {
                storeField.setValue(null);
                storeField.setLoading(false);
            }
        } else {
            newValue = getCorrectValueType(storeValue, fieldName);
            if (storeField) {
                storeField.setValue(newValue);
                storeField.setLoading(false);
            }
        }
    },
    setBetroffeneBaureihenAndBetroffeneBereichen: function(betroffeneObjects, form) {

        var baureihenField = form.findField("betroffeneBaureihen");
        var baureihenStore = Ext.getStore(baureihenField.store);
        var baureihenValues = betroffeneObjects.betrBaureihen;


        var bereichenValues = betroffeneObjects.betrBereich;


        if (!baureihenStore.isLoading() && baureihenStore.getCount() < 1) {
            baureihenField.setLoading(true);

            baureihenStore.load({
                callback: function(records, operation, success) {
                    baureihenField.setLoading(false);
                    if (success && records.length > 0) {
                        newValue = getCorrectValueType(baureihenValues, baureihenField.name);
                        baureihenField.setValue(newValue);

                        var betrBereichenFld = form.findField('betroffeneBereichen');
                        var betrBereichenStore = Ext.getStore(betrBereichenFld.store);

                        if (!betrBereichenStore.isLoading() && betrBereichenStore.getCount() < 1) {

                            var baureiheParams = Ext.JSON.encode(newValue);

                            betrBereichenFld.setLoading(true);
                            betrBereichenStore.load({
                                params: {
                                    baureihenIds: baureiheParams
                                },
                                callback: function(records, operation, success) {
                                    betrBereichenFld.setLoading(false);
                                    if (bereichenValues != undefined && bereichenValues != null && bereichenValues != "" && bereichenValues != '') {
                                        newValue = getCorrectValueType(bereichenValues, betrBereichenFld.name);
                                        betrBereichenFld.setValue(newValue);
                                        betrBereichenFld.setLoading(false);
                                    }
                                }
                            });
                        }
                    }

                },
                scope: this
            });
        } else if (baureihenValues == undefined) {
            if (baureihenField) {
                baureihenField.setValue(null);
                baureihenField.setLoading(false);
            }

        } else {
            if (baureihenField) {
                newValue = getCorrectValueType(baureihenValues, baureihenField);
                baureihenField.setValue(newValue);
            }

        }
    },
    setReadOnlyForForm: function(form, isReadOnly, aweId) {
        form.getFields().each(function(field) {
            field.setReadOnly(isReadOnly);
        });

        var btnArr = ['saveButton',
            'resetButton',
            'searchPositionsBtn',
            'clearAllPositionsBtn',
            'removeSelectedPositionsBtn',
            'clearAllVerteilersBtn',
            'removeSelectedVerteilersBtn',
            'clearAllGroupVerteilersBtn',
            'removeSelectedGroupVerteilersBtn'
        ];

        Ext.each(btnArr, function(value, id) {
            var field = Ext.getCmp(value);
            field.setDisabled(isReadOnly);
        });

        if (isReadOnly === true || isReadOnly == "true") {
            var panel = Ext.getCmp('awecreatedialog');

            if (!Ext.isEmpty(aweId)) {
                panel.setTitle(i18n.awe.form.lesemodus() + aweId);
            }
        }
    },
    setStartTitle: function(aweId) {
        var dialog = this.getAweCreateDialogWz();
        if (isAweInEditMode && !isAweInExtendMode && aweId) {
            wizardTitle = i18n.awe.form.edittitle() + ' ' + aweId;
        } else if (isAweInExtendMode && aweId) {
            wizardTitle = i18n.awe.form.aweExtendTitle() + ': ' + aweId;
        } else {
            wizardTitle = i18n.awe.form.createtitle();
        }
        dialog.setTitle(wizardTitle + ' - ' + i18n.awe.form.snrtitle());
    },
    isOneRecordSelctedValidation: function(selectedAwes) {
        if (selectedAwes.length != 1) {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.selectSingleWarning(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        } else {
            return true;
        }
    },
    loadAndSetProjekrRelatedFields: function(form, selectedProject, selectedTeilProjekt, selectedStueckliste) {
        this.clearProjectRelatedFields(form);
        if (Ext.isNumeric(selectedProject) && form != undefined) {
            // teilId of the first snr is used to load projectStore
            var teilId = this.getAweDisplayPanel().down('#displSnrsGrid').getStore().getAt(0).get('teil').id;
            //Load the project stores
            var projektStore = form.findField('projektId').getStore();
            var teilprojektStore = form.findField('teilprojektId').getStore();
            var stuecklisteStore = form.findField('stuecklisteId').getStore();

            //Load the project store for the new teil
            form.findField('projektId').setLoading(true);
            projektStore.load({
                scope: this,
                params: {
                    teil: teilId
                },
                callback: function(records, operation, success) {
                    this.getAweDisplayPanel().down('awedisplaymdsfset').setLoading(false);
                    form.findField('projektId').setLoading(false);
                    //Check if the selected project is in the new project store for this teil
                    if (selectedProject != null && projektStore.find('pdsId', selectedProject) >= 0) {
                        form.findField('projektId').setValue(selectedProject);
                        this.processTeilProjekt(teilId, form, teilprojektStore, stuecklisteStore, selectedProject,
                            selectedTeilProjekt, selectedStueckliste);
                    }
                }
            });
        }
    },
    processTeilProjekt: function(teilId, form, teilprojektStore, stuecklisteStore, selectedProject,
        selectedTeilProjekt, selectedStueckliste) {
        if (Ext.isNumeric(selectedTeilProjekt) && form != undefined) {
            //Load the store and if there was a previos selection set it anew. Then go on with the anlauf field
            form.findField('teilprojektId').setLoading(true);
            teilprojektStore.load({
                scope: this,
                params: {
                    teil: teilId, //before record.get('id'),
                    apjId: selectedProject
                },
                callback: function(records, operation, success) {
                    this.getAweDisplayPanel().down('awedisplaymdsfset').setLoading(false);
                    form.findField('teilprojektId').setLoading(false);
                    if (teilprojektStore.find('pdsId', selectedTeilProjekt) >= 0) {
                        //Check if the selected teilproject is in the new teilproject store for this teil and project combination

                        form.findField('teilprojektId').setValue(selectedTeilProjekt);
                        this.processAnlauf(teilId, form, stuecklisteStore, selectedProject,
                            selectedTeilProjekt, selectedStueckliste);

                    }
                }
            });
        }
    },
    processAnlauf: function(teilId, form, stuecklisteStore, selectedProject,
        selectedTeilProjekt, selectedStueckliste) {
        //Reload the stueckliste store if the old selected teilproject is in the new teilproject store and if we have old selection for stueckliste
        if (Ext.isNumeric(selectedStueckliste) && form != undefined)
            form.findField('stuecklisteId').setLoading(true);
        stuecklisteStore.load({
            scope: this,
            params: {
                teil: teilId, //before record.get('id'),
                apjId: selectedProject,
                tpjId: selectedTeilProjekt
            },
            callback: function(records, operation, success) {
                this.getAweDisplayPanel().down('awedisplaymdsfset').setLoading(false);
                form.findField('stuecklisteId').setLoading(false);
                //Check if the selected stueckliste is in the new stueckliste store for this teil, project and teilproject combination
                if (stuecklisteStore.find('pdsId', selectedStueckliste) >= 0) {
                    form.findField('stuecklisteId').setValue(selectedStueckliste);
                }

            }
        });
    },
    clearProjectRelatedFields: function(form) {
        form.findField('projektId').clearValue();
        form.findField('teilprojektId').clearValue();
        form.findField('stuecklisteId').clearValue();
    },
    setDisplayTitle: function(aweId) {
        var displayTitle = i18n.awe.displayTitle() + ' ' + aweId;
        this.getAweDisplayDialog().setTitle(displayTitle);
    },
    resetWizard: function() {
        this.resetWzForm();
        firstTeilId = null;
        generalPageFirstTimeFlag = true;
        lastPositionids = null;
    },
    loadAndSetProjectRelatedFieldsWiz: function(selectedProject, selectedTeilProjekt, selectedStueckliste) {
        var form = this.getAweCreateWizard().getForm();

        // teilId of the first snr is used to load projectStore
        var teilId = Ext.getStore('SachnummerStore').getAt(0).get('teil').id;

        //Load the project stores
        var projektStore = Ext.getStore('ProjektStore');
        var teilprojektStore = Ext.getStore('TeilprojektStore');
        var stuecklisteStore = Ext.getStore('StuecklisteStore');

        //Load the project store for the new teil
        form.findField('projektId').setLoading(true);
        projektStore.load({
            scope: this,
            params: {
                teil: teilId
            },
            callback: function(records, operation, success) {
                // if awe is edited load all available project stores, else load first combobox (projekt) & reset the other two comboboxes
                //set the project value in the project field
                selectedProject ? form.findField('projektId').setValue(projektStore.getAt(projektStore.find('pdsId', selectedProject))) : null;
                form.findField('projektId').setLoading(false);
                // load teilproject only if it is not loaded, otherwise loading is triggered every time we go to other page
                if (selectedProject && form.findField('teilprojektId').getValue() == null) {
                    form.findField('teilprojektId').setLoading(true);
                    //load the teilproject based on the project selection
                    teilprojektStore.load({
                        params: {
                            teil: teilId,
                            apjId: selectedProject
                        },
                        callback: function(records, operation, success) {
                            //set the teilprojekt value in the project field
                            selectedTeilProjekt ? form.findField('teilprojektId').setValue(teilprojektStore.getAt(teilprojektStore.find('pdsId', selectedTeilProjekt))) : null;
                            form.findField('teilprojektId').setLoading(false);
                            // load stueckliste only if it is not loaded, otherwise loading is triggered every time we go to other page
                            if (selectedTeilProjekt && form.findField('stuecklisteId').getValue() == null) {
                                form.findField('stuecklisteId').setLoading(true);
                                //load the anlaufe based on the project and teilproject selection
                                stuecklisteStore.load({
                                    params: {
                                        teil: teilId,
                                        apjId: selectedProject,
                                        tpjId: selectedTeilProjekt
                                    },
                                    callback: function(records, operation, success) {
                                        //set the anlauf value in the project field
                                        if (selectedStueckliste) {
                                            form.findField('stuecklisteId').setValue(stuecklisteStore.getAt(stuecklisteStore.find('pdsId', selectedStueckliste)));
                                        }
                                        form.findField('stuecklisteId').setLoading(false);
                                    }
                                });
                            }

                        }
                    });
                }
            }
        });
    },
    onAweDisplayDialog: function(activeItem) {
        var firstField = null;
        // Setting the focus based on the current page
        switch (activeItem.getXType()) {
            case 'awedisplaysnrfset':
                firstField = this.getAweDisplayPanel().down('#werkWerk');
                break;
            case 'awedisplaygeneralfset':
                firstField = this.getAweDisplayPanel().down('#abweichungsGrund');
                break;
            case 'awedisplaymdsfset':
                firstField = this.getAweDisplayPanel().down('#dialogProjekt');
                break;
            case 'awedisplayverteilerfset':
                firstField = this.getAweDisplayPanel().down('#additionalReceiversGrid');
                break;
            case 'awedisplaypdrsfset':
                firstField = this.getAweDisplayPanel().down('#betrBaureihen');
                break;
            case 'awedialogfset':
                firstField = this.getAweDisplayPanel().down('#erfassung');
                break;
        }

        if (firstField) {
            firstField.focus(false, 1000);
        }
    },
    onAweIdColumnClick: function(grid, cell, cellIndex, record, row, rowIndex) {
        grid.up('awelist').setLoading(true);
        var secondColumn = this.getAweList().columns[1];
        var firstRecord = this.getAweList().store.getAt(0);
        var secondCell = grid.getCell(firstRecord, secondColumn);
        if (Ext.getCmp("varianteWindow")) {
            Ext.getCmp("varianteWindow").destroy();
        }
        Ext.getStore('AweVarianteStore').getProxy().extraParams.aweId = rowIndex.data.id;
        Ext.getStore("AweVarianteStore").load({
            callback: function(records, options, success) {
                if (success == true) {
                    var secondColumn = this.getAweList().columns[1];
                    var firstRecord = this.getAweList().store.getAt(0);
                    var secondCell = grid.getCell(firstRecord, secondColumn);
                    var customWindow = Ext.create('Awe.AweCustomWindow', {

                        store: Ext.getStore("AweVarianteStore"),
                        gridWidth: 460,
                        windowId: "varianteWindow",
                        minWidth: 750,
                        minHeight: 200,
                        maxHeight: 450,
                        emptyBoxWidth: 230,
                        emptyBoxHeight: 70,
                        title: i18n.word.relatedVariants(),
                        columns: [{
                            header: i18n.awe.form.variante(),
                            dataIndex: 'teil',
                            width: 120,
                            tooltip: i18n.awe.form.variante()
                        }, {
                            header: i18n.word.teilBezeichnung(),
                            dataIndex: 'teilBezeichnung',
                            width: 160,
                            tooltip: i18n.word.teilBezeichnung()
                        }, {
                            header: i18n.word.ausfuehrungsart(),
                            dataIndex: 'ausfuehrungsart',
                            tooltip: i18n.word.ausfuehrungsart(),
                            width: 50,
                        }, {
                            header: i18n.word.codeleiste(),
                            dataIndex: 'codeleiste',
                            width: 180,
                            tooltip: i18n.word.codeleiste()
                        }, {
                            header: i18n.word.verbauVon(),
                            dataIndex: 'verbauVon',
                            width: 70,
                            tooltip: i18n.word.verbauVon()
                        }, {
                            header: i18n.word.verbauBis(),
                            dataIndex: 'verbauBis',
                            width: 70,
                            flex: 1,
                            tooltip: i18n.word.verbauBis()
                        }],

                        emptyText: i18n.word.noRelatedVariants()
                    });
                    delete Ext.getStore('AweVarianteStore').getProxy().extraParams.aweId;
                    grid.up('awelist').setLoading(false);
                    customWindow.show();
                } else {
                    Ext.MessageBox.alert({
                        title: i18n.awe.message.errorTitle(),
                        msg: i18n.word.errorShowingVariants(),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    grid.up('awelist').setLoading(false);
                }
            },
            scope: this
        });
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
    setMassnahmeRelatedFields: function(firstSnr, form, mnDescFldName, mnTypFldName, mnTreiberFldName, mnZielterminFldName, keyValue) {

        if(!form) {
            form = this.getAweCreateWizard().getForm();
        }

        if(firstSnr.data) {
            var massnahmeFld = form.findField(mnDescFldName);
            var massnahmeTypeFld = form.findField(mnTypFldName);
            var massnahmeTreiberFld = form.findField(mnTreiberFldName);
            var massnahmeZielterminFld = form.findField(mnZielterminFldName);

            var massnahmeValue = firstSnr.data.massnahmeDescription;
            var massnahmeTypeValue = firstSnr.data.isInformelleMassnahme;
            var massnahmeTreiberValue;
            var massnahmeZielterminValue = firstSnr.data.zieltermin;

            if( firstSnr.getAssociatedData() ) {

                if( firstSnr.getAssociatedData().treiber ) {
                    massnahmeTreiberValue = firstSnr.getAssociatedData().treiber;
                }

                if( firstSnr.getAssociatedData().massnahme ) {
                    var massnahme = firstSnr.getAssociatedData().massnahme;

                    if(massnahme) {
                        massnahmeValue = massnahme.description;
                        massnahmeZielterminValue = massnahme.realizationOriginal;

                        if(massnahme.treiber ) {
                            massnahmeTreiberValue = massnahme.treiber;
                        }
                    }
                }
            }

            if(massnahmeFld) {
                massnahmeFld.setValue(massnahmeValue);
            }

            if(massnahmeTreiberFld && massnahmeTreiberValue && massnahmeTreiberValue.id) {
                var treiberStore = massnahmeTreiberFld.getStore();
                treiberStore.add(massnahmeTreiberValue);
                var record = treiberStore.findRecord("id", massnahmeTreiberValue.id);
                massnahmeTreiberFld.setValue(record);
                massnahmeTreiberFld.isSelected = true;
                massnahmeTreiberFld.validate();
            }

            if(massnahmeTypeFld) {
                var obj = new Object();
                obj[keyValue] = massnahmeTypeValue;
                massnahmeTypeFld.setValue(obj);
            }

            if(massnahmeZielterminFld) {
                massnahmeZielterminFld.setValue(massnahmeZielterminValue);
            }
        }
    },
    initBetrWerke: function(betrWerke, form) {
        if( betrWerke !== null && betrWerke !== undefined ) {
            var aweDialogController = this.getController('AweDialogController');
            var currentPositionIds = aweDialogController.getAllPositionIdsFromSNRs();
            var betroffeneWerkeField = form.findField('werkeList');

            if(betroffeneWerkeField !== null && betroffeneWerkeField !== undefined  ){

            	var betroffeneWerkeStore = betroffeneWerkeField.getStore();
                var werkIdsRaw = betrWerke.split(',');
                var werkIds = werkIdsRaw.map(function(string) {
                    return string.trim();
                });

                var status = form.getRecord().data.antragstatus;

                if (betroffeneWerkeStore.getCount() > 0) {
                    var records = betroffeneWerkeStore.getRange(0, betroffeneWerkeStore.getCount());
                    this.loadBetroffeneWerkField(records, werkIds, betroffeneWerkeField,status);
                } else {
                    betroffeneWerkeStore.getProxy().extraParams.positionIds = Ext.JSON.encode(currentPositionIds);
                    betroffeneWerkeStore.load({
                        scope: this,
                        params: {
                          positionIds: Ext.JSON.encode(currentPositionIds)
                        },
                        callback: function(records, operation, success) {
                            this.loadBetroffeneWerkField(records, werkIds, betroffeneWerkeField,status);
                        }
                    });
                }

            }

        }
    }
});
