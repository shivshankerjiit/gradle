Ext.define('Awe.store.TeilprojektStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Teilprojekt',
    proxy : {
        type : 'ajax',
        url : 'awe.teilprojekte.populate.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});