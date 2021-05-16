Ext.define('Awe.view.awe.displaypanel.AweDisplaySachnummerFSet', {
	extend: 'Ext.form.FieldSet',
	itemId: 'aweDisplaySNRfset',
	alias: 'widget.awedisplaysnrfset',

	resizable: false,

	margins: '0 10 0 10',
	padding: '10 0 5 20',
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
		name: 'zeichnungsDatum'
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
		itemId: 'buttonAction',
		submitValue: false
	}, {
		xtype: 'hiddenfield',
		itemId: 'btnSaveItemId',
	}, {
		xtype: 'fieldcontainer',
		margins: '10 0 0 0',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			margins: '0 10 0 0',
			labelWidth: 85,
			labelAlign: 'left',
			width: 220,
			readOnly: true
		},
		items: [{
			xtype: 'combobox',
			name: 'werkWerk',
			itemId: 'werkWerk',
			fieldLabel: i18n.awe.form.werkLabel(),
			labelWidth: 40,
			displayField: 'dispWerkLabel',
			queryMode: 'remote',
			queryParam: 'dispWerkLabel',
			store: 'WerkStore',
			valueField: 'werk'
		}, {
			xtype: 'textfield',
			name: 'sachnummer',
			itemId: 'sachnummer',
			fieldLabel: i18n.awe.form.snr(),
			labelWidth: 55
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
			width: 120
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
			width: 220,
			readOnly: true
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
			labelWidth: 78
		}, {
			xtype: 'combobox',
			name: 'lieferant',
			itemId: 'lieferant',
			displayField: 'lnKname',
			queryMode: 'local',
			queryParam: 'value',
			store: 'DispLieferantStore',
			valueField: 'lnId',
			fieldLabel: i18n.awe.form.supplier(),
			labelWidth: 55,
			disableKeyFilter: true,
			matchFieldWidth: false,
			tpl: new Ext.XTemplate(
				'<ul>',
				'<tpl for=".">',
				'<li role="option" class="x-boundlist-item">{lnId} - {lnKname}</li>',
				'</tpl>',
				'</ul>'
			)
		}, {
			xtype: 'textfield',
			name: 'ersAltteil',
			itemId: 'ersAltteil',
			fieldLabel: i18n.awe.form.ersAltteil(),
			labelWidth: 100,
			width: 320
		}, {
			xtype: 'hidden',
			name: 'kem',
			itemId: 'kem'
		}]
	}, {
		xtype: 'grid',
		itemId: 'dispPositionsGrid',
		name: 'dispPositionsGrid',
		hidden: (jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true') ? true : false,
		title: i18n.awe.form.positions(),
		margins: '10 20 5 0',
		height: 182,
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
			tooltip: i18n.word.codeleiste(), // i18n.awe.form.positionswindow.codeleiste(),
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
		}]
	}, {
		xtype: 'menuseparator',
		margins: '15 20 15 0',
		border: true
	}, {
		xtype: 'grid',
		itemId: 'displSnrsGrid',
		name: 'displSnrsGrid',
		height: 176,
		width: 895,
		margins: '5 20 0 0',
		defaults: {
			sortable: false
		},
		store: Ext.create('Ext.data.Store', {
			storeId: 'DispSachnummerStore',
			model: 'Awe.model.SNR',
			sorters: [{
				property: 'id',
				direction: 'ASC'
			}],
	        listeners: {
	            datachanged: function(cmp) {
	                Ext.Array.each(cmp.getRange(), function(item, index, allItems) {
	                    item.set('countPos', item.positions().getCount());
	                });
	            }
	        }
		}),
		columns: [{
			text: i18n.awe.form.snr(),
			dataIndex: 'snr',
			tooltip: i18n.awe.form.snr(),
			width: 165,
			renderer: function(value, metaData, record, row, col, store, gridView) {
				var snr = record.get('snr');
				if (Ext.isEmpty(snr) && record.get('teil') && record.get('teil').snrShow) {
					// when awe already saved in the backend is edited, because snr is propery only in the ExtJs model, we must set it from teil.snrShow
					record.set('snr', record.get('teil').snrShow);
					record.commit();
					return record.get('teil').snrShow;
				}
				return snr;
			}
		}, {
			text: i18n.awe.form.teilebenennung(),
			dataIndex: 'teilebenennung',
			tooltip: i18n.awe.form.teilebenennung(),
			width: 220
		}, {
			text: i18n.awe.form.positionswindow.br(),
			tooltip: i18n.awe.form.positionswindow.br(),
			hidden: true,
			width: 48,
			renderer: function(value, metaData, record, row, col, store, gridView) {
				// when editing an awe & adding it to the grid renderer executes before the new positions are updated, thats why we take positions from the grid;
				// else statement applies when awe already saved in the backend is edited
				if (this.up().down('#dispPositionsGrid').getStore().getCount() > 0) {
					return this.up().down('#dispPositionsGrid').getStore().getAt(0).get('baureihe');
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
				if (this.up().down('#dispPositionsGrid').getStore().getCount() > 0) {
					return this.up().down('#dispPositionsGrid').getStore().getAt(0).get('ausfuehrungsart');
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
			width: 180
		}, {
			text: i18n.awe.form.ersAltteil(),
			dataIndex: 'ersAltteilText',
			tooltip: i18n.awe.form.ersAltteil(),
			width: 165,
			renderer: function(value, metaData, record, row, col, store, gridView) {
				var ersAltteilText = record.get('ersAltteilText');
				// We check if the snrShow containts '???', because currently there is a record in the db in table [TEST_PMSU_DB].[dbo].[D900000E_Teile] which does not have id
				// and whenever snr is saved without ersetztesAltteil, this property is automatically mapped to this field in the db
				if (Ext.isEmpty(ersAltteilText) && record.get('ersetztesAltteil') && record.get('ersetztesAltteil').snrShow && (record.get('ersetztesAltteil').snrShow.indexOf('???') == -1)) {
					// when awe already saved in the backend is edited, because ersAltteilText is propery only in the ExtJs model, we must set it from ersetztesAltteil.snrShow
					record.set('ersAltteilText', record.get('ersetztesAltteil').snrShow);
					record.commit();
					return record.get('ersetztesAltteil').snrShow;
				}
				return ersAltteilText;
			}
		}, {
			xtype: 'actioncolumn',
			header: i18n.awe.grid.details(),
			flex: 1,
			align: 'center',
			items: [{
				iconCls: 'imgButtonOpenSmall',
				tooltip: 'View',
				handler: function(grid, rowIndex, colIndex, item, e, record) {
					grid.up('#displSnrsGrid').fireEvent('viewRecord', this, record);
				}
			}]
		}]
	}],
	initComponent: function() {
		this.callParent(arguments);
	}
});