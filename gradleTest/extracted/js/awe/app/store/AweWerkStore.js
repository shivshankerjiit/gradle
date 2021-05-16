Ext.define('Awe.store.AweWerkStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.AweWerk',
    proxy : {
        type : 'ajax',
        url : 'awe.werk.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        },
        extraParams: {
            queryMode: 'plantsByPos'
        }
    }
});