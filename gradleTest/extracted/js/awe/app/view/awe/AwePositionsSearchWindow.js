Ext.define('Awe.view.awe.AwePositionsSearchWindow', {
    extend: 'Ext.window.Window',
    id: 'awePositionsSearchWindow',
    alias: 'widget.awepositionssearchwindow',

    title: i18n.awe.form.positions(),


    resizable: false,
    constrain: true,
    layout: 'fit',
    modal: true,
    style: 'z-index: -1;',
    listeners: {
        beforerender: function() {
            this.setSize(910, 290);
        },
        'close': function(window) {
            window.el.shadow.hide();
            window.el.fadeOut();
            window.destroy();
        }
    },
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'left'
        },
        items: [{
            xtype: 'grid',
            itemId: 'positionsSearchGrid',
            height: 260,
            store: 'PositionStore',
            defaults: {
                sortable: false
            },
            multiSelect: true,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'PositionStore',
                dock: 'bottom',
                displayInfo: true,
                prependButtons: true,
            }],
            tbar: {
            	items: [{
                    xtype: 'button',
                    iconCls: 'imgButtonAddToolbar',
                    tooltip: i18n.awe.form.positionswindow.addpositions(),
                    action: 'addPositions',
                    width: 26,
                    height: 26
                }]
            },
            columns: [{
                text: i18n.awe.form.positionswindow.br(),
                dataIndex: 'baureihe',
                tooltip: i18n.awe.form.positionswindow.br(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.aa(),
                dataIndex: 'ausfuehrungsart',
                tooltip: i18n.awe.form.positionswindow.aa(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.modul(),
                dataIndex: 'modul',
                tooltip: i18n.awe.form.positionswindow.modul(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.pose(),
                dataIndex: 'posE',
                tooltip: i18n.awe.form.positionswindow.pose(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.posv(),
                dataIndex: 'posV',
                tooltip: i18n.awe.form.positionswindow.posv(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.codeleiste(),
                dataIndex: 'coderegel',
                tooltip: i18n.awe.form.positionswindow.codeleiste(),
                flex: 0,
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
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.lenkung(),
                dataIndex: 'lenkung',
                tooltip: i18n.awe.form.positionswindow.lenkung(),
                flex: 0
            }, {
                text: i18n.awe.form.positionswindow.wahlweise(),
                dataIndex: 'wahlweise',
                tooltip: i18n.awe.form.positionswindow.wahlweise(),
                flex: 0
            }]
        }]
    }],

    initComponent: function() {
        this.callParent(arguments);
    }
});