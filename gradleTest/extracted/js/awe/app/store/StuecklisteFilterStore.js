Ext.define('Awe.store.StuecklisteFilterStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.AnlaufFilter',
    proxy : {
        type : 'ajax',
        url : 'awe.anlaeufe.filter.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});