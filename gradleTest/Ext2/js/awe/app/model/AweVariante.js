Ext.define('Awe.model.AweVariante', {
    extend : 'Ext.data.Model',
    fields : [{
        name : 'teil',
        type : 'string'
    },{
        name : 'aweIds',
        type : 'string'
    },{
        name : 'teilBezeichnung',
        type : 'string'
    },{
        name : 'ausfuehrungsart',
        type : 'string'
    },{
	name : 'codeleiste',
        type : 'string'
    },{
	name : 'verbauVon',
        type : 'string'
    },{
	name : 'verbauBis',
        type : 'string'
    }]
});