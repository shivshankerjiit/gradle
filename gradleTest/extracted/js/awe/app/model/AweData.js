Ext.define('Awe.model.AweData', {
	extend : 'Ext.data.Model',
    fields : [
       /* MAIN */
       'id',
       'aweId',
       'snrs',
       'betroffenerUmfang',
       'kem',
       'abweichungsGrund',
       'antragstatus',

       /* TERMINE AWE */
       'beantragung',
       'erfassung',
       'aweStart',
       'aweEnde',
       {
           name: 'stueckzahlbegrenzung',
           useNull: true,
           convert: function(v, model) {
               var val = v;
               if (v == 0) {
                   val = null;
               }
               return val;
           }
       },
       'genehmigung',
       'erstellungsDatum',
       'automatischBeendet',

       /* Freigabe */
       'ersteller',
       'qsVerantwortlicher',
       'windowPerson',
       'kemVerantwortlicher',
       'geprueftVon',
       'genehmigtVon',
       'dokumentiertVon',
       'qsVerantwortlicherId',
       'erstellerId',

       'deviationSheet',
       'notificationE1',

       /* DETAILS */
       'prioritaet',
       'bzaTyp',
       'kems',
       'sonderprozessBemusterung',
       {
           name: 'kemsCount',
           convert: function(v, model) {
               var cnt = 0, kems = model.get('kems');
               if (!Ext.isEmpty(kems)) {
                   cnt = kems.split('|').length;
               }
               return cnt;
           }
       },

       /* KONTEXT */
       'sammelbegriff',
       'dialogProjekt',
       'projekt',
       'teilprojekt',
       'stueckliste',

       /* PDRS */
       'betroffeneBaureihen',
       'betroffeneBereiche',
       'betroffeneProduktionslinien',
       'betroffeneProduktionslinienstation',
       'gewerk',
       'ncmNummer',
       'paev',

       /* SDR */
       'kemStart',
       'kemEnde',
       'artAntrag',
       'anwendungsfall',
       'vorgenger',
       'nachfolger',
       'grundDetailEN',
       'abweichungsGrundEN'

   ]
});