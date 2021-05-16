Ext.define('Awe.store.AenderungsartStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Aenderungsart',
    proxy : {
        type : 'ajax',
        url : 'awe.aenderungsart.combo.action',
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
