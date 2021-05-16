Ext.define('Awe.view.awe.AweCreateDialog', {
    extend: 'Ext.window.Window',
    requires: ['UX.form.field.ClearButton',
        'MDS.form.field.ProjektbeteiligterCombobox',
        'UX.form.field.CheckboxListCombo'
    ],
    alias: 'widget.awecreatedialog',
    id: 'awecreatedialog',
    modal: true,
    bodyPadding: 5,
    border: false,
    bodyStyle: 'background: #FFF',
    closable: false,
    closeAction: 'hide',
    layout: 'absolute',
    resizable: false,
    draggable: true,
    constrain: true,
    overflowY: 'auto',
    height: 620,
    width: 980,
    title: i18n.awe.form.createtitle(),
    items: [{
        xtype: 'awecreatepanel'
    }],
    tbar: {
	height: 36,
        defaults: {
            xtype: 'button',
            minWidth: 34,
            minHeight: 34,
            margin: '1 1 1 1'
        },
        items: [{
   		iconCls: this.window ? 'imgButtonCloseToolbar' : 'imgButtonBack',
	        itemId: 'backButton',
	        id: 'backButton',
	        tooltip: i18n.global.msg.back() + ' (Alt+Z)',
	        action: 'back',
	        margin: '1 14 1 1'
	    }, {
	        iconCls: 'imgButtonSave',
	        itemId: 'saveButton',
	        id: 'saveButton',
	        tooltip: i18n.global.msg.save() + ' (Alt+S)',
	        action: 'save'
	    }, {
	        iconCls: 'imgButtonReset',
	        itemId: 'resetButton',
	        id: 'resetButton',
	        tooltip: i18n.global.msg.resetform() + ' (Alt+R)',
	        action: 'reset'
	    }]
    },
    listeners: {
        beforeshow: function() {
            this.center();
        }
    },
    initComponent: function() {
        this.constrainTo = Ext.getBody();
        this.callParent(arguments);
    }
});