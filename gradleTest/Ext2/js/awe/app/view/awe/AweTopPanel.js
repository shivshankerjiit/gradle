Ext.define('Awe.view.awe.AweTopPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['MDS.Utils.Response', 'MDS.button.TimeoutButton'],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    alias: 'widget.awetoppanel',
    border: false,
    height: 35,
    margins: {
        left: 10,
        right: 10,
        bottom: 5
    },
    cls: 'top-panel',
    window: false,
    defaults: {
        xtype: 'button',
        minWidth: 28,
        minHeight: 28,
        margin: '1 4 1 1'
    },
    items: [{
        iconCls: 'imgButtonNew',
        itemId: 'newButton',
        tooltip: i18n.global.msg['new']() + ' (Alt+N)',
        action: 'newWz',
        tabIndex: 1,
        focusCls: 'setOutline'
    },
    {
        iconCls: 'imgButtonOpen',
        itemId: 'openButton',
        tooltip: i18n.global.msg.openSingle() + ' (Alt+O)',
        action: 'open',
        tabIndex: 2,
        focusCls: 'setOutline'
    },
     {
        iconCls: 'imgButtonEdit',
        itemId: 'editButton',
        tooltip: i18n.global.msg.editSingle() + ' (Alt+E)',
        action: 'edit',
        tabIndex: 3,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonCopy',
        itemId: 'copyButton',
        tooltip: i18n.global.msg['copy2']() + ' (Alt+C)',
        action: 'copy',
        tabIndex: 4,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonExtendAwe',
        itemId: 'extendAweButton',
        tooltip: i18n.global.msg['extend']() + ' (Alt+B)',
        action: 'extend',
        tabIndex: 5,
        focusCls: 'setOutline',
        hidden: true
    },{
        iconCls: 'imgButtonDelete',
        itemId: 'deleteButton',
        tooltip: i18n.global.msg['delete']() + ' (Alt+D)',
        action: 'delete',
        tabIndex: 6,
        focusCls: 'setOutline'
    },{
        iconCls: 'imgButtonCheckDialog',
        itemId: 'checkButton',
        tooltip: i18n.awe.grid.closeDialogAwe(),
        action: 'check',
        tabIndex: 6,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonFilter',
        itemId: 'filterButton',
        tooltip: i18n.global.msg.filterdisplay() + ' (Alt+F)',
        action: 'filter',
        tabIndex: 7,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonStop',
        itemId: 'closeButton',
        tooltip: i18n.awe.grid.beenden() + ' (Alt+X)',
        action: 'close',
        tabIndex: 8,
        hidden: true,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonExcelExport',
        itemId: 'excelExportButton',
        tooltip: i18n.global.msg.excelexport() + ' (Alt+U)',
        action: 'excelExport',
        tabIndex: 9,
        focusCls: 'setOutline'
    }, {
        iconCls: 'imgButtonHelp',
        itemId: 'helpButton',
        tooltip: i18n.global.msg.help() + ' (Alt+H)',
        action: 'help',
        tabIndex: 10,
        focusCls: 'setOutline'
    }, {
        xtype:'tbfill'
    }, {
        xtype: 'timeoutbutton',
        width: 83,
        id: 'timeoutbtn',
        componentCls: 'timeoutbtn',
        style: {
            width: '83px !important'
        }
    }],

    initComponent: function() {
        this.callParent(arguments);
    }
});