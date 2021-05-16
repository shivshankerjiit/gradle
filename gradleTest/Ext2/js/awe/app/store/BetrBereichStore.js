Ext.define('Awe.store.BetrBereichStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.BetroffeneBereich',
    proxy : {
        type : 'ajax',
        url : 'awe.bereich.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});