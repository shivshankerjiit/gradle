Ext.define('Awe.controller.wizardpages.MdsController', {
	extend: 'Ext.app.Controller',
	requires: [],
	stores: [],
	models: [],
	views: [],

	refs: [{
		ref: 'aweCreateWizard',
		selector: 'awecreatewizard'
	}, {
		ref: 'snrPage',
		selector: 'awecreatedialogwz awesnrfset'
	}, {
		ref: 'mdsPage',
		selector: 'awecreatedialogwz awemdsfset'
	}, {
		ref: 'nextButton',
		selector: 'awecreatedialogwz awecreatewizard #next'
	}, {
		ref: 'backButton',
        selector: 'awecreatedialogwz awecreatewizard #previous'
    }, {
		ref: 'saveAweButton',
		selector: 'awecreatedialogwz awecreatewizard #save'
	}, {
		ref: 'dialogProjektField',
		selector: 'awecreatedialogwz awemdsfset #dialogProjekt'
	}, {
		ref: 'teilProjektField',
		selector: 'awecreatedialogwz awemdsfset #teilprojektId'
	}, {
		ref: 'mdsProjektField',
		selector: 'awecreatedialogwz awemdsfset #projektId'
	}, {
		ref: 'anlaufField',
		selector: 'awecreatedialogwz awemdsfset #stuecklisteId'
	}, {
		ref: 'treiberField',
		selector: 'awecreatedialogwz awemdsfset #treiber'
	}, {
		ref: 'zielterminField',
		selector: 'awecreatedialogwz awemdsfset #zieltermin'
	}, {
		ref: 'massnahmeField',
		selector: 'awecreatedialogwz awemdsfset #massnahmeId'
	}],


	init: function() {
		this.control({
			'awecreatedialogwz awemdsfset #projektId': {
				select: this.onMdsProjektSelect,
				change: this.onProjektChange
			},
			'awecreatedialogwz awemdsfset #teilprojektId': {
				select: this.onTeilProjektSelect,
				change: this.onTeilProjektChange
			},
			'awecreatedialogwz awemdsfset #stuecklisteId': {
				beforeselect: this.beforeAnlaufSelect,
				change: {
					fn: this.onAnlaufChange,
					buffer: 150
				}
			},
			'awecreatedialogwz awemdsfset #aweWizardUploadBtn': {
				click: this.onUploadClick
			},
			'awecreatewizard awemdsfset #massnahmeId': {
				// validitychange: this.onValidityChange,
				errorchange: this.onErrorChange
			},
			'awecreatewizard awemdsfset #dialogProjekt': {
				validitychange: this.onValidityChange
					// errorchange: this.onErrorChange
			},
			'awecreatewizard awemdsfset #treiber': {
				select: this.onDropdownSelect,
				// validitychange: this.onValidityChange,
				change: this.onTreiberChange,
				errorchange: this.onErrorChange
			},
			'awecreatewizard awemdsfset #radioErstellen': {
				change: this.onMassnahmeTypeChange,
				enable: this.onRadioErstellenEnable
			},
			'awecreatewizard awemdsfset #zieltermin': {
				// validitychange: this.onValidityChange,
				errorchange: this.onErrorChange
			}
		});
	},

	onTeilProjektSelect: function(combo, records, eOpts) {
		var form = this.getAweCreateWizard().getForm()
		var record = records[0];
		var anlaufStore = Ext.getStore('StuecklisteStore');
		var teilId = Ext.getStore('SachnummerStore').getAt(0).get('teil').id;

		// set anlaufField loading and populate its store
		form.findField('stuecklisteId').setLoading(true);
		anlaufStore.load({
			params: {
				teil: teilId,
				apjId: form.findField('projektId').getValue(),
				tpjId: record.get('pdsId')
			},
			callback: function(records, operation, success) {
				form.findField('stuecklisteId').setLoading(false);
			}
		});
	},

	onMdsProjektSelect: function(combo, records, eOpts) {
		var form = this.getAweCreateWizard().getForm()
		var record = records[0];
		var teilprojectStore = Ext.getStore('TeilprojektStore');
		var teilId = Ext.getStore('SachnummerStore').getAt(0).get('teil').id;

		// set teilProjektField loading and populate its store
		form.findField('teilprojektId').setLoading(true);
		teilprojectStore.load({
			params: {
				teil: teilId,
				apjId: record.get('pdsId')
			},
			callback: function(records, operation, success) {
				form.findField('teilprojektId').setLoading(false);
			}
		});
	},

	beforeAnlaufSelect: function(combo, record, index, eOpts) {
		if (record.get('pdsId') == -1) {
			return false;
		}
	},

	onAnlaufChange: function(combo, record, index, eOpts) {
		var store = combo.getStore();
		store.clearFilter();
		store.filter({
			property: 'searchField',
			anyMatch: true,
			value: combo.getRawValue()
		});
		if (combo.getValue() === null) {
			combo.reset();
		}
	},

	showWizzardAttachmentWindow: function() {
		if (aweEditObject && isAweInEditMode) {
			var aweAttachmentsController = this.getController("AweAttachmentsController");
			aweAttachmentsController.showAttachmentWindow(aweEditObject);
		} else {
			var attachmentWindow = Ext.ComponentQuery.query('#uploadAttachmentWindow')[0];
			if (!attachmentWindow) {
				attachmentWindow = this.createAttachmentWindow();
			}

			var aweDialogController = this.getController("AweDialogController");
			var list = aweDialogController.attachments.join();
			var form = attachmentWindow.down('form').getForm();
			//set the hidden field for the awe's id
			form.findField('listAttachments').setValue(list);

			var arrayFromController = aweDialogController.attachments;
			var arrayIds = Ext.JSON.encode(arrayFromController);

			var attachmentsGrid = Ext.getCmp('wizzardAttachmentsGrid');
			var attachmentStore = attachmentsGrid.getStore();

			attachmentStore.load({
				params: {
					arrayAttachments: arrayIds
				},
				callback: function(records, operation, success) {
					if (records) {
						if (records.length == 0) {
							attachmentsGrid.hide();
						} else {
							attachmentsGrid.show();
						}
						attachmentWindow.show();
					} else {
						attachmentsGrid.hide();
						attachmentWindow.show();
					}
				}
			});
		}
	},

	createAttachmentWindow: function() {
		var controller = this;
		var aweDialogController = this.getController("AweDialogController");
		var attachmentWindow = Ext.create('Ext.window.Window', {
			title: i18n.awe.form.attachmentLabel(),
			id: 'uploadAttachmentWindow',
			modal: true,
			width: 450,
			height: 250,
			bodyPadding: 10,
			border: false,
			bodyStyle: 'background: #FFF',
			closable: true,
			closeAction: 'hide',
			layout: 'absolute',
			resizable: true,
			draggable: false,
			overflowY: 'auto',
			overflowX: 'auto',
			tbar: {
				height: 36,
				defaults: {
					xtype: 'button',
					minWidth: 34,
					minHeight: 34,
				},
				items: [{
					tooltip: i18n.message.clear.selection.close.win(),
					iconCls: 'imgButtonCloseToolbar',
					handler: function() {
						this.up('window').down('form').id = '';
						this.up('window').down('form').getForm().reset();
						this.up('window').hide();
					}
				}, {
					tooltip: i18n.global.msg.save() + ' (Alt+S)',
					iconCls: 'imgButtonSave',
					handler: function() {
						this.up('window').down('form').id = 'fileUploadForm';
						aweDialogController.uploadAttachment();
					}
				}]
			},
			//Start items
			items: [{
				xtype: 'form',
				id: 'wizzardAttachmentForm',
				border: false,

				items: [{
					xtype: 'hiddenfield',
					name: 'listAttachments'
				}, {
					xtype: 'fieldset',
					border: true,
					collapsible: false,
					bodyStyle: 'border: 2px solid #00417F',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					defaults: {
						width: 374,
						labelWidth: 120,
						labelAlign: 'left'
					},
					items: [{
						xtype: 'filefield',
						id: 'attachmentWz',
						name: 'file',
						allowBlank: false,
						fieldLabel: i18n.awe.form.anhang(),
						buttonText: i18n.awe.form.auswaehlen()
					}, {
						xtype: 'textfield',
						fieldLabel: i18n.global.msg.description(),
						name: 'beschreibung'
					}]

				}, {
					xtype: 'grid',
					id: 'wizzardAttachmentsGrid',
					name: 'wizzardAttachmentsGrid',
					title: i18n.awe.form.attachmentLabel(),
					width: 410,
					defaults: {
						sortable: false
					},
					store: 'AttachmentStore',
					multiSelect: false,
					columns: [{
						xtype: 'actioncolumn',
						width: 90,
						items: [{ //download
							iconCls: 'x-btn-download margin-right-10',
							tooltip: i18n.awe.form.downloadAttachment(),
							handler: function(grid, rowIndex, colIndex) {
								var record = grid.getStore().getAt(rowIndex);
								this.fireEvent('downloadAttachment', record);
							}
						}, { //save
							iconCls: 'x-btn-save margin-right-10',
							tooltip: i18n.global.msg.save(),
							handler: function(grid, rowIndex, colIndex) {
								var record = grid.getStore().getAt(rowIndex);
								this.fireEvent('updateAttachment', record);
							}
						}, { //delete
							iconCls: 'x-btn-delete',
							tooltip: i18n.global.msg['delete'](),
							handler: function(grid, rowIndex, colIndex) {
								var record = grid.getStore().getAt(rowIndex);
								aweDialogController.deleteAttachmentWz(record);
								//controller.deleteAttachmentWz(record);
							}
						}]
					}, {
						text: i18n.global.msg.description(),
						dataIndex: 'anBeschreibung',
						tooltip: i18n.global.msg.description(),
						width: 230,
						editor: {
							allowBlank: true
						}
					}, {
						text: i18n.word.datum(),
						dataIndex: 'anErfasst',
						tooltip: i18n.word.datum(),
						width: 80
					}],
					plugins: Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				}]
			}]
		});
		return attachmentWindow;
	},

	onUploadClick: function() {
		this.showWizzardAttachmentWindow();
	},
	validatePage: function(fieldset) {
		var fieldsIsValid = true;
		var fields = fieldset.query('textfield, textareafield, combobox, datefield');
		for (var i = 0; i < fields.length; i++) {
			if (!fields[i].isValie() && fieldsIsValid) {
				fieldsIsValid = false;
			}
		}

		return fieldsIsValid;
	},
	onDropdownSelect: function(combo) {
		combo.isSelected = true;
		combo.validate();
	},
	onMassnahmeTypeChange: function(radioField, newValue, oldValue, eOpts) {

		var awemdsfset = radioField.up('awemdsfset');
		if (newValue) {
			awemdsfset.down('#treiber').setDisabled(false);
			awemdsfset.down('#zieltermin').setDisabled(false);
		} else {
			awemdsfset.down('#treiber').setDisabled(true);
			awemdsfset.down('#zieltermin').setDisabled(true);
		}
	},
	onTreiberChange: function(combobox) {
		if (combobox.getValue() === null) {
			combobox.reset();
			combobox.isSelected = false;
		}
	},
	onTreiberValidChange: function(el, isValid) {
		this.checkAllHasExceptBlankError();
	},
	checkAllExceptBlankErrorValid: function() {
		var isExceptBlankValid = true;
		var isValidFields = [this.getDialogProjektField()]; /*, this.getTeilProjektField(), this.getMdsProjektField(), this.getAnlaufField() these fields does not require validation so far, because they are force selection*/

		Ext.each(isValidFields, function(el) {
			if (el.getActiveErrors().length != 0) {
				isExceptBlankValid = false;
				return;
			}
		}, this);

		if (isExceptBlankValid) {
			var isValidExceptBlankErrFields = [this.getMassnahmeField(), this.getTreiberField(), this.getZielterminField()];
			Ext.each(isValidExceptBlankErrFields, function(el) {
				if (!this.checkExceptBlankErrorValid(el)) {
					isExceptBlankValid = false;
					return;
				}
			}, this);
		}

		return isExceptBlankValid;
	},
	checkExceptBlankErrorValid: function(field) {
		if (field.getActiveErrors().length == 0) {
			return true;
		} else {
			if (field.getActiveErrors().length == 1 && field.getActiveErrors()[0] == field.blankText) {
				return true;
			} else {
				return false;
			}
		}
	},
	checkAllValid: function(fieldset) {
		var fieldsIsValid = true;
		var fields = fieldset.query('textfield, textareafield, combobox, datefield');
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].getActiveErrors().length != 0 && fieldsIsValid) {
				fieldsIsValid = false;
			} else {

			}
		}

		return fieldsIsValid;
	},
	onValidityChange: function(el, isValid) {
		var currentPage = this.getAweCreateWizard().layout.activeItem;
		if (currentPage && currentPage.getXType() == 'awemdsfset') {
			if (isValid) {
				if (this.checkAllExceptBlankErrorValid()) {
					this.getSaveAweButton().setDisabled(false);
					this.getBackButton().setDisabled(false);
					if (this.checkAllValid(this.getMdsPage())) {
						this.getNextButton().setDisabled(false);
					}
				}
			} else {
				this.getNextButton().setDisabled(true);
				if (!this.checkAllExceptBlankErrorValid()) {
					this.getSaveAweButton().setDisabled(true);
				}
			}
		}
	},
	onErrorChange: function(el, error) {
		var currentPage = this.getAweCreateWizard().layout.activeItem;
		if (currentPage && currentPage.getXType() == 'awemdsfset') {
			if (!error) {
				if (this.checkAllExceptBlankErrorValid()) {
					this.getSaveAweButton().setDisabled(false);
					this.getBackButton().setDisabled(false);
					if (this.checkAllValid(this.getMdsPage())) {

						this.getNextButton().setDisabled(false);

					}
				}
			} else {
				if (this.checkAllExceptBlankErrorValid()) {
					this.getSaveAweButton().setDisabled(false);
					this.getBackButton().setDisabled(false);
				} else {
					this.getSaveAweButton().setDisabled(true);
				}
				this.getNextButton().setDisabled(true);
				// this.validateOtherWithNoErr(el.getItemId()); //Necessacary not to make self validation in this event handlin because it will trigger endless loop
			}
		}
	},
	// validateOtherWithNoErr: function(fieldItemId) {
	// 	var fieldsForValidation = [this.getMassnahmeField(), this.getTreiberField(), this.getZielterminField()];
	// 	Ext.each(fieldsForValidation, function(el) {
	// 		if (el.getActiveErrors().length == 0 && el.getItemId() != fieldItemId) {
	// 			el.isValid();
	// 		}
	// 	}, this);
	// },
	onTeilProjektChange: function(combo) {
		if (combo.getValue() === null) {
			combo.reset();
			var stueckliste = null;
			Ext.getCmp('radioInformelle').setValue(true);
			Ext.getCmp('radioErstellen').disable();
			if (combo.up().up().query('#stuecklisteId')) {
				stueckliste = combo.up().up().query('#stuecklisteId').first();
			}
			if (stueckliste) {
				stueckliste.getStore().removeAll();
				stueckliste.reset();

			}
		} else {
			// Ext.getCmp('radioInformelle').enable();
			Ext.getCmp('radioErstellen').enable();
		}
	},

	onProjektChange: function(combo) {
		if (combo.getValue() === null) {
			combo.reset();
			var teilProjekt = null;
			if (combo.up().up().query('#teilprojektId')) {
				teilProjekt = combo.up().up().query('#teilprojektId').first();
			}
			if (teilProjekt) {
				teilProjekt.getStore().removeAll();
				teilProjekt.reset();
			}
		}
	},
	/*Handle the case when teilprojekt is initialy loaded in edit mode and the massnahme is checked */
	onRadioErstellenEnable: function(button) {

		if (button.getValue()) {
			this.getMdsPage().down('#treiber').enable();
			this.getMdsPage().down('#zieltermin').enable();
		}
	}
});