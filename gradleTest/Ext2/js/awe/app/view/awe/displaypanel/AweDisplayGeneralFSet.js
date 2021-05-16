Ext.define('Awe.view.awe.displaypanel.AweDisplayGeneralFSet', {
    extend: 'Ext.form.FieldSet',
    itemId: 'awedisplaygeneralfset',
    alias: 'widget.awedisplaygeneralfset',

    resizable: false,
    layout: 'vbox',
    margins: '0 10 0 10',
    padding: '10 10 5 20',
    border: false,
    collapsible: false,

    items: [{
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '0 10 0 0',
            labelAlign: 'left',
            width: 450
        },
        items: [{
            xtype: 'textfield',
            name: 'kemDisplayFSet',
            itemId: 'kemDisplayFSet',
            fieldLabel: 'AWE-KEM',
            labelWidth: 118,
            readOnly: true

        }, {
            xtype: 'textfield',
            name: 'antragstatusDisplayFSet',
            itemId: 'antragstatusDisplayFSet',
            fieldLabel: i18n.awe.grid.antragsstatus(),
            labelWidth: 100,
            readOnly: true
        }]
    },{
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '10 10 0 0',
            labelWidth: 85,
            labelAlign: 'top',
            width: 450
        },
        items: [{
            xtype: 'textareafield',
            width: 910,
            name: 'abweichungsGrund',
            grow: false,
            itemId: 'aweAbweichung',
            fieldLabel: i18n.awe.form.grundAbweichung(),
            anchor: '100%',
            readOnly: true
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '10 10 0 0',
            labelWidth: 118,
            labelAlign: 'top',
        },
        items: [{
            xtype: 'textareafield',
            width: 910,
            labelWidth: 118,
            name: 'grundDetails',
            itemId: 'grundDetails',
            grow: false,
            fieldLabel: i18n.awe.form.abweichungseinzelheiten(),
            anchor: '100%',
            readOnly: true
        }]
    }, {
        /** Fieldcontainer for dates [No.1]*/
        xtype: 'fieldcontainer',
        resizable: false,
        layout: 'hbox',
        defaults: {
            margins: '10 10 0 0',
            labelWidth: 118,
            labelAlign: 'left',
            width: 220
        },
        items: [{
            xtype: 'datefield',
            anchor: '100%',
            name: 'aweStart',
            itemId: 'aweStart',
            fieldLabel: i18n.awe.form.plannedStart(),
            labelAlign: 'top',
            readOnly: true
        }, {
            xtype: 'datefield',
            anchor: '100%',
            name: 'aweEnde',
            itemId: 'aweEnde',
            fieldLabel: i18n.awe.form.plannedEnd(),
            labelAlign: 'top',
            readOnly: true
        }, {
            xtype: 'numberfield',
            margins: '10 5 0 0',
            minValue: 1,
            maxValue: 6,
            labelWidth: 78,
            width: 165,
            name: 'dauer',
            itemId: 'dauer',
            fieldLabel: i18n.awe.form.duration(),
            labelAlign: 'top',
            decimalPrecision: 2,
            decimalSeparator: '.',
            step: 1,
            fromEndField: false,
            onFocus: function() {
                this.fromEndField = false;
            },
            readOnly: true
        }, {
            xtype: 'label',
            width: 50,
            padding: '23 0 0 0',
            text: i18n.awe.form.monate()
        }, {
            xtype: 'numberfield',
            margins: '10 10 0 0',
            labelWidth: 118,
            labelAlign: 'top',
            width: 220,
            minValue: 1,
            maxValue: 999999,
            name: 'stueckzahlbegrenzung',
            itemId: 'stueckzahlbegrenzung',
            fieldLabel: i18n.awe.form.piecenumberLimit(),
            readOnly: true
        }]

    } /** End of Fieldcontainer*/ , {
        xtype: 'fieldcontainer',
        margins: '0 0 5 0',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            //labelWidth: 85,
            labelAlign: 'left',
            width: 336, //296,//450,
            margins: '10 0 5 0'
        },
        items: [{
            xtype: 'textfield',
            name: 'betroffenerUmfang',
            itemId: 'betroffenerUmfang',
            fieldLabel: i18n.awe.form.btrffUmfang(),
            labelWidth: 118,
            readOnly: true
        }, {
            xtype: 'textfield',
            name: 'aggregateId',
            itemId: 'aggregateId',
            margins: '10 0 0 10',
            //labelWidth: 118,
            fieldLabel: i18n.awe.form.aggregateId(),
            readOnly: true
        }, {
            xtype: 'checkboxfield',
            name: 'sonderprozessBemusterung',
            itemId: 'sonderprozessBemusterung',
            inputValue: true,
            margins: '10 0 0 10',
            width: 221,
            labelWidth: 170,
            fieldLabel: i18n.awe.form.sonderprozessBemusterung(),
            uncheckedValue: false,
            readOnly: true
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            //labelWidth: 85,
            labelAlign: 'left',
            width: 450,
            margins: '0 10 10 0'
        },
        items: [{
            xtype: 'textfield',
            name: 'sammelbegriff',
            itemId: 'sammelbegriff',
            labelWidth: 118,
            fieldLabel: i18n.awe.form.sammelbegriff(),
            readOnly: true
        }, {
        	xtype: 'textfield',
            name: 'betroffeneWerke',
            itemId: 'betroffeneWerke',
            labelWidth: 118,
            maxLength: 30,
            fieldLabel: i18n.awe.form.betroffeneWerke(),
            readOnly: true
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '0 10 0 0',
            labelAlign: 'left',
            width: 450
        },
        items: [{
            xtype: 'combobox',
            name: 'prioritaet',
            fieldLabel: i18n.awe.form.prioritaet(),
            labelWidth: 118,
            displayField: 'value',
            queryMode: 'remote',
            queryParam: 'value',
            store: 'Prioritaet',
            valueField: 'name',
            readOnly: true
        }, {
            xtype: 'combobox',
            name: 'klassifikation',
            itemId: 'klassifikation',
            fieldLabel: i18n.awe.form.klassifikation(),
            labelWidth: 100,
            displayField: 'value',
            queryMode: 'remote',
            queryParam: 'value',
            store: 'Klassifikation',
            valueField: 'name',
            readOnly: true
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '0 10 0 0',
            labelAlign: 'left',
            width: 450
        },
        items: [{
            xtype: 'pjbCombobox',
            name: 'qsVerantwortlicherId',
            fieldLabel: i18n.bag.QPlaner(),
            labelWidth: 118,
            // Currently this plug-in is disabled, because on hover the content of this field is hidden
            // plugins: new UX.form.field.ClearButton({
            //     hideClearButtonWhenEmpty: true
            // }),
            typ: 'QS',
            margin: '5 0 0 0',
            readOnly: true
        }, {
            xtype: 'pjbCombobox',
            name: 'kemVerantwortlicherId',

            fieldLabel: i18n.awe.grid.kem(),
            labelWidth: 100,
            // Currently this plug-in is disabled, because on hover the content of this field is hidden
            // plugins: new UX.form.field.ClearButton({
            //     hideClearButtonWhenEmpty: true
            // }),
            readOnly: true,
            margin: '5 0 0 0'
        }]
    },{
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '0 10 0 0',
            labelAlign: 'left',
            width: 450
        },
        items: [{

            xtype: 'pjbCombobox',
            name: 'erstellerId',

            fieldLabel: i18n.awe.filter.ersteller(),
            labelWidth: 118,
            // Currently this plug-in is disabled, because on hover the content of this field is hidden
            // plugins: new UX.form.field.ClearButton({
            //     hideClearButtonWhenEmpty: true
            // }),
            readOnly: true,
            margin: '5 0 0 0'
        }, {
            xtype: 'pjbCombobox',
            name: 'windowPersonId',

            fieldLabel: i18n.awe.windowPerson(),
            labelWidth: 100,
            // Currently this plug-in is disabled, because on hover the content of this field is hidden
            // plugins: new UX.form.field.ClearButton({
            //     hideClearButtonWhenEmpty: true
            // }),
            readOnly: true,
            margin: '5 0 0 0'
        }]
    }, { //not present
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '10 10 0 0',
            labelAlign: 'left',
            width: 450,
            maxLength: 14,
            kemId: undefined,
            readOnly: true,
            setKemId: function(kemId) {
                this.kemId = kemId;
            }
        },
        items: [{
            xtype: 'textfield',
            name: 'kemsList',
            labelWidth: 118,
            fieldLabel: i18n.awe.form.zusammenMit()
        }, {
            xtype: 'textfield',
            name: 'kemsList',
            width: 332
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox',
            align: 'left'
        },
        defaults: {
            margins: '10 10 0 0',
            labelAlign: 'left',
            width: 450,
            maxLength: 14,
            kemId: undefined,
            readOnly: true,
            setKemId: function(kemId) {
                this.kemId = kemId;
            }
        },
        items: [{
            xtype: 'textfield',
            labelWidth: 118,
            name: 'kemsList',
            hideEmptyLabel: false
        }, {
            xtype: 'textfield',
            name: 'kemsList',
            width: 332
        }]
    }],
    initComponent: function() {
        this.callParent(arguments);
    }
});