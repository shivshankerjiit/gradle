Ext.define('Awe.store.DispAttachmentStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.Attachment',
    proxy : {
        type : 'ajax',
        url : 'awe.anhang.list.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    }
});
