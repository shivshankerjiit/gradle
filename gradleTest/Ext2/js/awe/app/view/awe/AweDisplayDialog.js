Ext.define('Awe.view.awe.AweDisplayDialog', {
    extend: 'Ext.window.Window',
    requires: ['UX.form.field.ClearButton',
        'MDS.form.field.ProjektbeteiligterCombobox',
        'UX.form.field.CheckboxListCombo'
    ],
    alias: 'widget.awedisplaydialog',
    id: 'awedisplaydialog',
    modal: true,
    //    bodyPadding: 5,
    border: false,
    bodyStyle: 'background: #FFF',
    closable: true,
    closeAction: 'hide',
    layout: 'absolute',
    resizable: false,
    draggable: true,
    constrain: true,
    overflowY: 'auto',
    height: 580,
    width: 980,
    title: i18n.awe.form.createtitle(),
    items: [{
        xtype: 'awedisplaypanel'
    }],

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