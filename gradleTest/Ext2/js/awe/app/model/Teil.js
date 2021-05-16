Ext.define('Awe.model.Teil', {
    extend : 'Ext.data.Model',
    fields : [ 'id', 'gueltig', 'kem', 'sieheZeichnungId', 'sieheZeichnungShow', 'snrShow', 'teilBez', 'zeichnungsDatum', 'zgs' ],
    proxy : {
	type : 'ajax',
	url : 'awe.teil.populate.action',
	simpleSortMode : true,
	reader : {
	    type : 'json',
	    root : 'data',
	    successProperty : 'success',
	    totalProperty : 'totalCount'
	}
    }
});