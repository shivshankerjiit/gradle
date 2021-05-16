Ext.define('Awe.store.ProjektStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.ProdStru',
    proxy : {
        type : 'ajax',
        url : 'awe.projekte.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});