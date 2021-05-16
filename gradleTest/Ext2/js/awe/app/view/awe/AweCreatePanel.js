var clearFieldsOnTeilChange = function(field) {
    //Clear readonly fields based on the loaded teil
    var form = field.findParentByType('form').getForm();
    form.findField('teilId').setValue("");
    form.findField('zgs').setValue("");
    form.findField('teilBenennung').setValue("");
    form.findField('betroffenerUmfang').setValue("");
    form.findField('zeichnungsDatum').setValue("");
    form.findField('sieheZeichnungTeilSachnummer').setValue("");
    form.findField('sieheZeichnungTeilId').setValue("");

    //Clear stores
    Ext.getStore('ProjektStore').removeAll();
    Ext.getStore('TeilprojektStore').removeAll();
    Ext.getStore('StuecklisteStore').removeAll();
    Ext.getCmp('positionsGrid').getStore().removeAll();
    form.findField('zgs').getStore().removeAll();
};

var searchBzaTyp = function(werkField, sachnummerField, form) {
    var werk = werkField.getValue();
    var sachnummer = sachnummerField.getValue();
    var bzaTyp = Ext.ModelManager.getModel('Awe.model.BzaTyp');

    if(!Ext.isEmpty(werk) && !Ext.isEmpty(sachnummer)) {
  bzaTyp.load(1, {
      scope: this,
      params: {
    werk: werk,
    teil: sachnummer
      },
      success: function(record, operation) {
    form.findField('bzaTyp').setValue(record);
      }
  });
    }

};

var searchZeichnung = function(teil, zgsField, form){
    if(teil.get('zgs') == zgsField.getValue()){
  if(teil.get('zeichnungsDatum')){
      form.findField('zeichnungsDatum').setValue(teil.get('zeichnungsDatum'));
      form.findField('sieheZeichnungTeilSachnummer').setValue("");
      form.findField('sieheZeichnungTeilId').setValue("");
      form.findField('sieheZeichnungTeilSachnummer').hide();
      form.findField('zeichnungsDatum').show();
  }
  if(teil.get('sieheZeichnungId')){
      form.findField('sieheZeichnungTeilSachnummer').setValue(teil.get('sieheZeichnungShow'));
      form.findField('sieheZeichnungTeilId').setValue(teil.get('sieheZeichnungId'));
      form.findField('zeichnungsDatum').setValue("");
      form.findField('zeichnungsDatum').hide();
      form.findField('sieheZeichnungTeilSachnummer').show();
  }
    } else {
   form.findField('sieheZeichnungTeilSachnummer').setValue("");
   form.findField('sieheZeichnungTeilId').setValue("");
   form.findField('zeichnungsDatum').setValue("");
    }
};


var setQSVerantwortlicher = function(werkField, TeilField, form) {
  var snrId = TeilField.getValue();
  var werk = werkField.getValue();
  var qsVerantwortlicherField = form.findField("qsVerantwortlicherId");

  if(!Ext.isEmpty(snrId) && !Ext.isEmpty(werk)) {

    qsVerantwortlicherField.setLoading(true);

    // Populate Q-Planner
      Ext.Ajax.request({
        scope: this,
        url: 'AweJson.do?method=getQSVerantwortlicher',
        method: 'POST',
        params: {
          snrId: snrId,
          werk: werk
        },
        callback : function(options, success, response) {


          if (MDS.Utils.Response.isSuccessful(response)) {

              var jsonData = Ext.decode(response.responseText);
              var qualityResponsible = jsonData.data[0];
              var store = qsVerantwortlicherField.getStore();


              if(qualityResponsible !== null && qualityResponsible !== "undefined") {
                store.removeAll();
                store.add(qualityResponsible);
                qsVerantwortlicherField.setValue(store.getAt(0));
                qsVerantwortlicherField.setReadOnly(true);
              } else {
                qsVerantwortlicherField.setValue("");
                qsVerantwortlicherField.setReadOnly(false);
              }

            }
          qsVerantwortlicherField.setLoading(false);
        }
      });

  } else {
    qsVerantwortlicherField.setValue("");
    qsVerantwortlicherField.setReadOnly(false);
  }
};

