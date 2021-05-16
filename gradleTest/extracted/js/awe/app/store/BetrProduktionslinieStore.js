Ext.define('Awe.store.BetrProduktionslinieStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.BetroffeneProduktionslinie',
    proxy : {
        type : 'ajax',
        url : 'awe.produktionslinie.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});
