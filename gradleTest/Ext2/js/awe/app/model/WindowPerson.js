Ext.define('Awe.model.WindowPerson', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'integer'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'vorname',
        type: 'string'
    }, {
        name: 'abteilung',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }]
});