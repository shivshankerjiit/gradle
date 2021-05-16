Ext.define('Awe.store.DispDialogProjektStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.DialogProjekt',
    proxy : {
        type : 'ajax',
        url : 'awe.dialogprojekt.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }

});
