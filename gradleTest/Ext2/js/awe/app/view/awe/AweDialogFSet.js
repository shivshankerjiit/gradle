Ext.define('Awe.view.awe.AweDialogFSet', {
    extend: 'Ext.form.FieldSet',
    itemId: 'awedialogfset',
    alias: 'widget.awedialogfset',

//    title: "AWE",

    border: false,
    margins: '10 10 0 10',
    padding: '0 0 10 10',
    collapsible: false,
    layout: {
        type: 'vbox',
        align: 'left'
    },

    resizable: false,
    layout: 'vbox',
    items: [{
                /** ***** Fieldcontainer 1 ***** * */
	xtype: 'fieldcontainer',
	border: true,
	layout: {
	    type: 'hbox',
	    align: 'left'
	},
	defaults: {
	    margins: '10 10 0 0',
	    labelWidth: 115,
	    labelAlign: 'left',
	    width: 297
	},
	items: [{
	    xtype: 'datefield',
	    name: 'erfassung',
	    itemId: 'erfassung',
	    readOnly: true,
	    fieldLabel: i18n.awe.form.entryDate(),
	    format: i18n.awe.word.defaultDateFormat(),
	    getSubmitData: function(){
	    	return getDataForDates(this);
	    }
	}, {
	    xtype: 'datefield',
	    name: 'beantragung',
	    itemId: 'beantragung',
	    readOnly: true,
	    fieldLabel: i18n.awe.form.applicationDate(),
	    format: i18n.awe.word.defaultDateFormat(),
	    getSubmitData: function(){
	    	return getDataForDates(this);
	    }
	}, {
	    xtype: 'datefield',
	    name: 'genehmigung',
	    itemId: 'genehmigung',
	    readOnly: true,
	    fieldLabel: i18n.awe.form.approvalDate(),
//	    width: 288,
	    labelWidth: 117,
	    format: i18n.awe.word.defaultDateFormat(),
	    getSubmitData: function(){
	    	return getDataForDates(this);
	    }
	}]
    }, {
	/** ***** Fieldcontainer 2 ***** * */
	xtype: 'fieldcontainer',
	layout: {
	    type: 'hbox',
	    align: 'left'
	},
	defaults: {
	    margins: '10 10 0 0',
	    labelWidth: 115,
	    labelAlign: 'left',
	    width: 297
	},
	items: [{
	    xtype: 'textfield',
	    name: 'geprueftVon',
	    itemId: 'geprueftVon',
	    readOnly : true,
	    fieldLabel: i18n.awe.form.checkedBy()
	}, {
	    xtype: 'textfield',
	    name: 'genehmigtVon',
	    itemId: 'genehmigtVon',
	    readOnly : true,
	    fieldLabel: i18n.awe.form.approvedBy()
	}, {
	    xtype: 'textfield',
	    name: 'dokumentiertVon',
	    itemId: 'dokumentiertVon',
	    readOnly : true,
//	    width: 288,
	    labelWidth: 117,
	    fieldLabel: i18n.awe.form.documentedBy()
	}, {
	    xtype: 'hiddenfield',
	    name: 'placeholder',
	    itemId: 'placeholder'
	}]
    }, {
	/** ***** Fieldcontainer 3 ***** * */
	xtype: 'fieldcontainer',
	layout: {
	    type: 'hbox',
	    align: 'stretch'
	},
	defaults: {
	    margins: '10 10 0 0',
	    labelWidth: 115,
	    labelAlign: 'left'
	},
	items: [{
	    xtype: 'textareafield',
	    width: 910,
	    name: 'aweInfo',
	    grow: true,
	    itemId: 'aweInfo',
	    fieldLabel: i18n.awe.form.returnedInfo(),
	    readOnly: true,
	    anchor: '100%'
	}]
//	,
//	listeners: {
//	    'select': function(combo, records, eOpts) {
//		var form = this.findParentByType('form').getForm();
//		var record = records[0];
//		if (record.get('id') == i18n.awe.form.grund.componentNotSampledId()) {
//		    form.findField('sonderprozessBemusterung').setValue(true);
//		} else {
//		    form.findField('sonderprozessBemusterung').setValue(false);
//		}
//	    }
//	}
    }],
    initComponent: function() {
	this.callParent(arguments);
    }
});