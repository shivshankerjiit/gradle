Ext.define('Awe.controller.AweDisplayPanelController', {
	extend: 'Ext.app.Controller',
	requires: [],
	stores: ['DispBetrBereich', 'DispProjektStore', 'DispTeilProjektStore', 'DispStuecklisteStore', 'DispDialogProjektStore', 'DispLieferantStore', 'DispAttachmentStore'],
	models: [],
	views: ['awe.AweDisplayPanel', 'awe.displaypanel.AweDisplayGeneralFSet', 'awe.displaypanel.AweDisplayVerteilerFSet',
		'awe.displaypanel.AweDisplaySachnummerFSet', 'awe.displaypanel.AweDisplayMdsFSet', 'awe.displaypanel.AweDisplayPdrsFSet', 'awe.AweDialogSDR'
	],
	refs: [{
		ref: 'aweDisplayPanel',
		selector: '#awedisplaydialog awedisplaypanel'
	}],
	init: function() {
		this.control({
			'#awedisplaydialog awedisplaypanel #0, #awedisplaydialog awedisplaypanel #1, #awedisplaydialog awedisplaypanel #2': {
				click: this.onTabSwitch
			},
			'#awedisplaydialog awedisplaypanel #3, #awedisplaydialog awedisplaypanel #4, #awedisplaydialog awedisplaypanel #5, #awedisplaydialog awedisplaypanel #6': {
				click: this.onTabSwitch
			},
			'#awedisplaydialog awedisplaypanel #displSnrsGrid': {
				viewRecord: this.loadSnrInFields
			},
			'#awedisplaydialog awedisplaypanel awedisplaypdrsfset #paev': {
                render: this.onRenderPaev
            }
		});
	},
	onTabSwitch: function(button) {
		var page;
		switch (button.getItemId()) {
			case '0':
				page = 0;
				break;
			case '1':
				page = 1;
				break;
			case '2':
				page = 2;
				this.getAweDisplayPanel().getLayout().setActiveItem(2);
				this.checkStoresLoading();
				return;
			case '3':
				page = 3;
				break;
			case '4':
				page = 4;
				break;
			case '5':
				page = 5;
				break;
			case '6':
				page = 6;
				break;
		}
		this.getAweDisplayPanel().getLayout().setActiveItem(page);
	},
	checkStoresLoading: function() {
		var panel = this.getAweDisplayPanel();
		var form = panel.getForm();
		var projektStore = form.findField('projektId').getStore();
		var teilprojektStore = form.findField('teilprojektId').getStore();
		var stuecklisteStore = form.findField('stuecklisteId').getStore();
		if (projektStore.isLoading() || teilprojektStore.isLoading() || stuecklisteStore.isLoading()) {
			panel.down('awedisplaymdsfset').setLoading(true);
		}
	},
	loadSnrInFields: function(_, record) {
		this.resetFieldsSnr();
		var form = this.getAweDisplayPanel().getForm();
		var positionsGrid = this.getAweDisplayPanel().down('#dispPositionsGrid');

		// get all top fields
		var snrField = form.findField("sachnummer");
		var zgsField = form.findField("zgs");
		var bzaTypField = form.findField("bzaTyp");
		var lieferantField = form.findField("lieferant");
		var ersAltteil = form.findField("ersAltteil");
		var teilebenennungField = form.findField("teilBenennung");

		var data = record.data;

		// load position, lieferant & zgs stores
		if (positionsGrid && record.positions()) {
			var recordsCount = record.positions().getCount();
			var records = record.positions().getRange(0, recordsCount);
			positionsGrid.getStore().loadRecords(records);
		}
		zgsField.bindStore(createZgsStore(data.zgs));
		zgsField.setValue(data.zgs);


		snrField.setValue(Ext.String.trim(data.snr));
		ersAltteil.setValue(data.ersAltteilText);
		teilebenennungField.setValue(data.teilebenennung);

		// set lieferant and bzaTyp as models
		lieferantField.reset();
		if (data.lieferant && data.lieferant.lnId && data.lieferant.lnKname) {
			this.loadLieferantStore(record.get('teil').id, form);
			var lieferantModel = Ext.create('Awe.model.Lieferant', {
				lnId: data.lieferant.lnId,
				lnKname: data.lieferant.lnKname
			});
			lieferantField.setValue(lieferantModel);
		}


		if (data.bzaTyp) {
			var bzaTypModel = Ext.create('Awe.model.BzaTyp', {
				name: data.bzaTyp,
				value: bzaTypConverter(data.bzaTyp)
			});
			bzaTypField.setValue(bzaTypModel);
		}
	},
	loadLieferantStore: function(part, form) {
		if (part) {
			var lieferantField = form.findField('lieferant');
			var lieferantStore = lieferantField.getStore();


			lieferantField.setLoading(true);

			lieferantStore.load({
				scope: this,
				params: {
					id: part
				},
				callback: function(records, operation, success) {
					lieferantField.setLoading(false);
				}
			});
		}
	},
	 resetFieldsSnr: function() {
        var aweDisplayPanel = this.getAweDisplayPanel()
        var form = aweDisplayPanel.getForm();
        var snrField = form.findField("sachnummer");
        var zgsField = form.findField("zgs");
        var bzaTypField = form.findField("bzaTyp");
        var lieferantField = form.findField("lieferant");
        var ersAltteil = form.findField("ersAltteil");
        var teilebenennungField = form.findField("teilBenennung");

        snrField.setValue('');
        zgsField.setValue('');
        bzaTypField.reset();
        bzaTypField.setValue('');
        lieferantField.setRawValue('');
        ersAltteil.setValue('');
        teilebenennungField.setValue('');

        // remove position, lieferant & zgs stores
        if (zgsField.getStore()) {
            zgsField.getStore().removeAll();
        }
        aweDisplayPanel.down('#dispPositionsGrid').getStore().removeAll();
        aweDisplayPanel.down('#lieferant').getStore().removeAll();

    },
    onRenderPaev: function(combo) {
        Ext.create('Ext.tip.ToolTip', {
            target: combo.getEl(),
            html: i18n.awe.form.paevTooltip(),
            componentLayout: 'auto'
        });
    },
});