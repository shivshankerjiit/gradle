Ext.define('Awe.view.awe.AweViewport', {
    extend: 'Ext.container.Container',

    itemId: 'aweHolder',
    alias: 'widget.aweHolder',
    id: 'aweHolder',

    requires: [
               'Awe.view.awe.AweTopPanel',
               'Awe.view.awe.AweList',
               'Awe.view.awe.AweCreateDialog',
               'Awe.view.awe.AweCreateDialogWz',
               'Awe.view.awe.AweDisplayDialog'
    ],

    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    border: 0,
    renderTo: 'aweHolder',

    initComponent: function() {
        this.items = [{
	    	xtype: 'awetoppanel'
	    }, {
	        xtype: 'awelist'
	    }, {
	        xtype: 'awecreatedialog'
	    }, {
	        xtype: 'awecreatedialogwz'
	    }, {
	        xtype: 'awedisplaydialog'
	    }];

        this.callParent();
    }
});