Ext.define('Awe.view.awe.AweGeneralFSet', {
    extend: 'Ext.form.FieldSet',
    requires: ['UX.form.field.CounterTextField', 'MDS.Utils.Misc'],
    itemId: 'awegeneralfset',
    alias: 'widget.awegeneralfset',

    resizable: false,
    layout: 'vbox',
    margins: '0 10 0 10',
    padding: '10 10 5 10',
    border: false,
    collapsible: false,

    config: {
        requiredField : true
    },

    constructor:  function(config) {
        var me = this;

        //Tip von Philipp um direkt auf das Feld zugreifen zu können. Baue dies um, wenn Zeit da ist und ich (Mario) das mental verdaut habe.
//        Ext.ComponentQuery.query('awecreatewizard')[0].query('[itemId="kemVerantwortlicherId"]')


        Ext.each(me.items, function(item, index, allItems) {
            Ext.each(item.items, function(items, index2){
                if(items.itemId == 'kemVerantwortlicherId'){
                    items.labelClsExtra = config.requiredField ? 'field-required' : '';
                    items.allowBlank = !config.requiredField;
                    items.afterLabelTextTpl = config.requiredField ? Awe.sharedData.requiredMarker : '' ;
                }
                if(items.itemId == 'windowPersonId'){
                    items.labelClsExtra = !config.requiredField ? 'field-required' : '';
                    items.allowBlank = config.requiredField;
                    items.afterLabelTextTpl = !config.requiredField ? Awe.sharedData.requiredMarker : '' ;
                }
            });
        });

        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },

    items: [  {
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
    	    width:  910,
    	    name: 'abweichungsGrund',
    	    grow: false,
            maxLength: 240,
    	    itemId: 'aweAbweichung',
    	    fieldLabel: i18n.awe.form.grundAbweichung(),
    	    afterLabelTextTpl: Awe.sharedData.requiredMarker,
    	    labelClsExtra: 'field-required',
    	    anchor: '100%',
            allowBlank: false,
            plugins: new UX.form.field.CounterTextField({ remainingTooltipText: i18n.global.msg.remainingChars() })
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
    	    maxLength: 4096,
    	    name: 'grundDetails',
    	    itemId: 'grundDetails',
    	    grow: false,
    	    fieldLabel: i18n.awe.form.abweichungseinzelheiten(),
    	    afterLabelTextTpl: Awe.sharedData.requiredMarker,
    	    labelClsExtra: 'field-required',
    	    anchor: '100%',
            allowBlank: false,
            plugins: new UX.form.field.CounterTextField({ remainingTooltipText: i18n.global.msg.remainingChars() })
    	}]
    },


    /** Fieldcontainer for dates [No.1]*/
    {
	xtype:'fieldcontainer',
	resizable: false,
	layout: 'hbox',
	defaults: {
	    margins: '10 10 0 0',
	    labelWidth: 118,
	    labelAlign: 'left',
	    width: 220
	},
	items:[{
            xtype: 'datefield',
            anchor: '100%',
            name: 'aweStart',
            itemId: 'aweStart',
            fieldLabel: i18n.awe.form.plannedStart(),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelAlign:'top',
            format: i18n.awe.word.defaultDateFormat(),
            validateOnChange: false,
            allowBlank: false,
            getSubmitData: function() {
                if (this.getValue()) {
                    return {
                        'aweStart': this.getRawValue()
                    };
                } else {
                    return {
                        'aweStart': null
                    };
                }
            }
        }, {
            xtype: 'datefield',
            anchor: '100%',
            name: 'aweEnde',
            itemId: 'aweEnde',
            fieldLabel: i18n.awe.form.plannedEnd(),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelAlign:'top',
            format: i18n.awe.word.defaultDateFormat(),
            validateOnChange: false,
            allowBlank: false,
            getSubmitData: function() {
                if (this.getValue()) {
                    return {
                        'aweEnde': this.getRawValue()
                    };
                } else {
                    return {
                        'aweEnde': null
                    };
                }
            }
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
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelAlign:'top',
            decimalPrecision: 1,
            decimalSeparator: '.',
            step: 1,
            fromEndField: false,
            validateOnChange: false,
            getSubmitData: function() {
                if (this.getValue()) {
                    return {
                        'dauer': this.getValue()
                    };
                } else {
                    return {
                        'dauer': null
                    };
                }
            },
            onFocus: function() {
            	this.fromEndField = false;
            },
            allowBlank: false
        },{
            xtype: 'label',
            width: 50,
            padding: '23 0 0 0',
            text: i18n.awe.form.monate()
        },{
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
            getSubmitData: function(){
                if(this.getValue()){
                    return {
                        'stueckzahlbegrenzung': this.getValue()
                    };
                } else {
                    return {
                        'stueckzahlbegrenzung':null
                    };
                }
            }
        }]

    } /** End of Fieldcontainer*/
    ,{
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
	    afterLabelTextTpl: Awe.sharedData.requiredMarker,
	    labelClsExtra: 'field-required',
	    labelWidth: 118,
	    allowBlank: false
	},{
        xtype: 'textfield',
        name: 'aggregateId',
        itemId: 'aggregateId',
        margins: '10 0 0 10',
        maxLength: 36,
        fieldLabel: i18n.awe.form.aggregateId()
    },
    {
        xtype:'checkboxfield',
        name: 'sonderprozessBemusterung',
        itemId: 'sonderprozessBemusterung',
        inputValue: true,
        margins: '10 0 0 10',
        width: 221,
        labelWidth: 170,
        fieldLabel: i18n.awe.form.sonderprozessBemusterung(),
        uncheckedValue : false
    }]
    }
    ,{
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
        maxLength: 30,
        fieldLabel: i18n.awe.form.sammelbegriff()
    }, {
        xtype: 'checkboxlistcombo',
        fieldLabel: i18n.awe.form.betroffeneWerke(),
        name: 'werkeList',
        itemId: 'werkeList',
        store: 'AweWerkStore',
        queryMode: 'remote',
        queryParam: 'value',
        valueField: 'werk',
        triggerAction: 'all',
        typeAhead: true,
        multiSelect: true,
        allowBlank: true,
        forceSelection: true,
        cls: 'multiSelectCombo',
        style: 'width: 380px !important',
        emptyText: i18n.awe.form.noBetrWerkeNotFound(),
        plugins: new UX.form.field.ClearButton({
            hideClearButtonWhenEmpty: false,
            hideClearButtonWhenMouseOut: false
        }),
        getSubmitData: function() {
        	var retVal = null;
        	if(this.getRawValue() != this.emptyText) {
        		retVal = Ext.util.Format.trim(this.getRawValue());
        	}

            return {
            	'betroffeneWerke': retVal
            };
        },
        /*
        listeners: {
            focus: function(field) {
                if (jspScope.isJustSupplier() == 'true') {
                    var nextNode = field.nextNode('field');
                    if (nextNode) {
                        nextNode.focus();
                    }
                }
            }
        },
        */
        displayTpl: Ext.create('Ext.XTemplate',
             '<tpl for=".">',
                 '<tpl if= " xindex != 1 ">',
                     ', ',
                 '</tpl>',
                 '{werk:trim}',
                 '<tpl if="Ext.util.Format.trim(werk).length < 4" >',
                     '0',
                 '</tpl>',
             '</tpl>'
        ),
        listConfig: {
        	loadingText: i18n.global.msg.load.data(),
            getInnerTpl: function() {
                var tpl =
                        '<span class="chkCombo-default-icon chkCombo" ></span><p>' +
                                 '<tpl if="(Ext.util.Format.trim(werk)).length == 4">'+
                                   '{werk}'+
                                 '<tpl else >'+
                                 '{werk:trim}'+ '0' +
                             '</tpl>'+ ' : {werkBez}'
                        '</p> ' ;
                    return tpl;
            }
        }
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
	items: [ {
	    xtype: 'combobox',
	    name: 'prioritaet',
	    fieldLabel: i18n.awe.form.prioritaet(),
	    labelWidth: 118,
	    displayField: 'value',
        itemId: 'prioritaet',
	    queryMode: 'remote',
	    queryParam: 'value',
	    store: 'Prioritaet',
	    valueField: 'name',
	    typeAhead: true,
	    forceSelection: true,
        getSubmitData: function() {
            return {
                'prioritaet': ( this.getValue()  ) ? this.getValue() : null
            };
        },
	    listConfig: {
    		emptyText: i18n.awe.form.prioritaetNotFound(),
    		height: 270,
    		minWidth: 165
	    }
	},{
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
	    typeAhead: true,
	    forceSelection: true,
        getSubmitData: function() {
            return {
                'klassifikation': ( this.getValue() ) ? this.getValue() : null
            };
        },
	    listConfig: {
    		emptyText: i18n.awe.form.klassifikationNotFound(),
    		height: 270,
    		minWidth: 165
	    }
	}]
}, { //not present
	xtype:'fieldcontainer',
	resizable: false,
    layout: {
        type: 'hbox',
        align: 'left'
    },
	defaults: {
        margins: '0 10 0 0',
        labelAlign: 'left',
        width: 450
	},
	items:[{
            xtype: 'pjbCombobox',
            name: 'qsVerantwortlicherId',
            getSubmitData: function() {
                if(this.getValue()) {
                return {
                    'qsVerantwortlicher': {
                        'id': this.getValue()
                    }
                };
                }
            },
            listConfig: {
            	loadingText: i18n.global.msg.load.data(),
            	resizable: true,
            	getInnerTpl: function() {
            		var tpl =
            			'<div class="x-combo-list-item" style="display: table">' +
                        	'<div style="display: table-row">' +
                            	'<div style="display: table-cell; width: 160px;">{name},&nbsp;{vorname}</div>' +
                            	'<div style="display: table-cell">{abteilung}</div>' +
                            '</div>' +
                        '</div>';
            		return tpl;
            	}
            },
            fieldLabel: i18n.bag.QPlaner(),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelWidth: 118,
            margin: 0,
            typ: 'QS',
            allowBlank: false,
            vtype: 'comboSelect',
            itemId: 'qsVerantwortlicherId',
            isSelected: false,
            forceSelection: true
    }, {
            xtype: 'pjbCombobox',
            name: 'kemVerantwortlicherId',
            getSubmitData: function() {
                return {
                    'kemVerantwortlicher': {
                        'id': this.getValue()
                    }
                };
            },
            listConfig: {
            	 loadingText: i18n.global.msg.load.data(),
            	 resizable: true,
            	 getInnerTpl: function() {
                     var tpl =
                         '<div class="x-combo-list-item" style="display: table">' +
                             '<div style="display: table-row">' +
                                 '<div style="display: table-cell; width: 160px;">{name},&nbsp;{vorname}</div>' +
                                 '<div style="display: table-cell">{abteilung}</div>' +
                             '</div>' +
                         '</div>';
                     return tpl;
                 }
            },

            fieldLabel: MDS.Utils.Misc.insert(i18n.awe.grid.kem(), '<br/>', i18n.awe.grid.kem().indexOf('-')+1),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelWidth: 100,
            //margin: '0 0 0 10',
            margin: 0,
            allowBlank: false,
            itemId: 'kemVerantwortlicherId',
            forceSelection: true,
            isSelected: false,
            vtype: 'comboSelect'
    }]
}, { //not present
    xtype:'fieldcontainer',
    resizable: false,
    layout: {
        type: 'hbox',
        align: 'left'
    },
    defaults: {
        margins: '0 0 0 0',
        labelAlign: 'left',
        width: 450
    },
    items:[ {
            xtype: 'pjbCombobox',
            name: 'erstellerId',
            getSubmitData: function() {
                if(this.getValue()) {
                    return {
                        'ersteller': {
                            'id': this.getValue()
                        }
                    };
                }
            },
            listConfig: {
                loadingText: i18n.global.msg.load.data(),
                resizable: true,
                getInnerTpl: function() {
                    var tpl =
                        '<div class="x-combo-list-item" style="display: table">' +
                        '<div style="display: table-row">' +
                        '<div style="display: table-cell; width: 160px;">{name},&nbsp;{vorname}</div>' +
                        '<div style="display: table-cell">{abteilung}</div>' +
                        '</div>' +
                        '</div>';
                    return tpl;
                }
            },
            editable: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? false : true,
            fieldLabel: i18n.awe.filter.ersteller(),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelWidth: 118,
            margin: 0,
            typ: 'AWECreator',
            allowBlank: false,
            vtype: 'comboSelect',
            itemId: 'erstellerId',
            isSelected: false,
            forceSelection: true
        }, {
            xtype: 'pjbCombobox',
            name: 'windowPersonId',
            getSubmitData: function() {
                if(this.getValue()) {
                    return {
                        'windowPerson': {
                            'id': this.getValue()
                        }
                    };
                }
            },
            listConfig: {
                loadingText: i18n.global.msg.load.data(),
                resizable: true,
                getInnerTpl: function() {
                    var tpl =
                        '<div class="x-combo-list-item" style="display: table">' +
                        '<div style="display: table-row">' +
                        '<div style="display: table-cell; width: 160px;">{name},&nbsp;{vorname}</div>' +
                        '<div style="display: table-cell">{abteilung}</div>' +
                        '</div>' +
                        '</div>';
                    return tpl;
                }
            },
            fieldLabel: i18n.awe.windowPerson(),
            afterLabelTextTpl: Awe.sharedData.requiredMarker,
            labelClsExtra: 'field-required',
            labelWidth: 100,
            margin: '0 0 0 10',
            typ: 'windowPerson',
            allowBlank: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? false : true,
            vtype: 'comboSelect',
            itemId: 'windowPersonId',
            plugins: new UX.form.field.ClearButton({
                hideClearButtonWhenEmpty: false,
                hideClearButtonWhenMouseOut: false
            }),
            isSelected: false,
            forceSelection: true
        }
    ]
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
        setKemId: function(kemId) {
            this.kemId = kemId;
        },
        vtype: 'validateKem',
        getSubmitData: function() {
            if (this.getValue()) {
                return {
                    'kemsList': {
                        'id': this.kemId,
                        'kemDruckformat': this.getValue()
                    }
            };
        }
        }
    },
    items: [{
        xtype: 'textfield',
        itemId:'kem1',
        tooltip: i18n.awe.grid.KEM(),
        name: 'kemsList',
        labelWidth: 118,
        fieldLabel: i18n.awe.form.zusammenMit()
    }, {
        xtype: 'textfield',
        itemId:'kem2',
        tooltip: i18n.awe.grid.KEM(),
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
        setKemId: function(kemId) {
            this.kemId = kemId;
        },
        vtype: 'validateKem',
        getSubmitData: function() {
            if (this.getValue()) {
                return {
                    'kemsList': {
                        'id': this.kemId,
                        'kemDruckformat': this.getValue()
                    }
            };
        }
            //TODO - if needed for the kems order
            // else {
            //     return {
            //         'kemsList': null
            //     }
            // }
        }
    },
    items: [{
        xtype: 'textfield',
        itemId:'kem3',
        tooltip: i18n.awe.grid.KEM(),
        labelWidth: 118,
        name: 'kemsList',
        hideEmptyLabel: false
    }, {
        xtype: 'textfield',
        itemId:'kem4',
        tooltip: i18n.awe.grid.KEM(),
        name: 'kemsList',
        width: 332
    }]
}],

    initComponent: function() {
        this.callParent(arguments);
    }
});