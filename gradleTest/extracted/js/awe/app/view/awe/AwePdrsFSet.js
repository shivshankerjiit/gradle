Ext.define('Awe.view.awe.AwePdrsFSet', {
	extend: 'Ext.form.FieldSet',
	alias: 'widget.awepdrsfset',
	requires: ['UX.form.field.ClearButton'],


	config: {
		requiredField : true
	},

	constructor:  function(config) {
		var me = this;

		Ext.each(me.items, function(item, index, allItems) {
			if (item.afterLabelTextTpl) {
				item.afterLabelTextTpl = config.requiredField ? Awe.sharedData.requiredMarker : '';
			}
			if(item.labelClsExtra){
				item.labelClsExtra = config.requiredField ? 'field-required' : '';
			}
			if(config.requiredField === false){
				item.allowBlank = true;
			}

		});

		this.initConfig(config);
        this.callParent(arguments);
        return this;
	},

	layout: 'vbox',
	margins: '0 10 0 10',
	padding: '10 10 5 10',
	border: false,
	resizable: false,
	collapsible: false,

	defaults: {
		labelAlign: 'top',
		width: 293,
		margins: '10 0 0 0',
		forceSelection: true
	},
	items: [{
		xtype: 'combobox',
		fieldLabel: i18n.awe.form.betrBaureihen(),
        afterLabelTextTpl: Awe.sharedData.requiredMarker,
        labelClsExtra: 'field-required',
		name: 'betroffeneBaureihen',
		itemId: 'betrBaureihen',
		store: 'BetrBaureihenStore',
		queryMode: 'remote',
		queryParam: 'betrBaureihen',
		valueField: 'id',
		triggerAction: 'all',
		displayField: 'name',
		typeAhead: true,
		multiSelect: true,
		cls: 'multiSelectCombo',
		style: 'width: 380px !important',
		allowBlank: false,
		plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
		getSubmitData: function() {
			if (this.getValue() && Ext.isArray(this.getValue())) {
				return {
					'betroffeneBaureihenList': this.getValue()
				};
			} else {
				return {
					'betroffeneBaureihenList': null
				};
			}
		},
		listConfig: {
			getInnerTpl: function() {
				var tpl = '<span class="chkCombo-default-icon chkCombo" ></span><p>{name}</p>';
				return tpl;
			}
		},
		listeners: {
			change: function() {
				if (this.getValue() === null) {
					this.reset();
					var betrBereich = null;
					if (this.up().up().query('#betrBereich')) {
						betrBereich = this.up().up().query('#betrBereich').first();
					}
					if (betrBereich) {
						betrBereich.getStore().removeAll();
						betrBereich.reset();
					}
				}
			}
		},
		plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false})
	}, {
		xtype: 'combobox',
		fieldLabel: i18n.awe.form.betrBereich(),
        //afterLabelTextTpl: Awe.sharedData.requiredMarker,
        //labelClsExtra: 'field-required',
		name: 'betroffeneBereichen',
		itemId: 'betrBereich',
		store: 'BetrBereichStore',
		queryMode: 'local',
		queryParam: 'baureihenId',
		valueField: 'id',
		triggerAction: 'all',
		displayField: 'name',
		typeAhead: true,
		multiSelect: true,
		cls: 'multiSelectCombo',
		style: 'width: 380px !important',
		//allowBlank: false,
		plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
		listConfig: {
			getInnerTpl: function() {
				var tpl = '<span class="chkCombo-default-icon chkCombo" ></span><p>{name}</p>';
				return tpl;
			}
		},
		getSubmitData: function() {
			if (this.getValue()) {
				return {
					'betroffeneBereichenList': this.getValue()
				};
			} else {
				return {
					'betroffeneBereichenList': null
				};
			}
		}
	}, {
		xtype: 'combobox',
		fieldLabel: i18n.awe.form.betrProduktionslinie(),
        //afterLabelTextTpl: Awe.sharedData.requiredMarker,
        //labelClsExtra: 'field-required',
		name: 'betroffeneProduktionslinien',
		itemId: 'betrProduktionslinie',
		store: 'BetrProduktionslinieStore',
		queryMode: 'remote',
		queryParam: 'betrProduktionslinie',
		valueField: 'id',
		triggerAction: 'all',
		displayField: 'name',
		typeAhead: true,
		multiSelect: true,
		cls: 'multiSelectCombo',
		style: 'width: 380px !important',
		//allowBlank: false,
		plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
		listConfig: {
			getInnerTpl: function() {
				var tpl = '<span class="chkCombo-default-icon chkCombo" ></span><p>{name}</p>';
				return tpl;
			}
		},

		getSubmitData: function() {
			if (this.getValue()&& Ext.isArray(this.getValue())) {
				return {
					'betroffeneProduktionslinienList': this.getValue()
				};
			} else {
				return {
					'betroffeneProduktionslinienList': null
				};
			}
		}
	}, {
		xtype: 'textfield',
		itemId: 'betrProduktionsliniestation',
		name: 'betroffeneProduktionslinienstation',
		maxLength: 100,
		fieldLabel: i18n.awe.form.betrProduktionsliniestation(),
	}, {
		xtype: 'combobox',
		itemId: 'betrGewerke',
		name: 'gewerk',
		fieldLabel: i18n.awe.form.betrGewerke(),
        //afterLabelTextTpl: Awe.sharedData.requiredMarker,
        //labelClsExtra: 'field-required',
		displayField: 'name',
		queryParam: 'betrGewerke',
		queryMode: 'remote',
		store: 'BetrGewerkeStore',
		valueField: 'id',
		typeAhead: true,
		//allowBlank: false,
		listConfig: {
			emptyText: i18n.awe.form.betrGewerkeNotFound(),
			height: 270,
			minWidth: 165
		},
		getSubmitData: function() {
			if (this.getValue() && Ext.isNumber(this.getValue())) {
				return {
					'gewerk': {
						'id': this.getValue()
					}
				};
			} else {
				return {
					'gewerk': null
				};
			}
		},
		plugins: new UX.form.field.ClearButton({hideClearButtonWhenEmpty: false, hideClearButtonWhenMouseOut: false}),
	}, {
		xtype: 'checkbox',
		name: 'ncmRel',
		fieldLabel: i18n.awe.form.ncmRel(),
		labelAlign: 'left',
		labelWidth: 105,
		inputValue: '1',
		uncheckedValue: '0',
		getSubmitData: function() {
			return {
				'ncmNummer': this.getValue()
			};
		}
	}, {
		xtype: 'textfield',
		name: 'paev',
		itemId: 'paev',
		fieldLabel: i18n.awe.form.paev(),
		maxLength: 50
			/*tooltip in the controller*/
	}]
});