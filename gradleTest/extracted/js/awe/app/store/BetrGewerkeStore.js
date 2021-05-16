Ext.define('Awe.store.BetrGewerkeStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Gewerk',
    proxy : {
        type : 'ajax',
        url : 'awe.gewerk.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});
