Ext.define('Awe.view.awe.AweMdsFSet', {
	extend: 'Ext.form.FieldSet',
	requires: ['UX.form.field.CounterTextField'],
	xtype: 'awemdsfset',
	itemId: 'aweMdsFSet',
	alias: 'widget.awemdsfset',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	margins: '0 10 0 10',
	padding: '10 0 5 10',
	resizable: false,
	border: false,
	collapsible: false,

	items: [{
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			labelAlign: 'top',
			width: 350
		},
		items: [{
			xtype: 'combobox',
			name: 'dialogProjekt',
			itemId: 'dialogProjekt',
			fieldLabel: i18n.awe.form.projektDia(),
			displayField: 'name',
			queryMode: 'local',
			queryParam: 'name',
			store: 'DialogProjektStore',
			valueField: 'name',
			typeAhead: true,
			maxLength: 10,
			margins: '0 20 0 0',
			width: 290,
			getSubmitData: function() {
				if (this.getValue()) {
					return {
						'dialogProjekt': this.getValue()
					};
				} else {
					return {
						'dialogProjekt': null
					};
				}
			},
			listConfig: {
				height: 270,
				minWidth: 165
			}
		}]
	}, {
		xtype: 'fieldcontainer',
		layout: {
			type: 'hbox',
			align: 'left'
		},
		defaults: {
			labelAlign: 'top',
			width: 350
		},
		items: [{
			xtype: 'combobox',
			name: 'projektId',
			itemId: 'projektId',
			fieldLabel: i18n.awe.form.projektMDS(),
			displayField: 'pdsKBez',
			queryMode: 'local',
			store: 'ProjektStore',
			triggerAction: 'all',
			valueField: 'pdsId',
			typeAhead: true,
			forceSelection: true,
			margins: '0 20 0 0',
			width: 290,
			listConfig: {
				emptyText: i18n.awe.form.noProjektMDSFound(),
				height: 270,
				minWidth: 165
			},
			getSubmitData: function() {
				if (this.getValue()) {
					return {
						'projekt': {
							'pdsId': this.getValue()
						}
					};
				} else {
					return {
						'projekt': null
					};
				}
			}
		}, {
			xtype: 'combobox',
			name: 'teilprojektId',
			itemId: 'teilprojektId',
			fieldLabel: i18n.awe.form.teilprojekt(),
			displayField: 'pdsKBez',
			queryMode: 'local',
			store: 'TeilprojektStore',
			valueField: 'pdsId',
			typeAhead: true,
			forceSelection: true,
			margins: '0 20 0 0',
			width: 290,
			listConfig: {
				emptyText: i18n.awe.form.noTeilprojektFound(),
				height: 270,
				minWidth: 165
			},


			getSubmitData: function() {
				if (this.getValue()) {
					return {
						'teilprojekt': {
							'pdsId': this.getValue()
						}
					};
				} else {
					return {
						'teilprojekt': null
					};
				}
			}
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
			store: 'StuecklisteStore',
			valueField: 'pdsId',
			displayField: 'displayField',
			disableKeyFilter: true,
			forceSelection: true,
			width: 290,
			getSubmitData: function() {
				if (this.getValue()) {
					return {
						'stueckliste': {
							'slId': this.getValue()
						}
					};
				} else {
					return {
						'stueckliste': null
					};
				}
			},
			listConfig: {
				height: 270,
			}
		}]
	}, {
		xtype: 'textareafield',
		width: 910,
		maxLength: 240,
		name: 'massnahme',
		itemId: 'massnahmeId',
		fieldLabel: i18n.awe.form.massnahme(),
        afterLabelTextTpl: Awe.sharedData.requiredMarker,
        labelClsExtra: 'field-required',
		labelAlign: 'top',
		allowBlank: false,
		margins: '0 20 0 0',
		plugins: new UX.form.field.CounterTextField({ remainingTooltipText: i18n.global.msg.remainingChars() })
	}, {
		xtype: 'radiogroup',
		fieldLabel: i18n.awe.form.massnahmeTyp(),
		columns: 1,
		itemId: 'massnahmeTyp',
		name: 'massnahmeTyp',
		defaults: {
			name: 'massnahmeType'
		},
		items: [{
			boxLabel: i18n.awe.form.massnahmeInformele(),
			inputValue: 1,
			id: 'radioInformelle',
			checked: true
		}, {
			boxLabel: i18n.awe.form.massnahmeErstellen(),
			inputValue: 0,
			id: 'radioErstellen',
			disabled: true
		}]
	}, {
		xtype: 'fieldcontainer',
		layout: 'hbox',
		defaults: {
			labelAlign: 'top',
			width: 290
		},
		items: [{
			xtype: 'pjbCombobox',
			name: 'treiber',
			getSubmitData: function() {
				return {
					'treiber': {
						'id': this.getValue()
					}
				};
			},
			fieldLabel: i18n.awe.form.treiber(),
			labelWidth: 100,
			allowBlank: false,
			margin: '0 20 0 0',
			itemId: 'treiber',
			forceSelection: true,
			isSelected: false,
			vtype: 'comboSelect',
			disabled: true
		}, {
			xtype: 'datefield',
			anchor: '100%',
			name: 'zieltermin',
			itemId: 'zieltermin',
			fieldLabel: i18n.awe.form.zieltermin(),
			format: i18n.awe.word.defaultDateFormat(),
			allowBlank: false,
			disabled: true
		}]
	}, {
	    xtype: 'fieldcontainer',
	    layout: 'hbox',
	    margins: '10 0 0 0',
	    items: [{
	        xtype:'checkboxfield',
	        name: 'deviationSheet',
	        itemId: 'deviationSheet',
	        inputValue: true,
	        labelWidth: 100,
	        fieldLabel: i18n.awe.form.deviationSheet(),
	        uncheckedValue: false,
	        hidden: false
	    },{
            xtype:'checkboxfield',
            name: 'notificationE1',
            itemId: 'notificationE1',
            inputValue: true,
            margins: '0 0 0 190',
            labelWidth: 140,
            fieldLabel: i18n.awe.form.notificationE1(),
            uncheckedValue: false,
            hidden: false
	    },{
	    	xtype: 'button',
			itemId: 'aweWizardUploadBtn',
			margins: '0 0 0 160',
			height: 22,
			width: 175,
			text: jspScope.lang() == 'en' ? (i18n.awe.form.auswaehlen() + ' ' + i18n.awe.form.anhang().toLowerCase()) : (i18n.awe.form.anhang() + ' ' + i18n.awe.form.auswaehlen().toLowerCase())
        }]
	}]
});