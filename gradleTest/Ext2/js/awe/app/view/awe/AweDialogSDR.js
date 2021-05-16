Ext.define('Awe.view.awe.AweDialogSDR', {
    extend: 'Ext.form.FieldSet',
    itemId: 'awedialogsdr',
    alias: 'widget.awedialogsdr',

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
                /** ***** Fieldcontainer ***** * */
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
	    name: 'kemStart',
	    itemId: 'kemStart',
	    readOnly: true,
	    fieldLabel: i18n.awe.grid.kemStart(),
	    format: i18n.awe.word.defaultDateFormat()
	}, {
	    xtype: 'datefield',
	    name: 'kemEnde',
	    itemId: 'kemEnde',
	    readOnly: true,
	    fieldLabel: i18n.awe.grid.kemEnde(),
	    format: i18n.awe.word.defaultDateFormat()
	}]
    }, {
	/** ***** Fieldcontainer ***** * */
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
	    name: 'artAntrag',
	    itemId: 'artAntrag',
	    readOnly : true,
	    fieldLabel: i18n.awe.grid.artAntrag()
	}, {
	    xtype: 'textfield',
	    name: 'anwendungsfall',
	    itemId: 'anwendungsfall',
	    readOnly : true,
	    fieldLabel: i18n.awe.grid.anwendungsfall()
	}]
    }, {
	/** ***** Fieldcontainer ***** * */
	xtype: 'fieldcontainer',
	layout: {
	    type: 'hbox',
	    align: 'stretch'
	},
	defaults: {
	    margins: '10 10 0 0',
	    labelWidth: 115,
	    labelAlign: 'left',
	    width: 297
	},
	items:[{
	    xtype: 'textfield',
	    name: 'vorgenger',
	    itemId: 'vorgenger',
	    readOnly : true,
	    fieldLabel: i18n.awe.grid.vorgenger()
	}, {
	    xtype: 'textfield',
	    name: 'nachfolger',
	    itemId: 'nachfolger',
	    readOnly : true,
	    fieldLabel: i18n.awe.grid.nachfolger()
	}]
    }, {
    	/** ***** Fieldcontainer ***** * */
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
    	items:[{
    		xtype: 'textareafield',
    	    width: 910,
    	    name: 'grundDetailEN',
    	    grow: true,
    	    itemId: 'grundDetailEN',
    	    fieldLabel: i18n.awe.grid.grundDetailEN(),
    	    readOnly: true,
    	    anchor: '100%'
    	}]
    	}, {
        	/** ***** Fieldcontainer  ***** * */
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
        	items:[{
        		xtype: 'textareafield',
        	    width: 910,
        	    name: 'abweichungsGrundEN',
        	    grow: true,
        	    itemId: 'abweichungsGrundEN',
        	    fieldLabel: i18n.awe.grid.abweichungsGrundEN(),
        	    readOnly: true,
        	    anchor: '100%'
        	}]
        	}],
    initComponent: function() {
	this.callParent(arguments);
    }
});