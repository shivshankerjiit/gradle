var selectedRows = [];
var sammelbegriffField;

Ext.define('Awe.controller.AweMultiCreateDialogController', {
	extend: 'Ext.app.Controller',

	refs: [{
		ref: 'aweMultiCreateDialog',
		selector: 'awemulticreatedialog'
	}, {
		ref: 'aweCreateDialogWz',
		selector: 'awecreatedialogwz'
	}],

	views: [
		'awe.AweMultiCreateDialog'
	],

	init: function() {
		this.control({
			'awemulticreatedialog #openWizardBtn': {
				click: this.openWizard
			},
			'awemulticreatedialog #cancelMultiselectDialog': {
				click: this.closeDialog
			},
			'awemulticreatedialog #sammelbegriffField' : {
				afterrender: this.sammelbegriffAfterRender
			}
		});
	},

	closeDialog: function() {
		Ext.Msg.confirm(i18n.awe.grid.redirectTitle(), i18n.awe.grid.redirectMessage(), function(buttonId) {
			if (buttonId == 'yes') {
				//window.returnValue = "aweRedirect";
				top.DialogManager.registerDialogReloadFlag(self);
			}
			//window.close();
			top.DialogManager.unregisterDialog(self);
		});
	},

	openWizard: function(button, event, options) {
		sammelbegriffField = this.getAweMultiCreateDialog().down('#sammelbegriffField');

		// open wizard only if sammelbegriff is filled in
		if (sammelbegriffField.isValid()) {
			var grid = this.getAweMultiCreateDialog().down('#multiCreateDialogGrid');
			var store = grid.getStore();
			var rows = grid.getView().getNodes();
			var rowsToSkip = [];

			for(var i = 0 ; i < rows.length; i++){
				var nextEl = store.getAt(i);

				if(nextEl.data.qsKemGroup){
					var groups = store.getGroups();
					for(var j = 0; j < groups.length; j++){
						var nextGroup = groups[j];
						if(nextGroup.name == nextEl.data.qsKemGroup){

							// If the item have checkboxes add second element in the array, and will be skipped to be added in the array
							if (rows[i].getElementsByTagName('input') && rows[i].getElementsByTagName('input')[0] &&
									rows[i].getElementsByTagName('input')[0].getValue() === 'on') {
									selectedRows.push(nextGroup.children);
									i = i + nextGroup.children.length - 1 ;
							} else {
								var array = [];
								array.push(nextEl);
								selectedRows.push(array);
							}

						}
					}

				} else {
					var array = [];
					array.push(nextEl);
					selectedRows.push(array);

				}

			}


			// load the list of selected row models to wizard
			if (selectedRows.length > 0) {

				var aweDialogCtrl = this.getController('AweDialogController');
				var sammelbegriffValue = ( sammelbegriffField ) ? sammelbegriffField.getValue() : "";

				// Setting the awes to an array in aweDialogController
				aweDialogCtrl.setMultipleAwes(selectedRows);

				// Setting the value of the Sammelbegriff, in aweDialogController
				aweDialogCtrl.setSammelbegriff(sammelbegriffValue);

				// Triggering only the first awe
				this.loadMultipleTeilsInWizard(selectedRows[0], sammelbegriffValue);
			}
			this.getAweMultiCreateDialog().hide();
		} else {
			Ext.MessageBox.alert({
				title: i18n.awe.message.errorTitle(),
				msg: i18n.awe.teilestatusGridDialog.sammelbegriffWarning(),
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});
		}
	},

	loadMultipleTeilsInWizard: function(awes, sammelbegriff, prevForm, prevAwe, additionalReceiversObjects, distributorGroupsObjects) {

		var form = Ext.getCmp('aweCreateWizard').getForm();
		var werkField = form.findField("werkWerk");
		var werkFieldStore = werkField.getStore();
		var snrStore = Ext.getStore('SachnummerStore');
		var positionsStore = Ext.getStore("PositionStore");
		var snrModel = null;
		var aweListCtrl = this.getController('AweListController');

		// load werkField & validate it
		werkFieldStore.load({
			callback: function(records, operation, success) {
				var record = werkFieldStore.findRecord('werk', jspScope.werk());
				if( record ) {
					werkField.setValue(record);
					werkField.setReadOnly(true);
					werkField.isSelected = true;
				}

				werkField.validate();
			}
		});

		//Setting the fields from the preveuos AWE/
		form.findField('sammelbegriff').setValue(sammelbegriff);

		var firstSNR = null;
		if(awes[0].snrs() && awes[0].snrs().getAt(0) && awes[0].snrs().getAt(0).data && awes[0].snrs().getAt(0).data.teilebenennung){
			firstSNR = awes[0].snrs().getAt(0);
			form.findField('betroffenerUmfang').setValue(firstSNR.data.teilebenennung);
		}

		// add positions to every snr
		for (var i = 0; i < awes.length; i++) {
			snrModel = awes[i].snrs().getAt(0);
			this.addPositions(snrModel, positionsStore, (i === awes.length - 1));
			snrStore.add(snrModel);
		}

		if (snrStore.first() && snrStore.first().data && snrStore.first().data.teil && snrStore.first().data.teil.id) {
            firstTeilId = snrStore.first().data.teil.id;
        } else {
            Ext.MessageBox.alert({
                title: i18n.awe.message.errorTitle(),
                msg: i18n.awe.form.errors.snrgridInit(),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }

        if (awes[0].data.kemVerantwortlicher && awes[0].data.kemVerantwortlicher.id) {
            var kemVerantwortlicherField = form.findField('kemVerantwortlicherId');
            var kemVerantwortlicherStore = form.findField('kemVerantwortlicherId').getStore();
            var aweKemVerant = awes[0].data.kemVerantwortlicher;

            kemVerantwortlicherStore.add(aweKemVerant);
            kemVerantwortlicherField.setValue(kemVerantwortlicherStore.findRecord('id', aweKemVerant.id));
            kemVerantwortlicherField.isSelected = true;
            kemVerantwortlicherField.validate();
        }

        if (awes[0].data.qsVerantwortlicher && awes[0].data.qsVerantwortlicher.id) {
            var qsVerantwortlicherField = form.findField('qsVerantwortlicherId');
            var qsVerantwortlicherStore = form.findField('qsVerantwortlicherId').getStore();
            var aweQsVerant = awes[0].data.qsVerantwortlicher;

            qsVerantwortlicherStore.add(aweQsVerant);
            qsVerantwortlicherField.setValue(qsVerantwortlicherStore.findRecord('id', aweQsVerant.id));
            qsVerantwortlicherField.isSelected = true;
            qsVerantwortlicherField.validate();
        }

        if (awes[0].data.ersteller && awes[0].data.ersteller.id) {
            var erstellerField = form.findField('erstellerId');
            var erstellerStore = form.findField('erstellerId').getStore();
            var aweErsteller = awes[0].data.ersteller;

            erstellerStore.add(aweErsteller);
            erstellerField.setValue(erstellerStore.findRecord('id', aweErsteller.id));
            erstellerField.isSelected = true;
            erstellerField.validate();
        }

        if (awes[0].data.windowPerson && awes[0].data.windowPerson.id) {
            var windowPersonField = form.findField('windowPersonId');
            var windowPersonStore = form.findField('windowPersonId').getStore();
            var windowPerson = awes[0].data.windowPerson;

            windowPersonStore.add(windowPerson);
            windowPersonField.setValue(windowPersonStore.findRecord('id', windowPerson.id));
            windowPersonField.isSelected = true;
            windowPersonField.validate();
        }

        var isSuspendedLoading = false;

		// load projekts in mds page
		this.getController('AweListController').loadAweProjekts(jspScope.projekt(), jspScope.teilprojekt(), jspScope.anlauf(), form, awes[0].snrs().getAt(0).data.teil.id);

		if(prevForm && prevAwe){

			var startDate = prevAwe.aweStart;
            var aweStartField = form.findField('aweStart');
            if (startDate && aweStartField) {
            	var aweStartDate = Ext.Date.parse(startDate, i18n.awe.word.defaultDateFormat());
                aweStartField.setValue(aweStartDate);
            }

            var endDate = prevAwe.aweEnde;
            var aweEndField = form.findField('aweEnde');
            if (endDate && aweEndField) {
            	var aweEndDate = Ext.Date.parse(endDate, i18n.awe.word.defaultDateFormat());
                aweEndField.setValue(aweEndDate);
            }

            var dauer = prevAwe.dauer;
            var aweDauerField = form.findField('dauer');
            if (dauer && aweDauerField) {
                aweDauerField.setValue(dauer);
            }

            var abweichnungsGrund = prevAwe.abweichungsGrund;
            var aweAbweichnungsGrundField = form.findField('abweichungsGrund');
            if (abweichnungsGrund && aweAbweichnungsGrundField) {
                aweAbweichnungsGrundField.setValue(abweichnungsGrund);
            }

            var grundDetails = prevAwe.grundDetails;
            var aweGrundDetailsField = form.findField('grundDetails');
            if (grundDetails && aweGrundDetailsField) {
                aweGrundDetailsField.setValue(grundDetails);
            }

            var aggregateId = prevAwe.aggregateId;
            var aweAggregateIdField = form.findField('aggregateId');
            if (aggregateId && aweAggregateIdField) {
                aweAggregateIdField.setValue(aggregateId);
            }

            var sonderprozessBemusterung = prevAwe.sonderprozessBemusterung;
            var sonderprozessBemusterungField = form.findField('sonderprozessBemusterung');
            if (sonderprozessBemusterung && sonderprozessBemusterungField) {
                sonderprozessBemusterungField.setValue(sonderprozessBemusterung);
            }

            var awePrioritaet = prevAwe.prioritaet;
            var awePrioritaetField = form.findField('prioritaet');
            if (awePrioritaet && awePrioritaetField) {
                this.loadComboboxName(awePrioritaet, awePrioritaetField);
            }

            var dialogProjekt = prevAwe.dialogProjekt;
            var aweDialogProjektField = form.findField('dialogProjekt');
            if (dialogProjekt && aweDialogProjektField) {
            	this.loadComboboxName(dialogProjekt, aweDialogProjektField);
            }


            var massnahme = prevAwe.massnahme;
            var aweMassnahmeField = form.findField('massnahme');
            if (massnahme && aweMassnahmeField) {
                aweMassnahmeField.setValue(massnahme);
            }

            if(jspScope.teilprojekt()!=0) {
	            var massnahmeType = prevAwe.massnahmeType;
	            var aweMassnahmeTypeField = form.findField('massnahmeTyp');
	            var aweTreiberField = form.findField('treiber');
	            var aweZielterminField = form.findField('zieltermin');

	            if( aweMassnahmeTypeField && massnahmeType !== undefined && massnahmeType !== null ) {
	            	var obj = new Object();
	            	obj['massnahmeType'] = massnahmeType;
	            	aweMassnahmeTypeField.setValue(obj);
	            }

	            var treiber = prevAwe.treiber;
	            if (treiber && aweTreiberField) {
	            	var treiberStore = aweTreiberField.getStore();
	            	treiberStore.add(treiber);
	            	aweTreiberField.setValue(treiberStore.findRecord('id', treiber.id));
	            	aweTreiberField.isSelected = true;
	                aweTreiberField.validate();
	            }

	            var zieltermin = prevAwe.zieltermin;
	            if (zieltermin && aweZielterminField) {
	            	var aweZieltermin = Ext.Date.parse(zieltermin, i18n.awe.word.defaultDateFormat());
	                aweZielterminField.setValue(aweZieltermin);
	            }
        	}

            var betrofBaureihen = prevAwe.betroffeneBaureihenList;
            var aweBaureihenField = form.findField('betroffeneBaureihen');
            if (betrofBaureihen && aweBaureihenField) {
                  this.loadPdrsStores(aweBaureihenField, betrofBaureihen);
            }

            var betrofBereichen = prevAwe.betroffeneBereichenList;
            var aweBereichenField = form.findField('betroffeneBereichen');
            if (betrofBereichen && aweBereichenField) {

	            	var arrayIdsList = Ext.JSON.encode(betrofBaureihen);
	            	var betrBereichStore = aweBereichenField.getStore();
	            	aweBereichenField.setLoading(true);

	            	aweBereichenField.reset();
	                betrBereichStore.load({
	                scope: this,
	                params: {
	                    baureihenIds: arrayIdsList
	                },
	                callback: function(records, operation, success) {
	                    //The bereichStore is already loaded so it doesn't reload in else statemnt in loadPdrsStores()
	                    this.loadPdrsStores(aweBereichenField, betrofBereichen);
	                    aweBereichenField.setLoading(false);
	                }
	            });

            }

            var betrofProduktlinein = prevAwe.betroffeneProduktionslinienList;
            var aweProduktlinienField = form.findField('betroffeneProduktionslinien');
            if (betrofProduktlinein && aweProduktlinienField) {
                  this.loadPdrsStores(aweProduktlinienField, betrofProduktlinein);
            }


            var betrofProduktlineinStation = prevAwe.betroffeneProduktionslinienstation;
            var aweProduktionslinienstationField = form.findField('betroffeneProduktionslinienstation');
            if (betrofProduktlineinStation && aweProduktionslinienstationField) {
                aweProduktionslinienstationField.setValue(betrofProduktlineinStation);
            }

            var gewerk = prevAwe.gewerk;
            var aweGewerkField = form.findField('gewerk');
            if (gewerk && gewerk.id && aweGewerkField) {
            	this.loadComboboxId(gewerk, aweGewerkField);
            }

            isSuspendedLoading = true;

        }

		if(additionalReceiversObjects || distributorGroupsObjects){

			if(additionalReceiversObjects.length > 0){
				var empfaengers = [];

				for(var i = 0; i<additionalReceiversObjects.length; i++ ){
					empfaengers.push(additionalReceiversObjects[i].data);
				}

				Ext.getStore('AdditionalReceiversStore').loadData(empfaengers);
			}

			if(distributorGroupsObjects.length > 0){
				var verteilersGruppe = [];
				for(var i = 0; i<distributorGroupsObjects.length; i++ ){
					verteilersGruppe.push(distributorGroupsObjects[i].data);
				}
				Ext.getStore('VerteilergruppenStore').loadData(verteilersGruppe);
			}

			isSuspendedLoading = true;

		}

		// Setting global variable to be possible to cancel the SNR loop
		isCanceledLoop = true;


		var controller = this;
		if(isSuspendedLoading){
			setTimeout(Ext.bind(controller.openSuspendedWz, controller), 2000);
		} else {
			aweListCtrl.showAwePanelWz();
		}

		this.getAweCreateDialogWz().setPagePosition(0, 0);
		this.getAweCreateDialogWz().setLoading(true);
	},

	openSuspendedWz:function(){
		var aweListCtrl = this.getController('AweListController');
		aweListCtrl.showAwePanelWz();
	},

	loadComboboxId: function(data, field) {
        if (data) {
        	if(field.getStore().getCount() > 0){
        		field.setValue(data.id);
        	} else {
	            field.setLoading(true);
	            field.getStore().load({
	                callback: function(records, operation, success) {
	                    field.setValue(field.getStore().findRecord('id', data.id));
	                    field.setLoading(false);
	                }
	            });
	        }
        }
    },

    loadComboboxName: function(data, field) {
    	if (data) {
        	if(field.getStore().getCount() > 0){
        		field.setValue(data);
        	} else {
	            field.setLoading(true);
	            field.getStore().load({
	            	scope: this,
	                callback: function(records, operation, success) {
	                    field.setValue(data);
	                    field.setLoading(false);
	                }
	            });
	        }
        }

    },

	loadPdrsStores: function(field, fieldArray) {

        if (fieldArray && field) {

            var fieldStore = field.getStore();

            if (fieldStore && fieldStore.getCount() > 0) {
                var records = fieldStore.getRange(0, fieldStore.getCount());
                this.loadMultiselectPdrsComboboxes(records, fieldArray, field);
            } else {
                fieldStore.load({
                    scope: this,
                    callback: function(records, operation, success) {
                        this.loadMultiselectPdrsComboboxes(records, fieldArray, field);
                    }
                });
            }
        }

    },

    loadMultiselectPdrsComboboxes: function(records, ids, field) {

        //This checks if the records are loaded in the Store
        var values = [];
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            if (record.data && record.data.id) {
                if (Ext.isEmpty(record.data.id)) {
                    continue;
                }

                var nameValue = record.data.id;

                if (nameValue && ids.indexOf(nameValue) > -1) {
                    values.push(record.data.id);
                }
            }
        }

        if (values.length > 0) {
            field.setValue(values);
        }
    },

	addPositions: function(snrModel, positionsStore, isLastSnr) {
		var self = this;
		positionsStore.load({
			params: {
				searchSachnummer: snrModel.get('snr')
			},
			callback: function(records, operation, success) {
				if (records) {
					for (var i = 0; i < records.length; i++) {
						if( records[i] ) {
							snrModel.positions().add(records[i]);
						}
					}
					snrModel.set('countPos', records.length);
				}

				if (isLastSnr) {
					self.getAweCreateDialogWz().setLoading(false);
				}
			}
		});
	},

	loadMultipleTeilsInGrid: function(teils, werk) {
		var grid = this.getAweMultiCreateDialog().down('#multiCreateDialogGrid');

		// the two variables below are used to create the json object, which is sent to the back-end action to load quality responsibles
		var mapObjectList = [];
		var requestParameter = {};

		grid.setLoading(true);

		this.getAweMultiCreateDialog().down('#openWizardBtn').setDisabled(true);

		for (var i = 0; i < teils.length; i++) {
			var sachnummer = teils[i].snrShow;
			this.loadAwe(sachnummer, werk, grid);

			var object = {};
			object[teils[i].id] = jspScope.werk();
			mapObjectList.push(object);
		}

		requestParameter['data'] = mapObjectList;

		// load quality responsibles & set one for each row (if any)
		this.loadQualityResponsibles(requestParameter, grid);
	},

	loadQualityResponsibles: function(requestParameter, grid) {
		Ext.Ajax.request({
			scope: this,
			url: 'awe.teilwks.list.action',
			method: 'POST',
			timeout: 60000,
			params: {
				werkTeilsMap: Ext.encode(requestParameter)
			},
			callback: function(options, success, response) {
				if (MDS.Utils.Response.isSuccessful(response)) {
					var aweResps = Ext.decode(response.responseText).data;
					var intervalCount = 1;
					var abortCount = 60;
					// gridStore.getCount() has a race condition issue and the count could be 0 or less then response count. 
					// Therefore we are checking every second if  grid count is smaller then response count.
					// After n times if count is still under we are going through the action just so the grid completes the loading.
					var interval = setInterval(function(_this) {
						console.log("intervalCount = " + intervalCount)
						var gridStore = grid.getStore();
						var gridCount = gridStore.getCount();
						if (gridCount >= aweResps.length || intervalCount++ > abortCount) {
							for (var i = 0; i < aweResps.length; i++) {
								var aweResp = aweResps[i];
								var snrShow = (aweResp && aweResp.teil) ? aweResp.teil.snrShow : '';
								var qsVerantwortlicher = aweResp ? aweResp.qsVerantwortlicher : null;
								var kemVerantwortlicher = aweResp ? aweResp.kemVerantwortlicher : null;
														
								// search for the row, where snrs match & set the quality responsible and kem vetantwortlicher
								for (var j = 0; j < gridCount; j++) {
									var gridItem = gridStore.getAt(j);
									var snrStore = gridItem.snrs();
									var index = snrStore.find('snr', snrShow);
									if (index > -1) {
										gridItem.setQsVerantwortlicher(qsVerantwortlicher);
										gridItem.setKemVerantwortlicher(kemVerantwortlicher);

										// refresh qsKemGroup field in Awe model, because it is currently empty string
										var combinedNameAbteilung = (qsVerantwortlicher && qsVerantwortlicher.combinedNameAbteilung) ? qsVerantwortlicher.combinedNameAbteilung : '';
										gridItem.set('qsKemGroup', combinedNameAbteilung);
									}
								}
							}
							gridStore.sort();

							// group models according to their qsKemGroup field
							gridStore.group('qsKemGroup');
							_this.groupRows(grid, gridStore.getGroups());

							_this.getAweMultiCreateDialog().down('#openWizardBtn').setDisabled(false);

							grid.setLoading(false);
							clearInterval(interval);
						}
					}, 1000, this);
				}
			}
		});
	},

	groupRows: function(grid, groups) {
		var gridView = grid.getView(),
			currentGroupChildren,
			rowIndex,
			cell,
			previousRowCell,
			currentRowBackgroundColor,
			previousRowBackgroundColor,
			white = '#ffffff',
			styleWhite = 'x-grid-row',
			styleGray = 'x-grid-row x-grid-row-alt';

		for (var i = 0; i < groups.length; i++) {
			currentGroupChildren = groups[i].children;
			rowIndex = currentGroupChildren[0].index;
			cell = gridView.getCell(grid.getStore().getAt(rowIndex), grid.columns[1]);
			previousRowCell = rowIndex > 0 ? gridView.getCell(grid.getStore().getAt(rowIndex - 1), grid.columns[1]) : null;
			currentRowBackgroundColor = cell.getColor('backgroundColor');
			previousRowBackgroundColor = previousRowCell ? (previousRowCell.getColor('backgroundColor')) : null;

			// if a group has more than one children & all children have the same qs-verantworlicher and kem-verantworlicher
			// put checbox in the first column of the first children's row & set the background of all children to be the same
			if (currentGroupChildren.length > 1 && groups[i].name !== "" && currentGroupChildren[0].get('kemVerantwortlicher') !== null) {
				cell.dom.innerHTML = '<input type="checkbox" style="margin: 3px 85px;" class="checkboxColumn" name="' + rowIndex + '" checked=true />';
				for (var j = 0; j < currentGroupChildren.length; j++) {
					if (previousRowBackgroundColor === white) {
						gridView.getNode(currentGroupChildren[j].index).className = styleGray;
					} else {
						gridView.getNode(currentGroupChildren[j].index).className = styleWhite;
					}
				}

			// else if the children of a group do not comply with the condition to have the same qs-verantworlicher and kem-verantworlicher
			// check if the first children's background is not the same as the background of the previous row, if so alternate the backgrounds of all children
			} else if (currentGroupChildren.length > 1 && groups[i].name !== "" && currentGroupChildren[0].get('kemVerantwortlicher') === null) {
				if (currentRowBackgroundColor === previousRowBackgroundColor) {
					for (var j = 0; j < currentGroupChildren.length; j++) {
						if (previousRowBackgroundColor === white) {
							gridView.getNode(currentGroupChildren[j].index).className = styleGray;
						} else {
							gridView.getNode(currentGroupChildren[j].index).className = styleWhite;
						}
						previousRowBackgroundColor = gridView.getCell(grid.getStore().getAt(currentGroupChildren[j].index), grid.columns[1]).getColor('backgroundColor');
					}
				}
			// else if a group has only one child, check if its background is not the same as the background of the previous row, if so alternate the background
			} else {
				if (currentRowBackgroundColor === previousRowBackgroundColor) {
					if (previousRowBackgroundColor === white) {
						gridView.getNode(rowIndex).className = styleGray;
					} else {
						gridView.getNode(rowIndex).className = styleWhite;
					}
				}
			}
		}
	},

	loadAwe: function(sachnummer, werk, grid) {
		var teil = Ext.ModelManager.getModel('Awe.model.Teil');
		teil.load(sachnummer, {
			scope: this,
			success: function(record, operation) {
				if( record ) {
					var werkStore = Ext.getStore('WerkStore');

					var snrModel = Ext.create('Awe.model.SNR', {
						teilebenennung: record.get('teilBez'),
						zgs: record.get('zgs'),
						snr: sachnummer,
						zeichnungsDatum: record.get('zeichnungsDatum'),
						sieheZeichnungTeil: record.get('sieheZeichnungId')
					});

					// load werk
					werkStore.load({
						callback: function(records, operation, success) {
							var record = werkStore.findRecord('werk', werk);
							var _werk = ( record && record.data ) ? record.data : null;
							snrModel.setWerk(_werk);
						}
					});

					// load bzaTyp & set it to the snr model
					var bzaTyp = Ext.ModelManager.getModel('Awe.model.BzaTyp');
					bzaTyp.load(1, {
						scope: this,
						params: {
							werk: werk,
							teil: sachnummer
						},
						success: function(record, operation) {
							if( record ) {
								snrModel.set('bzaTyp', record.get('name'));
								snrModel.set('bzaTypValue', record.get('value'));
							}
						}
					});

					// set teil to snr model
					snrModel.setTeil({
						id: record.get('id')
					});

					var aweModel = Ext.create('Awe.model.Awe');
					aweModel.snrs().add(snrModel);
					grid.getStore().add(aweModel);
				}
			},
			failure: function(record, operation) {
				MDS.Utils.Misc.setUserInfoMessage(i18n.awe.message.errorTitle(), i18n.awe.message.teilError(), 'x-icon-error');
			}
		});
	},
	sammelbegriffAfterRender: function(field) {
		field.focus(false, 1000);
	}
});