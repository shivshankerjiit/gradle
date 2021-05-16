MN.Namespace.create('ProzessZuordnung');

/**
 * ProzessZuordnung - Opens and closes a div for assigning and displaying processes.
 * Depends on the use of
 * tags/basis/prozess/prozessLink.tag and tags/basis/prozess/prozesszuordnung.tag
 *
 *  To prevent native Windows DOM elements like Select-boxes shine through the opened DIV,
 *  make sure, MNUtility comprises of IFrameHack Namespace.
 */
ProzessZuordnung = function(){

  var useIFrameHack = window.MN && MN.DOM && MN.DOM.IFrameHack && Prototype.Browser.IE;
  var assignProcessLnk;

  function hideProcessWindow(cloneId, isDirty) {

      $(cloneId).remove();
      if(useIFrameHack){
        MN.DOM.IFrameHack.hide(cloneId);
      }

      if(isDirty){

          if(!assignProcessLnk){
              assignProcessLnk = $('assignProcessLnk');
          }
          if(assignProcessLnk){
              assignProcessLnk.addClassName('dirty');
          }
      }

  }

  return{
    /**
     * initBtn
     * @param {type} btnId
     */
    initBtn : function(btnId){
        assignProcessLnk = $((btnId || 'assignProcessLnk'));
        if(assignProcessLnk){
           assignProcessLnk.observe('click', ProzessZuordnung.showProzesszuordnung);
        }
    },

    dynaNodes : { // Config-Object for DOM-Elements in Bewertungs-view, which are created or modified at runtime
      // To prevent adding a hidden field on each client jsp which
      // includes the prozessTag, we create a hidden field at runtime
      selZusatzprozesse : {
        type: 'input',
        configObj : {
          'type' : 'hidden',
          id: 'selZusatzprozesse',
          'name': 'selZusatzprozesse'
        }
      }
    },

    /**
     * @param {Event or DOM Element}
     */
    showProzesszuordnung : function(param){


      var src = $('prozessZuordnungDiv'),
          cloneId = src.id + 'Cl',
          srcClone = $(cloneId),
          link = Object.isElement(param) ? $(param.id) : param.element();

      // Registrieren um z.B. auf ESC zu schließen
      MN.util.registerPopUp(cloneId, ProzessZuordnung.copyZusatzprozesseValues);

      if(!srcClone){
        srcClone = src.clone(true);
        srcClone.setAttribute('id', cloneId);

        src.insert({after : srcClone});

        var originalCheckBoxes = $$('div#' + src.id + ' input[type=checkbox]');
        var clonedCheckBoxes = $$('div#' + cloneId + ' input[type=checkbox]');

        originalCheckBoxes.each(function(orgCB){
          var clonedCB = clonedCheckBoxes.find(function(clonedCBItem){
            return orgCB.value == clonedCBItem.value;
          });
          clonedCB.checked = orgCB.checked ? true : false;
        });

        var closeBtn = srcClone.down('button');
        closeBtn.setAttribute('id', closeBtn.id + 'Cl');
        closeBtn.observe('click', function(event){
          MN.util.killEvent(event);

          MN.util.unregisterPopUp(cloneId);

          hideProcessWindow(cloneId);

        });

        var copyBtn = srcClone.down('button', 1);
        if(copyBtn){
          copyBtn.setAttribute('id', copyBtn.id + 'Cl');
          copyBtn.observe('click', ProzessZuordnung.copyZusatzprozesseValues);
        }
      }
      if(!MN['iFrame' + cloneId]){
          MN.DOM.moveElement(srcClone, link, {offsetTop: 20, offsetLeft: -160});
          if(useIFrameHack){
              MN.DOM.IFrameHack.show(srcClone);
          }
      }
      else{
    	  MN.DOM.moveElement(srcClone, link, {offsetTop: 50, offsetLeft: 150});
      }
      // BUG-3557: set geometry properly
      var deltaWidth = window.innerWidth - srcClone.offsetWidth;
      if (deltaWidth < 0) {
        srcClone.style.left = '0px';
        srcClone.style.width = window.innerWidth + 'px';
      } else {
        srcClone.style.left = parseInt(deltaWidth / 2) + 'px';
      }
      var deltaHeight = window.innerHeight - srcClone.offsetHeight;
      if (deltaHeight < 0) {
        srcClone.style.top = '0px';
        srcClone.style.height = window.innerHeight + 'px';
      } else {
        srcClone.style.top = parseInt(deltaHeight / 2) + 'px';
      }
    },

    copyZusatzprozesseValues : function(event){

      MN.util.killEvent(event);

      var srcId = 'prozessZuordnungDiv',
          cloneId = srcId + 'Cl',
          clonedCheckBoxes = $$('div#' + cloneId + ' input[type=checkbox]'),
          originalCheckBoxes = $$('div#' + srcId + ' input[type=checkbox]'),
          zusatzProzesseInt = 0, elem,
          form = $$('form')[1] || $$('form')[0]; // in popups without frames we only have one form on the page

      MN.util.unregisterPopUp('prozessZuordnungDivCl');

      clonedCheckBoxes.each(function(clonedCB, index){
        var orgCB = originalCheckBoxes.find(function(orgCBItem){
          return orgCBItem.value == clonedCB.value;
        });
        orgCB.checked = clonedCB.checked;
        zusatzProzesseInt += parseInt(orgCB.checked ? orgCB.value : 0);
      });

      elem = document.getElementById('selZusatzprozesse');
      if(!elem){
        elem = MN.DOM.createElement(ProzessZuordnung.dynaNodes.selZusatzprozesse);
        form.insert({bottom:elem});
      }
      elem.value = zusatzProzesseInt;

      hideProcessWindow(cloneId, true);
    }

  }
}();


MN.Namespace.create('MN.Filter');

MN.Filter.Prozess = {
    /**
     * setProzess
     * @param {DOMEvent} event
     */
    setProzess : function(event){
        var elem = event.element(),
        type = 'kpkz';

        if(elem.id.startsWith(type + '_')){

            var valueStore = $(type);

            MN.DEBUG_ON() ? console.debug('Set Prozess for id: %s', elem.id) : '';

            valueStore.value = MN.Filter.Prozess.calculateKPKZ(valueStore, elem);
        }

    },
    /**
     * setHerkunft
     * @param {DOMEvent} event
     */
    setHerkunft : function(event){
        var elem = event.element(),
        type = 'herkunft';

        if(elem.id.startsWith(type + '_')){

            var valueStore = $(type);

            MN.DEBUG_ON() ? console.debug('Set Herkunft for id: %s', elem.id) : '';

            valueStore.value = MN.Filter.Prozess.calculateKPKZ(valueStore, elem);
        }
    },
    /**
     * calculateKPKZ
     * @param {String} valueType
     * @param {Integer} changedValue
     */
    calculateKPKZ : function(valueStore, changedElem){

        var intValue = valueStore.value || 0;

        if(changedElem.checked){

            intValue =  parseInt(intValue) + parseInt(changedElem.value);

        }else{

            intValue =  parseInt(intValue) - parseInt(changedElem.value);
        }

        MN.DEBUG_ON() ? console.debug('calculated value for id: %s, is: %d', changedElem.id, intValue) : '';

        return intValue;
    }
}