Ext.define('Awe.view.awe.AweCreatePanel', {
    id: 'aweCreatePanel',
    extend: 'Ext.form.Panel',
    requires: ['UX.form.field.ClearButton', 'MDS.form.field.ProjektbeteiligterCombobox'],
    alias: 'widget.awecreatepanel',
    border: false,
    aweTeilObject: Ext.ModelManager.getModel('Awe.model.Teil'),
    layout:  {
        type: 'vbox',
        align: 'left'
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
            name: 'sieheZeichnungTeilId'
        }, {
            xtype: 'hiddenfield',
            name: 'aweId',
            itemId: 'aweId',
            listeners: {
                'change': function(cmp) {
                    var panel = Ext.getCmp('awecreatedialog');
                    if (!Ext.isEmpty(this.getValue())) {
                        panel.setTitle(i18n.awe.form.edittitle() + this.getValue());
                    } else {
                        panel.setTitle(i18n.awe.form.createtitle());
                    }
                }
            }
        },
        /** ***** Fieldset 1 ***** * */
        {
            xtype: 'fieldset',
            margins: '0 10 0 10',
            padding: '10 0 10 10',
            border: false,
            collapsible: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                /** ***** Fieldcontainer 1 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '0 10 0 0',
                    labelWidth: 85,
                    labelAlign: 'left',
                    width: 291
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
                    displayField: 'dispWerkLabel',
                    queryMode: 'remote',
                    queryParam: 'dispWerkLabel',
                    store: 'WerkStore',
                    valueField: 'werk',                 
                    typeAhead: true,
                    allowBlank: false,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.werkNotFound(),
                        height: 270,
                        minWidth: 165
                    },
                    listeners: {
                  'select': function(combo, records, eOpts) {
                      var form = this.findParentByType('form').getForm();
                      searchBzaTyp(this, form.findField('sachnummer'), form);
                      setQSVerantwortlicher(this, form.findField('sachnummer'), form);
                  }
                    }
                }, {
                    xtype: 'combobox',
                    name: 'klassifikation',
                    itemId: 'klassifikation',
                    fieldLabel: i18n.awe.form.klassifikation(),
                    labelWidth: 90,
                    displayField: 'value',
                    queryMode: 'remote',
                    queryParam: 'value',
                    store: 'Klassifikation',
                    valueField: 'name',
                    typeAhead: true,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.klassifikationNotFound(),
                        height: 270,
                        minWidth: 165
                    }
                }, {
                    xtype: 'combobox',
                    name: 'prioritaet',
                    fieldLabel: i18n.awe.form.prioritaet(),
                    labelWidth: 60,
                    displayField: 'value',
                    queryMode: 'remote',
                    queryParam: 'value',
                    store: 'Prioritaet',
                    valueField: 'name',
                    typeAhead: true,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.prioritaetNotFound(),
                        height: 270,
                        minWidth: 165
                    }
                }]
            }, {
                /** ***** Fieldcontainer 2 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 85,
                    labelAlign: 'left',
                    width: 291
                },
                items: [{
                    xtype: 'textfield',
                    name: 'sachnummer',
                    getSubmitData: function() {
                        return {
                            'teil': {
                                'id': this.findParentByType('form').getForm().findField('teilId').getValue()
                            }
                        };
                    },
                    itemId: 'sachnummer',
                    fieldLabel: i18n.awe.form.snr(),
                    labelWidth: 40,
                    allowBlank: false,
                    listeners: {
                  'blur': function(field, event, options) {
                      var value = field.getValue();
                      var form = field.findParentByType('form').getForm();
                      var oldTeilSnr = form.findField('snr').getValue();
                      var oldTeilId = form.findField('teilId').getValue();
                      var aweTeilObject = this.up('#aweCreatePanel').aweTeilObject;
                      if (value.length > 0) {
                      //if (Ext.String.trim(value) != Ext.String.trim(oldTeilSnr)) {
                          var saveButton = Ext.getCmp('saveButton');
                          saveButton.disable();
                          saveButton.setTooltip(i18n.awe.form.saveButtonDisabledTooltip());
                          aweTeilObject = Ext.ModelManager.getModel('Awe.model.Teil');
                          aweTeilObject.load(value, {
                          scope: this,
                          failure: function(record, operation) {
                              field.markInvalid(i18n.awe.form.snrNotFound());
                              field.setActiveError(i18n.awe.form.snrNotFound());
                              clearFieldsOnTeilChange(field);
                          },
                          success: function(record, operation) {

                              //Populate readonly fields based on the loaded teil
                              if(record.get('id') != oldTeilId) {
                              //Always show the snrShow in the sachnummer field
                              form.findField('sachnummer').setValue(record.get('snrShow'));
                              form.findField('zgs').bindStore(createZgsStore(record.get('zgs')));
                              form.findField('zgs').setValue(record.get('zgs'));
                              form.findField('teilBenennung').setValue(record.get('teilBez'));
                              form.findField('betroffenerUmfang').setValue(record.get('teilBez'));
                              form.findField('teilId').setValue(record.get('id'));
                              form.findField('snr').setValue(record.get('snrShow'));
                              //Load the project stores
                              var projectStore = Ext.getStore('ProjektStore');
                              var teilprojektStore = Ext.getStore('TeilprojektStore');
                              var stuecklisteStore = Ext.getStore('StuecklisteStore');

                              var selectedProject = form.findField('projektId').getValue();
                              var selectedTeilProjekt = form.findField('teilprojektId').getValue();
                              var selectedStueckliste = form.findField('stuecklisteId').getValue();

                              //Load the project store for the new teil
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
                                  teilprojektStore.removeAll();
                                  stuecklisteStore.removeAll();

                                  //Check if the selected project is in the new project store for this teil
                                  form.findField('projektId').setLoading(false);
                                  if (selectedProject != null && projectStore.find('pdsId', selectedProject) >= 0) {
                                      form.findField('projektId').setValue(selectedProject);

                                      //Reload the teilproject store if the old selected project is in the new project store and if we have old selection for teilproject
                                      if (selectedTeilProjekt != null) {
                                      form.findField('teilprojektId').setLoading(true);
                                      teilprojektStore.load({
                                          params: {
                                          teil: record.get('id'),
                                          apjId: selectedProject
                                          },
                                          callback: function(records, operation, success) {

                                          form.findField('teilprojektId').setLoading(false);
                                          //Check if the selected teilproject is in the new teilproject store for this teil and project combination
                                          if(teilprojektStore.find('pdsId', selectedTeilProjekt) >= 0) {
                                              form.findField('teilprojektId').setValue(selectedTeilProjekt);

                                              //Reload the stueckliste store if the old selected teilproject is in the new teilproject store and if we have old selection for stueckliste
                                              if (selectedStueckliste != null) {
                                              form.findField('stuecklisteId').setLoading(true);
                                              stuecklisteStore.load({
                                                      params: {
                                                      teil: record.get('id'),
                                                      apjId: selectedProject,
                                                      tpjId: selectedTeilProjekt
                                                      },
                                                      callback: function(records, operation, success) {
                                                      form.findField('stuecklisteId').setLoading(false);
                                                      //Check if the selected stueckliste is in the new stueckliste store for this teil, project and teilproject combination
                                                      if (stuecklisteStore.find('pdsId', selectedStueckliste) >= 0) {
                                                          form.findField('stuecklisteId').setValue(selectedStueckliste);
                                                    }
                                                      }
                                              });
                                              }
                                          }
                                          }
                                      });
                                      }
                                  }
                                  }
                              });
                              this.up('#aweCreatePanel').aweTeilObject = record;
                              //Load new bzaTyp
                              searchBzaTyp(form.findField('werkWerk'), field, form);
                              searchZeichnung(record, form.findField('zgs'), form);
                              setQSVerantwortlicher(form.findField('werkWerk'), field, form);
                              Ext.getCmp('positionsGrid').getStore().removeAll();
                              }
                          },
                          callback : function(record, operation) {
                              saveButton.setTooltip(i18n.global.msg.save() + ' (Alt+S)');
                              saveButton.enable();
                          }
                          });
                      //}
                      } else {
                        clearFieldsOnTeilChange(field);
                      }
                  }
                    }
                }, {
                    xtype: 'textfield',
                    name: 'teilBenennung',
                    fieldLabel: i18n.awe.form.teilebenennung(),
                    labelWidth: 90,
                    itemId: 'teilebenennung',
                    readOnly: true

                }, {
                    xtype: 'combobox',
                    name: 'zgs',
                    fieldLabel: i18n.awe.form.zgs(),
                    labelWidth: 60,
                    itemId: 'zgs',
                    valueField: 'zgs',
                    displayField: 'zgs',
                    typeAhead: true,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.zgsNotFound(),
                        height: 270,
                        minWidth: 165
                    },
                    listeners: {
                  'select': function(dv, records, item, index, e) {
                      var form = this.findParentByType('form').getForm();
                      searchZeichnung(this.up('#aweCreatePanel').aweTeilObject, dv, form);
                  }
                    }
                }]
            }, {
                /** ***** Fieldcontainer  3***** * */
                xtype: 'fieldcontainer',
                defaults: {
                    margins: '10 10 0 0'
                },
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: i18n.awe.form.zeichnungsdatumSZeichnung(),
                    name: 'sieheZeichnungTeilSachnummer',
                    itemId: 'sieheZeichnungTeilSachnummer',
                    getSubmitData: function() {
                  if(this.findParentByType('form').getForm().findField('sieheZeichnungTeilId').getValue()){
                      return {
                                'sieheZeichnungTeil': {
                                    'id': this.findParentByType('form').getForm().findField('sieheZeichnungTeilId').getValue()
                                }
                            };
                  }
                    },
                    width: 291,
                    labelWIdth: 105,
                    readOnly: true
                },{
                    xtype: 'datefield',
                    fieldLabel: i18n.awe.form.zeichnungsdatumSZeichnung(),
                    name: 'zeichnungsDatum',
                    itemId: 'zeichnungsDatum',
                    width: 285,
                    labelWidth: 105,
                    readOnly: true,
                    hidden: true
                },{
                    xtype:'checkboxfield',
                    name: 'sonderprozessBemusterung',
                    itemId: 'sonderprozessBemusterung',
                    inputValue: true,
                    width: 200,
                    labelWidth: 150,
                    fieldLabel: i18n.awe.form.sonderprozessBemusterung(),
                    uncheckedValue : false,
                    readOnly: true
                }]
            }, {
                /** ***** Fieldcontainer 4 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 85,
                    labelAlign: 'left',
                    width: 291
                },
                items: [/*{
                    xtype: 'combobox',
                    name: 'grundId',
                    getSubmitData: function() {
                        return {
                            'grund': {
                                'id': this.getValue()
                            }
                        };
                    },
                    fieldLabel: i18n.awe.form.abweichungsgrund(),
                    valueField: 'id',
                    displayField: 'grund',
                    labelWidth: 100,
                    store: 'AbweichungsgrundStore',
                    queryMode: 'remote',
                    queryParam: 'grund',
                    typeAhead: true,
                    allowBlank: false,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.abweichungsgrundNotFound(),
                        height: 270,
                        minWidth: 165
                    },
                    listeners: {
                        'select': function(combo, records, eOpts) {
                            var form = this.findParentByType('form').getForm();
                            var record = records[0];
                            if (record.get('id') == i18n.awe.form.grund.componentNotSampledId()) {
                                form.findField('sonderprozessBemusterung').setValue(true);
                            } else {
                                form.findField('sonderprozessBemusterung').setValue(false);
                            }
                        }
                    }
                },*/ {
                    xtype: 'textareafield',
                    width: 594,
                    labelWidth: 105,
                    maxLength: 240,
                    margins: '10 0 0 0',
                    name: 'grundDetails',
                    itemId: 'grundDetails',
                    grow: false,
                    fieldLabel: i18n.awe.form.grundAbweichung(),
                    anchor: '100%'
                }]
            }, {
                /** ***** Fieldcontainer 5 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 85,
                    labelAlign: 'left',
                    width: 291
                },
                items: [{
                    xtype: 'textfield',
                    name: 'sammelbegriff',
                    itemId: 'sammelbegriff',
                    labelWidth: 100,
                    fieldLabel: i18n.awe.form.sammelbegriff()
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    width: 170,
                    fieldLabel: i18n.awe.form.aktionierungEmpf(),
                    labelWidth: 135,
                    defaultType: 'checkboxfield',
                    items: [{
                        name: 'aktionierungEmpfohlen',
                        id: 'aktionierungEmpfohlen',
                      inputValue: true,
                      uncheckedValue : false
                    }]
                }, {
                    xtype: 'textfield',
                    name: 'betroffenerUmfang',
                    itemId: 'betroffenerUmfang',
                    width: 414,
                    margins: '10 0 0 0',
                    fieldLabel: i18n.awe.form.btrffUmfang(),
                    labelWidth: 120
                }]
            }, {
                /** ***** Fieldcontainer 6 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 165,
                    labelAlign: 'left'
                },
                items: [{
                    xtype: 'textareafield',
                    width: 895,
                    name: 'aweAbweichung',
                    grow: true,
                    itemId: 'aweAbweichung',
                    fieldLabel: i18n.awe.form.abweichungseinzelheiten(),
                    anchor: '100%'
                }]
            }]
        }, {
        /** ***** Fieldset 2 ***** * */
      xtype: 'fieldset',
      id: 'positionsSearchFieldset',
  margins: '0 10 0 10',
  layout: {
      type: 'vbox',
      align: 'stretch'
  },
  items: [{
            /** ***** sub Fieldcontainer 1 ***** * */
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 90,
                labelAlign: 'left',
                width: 291
            },
            items: [{
                xtype: 'textfield',
                name: 'searchSachnummer',
                margins: '10 10 0 0',
                itemId: 'searchSachnummer',
                fieldLabel:  i18n.awe.form.sachnummer()
            }, {
                xtype: 'textfield',
                name: 'searchBaureihe',
                margins: '10 10 0 0',
                itemId: 'searchBaureihe',
                fieldLabel: i18n.awe.form.baureihe()
            }, {
                xtype: 'textfield',
                name: 'searchEmbodiment',
                margins: '10 0 0 0',
                itemId: 'searchEmbodiment',
                fieldLabel: i18n.awe.form.ausfuehrungsart()
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: {
          type: 'hbox',
          align: 'stretch'
            },
            defaults: {
          labelWidth: 90,
          labelAlign: 'left',
          width: 291
            },
            items:[{
                xtype: 'textfield',
                name: 'searchModul',
                margins: '10 10 0 0',
                itemId: 'searchModul',
                maxHeight: 22,
                fieldLabel: i18n.awe.form.modul()
            }, {
                xtype: 'textfield',
                name: 'searchPositionFrom',
                margins: '10 10 0 0',
                itemId: 'searchPositionFrom',
                maxHeight: 22,
                fieldLabel: i18n.awe.form.positionVon()
            }, {
                xtype: 'textfield',
                name: 'searchPositionTo',
                margins: '10 0 0 0',
                itemId: 'searchPositionTo',
                maxHeight: 22,
                fieldLabel: i18n.awe.form.positionBis()
            }]
        },{
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'end'
            },
            items: [{
                xtype: 'button',
                textAlign: 'right',
                iconCls: 'imgButtonSearchToolbar',
                action: 'searchPositions',
                tooltip: i18n.global.msg.search(),
                width: 34,
                height: 34,
                cls: 'top-panel',
                focusCls: 'setOutline',
                margins: '1 1 1 1'
            }]
        },{
            /** ***** sub Fieldcontainer 2 ***** * */
            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margins: '10 0 0 0'
            },
            items: [{
                xtype: 'grid',
                id: 'positionsGrid',
                name: 'positionsGrid',
                title: i18n.awe.form.positions(),
                height: 207,
                width: 895,
                defaults: {
                    sortable: false
                },
                store: Ext.create('Ext.data.Store', {
                    model: 'Awe.model.Position'
                }),
                multiSelect: true,
                columns: [{
                    text: i18n.awe.form.positionswindow.br(),
                    dataIndex: 'baureihe',
                    tooltip: i18n.awe.form.positionswindow.br(),
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.aa(),
                    dataIndex: 'ausfuehrungsart',
                    tooltip: i18n.awe.form.positionswindow.aa(),
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.modul(),
                    dataIndex: 'modul',
                    tooltip: i18n.awe.form.positionswindow.modul(),
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.pose(),
                    dataIndex: 'posE',
                    tooltip: i18n.awe.form.positionswindow.pose(),
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.posv(),
                    tooltip: i18n.awe.form.positionswindow.posv(),
                    dataIndex: 'posV',
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.codeleiste(),
                    dataIndex: 'coderegel',
                    tooltip: i18n.awe.form.positionswindow.codeleiste(),
                    width: 99,
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
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.lenkung(),
                    dataIndex: 'lenkung',
                    tooltip: i18n.awe.form.positionswindow.lenkung(),
                    width: 99
                }, {
                    text: i18n.awe.form.positionswindow.wahlweise(),
                    dataIndex: 'wahlweise',
                    tooltip: i18n.awe.form.positionswindow.wahlweise(),
                    width: 99
                }]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'end'
                },
                defaults: {
                    margins: '13 0 0 10'
                },
                items: [{
                    xtype: 'button',
                    text: i18n.awe.form.grid.removeAll(),
                    action: 'clearAllPositions'
                }, {
                    xtype: 'button',
                    text: i18n.awe.form.grid.removeSelection(),
                    action: 'removeSelectedPositions'
                }]
            }]
        }]
        }, {
            /** ***** Fieldset 3 ***** * */
            xtype: 'fieldset',
            border: false,
            collapsible: false,
            padding: '0 10 0 10',
            layout: {
                type: 'vbox',
                align: 'left'
            },
            items: [{
                /** ***** Fieldcontainer 1 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 10',
                    labelWidth: 125,
                    labelAlign: 'left',
                    width: 285
                },
                items: [{
                    xtype: 'datefield',
                    anchor: '100%',
                    name: 'aweStart',
                    itemId: 'aweStart',
                    fieldLabel: i18n.awe.form.plannedStart(),
                    format: i18n.awe.word.defaultDateFormat(),
                    validateOnChange: false,
                }, {
                    xtype: 'datefield',
                    anchor: '100%',
                    name: 'aweEnde',
                    itemId: 'aweEnde',
                    fieldLabel: i18n.awe.form.plannedEnd(),
                    format: i18n.awe.word.defaultDateFormat(),
                    validateOnChange: false,
                }, {
                    xtype: 'numberfield',
                    minValue: 1,
                    margins: '10 5 0 10',
                    maxValue: 6,
                    labelWidth: 50,
                    width: 235,
                    name: 'dauer',
                    itemId: 'dauer',
                    fieldLabel: i18n.awe.form.duration(),
                    decimalPrecision: 2,
                    decimalSeparator: '.',
                    step: 1,
                    fromEndField: false,
                    validateOnChange: false,
                    onFocus: function() {
                  this.fromEndField = false;
                    },
                    listeners:{
                  'spin': function(spinner, direction){
                      if(!Ext.isEmpty(spinner.getValue()) && spinner.getValue() != parseInt(spinner.getValue())){
                    if(direction == 'up'){
                        var nextValue = parseInt(spinner.getValue()) + 1;
                        spinner.step = nextValue - spinner.getValue();
                    } else if(direction == 'down'){
                        var step = spinner.getValue() - parseInt(spinner.getValue());
                              spinner.step = step;
                    }
                      } else {
                    spinner.step = 1;
                      }
                  }
                    }
                },{
                    xtype: 'label',
                    width: 50,
                    padding: '3 0 0 0',
                    text: i18n.awe.form.monate()
                }]
            }, {
                /** ***** Fieldcontainer 2 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 10',
                    labelWidth: 125,
                    labelAlign: 'left',
                    width: 285
                },
                items: [{
                    xtype: 'combobox',
                    name: 'aenderungsArt',
                    itemId: 'aenderungsArt',
                    fieldLabel: i18n.awe.form.aenderungsArt(),
                    displayField: 'value',
                    queryMode: 'remote',
                    queryParam: 'value',
                    store: 'AenderungsartStore',
                    valueField: 'name',
                    typeAhead: true,
                    forceSelection: true,
                    listConfig: {
                        emptyText: i18n.awe.form.noAenderungsArtFound(),
                        height: 270,
                        minWidth: 165
                    }
                }, {
                    xtype: 'numberfield',
                    minValue: 1,
                    maxValue: 999999,
                    name: 'stueckzahlbegrenzung',
                    itemId: 'stueckzahlbegrenzung',
                    fieldLabel: i18n.awe.form.piecenumberLimit()
                }]

            },{
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 5 0 10',
                    labelWidth: 125,
                    labelAlign: 'left',
                    width: 443
                },
                items:[{
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
                    listConfig: {
                        emptyText: i18n.awe.form.noBezugsarttypFound(),
                        height: 270,
                        minWidth: 165
                    }
                }, {
                    xtype: 'textfield',
                    name: 'aenderungsvorhaben',
                    itemId: 'aenderungsvorhaben',
                    fieldLabel: i18n.awe.form.referenzAenderungsvorhaben()
                }]
            }]
        }, {
            /** ***** Fieldset 4 ***** * */
            xtype: 'fieldset',
            border: false,
            padding: '0 10 0 10',
            collapsible: false,
            layout: {
                type: 'vbox',
                align: 'left'
            },
            items: [{
                /** ***** Fieldcontainer 1 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaultType: 'checkboxfield',
                defaults: {
                    margins: '0 0 0 10',
                    labelAlign: 'left',
                    width: 157,
                    inputValue: true,
                    uncheckedValue : false
                },
                items: [{
                    fieldLabel: i18n.awe.form.sicherheitsrelevanz(),
                    name: 'sicherheitsrelevant',
                    labelWidth: 125,
                    id: 'sicherheitsrelevant'
                }, {
                    fieldLabel: i18n.awe.form.zertifizierungsrelevanz(),
                    name: 'zertifizierungsrelevant',
                    labelWidth: 125,
                    id: 'zertifizierungsrelevant'
                }, {
                    fieldLabel: i18n.awe.form.auswirkungSicherheitsrelevanz(),
                    name: 'sicherheitsrelevanteAuswirkung',
                    width: 230,
                    labelWidth: 200,
                    id: 'sicherheitsrelevanteAuswirkung'
                }, {
                    fieldLabel: i18n.awe.form.auswirkungZertifizierungsrelevanz(),
                    name: 'zertifizierungsrelevanteAuswirkung',
                    width: 250,
                    labelWidth: 218,
                    id: 'zertifizierungsrelevanteAuswirkung'
                }]
            }, {
                /** ***** Fieldcontainer 2 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 0 0 10',
                    labelWidth: 125,
                    labelAlign: 'left',
                    width: 445
                },
                items: [{
                    xtype: 'combobox',
                    name: 'dialogProjekt',
                    itemId: 'dialogProjekt',
                    fieldLabel: 	i18n.awe.form.projektDia(),
                    displayField: 'name',
                    queryMode: 'local',
                    queryParam: 'name',
                    store : 'DialogProjektStore',
                    valueField: 'name',
                    typeAhead: true,
                    maxLength: 10,
                    listConfig: {
                        height: 270,
                        minWidth: 165
                    }
                }, {
                    xtype: 'combobox',
                    name: 'projektId',
                    itemId: 'projektId',
                    fieldLabel: i18n.awe.form.projektMDS(),
                    displayField: 'pdsKBez',
                    queryMode: 'local',
                    store: 'ProjektStore',
                    valueField: 'pdsId',
                    typeAhead: true,
                    forceSelection: true,
                    labelWidth: 80,
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
                        }
                    },
                    listeners: {
                        'select': function(_, records) {
                            var form = this.findParentByType('form').getForm();
                            var record = records[0];

                            var teilprojectStore = Ext.getStore('TeilprojektStore');
                            form.findField('teilprojektId').setLoading(true);
                            teilprojectStore.load({
                                params: {
                                    teil: form.findField('teilId').getValue(),
                                    apjId: record.get('pdsId')
                                },
                                callback: function(records, operation, success) {
                                    form.findField('teilprojektId').setLoading(false);
                                }
                            });
                        }
                    }
                }]
            },{
                /** ***** Fieldcontainer 2 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 0 0 10',
                    labelWidth: 125,
                    labelAlign: 'left',
                    width: 445
                },
                items: [{
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
                        }
                    },
                    listeners: {
                        select: function(_, records) {
                            var form = this.findParentByType('form').getForm();
                            var record = records[0];

                            var anlaufStore = Ext.getStore('StuecklisteStore');
                            form.findField('stuecklisteId').setLoading(true);
                            anlaufStore.load({
                                params: {
                                    teil: form.findField('teilId').getValue(),
                                    apjId: form.findField('projektId').getValue(),
                                    tpjId: record.get('pdsId')
                                },
                                callback: function(records, operation, success) {
                                    form.findField('stuecklisteId').setLoading(false);
                                }
                            });
                        }
                    }
                }, {
                    xtype: 'combobox',
                    name: 'stuecklisteId',
                    itemId: 'stuecklisteId',
                    fieldLabel: i18n.awe.form.anlauf(),
                    labelWidth: 80,
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
                    disableKeyFilter : true,
                    forceSelection: true,
                    getSubmitData: function() {
                        if (this.getValue()) {
                            return {
                                'stueckliste': {
                                    'slId': this.getValue()
                                }
                            };
                        }
                    },
                    listConfig: {
                        height: 270,
                        minWidth: 165
                    },
                    listeners: {
                      change: {
                        fn: function() {
                          var store = this.store;
                            store.clearFilter();
                            store.filter({
                                property: 'searchField',
                                anyMatch: true,
                                value   : this.getRawValue()
                            });
                        },
                        buffer: 150
                      },
                      beforeselect: function(combo, record, index){
                            if(record.get('pdsId') == -1) {
                              return false;
                            }
                      }
                  }
                }]
            }, {
                /** ***** Fieldcontainer 3 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    labelWidth: 125,
                    labelAlign: 'left',
                    margins: '10 0 10 0',
                    width: 445
                },
                items: [{
                    xtype: 'pjbCombobox',
                    name: 'kemVerantwortlicherId',
                    getSubmitData: function() {
                        return {
                            'kemVerantwortlicher': {
                                'id': this.getValue()
                            }
                        };
                    },
                    fieldLabel: i18n.awe.grid.kem(),
                    plugins: new UX.form.field.ClearButton({
                        hideClearButtonWhenEmpty: true
                    }),
                    minWidth: 250,
                    allowBlank: false
                },
                {
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
                    fieldLabel: i18n.bag.QPlaner(),
                    labelWidth: 80,
                    plugins: new UX.form.field.ClearButton({
                        hideClearButtonWhenEmpty: true
                    }),
                    minWidth: 250,
                    typ: 'QS'
                },
                {
                    xtype: 'pjbCombobox',
                    name: 'erstellerId',
                    getSubmitData: function() {
                        if (this.getValue()) {
                            return {
                                'ersteller': {
                                    'id': this.getValue()
                                }
                            };
                        }
                    },
                    fieldLabel: i18n.awe.filter.ersteller(),
                    labelWidth: 80,
                    plugins: new UX.form.field.ClearButton({
                        hideClearButtonWhenEmpty: true
                    }),
                    minWidth: 250,
                    typ: ''
                }]
            }, {
                /** ***** Fieldcontainer 4 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'left'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'left'
                    },
                    defaults: {
                        margins: '0 0 0 10',
                        labelWidth: 125,
                        labelAlign: 'left',
                        width: 445,
                        maxLength: 14,
                        kemId: undefined,
                        setKemId: function(kemId) {
                            this.kemId = kemId;
                        },
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
                    items:[{
                        xtype: 'textfield',
                        name: 'kemsList',
                        fieldLabel: i18n.awe.form.zusammenMit()
                    }, {
                        xtype: 'textfield',
                        name: 'kemsList',
                    }]
                },{
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'left'
                    },
                    defaults: {
                        margins: '10 0 0 10',
                        labelWidth: 125,
                        labelAlign: 'left',
                        width: 445,
                        maxLength: 14,
                        kemId: undefined,
                        setKemId: function(kemId) {
                            this.kemId = kemId;
                        },
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
                        name: 'kemsList',
                        hideEmptyLabel : false
                    }, {
                        xtype: 'textfield',
                        name: 'kemsList',
                    }]
                }]
            }, {
          xtype: 'fieldset',
          margins: '0 0 10 0',
          padding: '10 10 10 10',
          layout: {
              type: 'vbox',
              align: 'stretch'
          },
          items:[{
                    /** ***** Fieldcontainer 5 ***** * */
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'left'
                    },
                    defaults: {
                  labelWidth: 200,
                        labelAlign: 'left',
                        margins: '0 0 10 0',
                        width: 500
                    },
                    items: [{
                        xtype: 'pjbCombobox',
                        fieldLabel: i18n.awe.form.additionalReceiversApproval(),
                        plugins: new UX.form.field.ClearButton({
                            hideClearButtonWhenEmpty: true
                        }),
                        minWidth: 280,
                        listeners: {
                            select: function(combo, record, index) {
                                var store = Ext.getStore('Projektbeteiligter');
                                var isRecordExists = store.find('id', record[0].get('id'));
                                if (isRecordExists == -1) {
                                    store.add(record);
                                    store.sync();
                                }
                                combo.clearValue();
                            }
                        }
                    }]
                },{
                    /** ***** Fieldcontainer 6 ***** * */
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        width: 285
                    },
                    items: [{
                        xtype: 'grid',
                        id: 'verteilerGrid',
                        title: i18n.awe.form.additionalReceiversList(),
                        height: 207,
                        width: 895,
                        defaults: {
                            sortable: false
                        },
                        multiSelect: true,
                        columns: [{
                            text: i18n.awe.form.grid.name(),
                            dataIndex: 'name',
                            tooltip: i18n.awe.form.grid.name(),
                            width: 179
                        }, {
                            text: i18n.awe.form.grid.vorname(),
                            dataIndex: 'vorname',
                            tooltip: i18n.awe.form.grid.vorname(),
                            width: 179
                        }, {
                            text: i18n.awe.form.grid.department(),
                            dataIndex: 'abteilung',
                            tooltip: i18n.awe.form.grid.department(),
                            width: 179
                        }, {
                            text: i18n.awe.form.grid.email(),
                            dataIndex: 'email',
                            tooltip:  i18n.awe.form.grid.email(),
                            width: 179
                        }, {
                            text: i18n.awe.form.grid.phone(),
                            dataIndex: 'phone',
                            tooltip: i18n.awe.form.grid.phone(),
                            width: 177
                        }],
                        store: Ext.create('Ext.data.Store', {
                                storeId: 'Projektbeteiligter',
                                model: 'Awe.model.Projektbeteiligter'
                            })
                    }, {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                            pack: 'end'
                        },
                        defaults: {
                            margins: '13 0 10 10'
                        },
                        items: [{
                            xtype: 'button',
                            text: i18n.awe.form.grid.removeAll(),
                            action: 'clearAllVerteilers'
                        }, {
                            xtype: 'button',
                            text: i18n.awe.form.grid.removeSelection(),
                            action: 'removeSelectedVerteilers'
                        }]
                    }]
                }]
            }, {
          xtype: 'fieldset',
          padding: '10 10 0 10',
          layout: {
              type: 'vbox',
              align: 'stretch'
          },
          items:[{
                    /** ***** Fieldcontainer 7 ***** * */
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'left'
                    },
                    defaults: {
                        labelWidth: 200,
                        labelAlign: 'left',
                        margins: '0 0 10 0',
                        width: 500
                    },
                    items: [{
                        xtype: 'pjbCombobox',
                        fieldLabel: i18n.awe.form.vertAntragsdaten(),
                        plugins: new UX.form.field.ClearButton({
                            hideClearButtonWhenEmpty: true
                        }),
                        minWidth: 280,
                        listeners: {
                            select: function(combo, record, index) {
                                var store = Ext.getStore('Verteilergruppen');
                                var isRecordExists = store.find('id', record[0].get('id'));
                                if (isRecordExists == -1) {
                                    store.add(record);
                                    store.sync();
                                }
                                combo.clearValue();
                            }
                        }
                    },{
                        /** ***** Fieldcontainer 8 ***** * */
                        xtype: 'fieldcontainer',
                        width: 895,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'grid',
                            id: 'verteilerGruppenGrid',
                            title: i18n.awe.form.vertGruppenList(),
                            height: 207,
                            width: 895,
                            store: Ext.create('Ext.data.Store', {
                                storeId: 'Verteilergruppen',
                                model: 'Awe.model.Projektbeteiligter'
                            }),
                            defaults: {
                                sortable: false
                            },
                            multiSelect: true,
                            columns: [{
                                text: i18n.awe.form.grid.name(),
                                dataIndex: 'name',
                                width: 179,
                                tooltip: i18n.awe.form.grid.name()
                            }, {
                                text: i18n.awe.form.grid.vorname(),
                                dataIndex: 'vorname',
                                width: 179,
                                tooltip: i18n.awe.form.grid.vorname()
                            }, {
                                text: i18n.awe.form.grid.department(),
                                dataIndex: 'abteilung',
                                width: 179,
                                tooltip: i18n.awe.form.grid.department()
                            }, {
                                text: i18n.awe.form.grid.email(),
                                dataIndex: 'email',
                                width: 179,
                                tooltip:  i18n.awe.form.grid.email()
                            }, {
                                text: i18n.awe.form.grid.phone(),
                                dataIndex: 'phone',
                                width: 177,
                                tooltip: i18n.awe.form.grid.phone()
                            }]
                        }, {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'end'
                            },
                            defaults: {
                                margins: '13 0 0 10'
                            },
                            items: [{
                                xtype: 'button',
                                text: i18n.awe.form.grid.removeAll(),
                                action: 'clearAllGroupVerteilers'
                            }, {
                                xtype: 'button',
                                text: i18n.awe.form.grid.removeSelection(),
                                action: 'removeSelectedGroupVerteilers'
                            }]
                        }]
                    }]
                }]
            }]
        }, {
            /** ***** Fieldset 5 ***** * */
            xtype: 'fieldset',
            width: 918,
            border: false,
            margins: '0 10 0 10',
            padding: '10 0 10 10',
            collapsible: false,
            layout: {
                type: 'vbox',
                align: 'left'
            },
            items: [{
                /** ***** Fieldcontainer 1 ***** * */
                xtype: 'fieldcontainer',
                border: true,
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 115,
                    labelAlign: 'left',
                    width: 292
                },
                items: [{
                    xtype: 'datefield',
                    name: 'erfassung',
                    itemId: 'erfassung',
                    readOnly: true,
                    fieldLabel: i18n.awe.form.entryDate(),
                    format: i18n.awe.word.defaultDateFormat()
                }, {
                    xtype: 'datefield',
                    name: 'beantragung',
                    itemId: 'beantragung',
                    readOnly: true,
                    fieldLabel: i18n.awe.form.applicationDate(),
                    format: i18n.awe.word.defaultDateFormat()
                }, {
                    xtype: 'datefield',
                    name: 'genehmigung',
                    itemId: 'genehmigung',
                    readOnly: true,
                    fieldLabel: i18n.awe.form.approvalDate(),
                    width: 288,
                    labelWidth: 117,
                    format: i18n.awe.word.defaultDateFormat()
                }]
            }, {
                /** ***** Fieldcontainer 2 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 115,
                    labelAlign: 'left',
                    width: 292
                },
                items: [{
                    xtype: 'textfield',
                    name: 'geprueftVon',
                    itemId: 'geprueftVon',
                    readOnly : true,
                    fieldLabel: i18n.awe.form.checkedBy()
                }, {
                    xtype: 'textfield',
                    name: 'genehmigtVon',
                    itemId: 'genehmigtVon',
                    readOnly : true,
                    fieldLabel: i18n.awe.form.approvedBy()
                }, {
                    xtype: 'textfield',
                    name: 'dokumentiertVon',
                    itemId: 'dokumentiertVon',
                    readOnly : true,
                    width: 288,
                    labelWidth: 117,
                    fieldLabel: i18n.awe.form.documentedBy()
                }, {
                    xtype: 'hiddenfield',
                    name: 'placeholder',
                    itemId: 'placeholder'
                }]
            }, {
                /** ***** Fieldcontainer 3 ***** * */
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    margins: '10 10 0 0',
                    labelWidth: 115,
                    labelAlign: 'left'
                },
                items: [{
                    xtype: 'textareafield',
                    width: 895,
                    name: 'aweInfo',
                    grow: true,
                    itemId: 'aweInfo',
                    fieldLabel: i18n.awe.form.returnedInfo(),
                    readOnly: true,
                    anchor: '100%'
                }]
            }]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});
