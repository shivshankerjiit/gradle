Ext.define('Awe.view.awe.AweMultiCreateDialog', {
    extend: 'Ext.window.Window',
    xtype: 'awemulticreatedialog',
    modal: true,
    bodyPadding: 10,
    border: '0 0 0 0',
    bodyStyle: 'background: #FFF',
    closable: false,
    closeAction: 'hide',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    resizable: false,
    draggable: false,
    constrain: true,
    overflowY: 'auto',
    height: 600,
    width: 980,
    title: i18n.awe.teilestatusGridDialog.title(),
    items: [{
        xtype: 'textfield',
        itemId: 'sammelbegriffField',
        allowBlank: false,
        width: 530,
        maxWidth: 530,
        fieldLabel: i18n.awe.teilestatusGridDialog.sammelbegriffLabel(),
        labelWidth: 230
    }, {
        xtype: 'grid',
        itemId: 'multiCreateDialogGrid',
        store: Ext.create('Ext.data.Store', {
            model: 'Awe.model.Awe',
            sorters: [{
                // sort the store according to the combination of a row's qs-verantworlicher and kem-verantworlicher names
                sorterFn: function(object1, object2) {
                    var qs1 = (object1.get('qsVerantwortlicher') && object1.get('qsVerantwortlicher').combinedName) ? object1.get('qsVerantwortlicher').combinedName : '';
                    var qs2 = (object2.get('qsVerantwortlicher') && object2.get('qsVerantwortlicher').combinedName) ? object2.get('qsVerantwortlicher').combinedName : '';

                    var kem1 = (object1.get('kemVerantwortlicher') && object1.get('kemVerantwortlicher').combinedName) ? object1.get('kemVerantwortlicher').combinedName : '';
                    var kem2 = (object2.get('kemVerantwortlicher') && object2.get('kemVerantwortlicher').combinedName) ? object2.get('kemVerantwortlicher').combinedName : '';

                    var name1 = qs1.concat(kem1);
                    var name2 = qs2.concat(kem2);

                    if (name1 === name2) {
                        return 0;
                    }

                    return name1 < name2 ? -1 : 1;
                }
            }]
        }),
        height: 480,
        width: 970,
        columns: [{
            xtype: 'rownumberer',
            resizable: false,
            width: 25
        }, {
            text: i18n.awe.teilestatusGridDialog.commonAweLabel(),
            flex: 1
        }, {
            text: i18n.awe.teilestatusGridDialog.qualityPlannerLabel(),
            flex: 1,
            renderer: function(value, metaData, record, row, col, store, gridView) {
                if (record.data.qsVerantwortlicher && record.data.qsVerantwortlicher.combinedNameAbteilung) {
                    return record.data.qsVerantwortlicher.combinedNameAbteilung;
                }
                return '';
            }
        }, {
            text: i18n.awe.teilestatusGridDialog.devCoordinatorLabel(),
            flex: 1,
            renderer: function(value, metaData, record, row, col, store, gridView) {
                if (record.data.kemVerantwortlicher && record.data.kemVerantwortlicher.combinedNameAbteilung) {
                    return record.data.kemVerantwortlicher.combinedNameAbteilung;
                }
                return '';
            }
        }, {
            text: i18n.word.sachnummer(),
            flex: 1,
            renderer: function(value, metaData, record, row, col, store, gridView) {
                if (record.snrs().getAt(0) && record.snrs().getAt(0).get('snr')) {
                    return record.snrs().getAt(0).get('snr');
                }
                return '';
            }
        }, {
            text: i18n.word.benennung(),
            flex: 1,
            renderer: function(value, metaData, record, row, col, store, gridView) {
                if (record.snrs().getAt(0) && record.snrs().getAt(0).get('teilebenennung')) {
                    return record.snrs().getAt(0).get('teilebenennung');
                }
                return '';
            }
        }]
    }, {
        xtype: 'container',
        height: 'auto',
        margin: '10 0 0 0',
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        defaults: {
            xtype: 'button',
            width: 'auto',
            minHeight: 20
        },
        items: [{
            itemId: 'cancelMultiselectDialog',
            text: i18n.awe.form.cancel(),
            margin: '0 10 0 0',
        }, {
        	id: 'openWizardBtn',
            itemId: 'openWizardBtn',
            text: i18n.awe.teilestatusGridDialog.forwardButton()
        }]
    }],

    // TODO: remove when it is not needed anymore as a reference
    // listeners: {
    //     element: 'el',
    //     delegate: 'input.checkboxColumn',
    //     change: function(event, element, object) {
    //         var elementIndex = element.name;
    //         var gridView = findComponentByElement(element);
    //         var gridStore = gridView.up().getStore();

    //         // when checkbox is checked, it finds all rows which it can be grouped with and highlights them; also disables checkboxes which it cannot be grouped with;
    //         // a row without a qs-verantwortlicher cannot be grouped with any other row
    //         if (element.getValue() === 'on') {
    //             var selectedRowQs = gridStore.getAt(elementIndex).get('qsVerantwortlicher').id;
    //             for (var i = 0; i < gridStore.getCount(); i++) {
    //                 var currentRowQs = gridStore.getAt(i).get('qsVerantwortlicher').id;
    //                 if (selectedRowQs === currentRowQs && selectedRowQs != undefined) {
    //                     gridView.getNode(i).className = 'x-grid-row-custom-selected';
    //                 } else if (elementIndex == i) {
    //                     gridView.getNode(i).className = 'x-grid-row-custom-selected';
    //                 } else {
    //                     gridView.getNode(i).getElementsByTagName('input')[0].disabled = true;
    //                 }
    //             }
    //         } else {
    //             // if there are no more checked checkboxes, enable all disabled checkboxes & remove the highlights from grouped rows
    //             var rows = gridView.getNodes();
    //             var allUnchecked = checkIfAllUnchecked(rows);
    //             if (allUnchecked) {
    //                 for (var i = 0; i < rows.size(); i++) {
    //                     if (rows[i].getElementsByTagName('input')[0].disabled) {
    //                         rows[i].getElementsByTagName('input')[0].disabled = false;
    //                     } else {
    //                         rows[i].className = 'x-grid-row';
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
});