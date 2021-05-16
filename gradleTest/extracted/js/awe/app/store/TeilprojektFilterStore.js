Ext.define('Awe.store.TeilprojektFilterStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.TeilprojektFilter',
    proxy : {
        type : 'ajax',
        url : 'awe.teilprojekte.filter.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});