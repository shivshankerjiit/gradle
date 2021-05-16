Ext.define('Awe.store.PositionStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Position',
    autoLoad: false,
    //pageSize : Awe.sharedData.positionsPageSize,
	remoteSort : true,
    proxy : {
        type : 'ajax',
        url : 'awe.positions.search.action',
        timeout: 60000,
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success',
            totalProperty : 'totalCount'
        }
    }
});
