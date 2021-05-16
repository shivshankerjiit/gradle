// These are the "base" column that are common to all of the tabs

var commonColumns = [{
    xtype: 'rownumberer',
    resizable: false,
    width: 20,
    flex: 0
}, {
    text: i18n.awe.grid.aweId(),
    dataIndex: 'aweId',
    itemId:'aweIdColumn',
    width: 140,
    tooltip: i18n.awe.grid.aweId(),
    flex: 0,
    renderer: function(value, meta, record, row, col, store) {
    	//console.log(value); //2018M0100-0101.0 .. und andere AWE-IDs (Erste Spalte)
    	var isSDR_Antrag = record.data['artAntrag'].toUpperCase() === 'SDR' ;
        meta.tdCls =  jspScope.isJustSupplier() === 'true' ? '' : isSDR_Antrag ? 'HAND_UNDERLINE_ITALIC' : 'HAND_UNDERLINE';
        if (!Ext.isEmpty(value)) {
        	value = value.replace(/\"/g, "");
            meta.tdAttr = 'data-qtip="' + (isSDR_Antrag ? ' SDR   ' : '') +  value  + '"';
        }
        return value;
    }
}, {
    text: i18n.awe.grid.sachnummer(),
    // dataIndex: 'snrs',
    width: 112,
    tooltip: i18n.awe.grid.sachnummer(),
    flex: 0,
    // getSortParam: function() {
    //     return 'snrs.snrShow'; //TODO research the proper string to return, beacuse currently 'snrs.snrShow' does not work; check backend console when sorting this column for hint
    // },
    renderer: function(value, metaData, record, row, col, store, gridView) {
        if (record && !Ext.isEmpty(record.get('snrs'))) {
            var tooltipText = record.get('snrs');

            metaData.tdAttr = 'data-qtip="' + tooltipText + '"';
            return record.get('snrs');
        } else {
            return '';
        }
    }
}, {
    text: i18n.awe.grid.btrffUmfang(),
    dataIndex: 'betroffenerUmfang',
    width: 130,
    tooltip: i18n.awe.grid.btrffUmfang(),
    flex: 0,
    renderer: function(value, metaData, record, row, col, store, gridView) {
        if (!Ext.isEmpty(value)) {
            metaData.tdAttr = 'data-qtip="' + value + '"';
        }
        return value;
    }
}, {
    text: i18n.awe.grid.pkm(),
    dataIndex: 'kem',
    width: 94,
    tooltip: i18n.awe.grid.pkm(),
    flex: 0
}, {
    text: i18n.awe.grid.abweichungGrund(),
    dataIndex: 'abweichungsGrund',
    width: 120,
    //tooltip: i18n.awe.grid.abweichungGrund(),
    flex: 0,
    renderer: function(value, meta, record, row, col, store) {

        meta.tdCls =  record.data['grundDetailEN'] != '' ? 'ITALIC' : '';
        meta.tdAttr = 'data-qtip="' + record.data['grundDetailEN'].replace(/\"/g, "") + '"';
        return value;
    }
}, {
    text: i18n.awe.grid.antragsstatus(),
    dataIndex: 'antragstatus',
    width: 94,
    tooltip: i18n.awe.grid.antragsstatus(),
    flex: 0,
    tdCls: 'right-bordered',
    renderer: function(value, metaData, record, row, col, store, gridView) {
    	if (i18n.awe.enums.antragsstatus) {
    		return i18n.awe.enums.antragsstatus[value]();
    	} else {
    		return value;
    	}
    }
}];

// Columns specific to the different tabs
var tabSpecificColumns = {
    termineAwe: [{
        text: i18n.awe.grid.erfasstBeantragt(),
        sortable: false,
        tooltip: i18n.awe.grid.erfasstBeantragt(),
        renderer: function(value, metaData, record, row, col, store, gridView) {
            var beantragung = store.getAt(row).data['beantragung'];
            var erfassung = store.getAt(row).data['erfassung'];
            var erstellungsDatum = store.getAt(row).data['erstellungsDatum'];

            if (!beantragung && !erfassung) {
                return erstellungsDatum;
            }

            return (erfassung || "") + ' - ' + (beantragung || "");
        }
    }, {
        text: i18n.awe.grid.von(),
        dataIndex: 'aweStart',
        tooltip: i18n.awe.grid.von()
    }, {
        text: i18n.awe.grid.bis(),
        tooltip: i18n.awe.grid.bis(),
        renderer: function(value, meta, record, row, col, store) {
            var autoEndDate = store.getAt(row).data['automatischBeendet'];
            var aweEnde = store.getAt(row).data['aweEnde'];

            if (!(autoEndDate === null) && !(autoEndDate === aweEnde)) {
                var tooltipText = i18n.awe.grid.endDateTooltip() + aweEnde;
                meta.tdAttr = 'data-qtip="' + tooltipText + '"';
                meta.tdCls = 'cell-bold';
                return autoEndDate;
            }
            return aweEnde;
        }
    },{
        text: i18n.awe.grid.kemStart(),
        dataIndex: 'kemStart',
        tooltip: i18n.awe.grid.kemStart()
    }, {
        text: i18n.awe.grid.kemEnde(),
        dataIndex: 'kemEnde',
        tooltip: i18n.awe.grid.kemEnde()
    }, {
        text: i18n.awe.grid.stuckzahl(),
        dataIndex: 'stueckzahlbegrenzung',
        tooltip: i18n.awe.grid.stuckzahl(),
        renderer: function(value, metaData, record, row, col, store, gridView) {
           return (value == null || value == 0) ? "" : value;
        }
    }, {
        text: i18n.awe.grid.genehmigung(),
        dataIndex: 'genehmigung',
        tooltip: i18n.awe.grid.genehmigung()
    }, {
        xtype: 'actioncolumn',
        text: i18n.awe.form.attachmentLabelShort(),
        tooltip: i18n.awe.form.attachmentLabel(),
        width: 40,
        flex: 0,
        sortable: false,
        items: [{
            iconCls: 'x-btn-attachment',
            tooltip: i18n.awe.form.addAttachment(),
            handler: function(grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                this.fireEvent('openAttachmentsWindow', record);
            }
        }]
    }],
    freigabe: [{
        text: i18n.awe.grid.antragsteller(),
        dataIndex: 'ersteller',
        tooltip: i18n.awe.grid.antragsteller()
    }, {
    	text: i18n.bag.QPlaner(),
    	dataIndex: 'qsVerantwortlicher',
    	tooltip: i18n.bag.QPlaner()
    }, {
        text: i18n.awe.grid.kem(),
        dataIndex: 'kemVerantwortlicher',
        tooltip: i18n.awe.grid.kem()
    }, {
        text: i18n.awe.grid.gepruft(),
        dataIndex: 'geprueftVon',
        tooltip: i18n.awe.grid.gepruft()
    }, {
        text: i18n.awe.grid.genehmigt(),
        dataIndex: 'genehmigtVon',
        tooltip: i18n.awe.grid.genehmigt()
    }, {
        text: i18n.awe.grid.dokumentation(),
        dataIndex: 'dokumentiertVon',
        tooltip: i18n.awe.grid.dokumentation()
    }],
    details: [{
        text: i18n.awe.grid.prio(),
        dataIndex: 'prioritaet',
        tooltip: i18n.awe.grid.prio()
    }, {
        text: i18n.awe.grid.bezugsarttyp(),
        dataIndex: 'bzaTyp',
        tooltip: i18n.awe.grid.bezugsarttyp(),
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (!Ext.isEmpty(record.get('bzaTyp'))) {
                return bzaTypGridConverter(record.get('bzaTyp'));
            } else {
                return '';
            }
        }
    }, {
        text: i18n.awe.grid.zusammenMitKem(),
        sortable: false,
        align: 'center',
        tooltip: i18n.awe.grid.zusammenMitKem(),
        renderer: function(value, metaData, record, row, col, store, gridView) {
            var kemsCount = record.get('kemsCount');
            if (!Ext.isEmpty(kemsCount) && kemsCount > 0) {
                metaData.tdCls = 'HAND_UNDERLINE';
            }
            return kemsCount;
        },
        listeners: {
            'click': function(grid, cell, cellIndex, rowIndex, row, record) {
                var kemsRecords = [];
                var kemsArray = grid.getStore().getAt(cellIndex).get('kems').split('|');

                if (record.get('kemsCount') > 0) {
                    grid.up('awelist').setLoading(true);

                    Ext.Array.each(kemsArray, function(value, index, itemItSelf) {
                        var kemObj = value.split(',');
                        kemsRecords.push(Ext.create('Awe.model.Kem', {
                            kemDruckformat: kemObj[0],
                            erstellungsDatum: kemObj[1],
                            aenderungsDatum: kemObj[2]
                        }));
                    });

                    if (Ext.getCmp("kemsWindow")) {
                        Ext.getCmp("kemsWindow").destroy();
                    }

                    var customWindow = Ext.create('Awe.AweCustomWindow', {
                        records: kemsRecords,
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['kemDruckformat', 'erstellungsDatum', 'aenderungsDatum']
                        }),
                        gridWidth: 290,
                        windowId: "kemsWindow",
                        minWidth: 150,
                        minHeight: 100,
                        emptyBoxWidth: 100,
                        emptyBoxHeight: 100,
                        title: i18n.word.relatedKems(),
                        columns: [{
                            header: i18n.awe.grid.KEM(),
                            dataIndex: 'kemDruckformat',
                            tooltip: i18n.awe.grid.KEM(),
                            flex: 1
                        }, {
                            header: i18n.awe.grid.erstellungsDatum(),
                            dataIndex: 'erstellungsDatum',
                            tooltip: i18n.awe.grid.erstellungsDatum(),
                            flex: 1
                        }, {
                            header: i18n.awe.grid.aenderungsDatum(),
                            dataIndex: 'aenderungsDatum',
                            tooltip: i18n.awe.grid.aenderungsDatum(),
                            flex: 1
                        }],
                        xLocation: row.xy[0] - 190,
                        yLocation: row.xy[1] + 20,
                        emptyText: i18n.word.noRelatedKems(),
                    });
                    grid.up('awelist').setLoading(false);
                    customWindow.show();
                }
            },
            scope: this
        }
    }, {
        text: i18n.awe.grid.sonderprozessBeMu(),
        dataIndex: 'sonderprozessBemusterung',
        tooltip: i18n.awe.grid.sonderprozessBeMu(),
        align: 'center',
        renderer: function(value, metaData, record, row, col, store, gridView) {
            return value ? '<span class="ffAtJa">\u2714</span>' : '';
        }
    }],
    kontext: [{
        text: i18n.awe.grid.sammelbegriff(),
        dataIndex: 'sammelbegriff',
        tooltip: i18n.awe.grid.sammelbegriff(),
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (record && !Ext.isEmpty(value)) {
                metaData.tdAttr = 'data-qtip="' + value + '"';
            }
            return value;
        }
    }, {
        text: i18n.awe.grid.proektDialogTe(),
        dataIndex: 'dialogProjekt',
        tooltip: i18n.awe.grid.proektDialogTe()
    }, {
        text: i18n.awe.grid.proektMdsTs(),
        dataIndex: 'projekt',
        tooltip: i18n.awe.grid.proektMdsTs(),
        getSortParam: function() {
            return 'projekt.pdsKBez';
        }
    }, {
        text: i18n.word.teilprojekt(),
        dataIndex: 'teilprojekt',
        tooltip: i18n.word.teilprojekt(),
        getSortParam: function() {
            return 'teilprojekt.pdsKBez';
        }
    }, {
        text: i18n.word.anlauf(),
        dataIndex: 'stueckliste',
        tooltip: i18n.word.anlauf(),
        getSortParam: function() {
            return 'stueckliste.slBez';
        }
    }],
    pdrs: [{
        text: i18n.awe.grid.betrBaureihen(),
        dataIndex: 'betroffeneBaureihen',
        tooltip: i18n.awe.grid.betrBaureihen(),
        flex: 4,
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (record && !Ext.isEmpty(record.get('betroffeneBaureihen'))) {
                var tooltipText = record.get('betroffeneBaureihen');
                metaData.tdAttr = 'data-qtip="' + tooltipText + '"';
                return record.get('betroffeneBaureihen');
            } else {
                return '';
            }
        }
    }, {
        text: i18n.awe.grid.betrBereich(),
        dataIndex: 'betroffeneBereiche',
        tooltip: i18n.awe.grid.betrBereich(),
        flex: 4,
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (record && !Ext.isEmpty(record.get('betroffeneBereiche'))) {
                var tooltipText = record.get('betroffeneBereiche');
                metaData.tdAttr = 'data-qtip="' + tooltipText + '"';
                return record.get('betroffeneBereiche');
            } else {
                return '';
            }
        }
    }, {
        text: i18n.awe.grid.betrProduktionslinie(),
        dataIndex: 'betroffeneProduktionslinien',
        tooltip: i18n.awe.grid.betrProduktionslinie(),
        flex: 4,
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (record && !Ext.isEmpty(record.get('betroffeneProduktionslinien'))) {
                var tooltipText = record.get('betroffeneProduktionslinien');
                metaData.tdAttr = 'data-qtip="' + tooltipText + '"';
                return record.get('betroffeneProduktionslinien');
            } else {
                return '';
            }
        }
    }, {
        text: i18n.awe.grid.betrProduktionsliniestation(),
        dataIndex: 'betroffeneProduktionslinienstation',
        tooltip: i18n.awe.grid.betrProduktionsliniestation(),
        flex: 5,
        renderer: function(value, metaData, record, row, col, store, gridView) {
            if (!Ext.isEmpty(value)) {
                metaData.tdAttr = 'data-qtip="' + value + '"';
            }
            return value;
        }
    }, {
        text: i18n.awe.grid.betrGewerk(),
        dataIndex: 'gewerk',
        tooltip: i18n.awe.grid.betrGewerk(),
        flex: 4
    }, {
        text: i18n.awe.grid.ncmRelevant(),
        dataIndex: 'ncmNummer',
        tooltip: i18n.awe.grid.ncmRelevant(),
        align: 'center',
        renderer: function(value, metaData, record, row, col, store, gridView) {
            return value ? '<span class="ffAtJa">\u2714</span>' : '';
        },
        flex: 3
    }, {
        text: i18n.awe.grid.paev(),
        dataIndex: 'paev',
        tooltip: i18n.awe.grid.paev(),
        flex: 4
    }]
};

