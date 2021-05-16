// make sure, that our namespace exists
MN.Namespace.create('MN.Basis');

/**
 * Namespace for handling all things related to Gewerk/Teilgewerk selections in
 * - Filter
 * - BewElement RAT + ZPS + (TODO:CONT)
 * - Massnahme RAT + ZPS + (TODO:CONT)
 */
MN.Basis.Gewerk = function(){

    var gewerkFieldId = 'gewerkId',
        tgFieldId = 'teilGewerkId',
        prefix = '';

    /**
     */
    function fillTeilgewerke(event) {
        var gewerkIdValue = event.element().value,
            teilGewerkId = $(tgFieldId).value;
        let idParameter = {gewerkId : gewerkIdValue}
        
        jQuery.post("BaseAjaxAccess.getTeilGewerke.do", idParameter, afterTeilgewerkSet, "json");
    }

    /**
     */
    function registerTgObserver() {
        var teilGewerkIdField = $(MN.Basis.Gewerk.getTeilgewerkFieldId);

        if(teilGewerkIdField){
            teilGewerkIdField.observe('change', MN.Basis.Gewerk.Filter.setTeilgewerk);
        }
    }

    /**
     */
    function registerGewerkObserver() {
        var gewerkIdField = $(gewerkFieldId);

        if(gewerkIdField){
            gewerkIdField.observe('change', fillTeilgewerke);
        }
    }

    /**
     */
    function afterTeilgewerkSet(data) {
        MN.LOG_ON() ? console.log('Data received from server: %s', data.join(',')) : '';

        var teilgewerkFieldId = prefix ? prefix + tgFieldId.replace(tgFieldId.charAt(0), tgFieldId.charAt(0).toUpperCase()) : tgFieldId;

        // we try to keep the selected teilgewerk selected after reload the set, if possible
        // Wird vorerst nicht gewünscht

        jQuery('#'+ teilgewerkFieldId).empty();

        if (data != '') {
          jQuery.each(data, function(i, value) {
            jQuery('#' + teilgewerkFieldId)
              .append(jQuery("<option></option>")
              .attr("value", value.id)
              .text(value.name));
          });
        }
    }

    return {
        getGewerkFieldId: gewerkFieldId,
        getTeilgewerkFieldId: tgFieldId,
        registerTgObserver: registerTgObserver,
        registerGewerkObserver: registerGewerkObserver,
        callback: afterTeilgewerkSet,
        setPrefix: function (p) {prefix = p;}
    };
}();

MN.Basis.Gewerk.Filter = function() {

  /**
   */
  function fillTeilgewerke(event) {

    var tgFieldId = MN.Basis.Gewerk.getTeilgewerkFieldId, elem = event
        .element(), gewerkId = elem.value, prefix;

    jQuery.post('BaseAjaxAccess.getTeilGewerkeForFilter.do', {
      gewerkId : gewerkId
    }, function(data) {
      // in case of multi level filters we need to know the descriminator
      // for the combos at different levels. Therefor we extract a prefix
      // and store it
      // in MN.Basis.Gewerk.prefix
      prefix = elem.id.underscore().split('_')[0];
      if (prefix != 'gewerk' && prefix != 'teil') {
        MN.Basis.Gewerk.setPrefix(prefix);
      }
      MN.Basis.Gewerk.callback(data);
    });

  }

    /**
   * resetFilter - Sets the name of the selected combobox option into a hidden
   * field for later form submission
   *
   * Ids of hidden fields must have the same tokens as its corresponding
   * comboboxes without the 'Id'-suffix.
   *
   * @param {DOM
   *            Event} event
   */
    function resetFilter(event) {

        var elem = event.element(),
            nameField = $(elem.id.replace('Id', ''));

        if(elem.value) {
            nameField.value = elem.children[elem.selectedIndex].innerHTML;
        } else {
            nameField.value = '';
        }
    }

    /**
     * comboToggleObserver - Event-Observer managing Enabling and disabling combos, when common combos change
     *
     * @param {type} event
     */
    function comboToggleObserver(event) {

        var elem = event.element();

        // we need to toggle all combos at lower filter levels
        if (elem.id.toLowerCase().indexOf('teil') != -1) {
            $$('.teilGewerk[id!=commonTeilGewerkId]').each(function (i) { toggleOtherCombos(i, elem.value);});
        } else {
            $$('.gewerk[id!=commonGewerkId]').each(function (i) { toggleOtherCombos(i, elem.value);});

        }
    }

    /**
     * toggleOtherCombos - Enables and disables combos at lower filter levels
     *
     * @param {DOM-Element} i - the combo which has been changed
     * @param {number} value - of the combo which has been selected
     */
    function toggleOtherCombos(i, value) {

        // disable if a true value has been selected otherwise enable combo
        i.disabled = value != -1;
        // reset value after disabling
        jQuery('#'+ i.id).val(-1);
        // reset corresponding hidden field holding the displayed name
        var hiddenField = document.getElementById(i.id.replace('Id', '')) || MN.util.DUMMY;
        hiddenField.value = '';
    }

    return {
        fillTeilgewerke: fillTeilgewerke,
        resetFilter: resetFilter,
        setTeilgewerk : function(event){
            var tgField = $(MN.Basis.Gewerk.getTeilgewerkFieldId);
            $('teilGewerk').value = tgField[tgField.selectedIndex].text;

            MN.LOG_ON() ? console.log('New teilGewerk value is: %s', $('teilGewerk').value) : '';
        },

        /**
         * registerGewerkObserver - all Gewerk and Teilgewerk combo boxes are getting an change event observer registered.
         *
         * We need to...
         * i.    handle async refresh of Teilgewerk combo after selecting a Gewerk,
         *
         * ii.   set the name of the selected combobox option into a hidden field
         *       for later form submission
         *
         * iii.  in case of multi level filters we need to disable combos at each level
         *       when selecting a value in the common filter part
         *
         * Only those combo boxes are getting an observer which are marked with either .gewerk or .teilGewerk CSS classes.
         */
        registerGewerkObserver: function() {

            var gewerkIdFields = $$('[class*=gewerk]');
            if(gewerkIdFields.length > 0){
                gewerkIdFields.invoke('observe', 'change', MN.Basis.Gewerk.Filter.fillTeilgewerke);
                gewerkIdFields.invoke('observe', 'change', MN.Basis.Gewerk.Filter.resetFilter);

            }
            var teilgewerkIdFields = $$('[class*=teilGewerk]');
            if(teilgewerkIdFields.length > 0){
                teilgewerkIdFields.invoke('observe', 'change', MN.Basis.Gewerk.Filter.resetFilter);
            }

            var commonCombos = $$('.gewerk[id^=common]', '.teilGewerk[id^=common]');
            if(commonCombos.length > 1) {
                commonCombos.invoke('observe', 'change', comboToggleObserver);
            }
        }
    }
}();