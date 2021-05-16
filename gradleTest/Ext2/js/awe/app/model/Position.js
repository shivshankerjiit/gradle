Ext.define('Awe.model.Position', {
	extend : 'Ext.data.Model',
	fields : [ 'id', 'aweId', 'posId','baureihe', 'modul', 'posE', 'posV', 'werk', 'coderegel', 'ausfuehrungsart', 'lenkung', 'wahlweise', 'erstellungsDatum', 'aenderungsDatum', 'menge' ],
	idProperty : 'id'
});