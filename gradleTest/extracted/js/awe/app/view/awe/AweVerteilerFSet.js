Ext.define('Awe.view.awe.AweVerteilerFSet', {
    extend: 'Ext.form.FieldSet',
    itemId: 'aweverteilerfset',
    alias: 'widget.aweverteilerfset',

//    title: "AWE",

	layout: {
		type: 'vbox',
		align: 'stretch'
	},
    margins: '0 10 0 10',
    padding: '0 10 5 10',
    resizable: false,
	border: false,
	collapsible: false,

    items: [//{
//    	xtype: 'fieldset',
//	margins: '0 0 10 0',
//	,
//	layout: {
//	    type: 'vbox',
//	    align: 'stretch'
//	},
//	items:[
	{
            /** ***** Fieldcontainer 5 ***** * */
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'left'
            },
            defaults: {
        	labelWidth: 160,
                labelAlign: 'left',
                margins: '0 0 10 0',
                width: 500
            },
            items: [{
                xtype: 'pjbCombobox',
                onlyActiveUsers: true,
                itemId: 'additionalReceivers',
                name: 'additionalReceivers',
                listeners: {
                    render: function(c) {
                        new Ext.ToolTip({
                            target: c.getEl(),
                            html: i18n.awe.form.additionalReceiversApproval.Tooltip()
                        });
                    }
                },
                fieldLabel: i18n.awe.form.additionalReceiversApproval(),
//                plugins: new UX.form.field.ClearButton({
//                    hideClearButtonWhenEmpty: true
//                }),
                minWidth: 280//,
//                listeners: {
//                    select: function(combo, record, index) {
//                        var store = Ext.getStore('ProjektbeteiligterGrid');
//                        var isRecordExists = store.find('id', record[0].get('id'));
//                        if (isRecordExists == -1) {
//                            store.add(record);
//                            store.sync();
//                        }
//                        combo.clearValue();
//                    }
//                }
            }]
        },{
            /** ***** Fieldcontainer 6 ***** * */
            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                width: 285
            },
            items: [{
                xtype: 'grid',
                id: 'additionalReceiversGrid', //Refactoring - clearAll and clearSelected methods: change id references previous id-
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
                    tooltip:  i18n.awe.form.grid.email(),
                    width: 179
                }, {
                    text: i18n.awe.form.grid.phone(),
                    dataIndex: 'phone',
                    tooltip: i18n.awe.form.grid.phone(),
                    width: 177
                }],
                store: Ext.create('Ext.data.Store', {
                        storeId: 'AdditionalReceiversStore',
                        model: 'Awe.model.Projektbeteiligter'
                    })
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'end'
                },
                defaults: {
                    margins: '13 0 10 10'
                },
                items: [{
                    xtype: 'button',
                    text: i18n.awe.form.grid.removeAll(),
                    action: 'clearAllAdditReceivers'
                }, {
                    xtype: 'button',
                    text: i18n.awe.form.grid.removeSelection(),
                    action: 'removeSelectedAdditReceivers'
                }]
            }]
        }//]
//    }/** end of fieldset verteiler*/
//        ,{
//	xtype: 'fieldset',
//	padding: '10 10 0 10',
//	layout: {
//	    type: 'vbox',
//	    align: 'stretch'
//	},
//	items:[
	,{
            /** ***** Fieldcontainer 7 ***** * */
            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox',
                align: 'left'
            },
            defaults: {
                labelWidth: 160,
                labelAlign: 'left',
                margins: '0 0 10 0',
                width: 500
            },

            items: [{
                xtype: 'pjbCombobox',
                onlyActiveUsers: true,
                itemId: 'distributorGroups',
                name: 'distributorGroups',
                listeners: {
                    render: function(c) {
                        new Ext.ToolTip({
                            target: c.getEl(),
                            html: i18n.awe.form.vertAntragsdaten.Tooltip()
                        });
                    }
                },
                fieldLabel: i18n.awe.form.vertAntragsdaten(),
                minWidth: 280//,
//                listeners: {
//                    select: function(combo, record, index) {
//                        var store = Ext.getStore('VerteilergruppenGrid');
//                        var isRecordExists = store.find('id', record[0].get('id'));
//                        if (isRecordExists == -1) {
//                            store.add(record);
//                            store.sync();
//                        }
//                        combo.clearValue();
//                    }
//                }
            },{
                /** ***** Fieldcontainer 8 ***** * */
                xtype: 'fieldcontainer',
                width: 910,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'grid',
                    id: 'distributorGroupsGrid', // previous id-verteilerGruppenGrid
                    title: i18n.awe.form.vertGruppenList(),
                    height: 158,
                    width: 910,
                    store: Ext.create('Ext.data.Store', {
                        storeId: 'VerteilergruppenStore',
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
                        tooltip:  i18n.awe.form.grid.email()
                    }, {
                        text: i18n.awe.form.grid.phone(),
                        dataIndex: 'phone',
                        width: 177,
                        tooltip: i18n.awe.form.grid.phone()
                    }]
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'end'
                    },
                    defaults: {
                        margins: '13 0 0 10'
                    },
                    items: [{
                        xtype: 'button',
                        text: i18n.awe.form.grid.removeAll(),
                        action: 'clearAllDistributorGroups'
                    }, {
                        xtype: 'button',
                        text: i18n.awe.form.grid.removeSelection(),
                        action: 'removeSelectedDistributorGroups'
                    }]
                }]
            }]
        }//]
    //}

    ],
    initComponent: function() {
        this.callParent(arguments);
    }
});