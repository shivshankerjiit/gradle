Ext.define('Awe.store.Klassifikation', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Klassifikation',
    proxy : {
        type : 'ajax',
        url : 'awe.classification.combo.action',
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
