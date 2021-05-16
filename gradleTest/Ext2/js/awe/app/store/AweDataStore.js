Ext.define('Awe.store.AweDataStore', {
	extend : 'Ext.data.Store',
	model : 'Awe.model.AweData',
    requires: [
        'Awe.model.AweData'
    ],
    autoLoad: true,
    autoSync: true,
	pageSize : Awe.sharedData.pageSize,
	remoteSort : true,
	remoteFilter: true,
	proxy : {
		type : 'ajax',
		url : 'awe.list.action',
		simpleSortMode:true,
        timeout: 60000,
		reader : {
			type : 'json',
			root : 'data',
			successProperty : 'success',
			totalProperty : 'totalCount'
		}
	},
	listeners: {
        beforeload: function(store,options) {
        	if (store.getProxy().extraParams.filter === undefined) {
        		store.getProxy().extraParams.filter = Ext.encode({"meineAwes":true});
        	}
        }
    }
});