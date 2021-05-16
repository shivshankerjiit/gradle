Ext.define('Awe.view.awe.displaypanel.AweDisplayVerteilerFSet', {
    extend: 'Ext.form.FieldSet',
    itemId: 'awedisplayverteilerfset',
    alias: 'widget.awedisplayverteilerfset',

    //    title: "AWE",

    resizable: false,
    layout: 'vbox',
    margins: '0 10 0 10',
    padding: '10 10 5 20',
    border: false,

    items: [{
        xtype: 'grid',
        itemId: 'additionalReceiversGrid', // TODO: changed to itemId from id //Refactoring - clearAll and clearSelected methods: change id references previous id- 
        margins: '10 0 5 0',
        labelWidth: 160,
        title: i18n.awe.form.additionalReceiversList(),
        height: 158,
        width: 910,
        defaults: {
            sortable: false
        },
        multiSelect: true,
        columns: [{
            text: i18n.awe.form.grid.name(),
            dataIndex: 'name',
            tooltip: i18n.awe.form.grid.name(),
            width: 179
        }, {
            text: i18n.awe.form.grid.vorname(),
            dataIndex: 'vorname',
            tooltip: i18n.awe.form.grid.vorname(),
            width: 179
        }, {
            text: i18n.awe.form.grid.department(),
            dataIndex: 'abteilung',
            tooltip: i18n.awe.form.grid.department(),
            width: 179
        }, {
            text: i18n.awe.form.grid.email(),
            dataIndex: 'email',
            tooltip: i18n.awe.form.grid.email(),
            width: 179
        }, {
            text: i18n.awe.form.grid.phone(),
            dataIndex: 'phone',
            tooltip: i18n.awe.form.grid.phone(),
            width: 177
        }],
        store: Ext.create('Ext.data.Store', {
            storeId: 'DispAdditionalReceiversStore',
            model: 'Awe.model.Projektbeteiligter'
        })
    }, {
        margins: '10 0 0 0',
        xtype: 'grid',
        itemId: 'distributorGroupsGrid', // previous id-verteilerGruppenGrid // TODO: changed to itemId from id
        title: i18n.awe.form.vertGruppenList(),
        labelAlign: 'left',
        height: 158,
        width: 910,
        store: Ext.create('Ext.data.Store', {
            storeId: 'DispVerteilergruppenStore',
            model: 'Awe.model.Projektbeteiligter'
        }),
        defaults: {
            sortable: false
        },
        multiSelect: true,
        columns: [{
            text: i18n.awe.form.grid.name(),
            dataIndex: 'name',
            width: 179,
            tooltip: i18n.awe.form.grid.name()
        }, {
            text: i18n.awe.form.grid.vorname(),
            dataIndex: 'vorname',
            width: 179,
            tooltip: i18n.awe.form.grid.vorname()
        }, {
            text: i18n.awe.form.grid.department(),
            dataIndex: 'abteilung',
            width: 179,
            tooltip: i18n.awe.form.grid.department()
        }, {
            text: i18n.awe.form.grid.email(),
            dataIndex: 'email',
            width: 179,
            tooltip: i18n.awe.form.grid.email()
        }, {
            text: i18n.awe.form.grid.phone(),
            dataIndex: 'phone',
            width: 177,
            tooltip: i18n.awe.form.grid.phone()
        }]
    }],
    initComponent: function() {
        this.callParent(arguments);
    }
});