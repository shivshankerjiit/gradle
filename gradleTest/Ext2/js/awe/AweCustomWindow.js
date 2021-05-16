Ext.define('Awe.AweCustomWindow', {

    records: undefined,
    store: undefined,
    gridWidth: undefined,
    gridMaxHeight: undefined,
    windowId: undefined,
    minWidth: undefined,
    minHeight: undefined,
    maxHeight: undefined,
    emptyBoxWidth: undefined,
    emptyBoxHeight: undefined,
    title: undefined,
    columns: undefined,
    xLocation: undefined,
    yLocation: undefined,
    emptyText: undefined,
    constrain: true,


    getShowWindow: function() {

        var onClickWindow = Ext.create('Ext.window.Window', {
            closeAction: 'destroy',
            layout: 'fit',
            modal: true,
            items: []
        });

        var onClickGrid = Ext.create('Ext.grid.Panel', {
            xtype: 'grid',
            border: false,
            stripeRows: true,
            layout: 'fit',
            viewConfig: {
                forceFit: true
            },
            width: this.gridWidth,
            maxHeight: this.gridMaxHeight,
            columns: []
        });

        var emptyBox = Ext.create('Ext.Component', {
            xtype: 'box',
            width: '100%',
            styleHtmlContent: true,
            html: '<p>' + this.emptyText + '</p>'
        });

        onClickWindow.x = this.xLocation;
        onClickWindow.y = this.yLocation;
        onClickWindow.minWidth = this.minWidth;
        onClickWindow.minHeight = this.minHeight;
        onClickWindow.maxHeight = this.maxHeight;
        onClickWindow.title = this.title;
        onClickWindow.id = this.windowId;

        if (this.store.getCount() > 0) {
            onClickGrid.reconfigure(this.store, this.columns);
            onClickWindow.add(onClickGrid);
        } else {
            onClickWindow.minWidth = this.emptyBoxWidth;
            onClickWindow.minHeight = this.emptyBoxHeight;
            onClickWindow.add(emptyBox);
        }
        return onClickWindow;
    },

    show: function(){
	this.getShowWindow().show();
    },

    constructor: function(options){
		Ext.apply(this,options || {});

		if(this.records){
			this.store.loadData(this.records);
		}
    }
});