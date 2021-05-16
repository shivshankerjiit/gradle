Ext.define('Awe.store.Prioritaet', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Prioritaet',
    proxy : {
        type : 'ajax',
        url : 'awe.priority.combo.action',
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
