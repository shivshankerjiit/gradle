Ext.define('Awe.store.WerkStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Werk',
    autoLoad: true,
    proxy : {
        type : 'ajax',
        url : 'awe.werk.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});
