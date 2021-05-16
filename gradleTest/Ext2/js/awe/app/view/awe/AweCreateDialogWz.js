Ext.define('Awe.view.awe.AweCreateDialogWz', {
    extend: 'Ext.window.Window',
    requires: ['UX.form.field.ClearButton',
        'MDS.form.field.ProjektbeteiligterCombobox',
        'UX.form.field.CheckboxListCombo'
    ],
    alias: 'widget.awecreatedialogwz',
    id: 'awecreatedialogwz',
    modal: true,
    border: false,
    bodyStyle: 'background: #FFF',
    closable: false,
    closeAction: 'hide',
    layout: 'absolute',
    resizable: false,
    draggable: true,
    constrain: true,
    overflowY: 'auto',
    height: 620,
    width: 980,
    title: i18n.awe.form.createtitle(),
    items: [{
        xtype: 'awecreatewizard'
    }],
    listeners: {
        beforeshow: function() {
            this.center();
        },
        show: function() {
//        	alert("SHOW AWE CREATE WIZ");
          // alert("show userwerk:" + jspScope.userwerk() + " werkVorbelegung:" + this.werkVorbelegung);

        var form = this.down('awecreatewizard').getForm();
      var werkfeld = form.findField('werkWerk');
      var snrFeld = form.findField('sachnummer');
        var werkStore = werkfeld.getStore();
      werkStore.load({
        callback: function(records, operation, success) {
          // alert("jspScope.isKP() || jspScope.isJV() == " + (jspScope.isKP() || jspScope.isJV()));
          var record = werkStore.findRecord('werk', Ext.isEmpty(jspScope.werk()) ? jspScope.userwerk() : jspScope.werk());
          var werk = ( record && record.data ) ? record.get('werk') : "010 ";
          werkfeld.setValue(werk);
          werkfeld.isSelected = true;
          werkfeld.validate();
          werkfeld.setReadOnly(jspScope.isKP() == 'true' || jspScope.isJV() == 'true');
          snrFeld.focus(true);
        }, scope: this
      });

      var aweId = this.down('awecreatewizard').getForm().getValues().id;
      if (Ext.isEmpty(aweId)) {
        Ext.getStore('AttachmentStore').removeAll();
      } else {
        // pre-load attachment store!
        Ext.getStore('AttachmentStore').load({
          params: {
            aweId: aweId
          }
        });
      }

      	  var rec = form.getRecord();
      	  var antragstatus = '';
      	  if(rec) {
      		  antragstatus = form.getRecord().get('antragstatus');
      	  }



          if ('ERFASST_EXTERN' === antragstatus || 'ZUR_PRUEFUNG' === antragstatus) {
              if (form.getRecord().get('qsVerantwortlicherId') == jspScope.currentUserId()
                 || form.getRecord().get('windowPersonId') == jspScope.currentUserId()) {
                  this.down('#reject').show();
              } else {
                  this.down('#reject').hide();
              }
          } else {
              this.down('#reject').hide();
          }

          /**
           * Hide elements for KP/JV/Supplier
           */
         if(jspScope.isKP() === 'true' || jspScope.isJV() === 'true' || jspScope.isSupplier() === 'true'){
             Ext.getCmp('editBtn_positionsSearchFSet').hide();
         }else{
             Ext.getCmp('editBtn_positionsSearchFSet').show();
         }

        }

    },
    initComponent: function() {
        this.constrainTo = Ext.getBody();
        this.callParent(arguments);
    }
});
