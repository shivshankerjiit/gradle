Ext.define('Awe.view.awe.AweDisplayPanel', {
    id: 'aweDisplayPanel',
    extend: 'Ext.form.Panel',
    requires: ['UX.form.field.ClearButton', 'MDS.form.field.ProjektbeteiligterCombobox'],
    alias: 'widget.awedisplaypanel',
    border: false,
    //    aweTeilObject: Ext.ModelManager.getModel('Awe.model.Teil'),
    //    layout:  {
    //        type: 'vbox',
    //        align: 'left'
    //    },
    layout: 'card',
    activeItem: 0,
    currentItem: 0,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        baseCls: '',
        cls: 'x-tbar-tabpanel-white',
        defaults: {
            overCls: 'tablike-button-active-o',
            focusCls: 'tablike-button-active-f',
            pressedCls: 'tablike-button-active-p',
            cls: 'tablike-button',
            toggleGroup: 'fsets',
            allowToggle: true,
            allowDepress: false
        },
        items: [{
            text: i18n.awe.form.snrtitle(),
            itemId: '0'
        }, {
            text: i18n.awe.form.awetitle(),
            itemId: '1'
        }, {
            text: i18n.awe.form.mdstitle(),
            itemId: '2'
        }, {
            text: i18n.awe.form.verteilertitle(),
            itemId: '3'
        }, {
            text: i18n.awe.form.pdrstitle(),
            itemId: '4'
        }, {
            text: i18n.awe.form.dialogtitle(),
            itemId: '5'
        }, {
            text: i18n.awe.grid.sdr(),
            itemId: '6'
        }]
    }],
    items: [{
        xtype: 'awedisplaysnrfset'
    }, {
        xtype: 'awedisplaygeneralfset'
    }, {
        xtype: 'awedisplaymdsfset'
    }, {
        xtype: 'awedisplayverteilerfset'
    }, {
        xtype: 'awedisplaypdrsfset'
    }, {
        xtype: 'awedialogfset'
    }, {
        xtype: 'awedialogsdr'
        //padding: '0 0 10 20'
    }],
    initComponent: function() {
        this.callParent(arguments);
    }

});