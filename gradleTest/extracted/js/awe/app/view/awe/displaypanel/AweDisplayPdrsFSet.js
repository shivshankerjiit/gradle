Ext.define('Awe.view.awe.displaypanel.AweDisplayPdrsFSet', {
	extend: 'Ext.form.FieldSet',
	alias: 'widget.awedisplaypdrsfset',

	layout: 'vbox',
	margins: '0 10 0 10',
	padding: '10 10 5 20',
	border: false,
	resizable: false,
	collapsible: false,

	defaults: {
		labelAlign: 'top',
		width: 293,
		margins: '10 0 0 0',
		readOnly: true
	},
	items: [{
		xtype: 'combobox',
		itemId: 'betrBaureihen',
		name: 'betroffeneBaureihen',
		fieldLabel: i18n.awe.form.betrBaureihen(),
		displayField: 'name',
		queryParam: 'betrBaureihen',
		queryMode: 'remote',
		store: 'BetrBaureihenStore',
		valueField: 'id'
	}, {
		xtype: 'combobox',
		itemId: 'betrBereich',
		name: 'betroffeneBereichen',
		fieldLabel: i18n.awe.form.betrBereich(),
		displayField: 'name',
		queryParam: 'baureihenId',
		queryMode: 'local',
		store: 'DispBetrBereich',
		valueField: 'id'
	}, {
		xtype: 'combobox',
		name: 'betroffeneProduktionslinien',
		itemId: 'betrProduktionslinie',
		fieldLabel: i18n.awe.form.betrProduktionslinie(),
		displayField: 'name',
		queryParam: 'betrProduktionslinie',
		queryMode: 'remote',
		store: 'BetrProduktionslinieStore',
		valueField: 'id'
	}, {
		xtype: 'textfield',
		itemId: 'betrProduktionsliniestation',
		name: 'betroffeneProduktionslinienstation',
		fieldLabel: i18n.awe.form.betrProduktionsliniestation(),
	}, {
		xtype: 'combobox',
		itemId: 'betrGewerke',
		name: 'gewerk',
		fieldLabel: i18n.awe.form.betrGewerke(),
		displayField: 'name',
		queryParam: 'betrGewerke',
		queryMode: 'remote',
		store: 'BetrGewerkeStore',
		valueField: 'id'
	}, {
		xtype: 'checkbox',
		name: 'ncmRel',
		fieldLabel: i18n.awe.form.ncmRel(),
		labelAlign: 'left',
		labelWidth: 105,
		inputValue: '1',
		uncheckedValue: '0'
	}, {
		xtype: 'textfield',
		name: 'paev',
		itemId: 'paev',
		fieldLabel: i18n.awe.form.paev()
		/*tooltip in the controller*/
	}]
});