Ext.define('Awe.store.DispLieferantStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Lieferant',
    proxy : {
        type : 'ajax',
        url : 'awe.lieferant.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});