Ext.define('Awe.store.AweVarianteStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.AweVariante',
    proxy : {
        type : 'ajax',
        url : 'awe.varianten.combo.action',
        timeout: 60000,
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});
