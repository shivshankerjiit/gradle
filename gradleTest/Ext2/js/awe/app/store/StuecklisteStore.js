Ext.define('Awe.store.StuecklisteStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Anlauf',
    proxy : {
        type : 'ajax',
        url : 'awe.anlaeufe.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});