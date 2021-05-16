Ext.define('Awe.view.awe.displaypanel.AweDisplayMdsFSet', {
	extend: 'Ext.form.FieldSet',
	xtype: 'awedisplaymdsfset',
	itemId: 'aweDisplayMdsFSet',
	alias: 'widget.awedisplaymdsfset',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	margins: '0 10 0 10',

	padding: '10 0 5 20',
	resizable: false,
	border: false,
	collapsible: false,


	items: [{
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		margins: '10 0 0 0',
		defaults: {
			labelAlign: 'top',
			width: 350,
			readOnly: true
		},
		items: [{
			xtype: 'combobox',
			name: 'dialogProjekt',
			itemId: 'dialogProjekt',
			fieldLabel: i18n.awe.form.projektDia(),
			displayField: 'name',
			queryMode: 'local',
			queryParam: 'name',
			store: 'DispDialogProjektStore',
			valueField: 'name',
			maxLength: 10,
			width: 290,
			margins: '0 20 0 0'
		}]
	}, {
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			labelAlign: 'top',
			width: 350,
			readOnly: true
		},
		items: [{
			xtype: 'combobox',
			name: 'projektId',
			itemId: 'projektId',
			fieldLabel: i18n.awe.form.projektMDS(),
			displayField: 'pdsKBez',
			queryMode: 'local',
			store: 'DispProjektStore',
			valueField: 'pdsId',
			width: 290,
			margins: '0 20 0 0'
		} , {
			xtype: 'combobox',
			name: 'teilprojektId',
			itemId: 'teilprojektId',
			fieldLabel: i18n.awe.form.teilprojekt(),
			displayField: 'pdsKBez',
			queryMode: 'local',
			store: 'DispTeilProjektStore',
			valueField: 'pdsId',
			typeAhead: true,
			width: 290,
			margins: '0 20 0 0',
			forceSelection: true
		}, {
			xtype: 'combobox',
			name: 'stuecklisteId',
			itemId: 'stuecklisteId',
			fieldLabel: i18n.awe.form.anlauf(),
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
			store: 'DispStuecklisteStore',
			valueField: 'pdsId',
			displayField: 'displayField',
			width: 290,
			disableKeyFilter: true
		}]
	}, {
		xtype: 'textareafield',
		width: 910,
		maxLength: 240,
		name: 'massnahmeDispl',
		itemId: 'massnahmeDisplId',
		fieldLabel: i18n.awe.form.massnahme(),
		labelAlign: 'top',
		margins: '0 20 0 0',
		readOnly: true
	}, {
		xtype: 'fieldcontainer',
		layout: 'hbox',
		defaults: {
			labelAlign: 'top',
			// width: 290,
			readOnly: true
		},
		items: [{
				xtype: 'fieldcontainer',
				layout: 'vbox',
				defaults: {
					// labelAlign: 'top',
					flex: 1,
					//width: 290,
					readOnly: true
				},
				items: [
				{
					xtype: 'radiogroup',
					fieldLabel: i18n.awe.form.massnahmeTyp(),
					itemId: 'massnahmeTypDispl',
					name: 'massnahmeTypDispl',
					columns: 1,
					defaults: {
						readOnly: true,
						name: 'massnahmeTypeDispl'
					},
					items: [{
						boxLabel: i18n.awe.form.massnahmeInformele(),
						inputValue: 1,
						id: 'radioInformelleDispl'
					}, {
						boxLabel: i18n.awe.form.massnahmeErstellen(),
						inputValue: 0,
						id: 'radioErstellenDispl'
					}]
				},{
			        xtype: 'fieldcontainer',
			        layout: 'hbox',
			        defaults: {
			            labelAlign: 'top',
			            width: 290
			        },
			        items: [{
	                    xtype: 'pjbCombobox',
	                    name: 'treiberDispl',
	                    fieldLabel: i18n.awe.form.treiber(),
	                    labelWidth: 100,
	                    labelAlign: 'top',
	                    allowBlank: false,
	                    margin: '0 20 0 0',
	                    itemId: 'treiberDispl',
	                    forceSelection: true,
	                    isSelected: false,
	                    vtype: 'comboSelect'
	                }, {
	                    xtype: 'datefield',
	                    labelAlign: 'top',
	                    anchor: '100%',
	                    name: 'zielterminDispl',
	                    //margin: '10 120 0 0',
	                    itemId: 'zielterminDispl',
	                    fieldLabel: i18n.awe.form.zieltermin(),
	                    format: i18n.awe.word.defaultDateFormat(),
	                    allowBlank: false
			        }]
				},{
			        xtype: 'fieldcontainer',
			        layout: 'hbox',
			        margins: '10 0 0 0',
			        items: [{
    		            xtype:'checkboxfield',
    		            name: 'deviationSheetDisplayMdsFSet',
    		            itemId: 'deviationSheetDisplayMdsFSet',
    		            inputValue: true,
    		            labelWidth: 100,
    		            fieldLabel: i18n.awe.form.deviationSheet(),
    		            uncheckedValue: false,
    		            hidden: false,
    		            readOnly: true
    		        },{
    		            xtype:'checkboxfield',
    		            name: 'notificationE1DisplayMdsFSet',
    		            itemId: 'notificationE1DisplayMdsFSet',
    		            inputValue: true,
    		            margins: '0 0 0 190',
    		            labelWidth: 140,
    		            fieldLabel: i18n.awe.form.notificationE1(),
    		            uncheckedValue: false,
    		            hidden: false,
    		            readOnly: true
    		        }]
			}, {
	        xtype: 'fieldcontainer',
	        margins: '10 0 0 0',
	        items: [{

				xtype: 'grid',
				itemId: 'displayAttachmentsGrid',
				name: 'displayAttachmentsGrid',
				title: i18n.awe.form.attachmentLabel(),
				width: 350,
				height: 150,
				margins: '5 0 0 0',
				defaults: {
					sortable: false
				},
				store: 'DispAttachmentStore',
				multiSelect: false,
				columns: [{
					xtype: 'actioncolumn',
					width: 30,
					items: [{ //download
						iconCls: 'x-btn-download margin-right-10',
						tooltip: i18n.awe.form.downloadAttachment(),
						handler: function(grid, rowIndex, colIndex) {
							var record = grid.getStore().getAt(rowIndex);
							this.fireEvent('downloadAttachment', record);
						}
					}]
				}, {
					text: i18n.global.msg.description(),
					dataIndex: 'anBeschreibung',
					tooltip: i18n.global.msg.description(),
					width: 220,
					editor: {
						allowBlank: true
					}
				}, {
					text: i18n.word.datum(),
					dataIndex: 'anErfasst',
					tooltip: i18n.word.datum(),
					// width: 100,
					flex:1
				}]
	        }]
			}]
	    }]
	}


	]
});