Ext.define('Awe.view.awe.AweList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.awelist',
    height: 500,
    autoScroll: true,
    columns: {
        items: commonColumns.concat(tabSpecificColumns[Awe.sharedData.defaultTab]),
        defaults: {
            sortable: true,
            hideable: false,
            draggable: false,
            flex: 1
        }
    },
    store: 'AweDataStore',
    cls: 'gridw-row-numberer',
    flex: 1,
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'AweDataStore',
        dock: 'bottom',
        displayInfo: true
    }],

    initComponent: function() {
        this.tbar = {
            baseCls: '',
            cls: 'x-tbar-tabpanel-white',
            defaults: {
                overCls: 'tablike-button-active-o',
                focusCls: 'tablike-button-active-f',
                pressedCls: 'tablike-button-active-p',
                cls: 'tablike-button',
                toggleGroup: 'awes',
                allowToggle: true,
                allowDepress: false,
                handler: this.reconfigureTabs
            },
            items: [{
                text: i18n.awe.grid.termineAwe(),
                id: 'termineAwe'
            }, {
                text: i18n.awe.grid.freigabe(),
                id: 'freigabe'
            }, {
                text: i18n.awe.grid.details(),
                id: 'details'
            }, {
                text: i18n.awe.grid.kontext(),
                id: 'kontext'
            }, {
                text: i18n.awe.grid.pdrs(),
                id: 'pdrs'
            }]
        };

        this.callParent(arguments);

        this.store.on('beforeload', this.onBeforeStoreLoad, this);
    },

    onBeforeStoreLoad: function(store, records, successful, eOpts) {
        var me = this;

        var lastSelected = me.getSelectionModel().getLastSelected() ? me.getSelectionModel().getLastSelected() : 0;
        store.on('load', function(store2, records2, successful2, eOpts2) {
            var recToSelect = null;
            Ext.Array.each(records2, function(rec, index, allRecords) {
                if (lastSelected === 0 || rec.get('aweId') === lastSelected.get('aweId')) {
                    recToSelect = rec;
                    return false;
                }
            });
            if (recToSelect) {
                me.getSelectionModel().select(recToSelect);
            }
        }, store, {single: true});
    },

    // This function assumes that the ID of the tab (actually the button in the
    // topbar) is a key
    // in the "tabSpecificColumns" object
    reconfigureTabs: function(btn) {
        var grid = btn.up('grid');
        var store = Ext.StoreMgr.lookup('AweDataStore');
        var columnsForTab = tabSpecificColumns[btn.getId()];
        grid.reconfigure(store, commonColumns.concat(columnsForTab));

    }
});