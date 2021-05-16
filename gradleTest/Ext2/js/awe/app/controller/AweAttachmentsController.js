var keyMapDialog;
Ext.define('Awe.controller.AweAttachmentsController', {
    extend: 'Ext.app.Controller',
    requires: ['MDS.Utils.Misc', 'MDS.Utils.Response'],

    stores: ['Klassifikation', 'Prioritaet', 'WerkStore',
        'BzaTypStore', 'AenderungsartStore', 'PositionStore',
        'ProjektStore', 'TeilprojektStore', 'StuecklisteStore',
        'DialogProjektStore', 'AweVarianteStore', 'AttachmentStore'
    ],
    models: ['Awe', 'AweData', 'Klassifikation', 'Prioritaet', 'Werk',
        'Teil', 'BzaTyp', 'Aenderungsart', 'Position',
        'ProdStru', 'Projektbeteiligter', 'DialogProjekt','Anlauf', 'Attachment'
    ],
    views: ['awe.AweList', 'awe.AweAttachmentsWindow'],
    refs: [{
        ref: 'aweAttachmentsWindow',
        selector: 'aweattachmentswindow'
    }, {
    	ref : 'saveAttachmentButton',
    	selector: 'aweattachmentswindow #saveAttachmentButton'
    }, {
    	ref : 'attachmentsGrid',
    	selector: '#attachmentsGrid'
    }],
    init: function(application) {
        this.control({
            'aweattachmentswindow button[action=saveAttachment]': {
                click: this.saveAttachment
            },
            'aweattachmentswindow button[action=closeAttachmentsWindow]': {
                click: this.closeAttachmentsWindow
            },
            'aweattachmentswindow': {
                beforeshow: function(){
                	keyMapDialog.enable();
                },
                beforehide: function(){
                	keyMapDialog.disable();
                }
            },
            '*': {
            	openAttachmentsWindow: this.showAttachmentWindow,
            	downloadAttachment: this.downloadAttachment,
            	updateAttachment: this.updateAttachment,
            	deleteAttachment: this.deleteAttachment
            }
        });
    },
    showAttachmentWindow : function(record) {
    	var attachmentWindow = this.getAweAttachmentsWindow();
    	if (!attachmentWindow) {
    	    attachmentWindow = Ext.widget('aweattachmentswindow');
    	}

    	var form = attachmentWindow.down('form').getForm();

    	// set the hidden field for the awe's id
    	form.findField('contextid').setValue(record.get('id'));

    	var attachmentsGrid = Ext.getCmp('attachmentsGrid');
    	var attachmentStore = attachmentsGrid.getStore();
    	attachmentStore.load({
            params: {
                aweId: record.get('id')
            },
            callback: function(records, operation, success) {
            	if (records) {
                    if(records.length == 0) {
                	    attachmentsGrid.hide();
                	} else {
                	    attachmentsGrid.show();
                	}
                	attachmentWindow.show();
                }
            }
        });

    	// disable save and delete buttons if AWE is not in state erfasst + erfasst extern, beantragt (BUG-1013)
    	var recStatus = record.get('antragstatus');
    	if (recStatus !== 'ERFASST' && recStatus !== 'ERFASST_EXTERN' && recStatus !== 'BEANTRAGT'  && recStatus !== 'ZUR_PRUEFUNG') {
    		this.getAweAttachmentsWindow().mon(this.getAweAttachmentsWindow(), 'show', function() {
    			this.getSaveAttachmentButton().disable();
				var actionColumn = this.getAttachmentsGrid().getView().getHeaderCt().query('actioncolumn')[0];
				actionColumn.disableAction(1, true);
				actionColumn.disableAction(2, true);
    		}, this, {single: true});
    	} else {
    		this.getAweAttachmentsWindow().mon(this.getAweAttachmentsWindow(), 'show', function() {
    			this.getSaveAttachmentButton().enable();
	    		var actionColumn = this.getAttachmentsGrid().getView().getHeaderCt().query('actioncolumn')[0];
				actionColumn.enableAction(1, true);
				actionColumn.enableAction(2, true);
    		}, this, {single: true});
    	}
    },
    saveAttachment: function() {
        var attachmentWindow = this.getAweAttachmentsWindow();
        var form = attachmentWindow.down('form').getForm();
        var beschreibungField = form.findField('beschreibung');
        if(form.isValid()){
            form.submit({
                url: 'awe.anhang.upload.action',
                waitMsg: i18n.awe.form.uploadingAttachmentMsg(),
                success: function(form, action) {
                    beschreibungField.setValue('');
                    Ext.getStore('AttachmentStore').reload();
                    attachmentWindow.expand();
                    popupWindow(i18n.global.msg.save(), i18n.global.confirm.save());
                 },
                 failure: function(form, action) {
                     beschreibungField.setValue('');
                     popupWindow(i18n.global.msg.save(), action.result.errors, 'x-icon-error');
                 }
            });
        }

    },
    downloadAttachment: function(record) {
        window.open(jspScope.commonDownloadUrl() + record.get('anUrl'), "_blank");
    },

    updateAttachment: function(record) {
        var failureHandler = function() {
            popupWindow(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
        }

    	Ext.Ajax.request({
    	    scope: this,
    	    url: 'awe.anhang.update.action',
    	    method: 'POST',
    	    params: {
        		attachmentId: record.get('anId'),
        		anBeschreibung: record.get('anBeschreibung'),
    	    },
    	    success: function(response, action) {
        		if (MDS.Utils.Response.isSuccessful(response)) {
        		    Ext.getStore('AttachmentStore').reload();
                    popupWindow(i18n.global.msg.save(), i18n.global.confirm.save());
        		} else {
        		    this.getAweCreateDialog().setLoading(false);
        		    failureHandler();
        		}
    	    },
    	    failure: failureHandler
    	});
    },
    deleteAttachment: function(record) {
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
            			    Ext.getStore('AttachmentStore').reload();
                            popupWindow(i18n.awe.form.deleteTitle(), i18n.global.confirm.deleteMsg());
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
    closeAttachmentsWindow: function() {
        this.getAweAttachmentsWindow().close();
    }
});