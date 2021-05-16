Ext.define('Awe.store.BetrBaureihenStore', {
    extend : 'Ext.data.Store',
    model : 'Awe.model.BetroffeneBaureihen',
    proxy : {
        type : 'ajax',
        url : 'awe.baureihen.combo.action',
        reader : {
            type : 'json',
            root : 'data',
            successProperty : 'success'
        }
    },
    listeners: {
        beforeload: function(store,options) {
        		store.getProxy().extraParams.werk = Ext.getCmp('aweCreateWizard').getForm().findField('werkWerk').value;
            }
    }
});
