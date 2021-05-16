Ext.define('Awe.view.awe.AweAttachmentsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.aweattachmentswindow',
    id: 'aweattachmentswindow',
    modal: true,
    width: 450,
    height: 250,
    bodyPadding: 10,
    border: false,
    bodyStyle: 'background: #FFF',
    closable: true,
    closeAction: 'hide',
    layout: 'absolute',
    resizable: true,
    draggable: false,
    constrain: true,
    overflowY: 'auto',
    overflowX: 'auto',
    title: i18n.awe.form.newAttachmentLabel(),
    items: [{
        xtype: 'form',
        id: 'aweAttachmentForm',
        border: false,
        defaults: {
            border: false
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'contextid'
        }, {
            xtype: 'fieldset',
            border: true,
            collapsible: false,
            bodyStyle: 'border: 2px solid #00417F',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                width: 374,
                labelWidth: 120,
                labelAlign: 'left'
            },
            items: [{
                xtype: 'filefield',
                id: 'attachment',
                name: 'file',
                allowBlank: false,
                fieldLabel: i18n.awe.form.newAttachmentLabel(),
                buttonText: i18n.awe.form.browse()
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.global.msg.description(),
                name: 'beschreibung'
            }]
        }, {
            xtype: 'grid',
            id: 'attachmentsGrid',
            //name: 'attachmentsGrid',
            title: i18n.awe.form.attachmentLabel(),
            width: 400,
            defaults: {
                sortable: false
            },
            store: 'AttachmentStore',
            multiSelect: false,
            columns: [{
                xtype: 'actioncolumn',
                width: 90,
                items: [{ //download
                    iconCls: 'x-btn-download margin-right-10',
                    tooltip: i18n.awe.form.downloadAttachment(),
                    handler: function(grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        this.fireEvent('downloadAttachment', record);
                    }
                }, { //save
                    iconCls: 'x-btn-save margin-right-10',
                    tooltip: i18n.global.msg.save(),
                    handler: function(grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        this.fireEvent('updateAttachment', record);
                    }
                }, { //delete
                    iconCls: 'x-btn-delete',
                    tooltip: i18n.global.msg['delete'](),
                    handler: function(grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        this.fireEvent('deleteAttachment', record);
                    }
                }]
            }, {
                text: i18n.global.msg.description(),
                dataIndex: 'anBeschreibung',
                tooltip: i18n.global.msg.description(),
                width: 230,
                editor: {
                    allowBlank: true
                }
            }, {
                text: i18n.word.datum(),
                dataIndex: 'anErfasst',
                tooltip: i18n.word.datum(),
                width: 80
            }],
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        }]
    }],
    tbar: {
        height: 36,
        defaults: {
            xtype: 'button',
            minWidth: 34,
            minHeight: 34,
        },
        items: [{
            itemId: 'closeButton',
            id: 'closeButton',
            action: 'closeAttachmentsWindow',
            iconCls: 'imgButtonCloseToolbar',
            tooltip: i18n.global.msg.closepopup()
        }, {
            id: 'saveAttachmentButton',
            itemId: 'saveAttachmentButton',
            iconCls: 'imgButtonSave',
            action: 'saveAttachment',
            tooltip: i18n.global.msg.save()
        }]
    },
    initComponent: function() {
        this.callParent(arguments);
    }
});