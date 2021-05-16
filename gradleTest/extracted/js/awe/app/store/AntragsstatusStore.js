Ext.define('Awe.store.AntragsstatusStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Antragsstatus',
    proxy : {
        type : 'ajax',
        url : 'awe.antragsstatus.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    },

    listeners: {
        beforeload: checkStoreLoaded
    }
});
