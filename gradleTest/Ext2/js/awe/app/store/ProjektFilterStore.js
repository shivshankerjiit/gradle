Ext.define('Awe.store.ProjektFilterStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.ProdStruFilter',
    autoLoad: true,
    proxy : {
        type : 'ajax',
        url : 'awe.projekte.filter.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});