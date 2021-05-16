Ext.define('Awe.store.BzaTypStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.BzaTyp',
    proxy : {
        type : 'ajax',
        url : 'awe.bzatype.combo.action',
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
