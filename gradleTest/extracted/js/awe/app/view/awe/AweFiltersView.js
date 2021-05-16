
Ext.define('Awe.view.awe.AweFiltersView', {
    extend: 'Ext.window.Window',
    requires: ['UX.form.field.ClearButton',
        'MDS.form.field.ProjektbeteiligterCombobox',
        'UX.form.field.CheckboxListCombo',
        'UX.form.field.ClearButton'
    ],
    alias: 'widget.AweFiltersView',
    id: 'AweFiltersView',
    modal: true,
    bodyPadding: 10,
    border: false,
    bodyStyle: 'background: #FFF',
    closable: true,
    closeAction: 'hide',
    resizable: false,
    draggable: true,
    constrain: true,
    overflowY: 'auto',
    height: 600,
    title: i18n.awe.grid.filter(),
    items: [{
        xtype: 'form',
        id: 'aweWindowForm',
        border: false,
        defaults: {
            border: false,
            margin: '0 10 10 0'
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'oldsnr',
            submitValue: false,
            margin: '0'
        }, {
            xtype: 'hiddenfield',
            name: 'snrTeilId',
            submitValue: false,
            margin: '0'
        },{
            xtype: 'hiddenfield',
            itemId: 'snrLoadingFlag',
            submitValue: false,
            margin: '0'
        },{
            xtype: 'hiddenfield',
            itemId: 'buttonAction',
            submitValue: false,
            margin: '0'
        },{
            xtype: 'fieldset',
            border: true,
            collapsible: false,
            margin: '5 14 5 5',
            bodyStyle: 'border: 2px solid #00417F',
            layout: {
                type: 'hbox',
                align: 'left'
            },
            defaults: {
                width: 374,
                labelWidth: 150,
                labelAlign: 'left'
            },
            items: [{
                xtype: 'checkboxfield',
                name: 'meineAwes',
                itemId: 'meineAwes',
                fieldLabel: i18n.word.meineAwes(),
                width: 368,
                inputValue: true,
                checked: true
            }, {
                xtype: 'checkboxfield',
                name: 'proxyAwes',
                itemId: 'proxyAwes',
                fieldLabel: i18n.awe.filter.proxy(),
                inputValue: true
            }]
        }, {
            xtype: 'fieldset',
            border: true,
            collapsible: false,
            margin: '0 14 0 5',
            bodyStyle: 'border: 2px solid #00417F',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 150,
                labelAlign: 'left'
            },
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                margin: '0 0 10 0',
                border: false,
                items: [{
                    xtype: 'textfield',
                    name: 'aweId',
                    itemId: 'aweId',
                    fieldLabel: i18n.awe.grid.aweId(),
                    align: 'left',
                    width: 327,
                    margin: '0 32 0 0'
                }, {
                    xtype: 'pjbCombobox',
                    name: 'creator',
                    itemId: 'creator',
                    width: 378,
                    margin: '0 0 0 10',
                    labelWidth: 150,
                    fieldLabel: i18n.awe.filter.ersteller(),
                    getSubmitData: function() {
                        if (this.getValue()) {
                            return {
                                'creator': this.getValue()
                            };
                        }
                    },
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false})
                }]
            },{
            layout: {
                    type: 'hbox',
                    align: 'left'
                },
                border: false,
                items:[{
                    xtype: 'combobox',
                    name: 'varianteTeil',
                    itemId: 'varianteTeil',
                    fieldLabel: i18n.awe.form.variante(),
                    displayField: 'teil',
                    queryMode: 'remote',
                    queryParam: 'teil',
                    triggerAction: 'query',
                    minChars: 4,
                    store: 'AweVarianteStore',
                    valueField: 'teil',
                    typeAhead: true,
                    forceSelection: true,
                    allowBlank: true,
                    width: 327,
                    margin: '0 42 0 0',
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false})
                }, {
                    xtype: 'textfield',
                    name: 'lft',
                    itemId: 'lft',
                    fieldLabel: i18n.awe.form.supplier(),
                    readOnly: jspScope.isJustSupplier() == 'true' ? true : false,
                    value: jspScope.lnId() || '',
                    width: 378,
                    labelWidth: 150
                }]
            }]
        }, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'fieldset',
                border: true,
                collapsible: false,
                flex: 1,
                margin: 5,
                bodyStyle: 'border: 2px solid #00417F',
                minHeight: 254,
                height: 254
            },
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'left'
                },
                defaults: {
                    labelWidth: 150,
                    labelAlign: 'left',
                    margin: '5 5 5 0'
                },
                items: [{
                    xtype: 'combobox',
                    name: 'werkWerk',
                    itemId: 'werkWerk',
                    fieldLabel: i18n.awe.form.werkLabel(),
                    align: 'left',
                    typeAhead: true,
                    getSubmitData: function() {
                        return {
                            'werk': this.getValue()
                        };
                    },
                    displayField: 'dispWerkLabel',
                    queryMode: 'remote',
                    queryParam: 'dispWerkLabel',
                    valueField: 'werk',
                    typeAhead: true,
                    store: 'WerkStore',
                    width: 327,
                    listConfig: {
                        emptyText: i18n.awe.form.werkNotFound(),
                        height: 270,
                        minWidth: 165
                    },
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                }, {
                    xtype: 'textfield',
                    name: 'snr',
                    itemId: 'filterSachnummer',
                    fieldLabel: i18n.word.sachnummer(),
                    align: 'left',
                    width: 327
                }, {
                    xtype: 'textfield',
                    name: 'teilBenennung',
                    itemId: 'teilBenennung',
                    fieldLabel: i18n.awe.form.teilebenennung(),
                    align: 'left',
                    width: 327
                }, /*{
                    xtype: 'combobox',
                    name: 'grund',
                    itemId: 'grund',
                    fieldLabel: i18n.awe.form.abweichungsgrund(),
                    align: 'left',
                    valueField: 'id',
                    displayField: 'grund',
                    queryMode: 'remote',
                    queryParam: 'grund',
                    typeAhead: true,
                    store: 'AbweichungsgrundStore',
                    width: 327,
                    listConfig: {
                        emptyText: i18n.awe.form.abweichungsgrundNotFound(),
                        height: 270,
                        minWidth: 165
                    }
                },*/ {
                    xtype: 'textfield',
                    name: 'sammelbegriff',
                    itemId: 'sammelbegriff',
                    fieldLabel: i18n.awe.grid.sammelbegriff(),
                    align: 'left',
                    width: 327
                }, {
                    xtype: 'textfield',
                    name: 'betroffenerUmfang',
                    itemId: 'betroffenerUmfang',
                    fieldLabel: i18n.awe.form.btrffUmfang(),
                    align: 'left',
                    width: 327
                }, {
                    xtype: 'textfield',
                    name: 'kem',
                    itemId: 'kem',
                    fieldLabel: i18n.awe.form.aweKem(),
                    align: 'left',
                    width: 327
                }]
            }, {
                layout: {
                    type: 'vbox',
                    align: 'right'
                },
                defaults: {
                    labelWidth: 150,
                    labelAlign: 'left',
                    margin: 5

                },
                items: [{
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    border: false,
                    defaults: {
                        xtype: 'datefield',
                        format: i18n.awe.word.defaultDateFormat()
                    },
                    items: [{
                    xtype: 'datefield',
                        name: 'aweStartVon',
                        itemId: 'aweStartVon',
                        fieldLabel: i18n.word.geplanterStart(),
                        labelAlign: 'left',
                        align: 'left',
                        validateOnChange: false,
                        labelWidth: 150
                    }, {
                    xtype: 'datefield',
                        name: 'aweStartBis',
                        itemId: 'aweStartBis',
                        fieldLabel: i18n.awe.grid.bis(),
                        labelAlign: 'right',
                        align: 'left',
                        margin: '0 0 0 10',
                        labelWidth: 30,
                        validateOnChange: false
                    }]
                }, {
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    border: false,
                    defaults: {
                        flex: 1,
                        xtype: 'datefield',
                        format: i18n.awe.word.defaultDateFormat()
                    },
                    items: [{
                    xtype: 'datefield',
                        name: 'aweEndeVon',
                        itemId: 'aweEndeVon',
                        fieldLabel: i18n.word.geplantesEnd(),
                        labelAlign: 'left',
                        align: 'left',
                        labelWidth: 150
                    }, {
                    xtype: 'datefield',
                        name: 'aweEndeBis',
                        itemId: 'aweEndeBis',
                        fieldLabel: i18n.awe.grid.bis(),
                        labelAlign: 'right',
                        align: 'left',
                        margin: '0 0 0 10',
                        labelWidth: 30
                    }]
                    // SDR - Hier KEM Felder hinzufügen
                },{
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    border: false,
                    defaults: {
                        flex: 1,
                        xtype: 'datefield',
                        format: i18n.awe.word.defaultDateFormat()
                    },
                    items: [{
                    xtype: 'datefield',
                        name: 'kemStart',
                        itemId: 'kemStart',
                        fieldLabel: i18n.awe.grid.kemStart(),
                        labelAlign: 'left',
                        align: 'left',
                        labelWidth: 150
                    }, {
                    xtype: 'datefield',
                        name: 'kemEnde',
                        itemId: 'kemEnde',
                        fieldLabel: i18n.awe.grid.kemEnde(),
                        labelAlign: 'right',
                        align: 'left',
                        margin: '0 0 0 10',
                        labelWidth: 30
                    }]
                }, {
                    xtype: 'combobox',
                    name: 'prioritaet',
                    itemId: 'prioritaet',
                    fieldLabel: i18n.awe.form.prioritaet(),
                    displayField: 'value',
                    queryMode: 'remote',
                    queryParam: 'value',
                    store: 'Prioritaet',
                    valueField: 'name',
                    typeAhead: true,
                    width: 380,
                    listConfig: {
                        emptyText: i18n.awe.form.prioritaetNotFound(),
                        height: 270,
                        minWidth: 165
                    }
                }, {
                    xtype: 'checkboxlistcombo',
                    fieldLabel: i18n.awe.grid.antragsstatus(),
                    name: 'antragstatus',
                    itemId: 'antragstatus',
                    store: 'AntragsstatusStore',
                    queryMode: 'remote',
                    queryParam: 'value',
                    displayField: 'value',
                    valueField: 'name',
                    triggerAction: 'all',
                    multiSelect: true,
                    cls: 'multiSelectCombo',
                    style: 'width: 380px !important',
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    listConfig: {
                        getInnerTpl: function() {
                            return '<span class="chkCombo-default-icon chkCombo" ></span><p>{value}</p> ';
                        }
                    }
                }, {
                    xtype: 'checkboxlistcombo',
                    fieldLabel: i18n.awe.grid.bezugsarttyp(),
                    name: 'bzaTyp',
                    itemId: 'bzaTyp',
                    queryMode: 'local',
                    queryParam: 'value',
                    displayField: 'value',
                    store: 'BzaTypStore',
                    valueField: 'name',
                    triggerAction: 'all',
                    multiSelect: true,
                    cls: 'multiSelectCombo',
                    style: 'width: 380px !important',
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    listConfig: {
                        getInnerTpl: function() {
                            return '<span class="chkCombo-default-icon chkCombo" ></span><p>{value}</p> ';
                        }
                    }
                }, {
                    xtype: 'combobox',
                    name: 'klassifikation',
                    itemId: 'klassifikation',
                    fieldLabel: i18n.awe.form.klassifikation(),
                    displayField: 'value',
                    queryMode: 'remote',
                    queryParam: 'value',
                    store: 'Klassifikation',
                    valueField: 'name',
                    typeAhead: true,
                    width: 380,
                    listConfig: {
                        emptyText: i18n.awe.form.klassifikationNotFound(),
                        height: 270,
                        minWidth: 165
                    },
                    plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                }]
            }]
        },{
            xtype: 'container',
            layout:{
                type: 'hbox',
                align: 'left'
            },
            margin: '-5 0 0 0',
            border: false,
            items:[{
                border: false,
//              height: 420,
                items:[{
                    xtype: 'container',
                    type: 'vbox',
                    align: 'stretch',
                    xtype: 'fieldset',
                    border: true,
                    collapsible: false,
                    margin: '0 0 10 5',
                    padding: '10 10 10 10 ',
                    bodyStyle: 'border: 2px solid #00417F',
                    defaults: {
                        labelWidth: 150,
                        labelAlign: 'left',
                        margin: '0 0 10 0',
                        border: false
                    },
                    items: [{
                        xtype: 'pjbCombobox',
                        name: 'qsVerantwortlicherId',
                        itemId: 'qsVerantwortlicherId',
                        typ: 'QS',
                        fieldLabel: i18n.bag.QPlaner(),
                        width: 400,
                        margin: '5 0 10 0',
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'qsVerantwortlicher': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    }, {
                        xtype: 'pjbCombobox',
                        name: 'kemVerantwortlicherId',
                        itemId: 'kemVerantwortlicherId',
                        fieldLabel: i18n.awe.grid.kem(),
                        width: 445,
                        margin: '5 0 10 0',
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'kemVerantwortlicher': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    }, {
                        xtype: 'pjbCombobox',
                        name: 'windowPersonFilterId',
                        itemId: 'windowPersonFilterId',
                        fieldLabel: i18n.awe.windowPerson(),
                        width: 445,
                        margin: '5 0 10 0',
                        typ: 'windowPerson',
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'windowPerson': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    }, {
                        xtype: 'combobox',
                        name: 'projektDiaCombo',
                        itemId: 'projektDiaCombo',
                        fieldLabel: i18n.awe.form.projektDia(),
                        width: 445,
                        displayField: 'name',
                        queryMode: 'local',
                        store : 'DialogProjektStore',
                        valueField: 'name',
                        minChars: 2,
                        maxLength: 10,
                        typeAhead: true,
                        listConfig: {
                            emptyText: i18n.awe.form.noProjektDiaFound(),
                            height: 270,
                            minWidth: 165
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                    }, {
                        xtype: 'combobox',
                        minChars: 2,
                        name: 'projektId',
                        itemId: 'projektId',
                        fieldLabel:  i18n.awe.form.projektMDS(),
                        store: 'ProjektFilterStore',
                        queryMode: 'local',
                        displayField: 'pdsKBez',
                        valueField: 'pdsId',
                        typeAhead: true,
                        width: 445,
                        listConfig: {
                            emptyText: i18n.awe.form.noProjektMDSFound(),
                            height: 270,
                            minWidth: 165
                        },
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'projekt': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                        listeners: {
                            'select': function(_, records) {

                                if(this.findParentByType('form') && this.findParentByType('form').getForm()){

                                    var form = this.findParentByType('form').getForm();
                                    var record = records[0];

                                    var teilId = null;
                                    if( form.findField('snrTeilId')){
                                        teilId = form.findField('snrTeilId').getValue();
                                    }
                                    var teilprojektField = null;
                                    if(form.findField('teilprojektId')){
                                        teilprojektField = form.findField('teilprojektId');
                                        var teilprojectStore = teilprojektField.getStore();
                                        teilprojektField.setLoading(true);
                                        teilprojektField.reset();
                                        teilprojectStore.load({
                                            params: {
                                                teil: teilId,
                                                apjId: record.get('pdsId')
                                            },
                                            callback: function(records, operation, success) {
                                                teilprojektField.setLoading(false);
                                            }
                                        });
                                    }

                                }

                            }
                        }
                    }, {
                        xtype: 'combobox',
                        name: 'teilprojektId',
                        itemId: 'teilprojektId',
                        fieldLabel: i18n.awe.form.teilprojekt(),
                        width: 445,
                        displayField: 'pdsKBez',
                        queryMode: 'local',
                        store: 'TeilprojektFilterStore',
                        valueField: 'pdsId',
                        typeAhead: true,
                        listConfig: {
                            emptyText: i18n.awe.form.noTeilprojektFound(),
                            height: 270,
                            minWidth: 165
                        },
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'teilprojekt': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                        listeners: {
                            select: function(_, records) {

                                if(this.findParentByType('form') && this.findParentByType('form').getForm()){
                                    var form = this.findParentByType('form').getForm();
                                    var record = records[0];

                                    var teilId = null;
                                    if(form.findField('snrTeilId')){
                                        teilId = form.findField('snrTeilId').getValue();
                                    }
                                    var anlaufField = null;
                                    if(form.findField('stuecklisteId')){
                                        anlaufField = form.findField('stuecklisteId');
                                        var anlaufStore = anlaufField.getStore();
                                        anlaufField.setLoading(true);
                                        anlaufField.reset();
                                        anlaufStore.load({
                                            params: {
                                                teil: teilId,
                                                apjId: form.findField('projektId').getValue(),
                                                tpjId: record.get('pdsId')
                                            },
                                            callback: function(records, operation, success) {
                                                anlaufField.setLoading(false);
                                            }
                                        });
                                    }
                                }


                            }
                        }
                    }, {
                        xtype: 'combobox',
                        name: 'stuecklisteId',
                        itemId: 'stuecklisteId',
                        fieldLabel: i18n.awe.form.anlauf(),
                        width: 445,
                        displayField: 'displayField',
                        disableKeyFilter : true,
                        tpl: Ext.create('Ext.XTemplate',
                                '<table class="anlauf-table">',
                                '<tpl for=".">',
                                '<tpl if="pdsId  == -1">',
                                '<tr class="x-boundlist-item"><td colspan="2" class="option-bold">{pdsBez}</td></tr>',
                                '<tpl else>',
                                '<tr class="x-boundlist-item">',
                                '<td class="first-child">{pdsName}</td>',
                                '<td>{pdsTrmSb}</td>',
                                '</tr>',
                                '</tpl>',
                                '</tpl>',
                                '</table>'
                        ),
                        queryMode: 'local',
                        store: 'StuecklisteFilterStore',
                        valueField: 'pdsId',
                        typeAhead: true,
                        getSubmitData: function() {
                            if (this.getValue()) {
                                return {
                                    'stueckliste': this.getValue()
                                };
                            }
                        },
                        plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
                        listConfig: {
                            height: 270,
                            minWidth: 165
                        },
                        listeners: {
                            change: {
                                fn: function() {
                                    var store = this.store;
                                    store.clearFilter();
                                    store.filter({
                                        property: 'searchField',
                                        anyMatch: true,
                                        value   : this.getRawValue()
                                    });
                                },
                                buffer: 150
                            },
                            beforeselect: function(combo, record, index){
                                if(record.get('pdsId') == -1) {
                                    return false;
                                }
                            }
                        }
                    }]
                }, {
                    align: 'stretch',
                    xtype: 'fieldset',
                    border: true,
                    collapsible: false,
                    margin: '0 0 10 5',
                    padding: '10 10 25 10 ',
                    bodyStyle: 'border: 2px solid #00417F',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    defaults: {
                        labelWidth: 150,
                        labelAlign: 'left',
                        margin: '5 5 5 0',
                        border: false,
                        layout: {
                            type: 'hbox'
                        }
                    },
                    items: [{
                        defaults: {
                            labelAlign: 'left',
                            align: 'left',
                            inputValue: true,
                            xtype: 'datefield',
                            labelWidth: 150,
                            format: i18n.awe.word.defaultDateFormat()
                        },
                        items: [{
                            name: 'erfassungVon',
                            itemId: 'erfassungVon',
                            id: 'erfassungVon',
                            fieldLabel: i18n.awe.filter.entryDateFrom()
                        }, {
                            name: 'erfassungBis',
                            itemId: 'erfassungBis',
                            id: 'erfassungBis',
                            fieldLabel:  i18n.awe.filter.to(),
                            labelWidth: 50,
                            margin: '0 0 0 10',
                            labelAlign: 'right'
                        }]
                    }, {
                        defaults: {
                            labelAlign: 'left',
                            align: 'left',
                            inputValue: true,
                            xtype: 'datefield',
                            labelWidth: 150,
                            format: i18n.awe.word.defaultDateFormat()
                        },
                        items: [{
                            name: 'beantragungVon',
                            itemId: 'beantragungVon',
                            id: 'beantragungVon',
                            fieldLabel:  i18n.awe.filter.applicationDateFrom()
                        }, {
                            name: 'beantragungBis',
                            itemId: 'beantragungBis',
                            id: 'beantragungBis',
                            fieldLabel: i18n.awe.filter.to(),
                            labelWidth: 50,
                            margin: '0 0 0 10',
                            labelAlign: 'right'
                        }]
                    }, {
                        defaults: {
                            labelAlign: 'left',
                            align: 'left',
                            inputValue: true,
                            xtype: 'datefield',
                            labelWidth: 150,
                            format: i18n.awe.word.defaultDateFormat()
                        },
                        items: [{
                            name: 'genehmigungVon',
                            itemId: 'genehmigungVon',
                            id: 'genehmigungVon',
                            fieldLabel:  i18n.awe.filter.approvalDateFrom()
                        }, {
                            name: 'genehmigungBis',
                            itemId: 'genehmigungBis',
                            id: 'genehmigungBis',
                            fieldLabel: i18n.awe.filter.to(),
                            labelWidth: 50,
                            margin: '0 0 0 10',
                            labelAlign: 'right'
                        }]
                    }]
                }]
            },{
                xtype:'awepdrssdr',
                requiredField: false,
                border: true,
                width: 339
            }]
        }]
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
            action: 'clearFilterAwesCloseWindow',
            iconCls: 'imgButtonCloseToolbar',
            margin: '1 14 1 1',
            tooltip: i18n.global.msg.closepopup() + ' (ESC)'
        },{
            action: 'filterAwes',
            iconCls: 'imgButtonFilterToolbar',
            tooltip: i18n.anlauffabrik.FilterAusfuehren()
        }, {
            action: 'clearFilterAwes',
            iconCls: 'imgButtonResetToolbar',
            tooltip: i18n.anlauffabrik.FilterZuruecksetzen()
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