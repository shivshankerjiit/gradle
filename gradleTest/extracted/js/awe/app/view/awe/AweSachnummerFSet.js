Ext.define('Awe.view.awe.AweSachnummerFSet', {
    extend: 'Ext.form.FieldSet',

    requires: ['MDS.form.field.AdvancedCombobox'],

    itemId: 'aweSNRfset',
    alias: 'widget.awesnrfset',

	resizable: false,

	margins: '0 10 0 10',
	padding: '10 0 5 10',
	border: false,
	collapsible: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	items: [{
		xtype: 'hiddenfield',
		name: 'id'
	}, {
		xtype: 'hiddenfield',
		name: 'teilId'
	}, {
		xtype: 'hiddenfield',
		name: 'snr'
	}, {
		xtype: 'hiddenfield',
		name: 'ersAltteilId',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		name: 'ersAltteilShow',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		name: 'sieheZeichnungTeil'
	}, {
		xtype: 'hiddenfield',
		name: 'zeichnungsDatum',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		name: 'aweId',
		itemId: 'aweId'
	}, {
	    xtype: 'hiddenfield',
	    name: 'antragstatus',
	    itemId: 'antragstatus'
	}, {
		xtype: 'hiddenfield',
		itemId: 'snrLoadingFlag',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		itemId: 'werkLoadingFlag',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		itemId: 'ersAltteilLoadingFlag',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		itemId: 'teilRelevantValuesLoadingFlag',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		itemId: 'buttonAction',
		submitValue: false
	}, {
	    xtype: 'hiddenfield',
	    itemId: 'btnSaveItemId',
	},  {
	    xtype:  'hiddenfield',
	    name:   'certificationFlag',
	    itemId: 'certificationFlag',
	}, {
	    xtype:  'hiddenfield',
	    name:   'safetyRelevanceFlag',
	    itemId: 'safetyRelevanceFlag',
	}, {
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			margins: '0 10 0 0',
			labelWidth: 85,
			labelAlign: 'left',
			width: 220
		},
	items: [{
	    xtype: 'combobox',
	    name: 'werkWerk',
	    getSubmitData: function() {
		return {
		    'werk': {
			'werk': this.getValue()
		    }
		};
	    },
	    itemId: 'werkWerk',
	    fieldLabel: i18n.awe.form.werkLabel(),
	    labelWidth: 40,
	    afterLabelTextTpl: Awe.sharedData.requiredMarker,
	    labelClsExtra: 'field-required',
	    displayField: 'dispWerkLabel',
	    queryMode: 'remote',
	    queryParam: 'dispWerkLabel',
	    store: 'WerkStore',
	    valueField: 'werk',
	    typeAhead: true,
	    allowBlank: false,
	    forceSelection: true,
	    isSelected: false,
	    vtype: 'comboSelect',
	    listConfig: {
		emptyText: i18n.awe.form.werkNotFound(),
		height: 270,
		minWidth: 165
	    }
	},{
	    xtype: 'textfield',
	    name: 'sachnummer3',
		getSubmitData: function() {
			return {
				'teil': {
					'id': this.findParentByType('form').getForm().findField('teilId').getValue()
				}
			};
		},
	    itemId: 'sachnummer3',
	    fieldLabel: i18n.awe.form.snr() + 'ALT',
	    hidden: true, // TODO: remove this component - this is the old/pre-8.1 one!
	    width: 189,
	    labelWidth: 55
	}, {
	    xtype: 'advancedcombobox',
	    name: 'sachnummer',
	    itemId: 'sachnummer',
	    fieldLabel: i18n.awe.form.snr(),
	    tooltip: i18n.word.koopSnrPicker(),
	    width: 200,
	    labelWidth: 55,
	    enableKeyEvents: true,
        getSubmitData: function() {
            return {
                'teil': {
                    'id': this.findParentByType('form').getForm().findField('teilId').getValue()
                }
            };
        },
	    pickerType: 'grid',
	    pickerConfig: {
	        dataConfig: {
	            recordDef: [
                    {name: 'referenzNr', type: 'string'},
                    {name: 'daimlerSnr',  type: 'string', mapping: 'teil.snrShow'},
                    {name: 'herstellerKz',  type: 'string'}
                ],
	            url: 'awe.referenzsachnummern.list.action'
	        },
	        headline: i18n.word.koopSnrPicker(),
	        hideHeadline: false,
	        additionalElements: [ {
                xtype: 'combobox',
                fieldLabel: i18n.word.hersteller(),
                tooltip: i18n.word.firmaHerstellerKz(),
                itemId: 'herstellerKz',
                name: 'herstellerKz',
                labelWidth: 105,
                margins: {
                    left: 10,
                    right: 17,
                    top: 0,
                    bottom: 0
                },
                displayField: 'herstellerKz',
                valueField: 'herstellerKz',
                forceSelection: true,
    	        store: Ext.create('Ext.data.Store', {
    	            storeId: 'HerstellerStore',
    	            model: Ext.define('Hersteller', {
    	                extend: 'Ext.data.Model',
    	                fields: [
    	                    {name: 'herstellerKz', type: 'string'},
    	                    {name: 'anz', type: 'int'}
    	                ]
    	            }),
    	            proxy: {
    	                type: 'ajax',
    	                url: 'awe.hersteller.list.action',
    	                reader: {
    	                    type: 'json',
    	                    root: 'data',
    	                    successProperty: 'success',
    	                    totalProperty: 'totalCount'
    	                }
    	            }
    	        }),
    	        plugins: new UX.form.field.ClearButton({
    	            hideClearButtonWhenEmpty: false,
    	            hideClearButtonWhenMouseOut: false
    	        }),
    	        listeners: {
    	            select: function(combo, records, eOpts) {
    	                combo.up('pickerwindowgrid').alignToEle.stopCollapse = true;
    	                combo.up('pickerwindowgrid').gridStore.load({
    	                    params: {
    	                        start: 0,
    	                        limit: 20,
    	                        herstellerKz: combo.getValue()
        	                }
    	                });
    	                combo.up('pickerwindowgrid').alignToEle.stopCollapse = true;
    	            },
    	            expand: function(field, eOpts) {
    	                field.up('pickerwindowgrid').alignToEle.stopCollapse = true;
    	            },
    	            collapse: function(field, eOpts) {
    	                field.up('pickerwindowgrid').alignToEle.stopCollapse = true;
    	            },
    	            blur: function(cmp, e, eOpts) {
    	                cmp.up('pickerwindowgrid').alignToEle.stopCollapse = true; //!cmp.isExpanded;
    	            }
    	        }
            } ],
            columns: [{
                text: i18n.word.koopSnr(),
                dataIndex: 'referenzNr',
                tooltip: i18n.word.koopSnr(),
                width: 87,
                menuDisabled: true,
                sortable: false
            }, {
                text: i18n.word.daimlerSnr(),
                dataIndex: 'daimlerSnr',
                tooltip: i18n.word.daimlerSnr(),
                width: 100,
                menuDisabled: true,
                sortable: false
            }, {
                text: i18n.word.hersteller(),
                dataIndex: 'herstellerKz',
                tooltip: i18n.word.firmaHerstellerKz(),
                width: 60,
                menuDisabled: true,
                sortable: false
            }]
	    },
        onDataChanged: function(combo, selectedRecords) {
            if (selectedRecords && selectedRecords.length > 0) {
            	if (selectedRecords && selectedRecords.length > 0) {
	            	aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');
	                aweTeilObject.load(Ext.valueFrom(selectedRecords[0].get('daimlerSnr')).trim(), {
	                    scope: this,
	                    failure: function(record, operation) {
	                    	var field = Ext.ComponentQuery.query('advancedcombobox[name=sachnummer]')[0];
	                    	field.setValue(Ext.valueFrom(selectedRecords[0].get('daimlerSnr')).trim());
	                    	field.markInvalid(i18n.awe.form.snrNotFound());
	                    	field.setActiveError(i18n.awe.form.snrNotFound());
	                    },
	                    success: function(record, operation) {
	                    	Ext.ComponentQuery.query('advancedcombobox[name=sachnummer]')[0].setValue(Ext.valueFrom(selectedRecords[0].get('daimlerSnr')).trim());
	                    },
	                    callback: function(record, operation) {
	                        //test if it can be deleted
	                    }
	                });
            	}
            }
        },
	    listeners: {
	        gridbeforeload: function(cmp) {
	            this.pickerWindow.gridStore.getProxy().extraParams.herstellerKz = Ext.valueFrom(this.pickerWindow.down('#herstellerKz').getValue(), '').trim();
	            this.pickerWindow.gridStore.getProxy().extraParams.search = Ext.valueFrom(this.pickerWindow.down('#searchinput').getValue(), '').trim();
	        },
			keypress: function(field,e,eOpts) {
			    if (e.getKey() == e.ENTER || e.getKey() == e.RETURN)
			    	field.triggerBlur();
			}
	    }
	}, {
	    xtype: 'textfield',
	    name: 'teilBenennung',
	    fieldLabel: i18n.awe.form.teilebenennung(),
	    labelWidth: 100,
	    itemId: 'teilebenennung',
	    readOnly: true,
	    width: 320
	}, {
	    xtype: 'combobox',
	    name: 'zgs',
	    fieldLabel: i18n.awe.form.zgs(),
	    labelWidth: 40,
	    itemId: 'zgs',
	    valueField: 'zgs',
	    displayField: 'zgs',
	    typeAhead: true,
	    forceSelection: true,
	    width: 120,
	    listConfig: {
    		emptyText: i18n.awe.form.zgsNotFound(),
    		height: 270,
    		minWidth: 75
	    }

	}]
    }, {
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			margins: '10 10 0 0',
			labelWidth: 85,
			labelAlign: 'left',
			width: 220
		},
		items: [{
			xtype: 'combobox',
			name: 'bzaTyp',
			itemId: 'bzaTyp',
			fieldLabel: i18n.awe.form.bezugsarttyp(),
			displayField: 'value',
			queryMode: 'local',
			queryParam: 'value',
			store: 'BzaTypStore',
			valueField: 'name',
			readOnly: true,
			hideTrigger: true,
			labelWidth: 78,
			listConfig: {
				emptyText: i18n.awe.form.noBezugsarttypFound(),
				height: 270,
				minWidth: 165
			}
		}, {
			xtype: 'combobox',
			name: 'lieferant',
			itemId: 'lieferant',
			displayField: 'lnKname',
			queryMode: 'local',
			queryParam: 'value',
			store: 'LieferantStore',
			valueField: 'lnId',
			fieldLabel: i18n.awe.form.supplier(),
			labelWidth: 55,
			disableKeyFilter: true,
			forceSelection: true,
			matchFieldWidth: false,
			tpl: new Ext.XTemplate(
					'<ul>',
						'<tpl for=".">',
							'<li role="option" class="x-boundlist-item">{lnId} - {lnKname}</li>',
						'</tpl>',
					'</ul>'
			),
			listConfig: {
				emptyText: i18n.awe.form.noSuppliersFound(),
				height: 270,
				minWidth: 165
			}
		}, {
			xtype: 'textfield',
			name: 'ersAltteil',
			itemId: 'ersAltteil',
			fieldLabel: i18n.awe.form.ersAltteil(),
			labelWidth: 100,
			width: 320
		},{
			xtype: 'hidden',
			name: 'kem',
			itemId: 'kem'
		}]
	}, {
	/** ***** Fieldset 2 ***** * */
	xtype: 'fieldset',
	id: 'positionsSearchFSet',
	margins: '5 20 0 0',
	padding: '0 10 0 10',
	height: 265,
	hidden: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? true : false,
	layout: {
	    type: 'vbox',
	    align: 'stretch'
	},
	items: [{
	    xtype: 'fieldcontainer',
	    layout: {
    		type: 'hbox',
    		align: 'stretch'
	    },
	    items: [{
    		xtype: 'fieldcontainer',
    		layout: {
    		    type: 'vbox',
    		    align: 'stretch'
    		},
    		items: [{
    		    //search fields
    		    /** ***** sub Fieldcontainer 1 ***** * */
    		    xtype: 'fieldcontainer',
    		    layout: {
        			type: 'hbox',
        			align: 'stretch'
    		    },
    		    defaults: {
        			labelWidth: 80,
        			labelAlign: 'left',
        			width: 275,
        			padding: '10 0 0 0'
    		    },
    		    items: [{
        			xtype: 'textfield',
        			name: 'searchSachnummer',
        			margins: '0 10 0 0',
        			itemId: 'searchSachnummer',
        			fieldLabel:  i18n.awe.form.sachnummer(),
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
        				}
            	    }
    		    }, {
        			xtype: 'textfield',
        			name: 'searchBaureihe',
        			margins: '0 10 0 0',
        			itemId: 'searchBaureihe',
        			fieldLabel: i18n.awe.form.baureihe(),
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
        				}
            	    }
    		    }, {
        			xtype: 'textfield',
        			name: 'searchEmbodiment',
        			margins: '0 0 0 0',
        			itemId: 'searchEmbodiment',
        			fieldLabel: i18n.awe.form.ausfuehrungsart(),
        			labelWidth: 90,
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
        				}
            	    }
    		    }]
    		},{
    		    xtype: 'fieldcontainer',
    		    layout: {
        			type: 'hbox',
        			align: 'stretch'
    		    },
    		    defaults: {
        			labelWidth: 80,
        			labelAlign: 'left',
        			width: 275
    		    },
    		    items:[{
        			xtype: 'textfield',
        			name: 'searchModul',
        			margins: '5 10 0 0',
        			itemId: 'searchModul',
        			maxHeight: 22,
        			fieldLabel: i18n.awe.form.modul(),
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
        				}
            	    }
    		    }, {
        			xtype: 'textfield',
        			name: 'searchPositionFrom',
        			margins: '5 10 0 0',
        			itemId: 'searchPositionFrom',
        			maxHeight: 22,
        			fieldLabel: i18n.awe.form.positionVon(),
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
        				}
            	    }
    		    }, {
        			xtype: 'textfield',
        			name: 'searchPositionTo',
        			margins: '5 0 0 0',
        			itemId: 'searchPositionTo',
        			maxHeight: 22,
        			fieldLabel: i18n.awe.form.positionBis(),
        			labelWidth: 90,
        			enableKeyEvents: true,
            	    listeners : {
            			keypress: function(field,e,eOpts) {
            				triggerSearchPositionsButtonClick(e);
            			}
            	    }
    		    }]
    		}]
	    },{
    		// searchbutton

    		xtype: 'container',
    		layout: {
    		    type: 'hbox',
    		    align: 'center',
    		    pack: 'end'
    		},
    		items: [{
    		    xtype: 'button',
    		    iconAlign : 'right',
    		    iconCls: 'imgButtonSearchToolbar',
    		    itemId: 'searchPositionsBtn',
    		    action: 'searchPositions',
    		    tooltip: i18n.global.msg.search() + ' (ALT+P)',
    		    width: 34,
    		    height: 34,
    		    cls: 'top-panel',
    		    focusCls: 'setOutline',
    			margins: '22 1 1 8'
    		}]
	    }]
	},{
	    /** ***** sub Fieldcontainer 2 ***** * */
	    xtype: 'fieldcontainer',
	    layout: {
    		type: 'hbox',
    		align: 'stretch'
	    },
	    defaults: {
	        margins: '0 0 0 0'
	    },
	    items: [{
    		xtype: 'grid',
    		id: 'positionsGridWz',
    		name: 'positionsGridWz',
    		title: i18n.awe.form.positions(),
			height: 152,
			width: 888,
    		defaults: {
    		    sortable: false
    		},
            store: 'PositionStore',
            /*store: Ext.create('Ext.data.Store', {
                model: 'Awe.model.Position'
            }),*/
    		multiSelect: true,
    		columns: [{
    		    text: i18n.awe.form.positionswindow.br(),
    		    dataIndex: 'baureihe',
    		    tooltip: i18n.word.baureihe(), //i18n.awe.form.positionswindow.br(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.aa(),
    		    dataIndex: 'ausfuehrungsart',
    		    tooltip: i18n.word.ausfuehrungsart(), //i18n.awe.form.positionswindow.aa(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.modul(),
    		    dataIndex: 'modul',
    		    tooltip: i18n.word.modul(), //i18n.awe.form.positionswindow.modul(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.pose(),
    		    dataIndex: 'posE',
    		    tooltip: i18n.awe.form.positionswindow.pose(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.posv(),
    		    tooltip: i18n.awe.form.positionswindow.posv(),
    		    dataIndex: 'posV',
    		    width: 96
    		}, {
    		    text: i18n.word.codeleiste(), //i18n.awe.form.positionswindow.codeleiste(),
    		    dataIndex: 'coderegel',
    		    tooltip: i18n.word.codeleiste(), //i18n.awe.form.positionswindow.codeleiste(),
    		    width: 96,
                renderer: function(value, metaData, record, row, col, store, gridView) {
                    if (record && !Ext.isEmpty(value)) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
    		}, {
    		    text: i18n.awe.form.positionswindow.werke(),
    		    dataIndex: 'werk',
    		    tooltip: i18n.awe.form.positionswindow.werke(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.lenkung(),
    		    dataIndex: 'lenkung',
    		    tooltip: i18n.awe.form.positionswindow.lenkung(),
    		    width: 96
    		}, {
    		    text: i18n.awe.form.positionswindow.wahlweise(),
    		    dataIndex: 'wahlweise',
    		    tooltip: i18n.awe.form.positionswindow.wahlweise(),
    		    width: 96
    		}],
    		listeners: {
    		    afterrender: function(component, args) {
                    var aDomGridView = component.getView().getEl().dom;
                    var aDomTr = aDomGridView.getElementsByTagName('tr');
    		        for (var i = 0; i < aDomTr.length; i++) {
    		            if (aDomTr[i].className.indexOf('x-grid-row') > -1) {
    		                aDomTr[i].setAttribute('tabindex', "0");
    		                aDomTr[i].setAttribute("onfocus","Ext.getDom('"+aDomGridView.id+"').style.border=\'1px dotted\';");
    		                aDomTr[i].setAttribute("onblur","Ext.getDom('"+aDomGridView.id+"').style.border=\'none\';");
    		                break;
    		            }
    		        }
    		    }
    		}
	    }]
	},{
		xtype: 'container',
		layout: {
		    type: 'hbox',
		    align: 'right',
		    pack: 'end'
		},
		defaults: {
				minWidth: 116
		},
		items: [{
		    xtype: 'button',
		    text: i18n.awe.form.grid.removeAll(),
		    action: 'clearAllPositions',
		    margins: '0 5 5 0'
		}, {
		    xtype: 'button',
		    text: i18n.awe.form.grid.removeSelection(),
		    action: 'removeSelectedPositions',
		    margins: '0 0 0 0' //TODO: may be delete
		}]
	    }]
    }, {
	xtype: 'container',
	margins: '0 0 1 0 ',//TODO:May be delete
	layout: {
	    type: 'hbox',
	    align: 'center',
	    pack: 'start'
	},
	items: [{
		    xtype: 'button',
		    text: i18n.awe.form.add(),
		    width: 116,
		    action: 'addSnr',
		    margins: '0 5 0 0',
		    readyState: true
			//tooltip: i18n.global.msg.
		}, {
		    xtype: 'button',
		    hidden: true,
		    text: i18n.awe.form.saveSnr(),
		    width: 116,
		    action: 'saveSnr',
		    margins: '0 5 0 0',
		    readyState: true
			//tooltip: i18n.global.msg.
		}, {
		    xtype: 'button',
		    text: i18n.awe.form.loeschen(),
		    width: 116,
		    action: 'deleteSnr',
		    margins: '0 5 0 0'
			//tooltip: i18n.global.msg.
		}, {
		    xtype: 'button',
//		    hidden: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? true : false,
		    id: 'editBtn_positionsSearchFSet',
		    text: i18n.awe.form.edit(),
		    width: 116,
		    action: 'editSnr'
			//tooltip: i18n.global.msg.
		}, {
		    xtype: 'button',
		    hidden: true,
		    text: i18n.awe.form.cancel(),
		    width: 116,
		    action: 'cancelSnr'
		    //tooltip: i18n.global.msg.
		}]
    }, {
    	xtype: 'grid',
    	id: 'snrsGrid',
    	name: 'snrsGrid',
    	height: 126,
    	width: 895,
    	margins: '1 20 3 0',
    	defaults: {
    		sortable: false
    	},
    	store: Ext.create('Ext.data.Store', {
    		storeId: 'SachnummerStore',
    		model: 'Awe.model.SNR',
    		sorters: [{
    			property: 'id',
    			direction: 'ASC'
    		}],
    		listeners: {
    		    datachanged: function(cmp) {
    		        Ext.Array.each(cmp.getRange(), function(item, index, allItems) {
    		            item.set('countPos', item.positions().getCount());
                        if (index === 0) {
                            var field = Ext.ComponentQuery.query('#betroffenerUmfang')[1];
                            if (field && Ext.isEmpty(field.getValue())) {
                                field.setValue(item.get('teilebenennung'));
                            }
                        }
    		        });
    		    }
    		}
    	}),
    	columns: [{
    		text: i18n.awe.form.snr(),
    		dataIndex: 'snr',
    		tooltip: i18n.awe.form.snr(),
    		width: 130,
    		renderer: function(value, metaData, record, row, col, store, gridView) {
    			var snr = record.get('snr');
    			if (Ext.isEmpty(snr) && record.get('teil') && record.get('teil').snrShow) {
    				// when awe already saved in the backend is edited, because snr is propery only in the ExtJs model, we must set it from teil.snrShow
    				record.set('snr', record.get('teil').snrShow);
    				return record.get('teil').snrShow;
    			}
    			return snr;
    		}
    	}, {
    		text: i18n.word.teilebenennung(), //i18n.awe.form.teilebenennung(),
    		dataIndex: 'teilebenennung',
    		tooltip: i18n.word.teilebenennung(), //i18n.awe.form.teilebenennung(),
    		width: 220
    	}, {
    		text: i18n.awe.form.positionswindow.br(),
    		tooltip: i18n.awe.form.positionswindow.br(),
    		hidden: true,
    		width: 48,
    		renderer: function(value, metaData, record, row, col, store, gridView) {
    			// when editing an awe & adding it to the grid renderer executes before the new positions are updated, thats why we take positions from the grid;
    			// else statement applies when awe already saved in the backend is edited
    			if (this.up().down('#positionsGridWz').getStore().getCount() > 0) {
    				return this.up().down('#positionsGridWz').getStore().getAt(0).get('baureihe');
    			} else if (record.positions().getCount() > 0) {
    				return record.positions().getAt(0).get('baureihe');
    			}
    			return "";
    		}
    	}, {
    		text: i18n.awe.form.positionswindow.aa(),
    		tooltip: i18n.awe.form.positionswindow.aa(),
    		hidden: true,
    		width: 48,
    		renderer: function(value, metaData, record, row, col, store, gridView) {
    			// when editing an awe & adding it to the grid renderer executes before the new positions are updated, thats why we take positions from the grid;
    			// else statement applies when awe already saved in the backend is edited
    			if (this.up().down('#positionsGridWz').getStore().getCount() > 0) {
    				return this.up().down('#positionsGridWz').getStore().getAt(0).get('ausfuehrungsart');
    			} else if (record.positions().getCount() > 0) {
    				return record.positions().getAt(0).get('ausfuehrungsart');
    			}
    			return "";
    		}
    	}, {
    	    text: i18n.awe.form.anzahlPos(),
    	    dataIndex: 'countPos',
    	    tooltip: i18n.awe.form.anzahlPosBez(),
    	    width: 64
    	}, {
    		text: i18n.awe.form.zgs(),
    		dataIndex: 'zgs',
    		tooltip: i18n.awe.form.zgs(),
    		width: 220
    	}, {
    		text: i18n.awe.form.ersAltteil(),
    		dataIndex: 'ersAltteilText',
    		tooltip: i18n.awe.form.ersAltteil(),
    		width: 220,
    		renderer: function(value, metaData, record, row, col, store, gridView) {
    			var ersAltteilText = record.get('ersAltteilText');
    			// We check if the snrShow containts '???', because currently there is a record in the db in table [TEST_PMSU_DB].[dbo].[D900000E_Teile] which does not have id
    			// and whenever snr is saved without ersetztesAltteil, this property is automatically mapped to this field in the db
    			if (Ext.isEmpty(ersAltteilText) && record.get('ersetztesAltteil') && record.get('ersetztesAltteil').snrShow && (record.get('ersetztesAltteil').snrShow.indexOf('???') == -1)) {
    				// when awe already saved in the backend is edited, because ersAltteilText is propery only in the ExtJs model, we must set it from ersetztesAltteil.snrShow
    				record.set('ersAltteilText', record.get('ersetztesAltteil').snrShow);
    				return record.get('ersetztesAltteil').snrShow;
    			}
    			return ersAltteilText;
    		}
    	}]
	}],
    initComponent: function() {
        this.callParent(arguments);
    }
});

function triggerSearchPositionsButtonClick(e) {
	if (e.getKey() == e.ENTER || e.getKey() == e.RETURN) {
		var searchPositionsButton = Ext.ComponentQuery.query('button[itemId=searchPositionsBtn]')[0];
		searchPositionsButton.fireEvent('click', searchPositionsButton);
	}
}