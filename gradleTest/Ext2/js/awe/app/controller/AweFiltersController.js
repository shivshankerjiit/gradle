Ext.define('Awe.controller.AweFiltersController', {
    extend: 'Ext.app.Controller',
    requires: ['MDS.Utils.Misc', 'MDS.Utils.Response'],
    stores: ['WerkStore', 'BzaTypStore', 'AenderungsartStore', 'AntragsstatusStore', 'Klassifikation', 'AweVarianteStore', 'BetrBaureihenStore', 'ProjektFilterStore', 'TeilprojektFilterStore', 'StuecklisteFilterStore'],
    views: ['awe.AweFiltersView', 'awe.AweList'],
    refs: [{
        ref: 'aweFilterWindow',
        selector: '#AweFiltersView'
    }, {
        ref: 'aweList',
        selector: 'awelist'
    }],
    init: function() {
        this.control({
            'AweFiltersView button[action=filterAwes]': {
                click: this.filterAwes
            },
            'AweFiltersView button[action=clearFilterAwesCloseWindow]': {
                click: this.clearFilterAwesCloseWindow
            },
            'AweFiltersView button[action=clearFilterAwes]': {
                click: this.clearFilterAwes
            },
            'AweFiltersView #betrBaureihen, AweFiltersView #betrBereich, AweFiltersView #betrGewerke, AweFiltersView #betrProduktionslinie':{
            	boxready: this.changeCombosForFilter
            },
            'AweFiltersView awepdrsfset #betrBaureihen':{
            	select: this.onBetrBaureihenSelect
            },
            'AweFiltersView awepdrsfset #paev':{
            	render: this.onRenderPaev
            },
            'AweFiltersView #filterSachnummer':{
            	blur: this.onFilterSnrBlur,
                change: this.onSnrChange
            },
            'AweFiltersView #stuecklisteId': {
                beforeselect: this.beforeAnlaufSelect,
                change: {
                    fn: this.onAnlaufChange,
                    buffer: 150
                }
            },

        });
    },
    filterAwes: function() {
    	var windowWidget = this.getAweFilterWindow();
    	if(this.getSnrLoadingFlag()){
    		var buttonAction = windowWidget.down('#buttonAction');

    		buttonAction.setValue(1);
    		windowWidget.setLoading(true);
    	} else {
            var filterForm = Ext.getCmp('aweWindowForm');
            if(filterForm && filterForm.getForm() && filterForm.getForm().getValues()){
        		var formValues = filterForm.getForm().getValues();
        		if(!formValues.ncmNummer){
        			formValues.ncmNummer="";
        		}

        		if(formValues.betroffeneBaureihen && formValues.betroffeneBaureihen.length == 0) {
        			formValues.betroffeneBaureihen = null;
        		}

        		if(formValues.betroffeneBereichen && formValues.betroffeneBereichen.length == 0) {
        			formValues.betroffeneBereichen = null;
        		}

        		if(formValues.betroffeneProduktionslinien && formValues.betroffeneProduktionslinien.length == 0) {
        			formValues.betroffeneProduktionslinien = null;
        		}

        		clearObject(formValues, [null, ""]);
        		windowWidget.close();

        		var failureHandler = function() {
        			MDS.Utils.Misc.setUserInfoMessage(i18n.global.msg.save(), i18n.global.msg.error(), 'x-icon-error');
        		}

        		Ext.getStore('AweDataStore').loadPage(1,{
        			params: {
        				'updateFilter': true,
        				'filter': Ext.encode(formValues)
        			}
        		});

            }
    	}
    },
    clearFilterAwesCloseWindow: function() {
        var windowWidget = this.getAweFilterWindow();
        windowWidget.close();
    },
    clearFilterAwes: function() {
    	var windowWidget = this.getAweFilterWindow();
    	if(this.getSnrLoadingFlag()){
    		var buttonAction = windowWidget.down('#buttonAction');

    		buttonAction.setValue(2);
    		windowWidget.setLoading(true);
    	} else {
    		var form = windowWidget.down('form').getForm();
    		form.reset(true);

    		form.findField('projektId').getStore().loadData([],false);
	    	form.findField('teilprojektId').getStore().loadData([],false);
	    	form.findField('stuecklisteId').getStore().loadData([],false);
    	}
    },
    changeCombosForFilter:function(combo){
    	combo.getSubmitData=  function() {
    		var me = this,
    		data = null,
    		val;
    		if (!me.disabled && me.submitValue && !me.isFileUpload()) {
    			val = me.getSubmitValue();
    			if (val !== null) {
    				data = {};
    				data[me.getName()] = val;
    			}
    		}
    		return data;
    	};
    	combo.forceSelection=false;
    },
    onBetrBaureihenSelect: function(combo, records){
    	var form = this.getAweFilterWindow().down('form').getForm();


    	var recordsIds = [];

        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record && record.data && record.data.id) {
                    recordsIds.push(record.data.id);
                }
            }
        }

        var arrayIdsList = Ext.JSON.encode(recordsIds);
        var bereichField = form.findField('betroffeneBereichen');
        if(!bereichField){
    		return;
    	}
        var betrBereichStore = null;
        if(bereichField && bereichField.store){
            betrBereichStore = Ext.getStore(bereichField.store);
        }

        form.findField('betroffeneBereichen').setLoading(true);
        form.findField('betroffeneBereichen').reset();
    	betrBereichStore.load({
    		params: {
                baureihenIds: arrayIdsList
    		},
    		callback: function(records, operation, success) {
    			form.findField('betroffeneBereichen').setLoading(false);
    		}
    	});
    },

    onSnrChange: function(combo) {

            if(!isFilteredAwe){
                var project = null;
                if (combo.up().up().up().query('#projektId')) {
                    project = combo.up().up().up().query('#projektId').first();
                }
                if (project) {
                    project.getStore().removeAll();
                    project.reset();
                }
        }
        isFilteredAwe = false;

    },


    onAnlaufChange: function(combo, record, index, eOpts) {

        var store = combo.getStore();
        store.clearFilter();
        store.filter({
            property: 'searchField',
            anyMatch: true,
            value: combo.getRawValue()
        });
        if (combo.getValue() === null) {
            combo.reset();
        }
    },
    beforeAnlaufSelect: function(combo, record, index, eOpts) {
        if (record.get('pdsId') == -1) {
            return false;
        }
    },
    onRenderPaev: function(combo) {
    	Ext.create('Ext.tip.ToolTip',{
            target: combo.getEl(),
            html: i18n.awe.form.paevTooltip(),
            componentLayout: 'auto'
        });
    },
    getSnrLoadingFlag: function(){
    	var snrLoadingFlagField = this.getAweFilterWindow().down('#snrLoadingFlag');
    	if(snrLoadingFlagField.getValue()=='true'){
    		return true;
    	} else{
    		return false;
    	}
    },
    executeSuspendedClick: function( suspendedAction){
    	var queryString = 'button[action =' + suspendedAction + ']';
    	var suspendedButton = this.getAweFilterWindow().down(queryString);
    	suspendedButton.fireEvent('click', suspendedButton);
    },
    executeSuspendedAction: function(){
    	var buttonAction =this.getAweFilterWindow().down('#buttonAction');

    	if(buttonAction.getValue()){
    		switch(buttonAction.getValue()){
    		case '1':
    			this.executeSuspendedClick('filterAwes');

    			//Reset the flag
        		buttonAction.setValue(null);
    			break;
    		case '2':
    			this.executeSuspendedClick('clearFilterAwes');

    			//Reset the flag
        		buttonAction.setValue(null);
    			break;
    		}

    	}
    },
    onFilterSnrBlur : function(field, event, options) {

        if(Ext.isArray(field)){  // Chek if it is triggered manually by fireEvent()
            options = field['eOpts'];
            field=field['this'];
        }
        var value = field.getValue();
		var form = field.findParentByType('form').getForm();
		var aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');
		var snrLoadingFlagField =this.getAweFilterWindow().down('#snrLoadingFlag');

		var oldTeilSnr = form.findField('oldsnr').getValue();
		if (value.length > 0 && Ext.String.trim(value) != Ext.String.trim(oldTeilSnr)) {
			snrLoadingFlagField.setValue(true);

			aweTeilObject.load(value, {
				scope: this,
				success: function(record, operation) {
					var buttonAction =this.getAweFilterWindow().down('#buttonAction');
					if(!(buttonAction.getValue()== '2')){ // button action for reset of filter
						field.setValue(record.get('snrShow'));
						form.findField('oldsnr').setValue(record.get('snrShow'));
                        form.findField('snrTeilId').setValue(record.get('id'));

						var project = form.findField('projektId');
						var teilProjekt = form.findField('teilprojektId');
						var stueckliste = form.findField('stuecklisteId');
						//Load the project stores
						var projectStore = project.getStore();
						var teilprojektStore = teilProjekt.getStore();
						var stuecklisteStore = stueckliste.getStore();

						var selectedProject = options["projektId"] ? options["projektId"] : form.findField('projektId').getValue();
						var selectedTeilProjekt = options["teilprojektId"] ? options["teilprojektId"]: form.findField('teilprojektId').getValue();
						var selectedStueckliste =options["stuecklisteId"] ? options["stuecklisteId"]:  form.findField('stuecklisteId').getValue();

						form.findField('projektId').setLoading(true);

						projectStore.load({
							params: {
								teil: record.get('id')
							},
							callback: function(records, operation, success) {
								//clear the fields and the stores for the sub project and anlauf
								form.findField('projektId').clearValue();
								form.findField('teilprojektId').clearValue();
								form.findField('stuecklisteId').clearValue();

								form.findField('projektId').setLoading(false);


								if(projectStore.find('pdsId', selectedProject) >= 0) {
									form.findField('projektId').setValue(selectedProject);
									form.findField('teilprojektId').setLoading(true);
									teilprojektStore.load({
										params: {
											teil: record.get('id'),
											apjId: selectedProject
										},
										callback: function(records, operation, success) {
											form.findField('teilprojektId').setLoading(false);

											if(teilprojektStore.find('pdsId', selectedTeilProjekt) >= 0) {
												form.findField('teilprojektId').setValue(selectedTeilProjekt);
												form.findField('stuecklisteId').setLoading(true);
												stuecklisteStore.load({
													params: {
														teil: record.get('id'),
														apjId: selectedProject,
														tpjId: selectedTeilProjekt
													},
													callback: function(records, operation, success) {

														if(stuecklisteStore.find('pdsId', selectedStueckliste) >= 0) {
															form.findField('stuecklisteId').setValue(selectedStueckliste);
														}
														form.findField('stuecklisteId').setLoading(false);
													}
												});
											}
										}
									});
								}

							}
						});
					}
				},
				callback: function(){
					this.getAweFilterWindow().setLoading(false);
					snrLoadingFlagField.setValue('');
					this.executeSuspendedAction();
				}
			});
		}
    }


});