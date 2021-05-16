var editMultipleMassnahmen = {
  showDialog : function(parentElemId, isJqxGrid, system) {
    var url = '../EditMultipleMassnahmen.showDialog.action?selectedItems=';
    if (isJqxGrid) {
      url = '../' + url;
    }
    var selectedItems = [];
    var selectedItemsCount = -1;
    if (system == 'RATSD') {
      var url = '../../EditMultipleMassnahmen.showDialog.action?selectedItems=';
      var selectedRowItems = document.getElementById('selectedItems').value;
      var selectedItems = selectedRowItems.split(',');
      selectedItemsCount = selectedItems.length;

      if (selectedRowItems === '') {
        selectedItemsCount = -1;
      } else {
        var setSelectedItems = selectedRowItems.replace(/,/g, "%2C");
        document.getElementById('selectedRowItems').value = setSelectedItems;
      }

      this.showGreybox(url, selectedRowItems, selectedItemsCount);

    } else {
      jQuery.ajax({
        type : "POST",
        url : "action/getSelected",
        data : {
          context : "mnContext"
        }
      }).done(
          function(obj) {
            selectedItems = obj.ids;
            selectedItemsCount = obj.rowCount;

            if (selectedItemsCount < 1) {
              alert(messages.errors.select.minimumone());
              return;
            }
            var dialogTitle = messages.general.msg
                .collectivechanges();
            url += selectedItems + '&selectedItemsCount='
                + selectedItemsCount;

            MN.Greybox.centerScreen(dialogTitle, url, 250, 450);
          });
    }
  },
  showGreybox : function(url, selectedRowItems, selectedItemsCount) {
    if (selectedItemsCount < 1) {
      alert(messages.errors.select.minimumone());
      return;
    }
    var dialogTitle = messages.general.msg.collectivechanges();
    url += selectedRowItems + '&selectedItemsCount=' + selectedItemsCount;
    console.log('showGreybox url : '+url);
    MN.Greybox.centerScreen(dialogTitle, url, 250, 450);
  },
  save : function() {
    var selectedValue = document.getElementById('kenzeichenBericht').value;

    if (selectedValue === '-1') {
      this.closeDialog();
      return false;
    }

    var form = document.forms['EditMultipleMassnahmenForm'];
    if (form) {
      form.submit();
    }
  },
  closeDialog : function() {
    parent.parent.GB_hide();

    var system = parent.parent.document.getElementById('system');
    if (system !== null && system !== 'null' && system !== undefined && system !== 'undefined') {
      this.closeDialogRATSD();
    } else {
      this.closeDialogZKS();
    }

  },
  closeDialogRATSD : function() {
    parent.parent.GB_hide();
    var selectedRowItems = parent.parent.document
        .getElementById('selectedItems').value;
    var setSelectedItems = selectedRowItems.replace(/,/g, "%2C");

    var previousURL = '/RATSD/listen.risiken.action?selectedItems=' + setSelectedItems;
      parent.parent.location = previousURL;
  },
  closeDialogZKS : function() {
    parent.parent.GB_hide();
    var previousURL = parent.parent.document.getElementById('previousURL');
    if (previousURL !== null && previousURL !== undefined
        && previousURL !== 'undefined' && previousURL !== ''
        && previousURL.value !== null
        && previousURL.value !== undefined
        && previousURL.value !== 'undefined'
        && previousURL.value !== '') {

      parent.parent.location = previousURL.value;
    } else {
      parent.parent.location.reload();
    }
  }
};