// make sure, that our namespace exists
MN.Namespace.create('MN.Basis');

MN.Basis.Massnahme = {
  config : {},
  maxCharsinTextArea : {
    'title' : 255,
    'description' : 1500,
    'comment' : 1500,
    'proposedDecision' : 1024,
    'ursache' : 1500,
    'default' : 1024
  },
  ZPS : {
    config : {
      activity : {
          action : 'Aktivitaeten',
          callBackAction : 'AktivitaetenList.viewAktivitaetenByMnId.do?',
          dispatch : ''
      }
    }
  },
  RAT : {
    config : {
      activity : {
        action : 'aktivitaet.',
        dispatch : ''
      }
    }
  },
  PMOAM : {
    config : {
      activity : {
        action : 'Aktivitaet.do?',
        dispatch : 'dispatch='
      }
    }
  },
  CONT : {
    config : {}
  },

  /**
   * globalInit - Initializaton of all common pickers
   *
   * @param {type}
   *            param
   */
  globalInit : function(param) {

    var nsPicker = MN.Util.Picker, mainHeight = $('accBase').getHeight(), errorMsgObj = param.errorMsgObj;

    if (MN.Util.Picker && MN.Util.Picker.PJB) {
      var pjbPickerCfg = {
        txtFieldId : 'treiber',
        minCharsHint : errorMsgObj.lessThanThree(),
        openUp : mainHeight < 260,
        width : '200px'
      };

      var pjbItPickerCfg = {
        txtFieldId : 'prio1Form.it',
        minCharsHint : errorMsgObj.lessThanThree(),
        openUp : mainHeight < 260,
        width : '120px'
      };

      var pjbIsPickerCfg = {
        txtFieldId : 'prio1Form.is',
        minCharsHint : errorMsgObj.lessThanThree(),
        openUp : mainHeight < 260,
        width : '120px'
      };

      var pjbFbPickerCfg = {
        txtFieldId : 'prio1Form.fb',
        minCharsHint : errorMsgObj.lessThanThree(),
        openUp : mainHeight < 260,
        width : '120px'
      };

      if (MN.Basis.Massnahme.context && MN.Basis.Massnahme.context.isMaster) {
        pjbPickerCfg.populator = MN.Util.Picker.PJB.updatePjbRlList;
        pjbPickerCfg.minCharsHint = null;
        pjbPickerCfg.optTriggerCheck = false;
        pjbPickerCfg.minChars = '0';
        //prio1PjbPickers
        pjbIsPickerCfg.populator = MN.Util.Picker.PJB.updatePjbRlList;
        pjbIsPickerCfg.minCharsHint = null;
        pjbIsPickerCfg.optTriggerCheck = false;
        pjbIsPickerCfg.minChars = '0';

        pjbItPickerCfg.populator = MN.Util.Picker.PJB.updatePjbRlList;
        pjbItPickerCfg.minCharsHint = null;
        pjbItPickerCfg.optTriggerCheck = false;
        pjbItPickerCfg.minChars = '0';

        pjbFbPickerCfg.populator = MN.Util.Picker.PJB.updatePjbRlList;
        pjbFbPickerCfg.minCharsHint = null;
        pjbFbPickerCfg.optTriggerCheck = false;
        pjbFbPickerCfg.minChars = '0';
      }
      nsPicker.pjbPicker.action(pjbPickerCfg);
      nsPicker.pjbPicker.action(pjbIsPickerCfg);
      nsPicker.pjbPicker.action(pjbItPickerCfg);
      nsPicker.pjbPicker.action(pjbFbPickerCfg);

      var gremPickerCfg = {
        txtFieldId : 'gremium',
        openUp : mainHeight < 450
      };
      nsPicker.gremiumPicker.action(gremPickerCfg);

      var gremKasPickerCfg = {
        txtFieldId : 'gremiumKAS',
        openUp : mainHeight < 450
      };

      nsPicker.gremiumPicker.action(gremKasPickerCfg);

      nsPicker.themaPicker.action({
        openUp : mainHeight < 420
      });
      nsPicker.fgPicker.action({
        openUp : mainHeight < 420
      });
      nsPicker.schlagwortPicker.action({
        openUp : mainHeight < 450
      });
    }


    $$('.upload').invoke('observe', 'click',
        MN.Basis.Massnahme.uploadClickObserver);

    var productBtn = $('assignProductBtn');
    if (productBtn) {
      productBtn.observe('click',
          Anforderung.Zuordnung.showWindowToAssign);
    }

    MN.Basis.Gewerk.registerGewerkObserver();

    if (window.ProzessZuordnung) {
      ProzessZuordnung.initBtn();
    }

    if (window.Bewertung && Bewertung.Messwerte) {
      Bewertung.Messwerte.initResizableElements();
      Bewertung.Messwerte.maxCharsinTextArea = MN.Basis.Massnahme.maxCharsinTextArea;
    }

    calendar.noEternal();
  },

  /**
   * init - Performs all necessary initialization steps to activate
   * interaction for Massnahme guis
   *
   * @param {type}
   *            param
   */
  init : function(param) {

    var mainHeight = $('accBase').getHeight();

    if (MN.Util.Picker && MN.Util.Picker.pjbPicker) {
      var initiatorCfg = {
              txtFieldId : 'initiator',
              populator : MN.Util.Picker.PJB.updatePjbListStr,
              openUp : mainHeight < 340
            };
      MN.Util.Picker.pjbPicker.action(initiatorCfg);
    }

    MN.Basis.Massnahme.globalInit(param);

    MN.Basis.Massnahme.Status.init(param.statusCntrId);

    if (MN.Basis.Images && param.formName) {

      MN.Basis.Images.init(param.formName);

    } else if (MN.Basis.Massnahme.Images) {

      MN.Basis.Massnahme.Images.init();
    }
    if ($('typ') && $('doNotChangeTyp') == undefined) {
      $('typ').value = "M";
    }
  },

  /**
   * initEditView - Initialisation steps for edit view
   *
   * @param {type}
   *            param
   */
  initEditView : function(param) {
    MN.Basis.Massnahme.globalInit(param);

    if (MN.Basis.Images && param.formName) {

      MN.Basis.Images.init(param.formName);

    } else if (MN.Basis.Massnahme.Images) {

      MN.Basis.Massnahme.Images.init();
    }
  },

  /**
   * initReadView - Initialisation steps for the read only view
   *
   * @param {type}
   *            param
   */
  initReadView : function(param) {

    ProzessZuordnung.initBtn();

    $$('.upload').invoke('observe', 'click',
        MN.Basis.Massnahme.uploadClickObserver);

    if (MN.Basis.Images && param.formName) {

      MN.Basis.Images.init(param.formName);

    } else if (MN.Basis.Massnahme.Images) {

      MN.Basis.Massnahme.Images.init();
    }

    if (window.Bewertung && Bewertung.Messwerte) {
      Bewertung.Messwerte.initResizableElements(param.targetCntr);
      Bewertung.Messwerte.maxCharsinTextArea = MN.Basis.Massnahme.maxCharsinTextArea;
    }

    if (param.statusCntrId) {
      MN.Basis.Massnahme.Status.init(param.statusCntrId);
    }
  },

  getBewertungen : function(mnId, configs) {
    if (BewertungenWindow) {

      jQuery.post('BaseAjaxAccess.getBewertungenForMassnahme.do', {
        mnId : mnId
      }, function(json) {
        configs['data'] = json;
        var bewWindow = new BewertungenWindow(configs);
        bewWindow.showBewertungen();
      });

    }
  },

  /**
   * openAnfWindow
   */
  openAnfWindow : function(bewId) {
    var url = 'Bewertung.viewBewertung.do?popup=true&bewId=' + bewId;

    let style = {top: '160px', left: '35px', width: '1000px', height: '500px', title: 'Bewertung ...'};
    top.DialogManager.registerDialog(url, style, window);

//	  console.log('[DialogManager] start creating Dialog');
//      let dialogHost = document.createElement('iFrame');
//
//      //Set Standard Style Attributes for Dialog
//      dialogHost.style.background = 'white';
//	  dialogHost.style.position = 'fixed';
//	  dialogHost.style.boxShadow = '0px 0px 20px 1px rgba(0,0,0,0.5)';
//
//	  //width and height for calculation
//	  let calc_width = 0;
//	  let calc_height = 0;
//
//	  //Get Viewport width and height based on 100% of the Screen
//	  calc_width = Math.max(document.documentElement.clientWidth, window.innerWidth);
//	  calc_height = Math.max(document.documentElement.clientHeight, window.innerHeight);
//	  console.log('[DialogManager] calculated width: ' + calc_width + ' (100%) | calculated height: ' + calc_height + ' (100%)');
//
//	  let calc_zIndex = 100000;
//	  let calc_top = 25;
//	  let calc_left = 25;
//
//	  //Check if dialog is called by RATSD
//	  let callFromRATSD = false;
//	  if(window.callFromRATSD) {
//		  callFromRATSD = window.callFromRATSD.value == 'true' ? true : false;
//	  } else {
//		  let tempLocation = window.location.toString();
//		  let ratsd = tempLocation.split('/')[3];
//
//		  if(ratsd == "RATSD") {
//			  callFromRATSD = true;
//		  }
//	  }
//
//	  console.log('[DialogManager] callFromRATSD check is: ' + callFromRATSD);
//
//	  //Check for other opened Dialogs
//	  let otherDialogs = false;
//		if(!window.parent.document.getElementById('modalDialog')) {
//			if(document.getElementById('modalDialog')) {
//				otherDialogs = true;
//			}
//		} else {
//			otherDialogs = true;
//		}
//
//	  console.log('[DialogManager] otherDialogs check is: ' + otherDialogs);
//
//	  if(otherDialogs) {
//			//100%
//			let openedDialogs;
//
//			if(callFromRATSD) {
//				//100% ausgehend
//				calc_top = 0;
//				calc_left = 0;
//
//				openedDialogs = window.parent.document.getElementsByClassName('modalDialogClass');
//			} else {
//				//Trotzdem auf 50% teilen
//				openedDialogs = document.getElementsByClassName('modalDialogClass');
//
//				calc_width = calc_width / 100 * 60;
//				calc_height = calc_height / 100 * 80;
//
//				calc_top = 5;
//				calc_left = 20;
//			}
//
//			//Berechnung des zIndex;
//			for(let i = 0; i < openedDialogs.length; i++) {
//				let de = openedDialogs[i];
//				let tz = parseInt(de.style.zIndex);
//				if(tz >= calc_zIndex) {
//					calc_zIndex = tz + 10;
//				}
//			}
//
//			console.log('[DialogManager] calc_zIndex is: ' + calc_zIndex);
//		} else {
//			//50%
//			calc_width = calc_width / 100 * 60;
//			calc_height = calc_height / 100 * 80;
//
//			calc_top = 5;
//			calc_left = 20;
//		}
//
//	  if(calc_width < 1105) {
//		  calc_width = 1105;
//		  console.log('resetting calc_width to: 1105');
//		  if(otherDialogs) {
//			  calc_left = 0;
//		  }
//	  }
//
//	  if(calc_height < 750) {
//		  calc_height = 750;
//		  console.log('Resetting calc_height to 750');
//		  if(otherDialogs) {
//			  calc_top = 0;
//		  }
//	  }
//
//	  	console.log('[DialogManager] finished calculations...');
//
//	  	dialogHost.style.border = '0px';
//	  	console.log('[DialogManager] removed Border from iFrame Host Element.');
//
//	  	dialogHost.style.width = calc_width + 'px';
//	  	console.log('[DialogManager] set width to: ' + calc_width);
//
//		dialogHost.style.height = calc_height + 'px';
//		console.log('[DialogManager] set height to: ' + calc_height);
//
//		dialogHost.style.zIndex = calc_zIndex;
//		console.log('[DialogManager] set zIndex to: ' + calc_zIndex);
//
//		dialogHost.style.top = calc_top + '%';
//		console.log('[DialogManager] set top to: ' + calc_top);
//
//		dialogHost.style.left = calc_left + '%';
//		console.log('[DialogManager] set left to: ' + calc_left);
//
//		dialogHost.setAttribute('id', 'modalDialog');
//		dialogHost.setAttribute('class', 'modalDialogClass');
//
//		dialogHost.src = url;
//		document.body.appendChild(dialogHost);
  },

  /**
   * wrapper for multi-bewertungen window -> redirect to openParentWindow
   */
  showBewertung : function(bewId, beId) {
    MN.Basis.Massnahme.openParentWindow(this, bewId, beId);
  },

  /**
   * openParentWindow
   */
  openParentWindow : function(event, customBewId, customBeId) {
    var beId = MN.Basis.Massnahme.config.beId, bewId = MN.Basis.Massnahme.config.bewId, url;

    // if a custom bewId is given, override config
    if (customBewId) {
      bewId = customBewId;
    }
    if (customBeId) {
      beId = customBeId;
    }

    if (beId && bewId) {

      url = encodeURI('bewertungDetails.showBewertung.action?'
          + '&popup=true' + '&beId=' + beId + '&bewId=' + bewId);

      console.log('Executing modal Dialog from openParentWindow right in WebComponent.masnahme.js');
      //Hier
      let styleOpt = {top: '20px', left: '20px', width: '600px', height: '800px', title: 'Bewertungdetails' };

      top.DialogManager.registerDialog(url, styleOpt, window);

     // showModalDialog(url, window, 'status:0;center:1;help:0;resizable:0;edge:sunken;unadorned:1;dialogWidth:800px;dialogHeight:600px;');

    }
  },

  /**
   * uploadClickObserver
   *
   * @param {type}
   *            event
   */
  uploadClickObserver : function(event) {
    var elem = event.element(), idParts = elem.id
        .split(MN.util.idDelimiter), triggerId = idParts[0], objId = idParts[1], params, url, retVal;

    params = {
      'objTyp' : idParts[2] || 'M',
      'objId' : objId,
      'trigger' : elem,
      'right' : MN.Basis.Massnahme.config.right
    };
/////////////////////////////////////////////////////////////////////////////
    // Wurde denn richtig geklickt?
    if (triggerId === 'uploadDoc') {
      params.bereich = 'DOCS';
      params.onlyImage = false;

    } else if (triggerId === 'uploadImg') {
      params.bereich = 'IMG';
      params.onlyImage = true;

    } else {
      MN.LOG_ON() ? console.log('Id %s is not supported!', triggerId)
          : '';
      return false;
    }

    var attch = idParts[4];
    url = encodeURI('upload.view.action?' + 'contextid='
        + params.objId + '&bereich=' + params.bereich + '&objekt='
        + params.objTyp + '&savedb=1' + '&onlyImage='
        + params.onlyImage + '&right=' + params.right);

    let options = {top: '150px', left: '200px', width: '600px', height: '650px', title: 'Anhänge', callbackFunction: function() {
        if(self.document.forms['MassnahmeForm']) {
          self.document.forms['MassnahmeForm'].submit();
        } else {
          window.location.reload(true);
        }
      }};

    top.DialogManager.registerDialog(url, options, window);

    /*
	  //Check if dialog is called by RATSD
	  let callFromRATSD = false;
	  if(window.callFromRATSD) {
		  callFromRATSD = window.callFromRATSD.value == 'true' ? true : false;
	  } else {
		  let tempLocation = window.location.toString();
		  let ratsd = tempLocation.split('/')[3];

		  if(ratsd == "RATSD") {
			  callFromRATSD = true;
		  }
	  }

	jQuery(document).bind("DOMNodeRemoved", function(e) {
	    console.log('detected something strange -> NodeRemoved from DOM');

	    let currentUrl = window.location;
	    console.log('detected something strange -> CurrentLocation: ', currentUrl);
	    console.log('detected something strange -> CurrentWindow: ', window);

	    if(window.uploadUpdateFlag) {
	        console.log('UpdateFalg is true -> Refresh Page')
	       document.forms['MassnahmeForm'].action = currentUrl;
	       document.forms['MassnahmeForm'].submit();
	    }

	    jQuery(this).unbind(e);
	    console.log('DOMNodeRemoved Event unbound successfully!');
	  });

*/
    if (params.right === '1' && attch != params.hasAttachment) {
      MN.Basis.Massnahme['do' + triggerId.capitalize()](params);
    }

  },
  /**
   * doUploaddoc
   *
   * @param {object}
   *            params Object which must include at least a key trigger
   *            containing a DOM-Element and a objId entry
   */
  doUploaddoc : function(params) {
  // #systemModule takes the value of the current System
      // If method is called from ZKS , ZPSAjaxAccessImpl.java is invoked ,
      // If method is called from RATSD , RATAjaxAccessImpl.java is invoked
      // else BaseAjaxAccessImpl.java is invoked
   var system = 'Base';
   if(jQuery('#systemModule')){
       system = jQuery('#systemModule').val();
   }

    jQuery.post(system + 'AjaxAccess.updateHasAttachment.do', {
      objId : params.objId,
      hasAttachment : params.hasAttachment
    }, function() {
      params.trigger.className = params.trigger.className.replace(/_.*/,
          '_' + (params.hasAttachment > 0 ? true : false));

    });
  },

  /**
   * General page reloading after changes in popups
   */
  reloadAfterPopup: function(rc) {
      if ((typeof rc === "undefined") || (rc === 1)) {
          document.forms['MassnahmeForm'].action = 'Massnahme.viewMassnahme.do';
          document.forms['MassnahmeForm'].submit();
      }
  },

  /**
   * doUploadimg
   *
   * @param {type}
   *            params
   */
  doUploadimg : function(params) {

    var form = document.forms['MassnahmeForm'];

    if (form && params.hasAttachment) {
      form.submit();
    }
  },

  /**
   * openVorschlagWindow
   *
   * @param {Integer}
   *            id
   */
  openVorschlagWindow : function(id) {

    var url = encodeURI('Vorschlag.viewVorschlagByMN.do?' + 'massnahmeId='
        + id + '&isPopUp=true');

    //Hier
    let styleOpt = {top: '200px', left: '250px', width: '1000px', height: '500px', title: 'Open Vorschlag Window ...' };

    top.DialogManager.registerDialog(url, styleOpt, window);
//    showModalDialog(url, window,
//        "status:0;dialogLeft:250;dialogTop:200"
//            + ";help:0;resizable:0;edge:sunken;unadorned:1;dialogWidth:1000px;dialogHeight:500px;");
  },

  /**
   * openAktivityWindow
   *
   * @param {type}
   *            params
   */
  openAktivityWindow : function(params) {	 
      var url, callbackUrl, mnCfg = MN.Basis.Massnahme.config, sysCfg = MN.Basis.Massnahme[params.system
          || 'ZPS'].config.activity;
      var prio1ReportQuery = "";
      if(null != params.prio1ReportQuery){
        prio1ReportQuery = ''+getReportPrio1Query()+'';
      }
      url = encodeURI(sysCfg.action + sysCfg.dispatch + params.action
          + '&id=' + params.id + '&mnId=' + mnCfg.mnId + '&beId='
          + params.beId + '&bewId=' + params.bewId + '&idKvId='
          + params.idKvId + '&mnUrKpkz=' + mnCfg.mnUrKpkz + '&prio1ReportQuery=' + prio1ReportQuery);


      //Hier
      let styleOpt = {top: '200px', left: '250px', width: '950px', height: '700px', title: 'Aktivität ['+params.id+']', callbackFunction: function() {
        console.log('[After] running callback function...');
        location.replace('Massnahme.viewMassnahme.do?popup=false&mnId=' + mnCfg.mnId);
        document.forms['MassnahmeForm'].submit();
      }};

      top.DialogManager.registerDialog(url, styleOpt, window);
  },
  /**
   * openPoolsWindow
   *
   * @param {type}
   *            param
   */
  openPoolsWindow : function(param) {
    var url, callbackUrl, mnCfg = MN.Basis.Massnahme.config, rc;
    url = encodeURI('MassnahmeList.viewMassnahmenListeForAddonFilter.do'
        + '?id=' + mnCfg.mnId + '&idKvId=' + mnCfg.idKvId
        + '&mnForPool=true' + '&filterOnly=true' + '&idVariante='
        + mnCfg.idVariante + '&poolId=' + mnCfg.poolId);

    //Hier
    let styleOpt = {top: '30px', left: '30px', width: '1000px', height: '650px', callbackFunction: function() {
      console.log('[After] running callback function...');
      document.forms['MassnahmeForm'].action = 'Massnahme.viewMassnahme.do';
      document.forms['MassnahmeForm'].submit();
    }};

    top.DialogManager.registerDialog(url, styleOpt, window);
//
//    rc = showCustomDialog(url, window,
//        "status:0;dialogLeft:30;dialogTop:30"
//            + ";help:0;resizable:0;edge:sunken;unadorned:1;dialogWidth:1000px;dialogHeight:650px;",
//            MN.Basis.Massnahme.reloadAfterPopup);
//
//    //MN.Basis.Massnahme.reloadAfterPopup(rc);
//    jQuery(document).bind("DOMNodeRemoved", function(e) {
//	    console.log('detected something strange -> NodeRemoved from DOM');
//
//	    let currentUrl = window.location;
//	    console.log('detected something strange -> CurrentLocation: ', currentUrl);
//	    console.log('detected something strange -> CurrentWindow: ', window);
//
//	    if(window.uploadUpdateFlag) {
//	        console.log('UpdateFalg is true -> Refresh Page')
//	       document.forms['MassnahmeForm'].action = 'Massnahme.viewMassnahme.do';
//          document.forms['MassnahmeForm'].submit();
//	    }
//
//	    jQuery(this).unbind(e);
//	    console.log('DOMNodeRemoved Event unbound successfully!');
//	  });

    if (params.right === '1' && attch != params.hasAttachment) {
      MN.Basis.Massnahme['do' + triggerId.capitalize()](params);
    }
  },

  showNeutralActivityDialog : function(formName, saveButton) {
    if (!$('reopenStateDiv')) {
      var newDiv = new Element('div', {
        'id' : 'reopenStateDiv',
        'class' : 'reopenStateDiv'
      });

      var text = new Element('p').update(messages.action.lbl
          .reopenStateAdvice());
      var textfield = new Element('textarea', {
        'id' : 'stateReopenDescription',
        'name' : 'stateReopenDescription'
      });

      newDiv.insert(text);
      newDiv.insert(textfield);
      $(formName).insert(newDiv);
    }

    $('reopenStateDiv').clonePosition(saveButton, {
      setWidth : false,
      setHeight : false,
      offsetTop : 27
    });
    $('reopenStateDiv').show();
  },

  setMibTyp : function(typ) {
    var typObj = document.getElementById('typ');
    var typM = document.getElementById('typM');
    var imgM = document.getElementById('img_typm');
    var typI = document.getElementById('typI');
    var imgI = document.getElementById('img_typi');
    var typB = document.getElementById('typB');
    var imgB = document.getElementById('img_typb');
    var typR = document.getElementById('typR');
    var imgR = document.getElementById('img_typr');
    var callFromRATSD = document.getElementById('callFromRATSD').value;

    if (typ == 'M') {
      typI.value = 'false';
      typB.value = 'false';
      typR.value = 'false';

      var mPath = imgM.src;
      if (mPath.search(/1.gif/) < 0) {
        imgM.src = mPath.replace(/2.gif/, '1.gif');
        typM.value = 'true';
        typObj.value = 'M';
      } else {
        if (typI.value == 'false' && typB.value == 'false'
            && typR.value == 'false') {
          return false;
        } else {
          imgM.src = mPath.replace(/1.gif/, '2.gif');
          typM.value = 'false';
          typObj.value = '';
        }
      }
      if(callFromRATSD == false || callFromRATSD == 'false'){
      var iPath = imgI.src;
      imgI.src = iPath.replace(/1.gif/, '2.gif');
      var bPath = imgB.src;
      imgB.src = bPath.replace(/1.gif/, '2.gif');
      }
      var rPath = imgR.src;
      imgR.src = rPath.replace(/1.gif/, '2.gif');
    } else if (typ == 'I') {
      typM.value = 'false';
      typB.value = 'false';
      typR.value = 'false';

      var mPath = imgM.src;
      imgM.src = mPath.replace(/1.gif/, '2.gif');
      var iPath = imgI.src;
      if (iPath.search(/1.gif/) < 0) {
        imgI.src = iPath.replace(/2.gif/, '1.gif');
        typI.value = 'true';
        typObj.value = 'I';
      } else {
        if (typM.value == 'false' && typB.value == 'false'
            && typR.value == 'false') {
          return false;
        } else {
          imgI.src = iPath.replace(/1.gif/, '2.gif');
          typI.value = 'false';
          typObj.value = '';
        }
      }
      var bPath = imgB.src;
      imgB.src = bPath.replace(/1.gif/, '2.gif');
      var rPath = imgR.src;
      imgR.src = rPath.replace(/1.gif/, '2.gif');
    } else if (typ == 'B') {
      typM.value = 'false';
      typI.value = 'false';
      typR.value = 'false';

      var mPath = imgM.src;
      imgM.src = mPath.replace(/1.gif/, '2.gif');
      var iPath = imgI.src;
      imgI.src = iPath.replace(/1.gif/, '2.gif');
      var bPath = imgB.src;
      if (bPath.search(/1.gif/) < 0) {
        imgB.src = bPath.replace(/2.gif/, '1.gif');
        typB.value = 'true';
        typObj.value = 'B';
      } else {
        if (typM.value == 'false' && typI.value == 'false'
            && typR.value == 'false') {
          return false;
        } else {
          imgB.src = bPath.replace(/1.gif/, '2.gif');
          typB.value = 'false';
          typObj.value = '';
        }
      }
      var rPath = imgR.src;
      imgR.src = rPath.replace(/1.gif/, '2.gif');
    } else if (typ == 'R') {
      typM.value = 'false';

      var mPath = imgM.src;
      imgM.src = mPath.replace(/1.gif/, '2.gif');

      if(callFromRATSD == false || callFromRATSD == 'false'){
          typI.value = 'false';
          typB.value = 'false';
          var iPath = imgI.src;
          imgI.src = iPath.replace(/1.gif/, '2.gif');
          var bPath = imgB.src;
          imgB.src = bPath.replace(/1.gif/, '2.gif');
      }

      var rPath = imgR.src;
      if (rPath.search(/1.gif/) < 0) {
        imgR.src = rPath.replace(/2.gif/, '1.gif');
        typR.value = 'true';
        typObj.value = 'R';
      } else {
        if (typM.value == 'false' && typI.value == 'false'
            && typB.value == 'false') {
          return false;
        } else {
          imgR.src = rPath.replace(/1.gif/, '2.gif');
          typR.value = 'false';
          typObj.value = '';
        }
      }
    }

    var apjMnParams = '&apjMnTpj=' + $("apjMnTpj").value + '&apjMnProcess=' + $("apjMnProcess").value;

    if(callFromRATSD == true || callFromRATSD == 'true'){
      var username = document.getElementById ('mnExternalParameters.username').value;
      var clusterId = document.getElementById ('mnExternalParameters.clusterId').value;
      var apjPdsId = document.getElementById ('mnExternalParameters.apjPdsId').value;
      var tpjPdsId = document.getElementById ('mnExternalParameters.tpjPdsId').value;
      var beId = document.getElementById ('mnExternalParameters.beId').value;
      var bewId = document.getElementById ('mnExternalParameters.bewId').value;
      var pdsId = document.getElementById ('mnExternalParameters.pdsId').value;
      var paketKalendarId = document.getElementById ('mnExternalParameters.paketKalendarId').value;
      var changedAsDeputy = document.getElementById ('mnExternalParameters.changedAsDeputy').value;
      var selZusatzprozess = document.getElementById ('mnExternalParameters.selZusatzprozess').value;
      var projektEbene = document.getElementById ('mnExternalParameters.projektEbene').value;

      doCallURL('Massnahme.prepareToCreateMassnahme', 'popup=true'
          + '&mnTyp=' + typ
          + '&callFromRATSD=true'
          + '&username=' + username
          + '&clusterId=' + clusterId
          + '&apjPdsId=' + apjPdsId
          + '&tpjPdsId=' + tpjPdsId
          + '&beid=' + beId
          + '&bewid=' + bewId
          + '&pdsid=' + pdsId
          + '&pkid=' + paketKalendarId
          + '&selZusatzprozess=' + selZusatzprozess
          + '&changedasdeputy=' + changedAsDeputy
          + '&isProjectEbene=' + projektEbene
          + encodeURI(apjMnParams));
    }else{
      doCallURL('Massnahme.prepareToCreateMassnahme',
          'mnTyp=' + typ
          + encodeURI(apjMnParams));
    }

  },

  fillTeilgewerke : function(token) {
    var gewerkId = $('gewerkId').value;
    jQuery.post('BaseAjaxAccess.getTeilGewerke.do', {
      gewerkId : gewerkId
    }, function(data) {
      jQuery('#' + teilgewerkFieldId).empty();

      if (data != '') {
        jQuery.each(data, function(id, name) {
          jQuery('#' + teilgewerkFieldId).append(
              jQuery("<option></option>").attr("value", id).text(
                  name));
        });
      }
    });
  },

  Tabs : {
    /**
     * wheelObserver - Adds additional functionality to the wheelObserver of
     * TabControl
     *
     * @param {type}
     *            event
     */
    wheelObserver : function(event) {
      var tab;

      (function() {
        tab = TabControl.getActive();
        MN.Basis.Massnahme.Tabs.moveImgCntr(tab);
        MN.LOG_ON() ? console.log(tab.id) : '';
      }).defer(0.1);

    },
    /**
     * focusObserver - Adds additional functionality to the focusObserver of
     * TabControl
     *
     * @param {type}
     *            event
     */
    focusObserver : function(event) {
      var elem = event.element(), tab;

      (function() {
        tab = (elem.tagName === 'li' ? elem : elem.up('li'));
        MN.Basis.Massnahme.Tabs.moveImgCntr(tab);
        MN.LOG_ON() ? console.log(tab.id) : '';
      }).defer(0.1);
    },
    /**
     * moveImgCntr - Moves the container for displaying images from one tab
     * to another. Currently supported tab-ids are 'controlling' and
     * 'extDescription'.
     *
     * @param {type}
     *            tab - DOM object
     */
    moveImgCntr : function(tab) {

      var cfg = MN.Basis.Massnahme.config, imgCntrId, tmp, imgWrapperToken = 'imgWrapper';

      if (tab.id === 'extDescription' || tab.id === 'controlling') {
        if (tab.hasClassName('current')) {
          if (!cfg.imgWrapper) {
            cfg.imgWrapper = $(imgWrapperToken)
                || $(imgWrapperToken + 'N');
          }
          tmp = cfg.imgWrapper.remove();

          imgCntrId = tab.id + imgWrapperToken;
          if (!cfg[imgCntrId]) {
            cfg[imgCntrId] = $(imgCntrId);
          }
          cfg[imgCntrId].insert(tmp);
        }
      }
    },
    synchronizeInputFields : function(sourceInput, targetInput) {
      $(targetInput).value = $(sourceInput).value;
    }
  }
};

/**
 * Namespace provides functionality for handling actions with uploaded images
 */
MN.Basis.Massnahme.Images = {
  /**
   * Object holds necessary general configuration data, needed to handle
   * displaying, stepping throug image array and zoom into current image
   */
  config : {
    mnImagesInArray : [],
    imageTitlesArray : [],
    imIdx : 0,
    isZoomed : false,
    surrImageUrl : 'images/symbols/image_message_${language}.gif',
    nonDisplayableType : '.tif.eps.ps',
    imDrag : ''
  },
  /**
   * init displays current image
   *
   * @param {type}
   *            param
   */
  init : function(param) {
    var ns = MN.Basis.Massnahme.Images;

    // script for displaying images
    if (ns.config.mnImagesInArray.length > 0) {
      ns.showCurrentImage();
    }
  },

  /**
   * showCurrentImage
   */
  showCurrentImage : function() {
    var imgNS = MN.Basis.Massnahme.Images, imgCfg = imgNS.config, imIdx = imgCfg.imIdx, mnImagesInArray = imgCfg.mnImagesInArray;

    imgCfg.isZoomed = false;

    var imageType = mnImagesInArray[imIdx].substr(mnImagesInArray[imIdx]
        .lastIndexOf('.'));

    var imSrc = mnImagesInArray[imIdx];
    if (imgCfg.nonDisplayableType.indexOf(imageType) != -1) {
      imSrc = imgCfg.surrImageUrl;
    }

    // cache the placeholder for displ. current image
    if (!imgCfg.currentImg) {
      imgCfg.currentImg = $('theimage');
    }

    if (imgCfg !== undefined && imgCfg.currentImg !== undefined
        && imgCfg.currentImg.src !== undefined) {
      imgCfg.currentImg.src = imSrc;
    }

  },

  showPreviousImage : function() {
    var ns = MN.Basis.Massnahme.Images, imIdx = ns.config.imIdx;

    if (imIdx > 0) {
      ns.config.imIdx = imIdx - 1;
    } else {
      ns.config.imIdx = ns.config.mnImagesInArray.length - 1;
    }
    ns.showCurrentImage();
  },

  showNextImage : function() {
    var ns = MN.Basis.Massnahme.Images, imIdx = ns.config.imIdx;

    if (imIdx < (ns.config.mnImagesInArray.length - 1)) {
      ns.config.imIdx = imIdx + 1;
    } else {
      ns.config.imIdx = 0;
    }
    ns.showCurrentImage();
  },

  zoomImage : function() {
    var zfactor, imgCfg = MN.Basis.Massnahme.Images.config;

    if (imgCfg.isZoomed) {
      zfactor = 50;
      imgCfg.isZoomed = false;
    } else {
      zfactor = 200;
      imgCfg.isZoomed = true;
    }
    window.open(imgCfg.mnImagesInArray[imgCfg.imIdx], 'img' + imgCfg.imIdx);
  }
};

MN.Basis.Massnahme.Bauteile = {
  /**
   * TODO: not in use because async reload needs a refactoring in form
   * handling
   *
   * selectionChange
   *
   * @param {type}
   *            params
   */
  selectionChange : function(variante, potArt) {
    var mnCfg = MN.Basis.Massnahme.config, url = encodeURI(
        'Bauteil.viewBauteileForMN.do?'
            + 'mnId=' + mnCfg.mnId + '&idKvId' + mnCfg.idKvId
            + '&beId=' + mnCfg.beId + '&bewId=' + mnCfg.bewId
            + '&potArtId=' + mnCfg.potArtId + '&status='
            + mnCfg.statenId + '&mnPjbId=' + mnCfg.treiberId,
        '&relevant=' + mnCfg.relevant, '&poolRelevant='
            + mnCfg.poolRelevant, '&potArtId=' + potArt.value,
        '&idVariante=' + variante.value);

    jQuery('#bauteileMitSNR').load(url, $('MassnahmeForm').serialize(true));
  }
};

MN.Basis.Massnahme.Status = {
  /**
   * init
   *
   * @param {String}
   *            statusCntrId
   */
  init : function(statusCntrId) {

    var cntr = $(statusCntrId);

    if (cntr) {

      // Cache relevant image elements
      MN.Basis.Massnahme.Status.stateSymbols = cntr
          .select('img.clickable');

      cntr.observe('click', MN.Basis.Massnahme.Status.stateClickObserver);
    }

  },
  /**
   * stateClickObserver
   *
   * @param {type}
   *            event
   */
  stateClickObserver : function(event) {

    var elem = event.element(), statusNS = MN.Basis.Massnahme.Status, pattern = 'grau';

    if (elem.hasClassName('clickable')) {

      statusNS.stateSymbols.each(function(item) {

        var idParts = item.id.split('_');

        if (item.id === elem.id) {
          item.className = item.className.replace(pattern, '');
          var statusElem = document.getElementById('status')
              || MN.util.DUMMY;
          statusElem.value = idParts[0];
        } else {
          if (!item.className.include(pattern)) {
            var className = item.className;
            var newClassName = className.substring(0, className
                .indexOf(' '));
            item.className = item.className.replace(newClassName,
                newClassName + pattern);
          }
        }

      });
    }

  },
  /**
   * replaceStatusImg
   *
   * @param {type}
   *            oldImgs
   * @param {type}
   *            oldState
   * @param {type}
   *            newState
   */
  replaceStatusImg : function(oldImgs, oldState, newState) {

    for (var i = 0; i < oldImgs.length; i++) {
      oldImgs[i].id = oldImgs[i].id.replace(oldState, newState);
      oldImgs[i].className = oldImgs[i].className.replace(oldState,
          newState);
    }

  },

  isStateReopened : function(oldState, newState) {

    if ([ 'R', 'N', 'C' ].indexOf(oldState) > -1
        && [ 'I', 'B', 'A', 'E' ].indexOf(newState) > -1) {
      return true;
    }
    return false;

  }
};

MN.Basis.Aktivitaet = {
  config : {
    clickableImgs : [],
    notClickableImgs : [],
    clickableStandImgs : [],
    neutralStatusRadios : [],
    status : null,
    stand : null
  },
  /**
   * globalInit - Initializaton of all common pickers
   *
   * @param {type}
   *            param
   */
  globalInit : function() {

    var ns = MN.Basis.Aktivitaet, contentCntr = $('content');

    // Cachen der benötigten DOM Elemente
    var allClickableImgs = contentCntr.select('img.clickable');
    var allStatusImgs = contentCntr.select('img.status');
    var allStandImgs = contentCntr.select('img.stand');
    var allRadioButtons = contentCntr.select('input[type="radio"]');
    ns.config.clickableImgs = allStatusImgs.intersect(allClickableImgs);
    ns.config.clickableStandImgs = allStandImgs.intersect(allClickableImgs);
    ns.config.neutralStatusRadios = allRadioButtons;

    ns.config.status = $('status');
    ns.config.stand = $('stand');

    // Registrieren der Handler
    ns.config.clickableImgs.invoke('observe', 'click',
        MN.Basis.Aktivitaet.statusClickObsrever);
    ns.config.clickableStandImgs.invoke('observe', 'click',
        MN.Basis.Aktivitaet.standClickObsrever);
    ns.config.neutralStatusRadios.invoke('observe', 'click',
        MN.Basis.Aktivitaet.showOrHideStatusImg);

    // Bewertung in Aktivitaet-View ?!?!?
    /*
     * if(Bewertung && Bewertung.Messwerte){
     * Bewertung.Messwerte.initResizableElements(); }
     */

    MN.Basis.Aktivitaet.showOrHideStatusImg();

  },

  initEdit : function(param) {

    MN.Basis.Aktivitaet.globalInit();

    errorMsgObj = param.errorMsgObj;

    var nsPicker = MN.Util.Picker;
    nsPicker.pjbPicker.action({
      txtFieldId : 'projektbeteiligte',
      minCharsHint : errorMsgObj.lessThanThree(),
      openUp : false
    });
    nsPicker.gremiumPicker.action();
  },

  initRead : function() {
    MN.Basis.Aktivitaet.globalInit();
  },

  validateRealizationAndSaveAkt : function(system) {

    var sysCfg = MN.Basis.Massnahme[system || 'ZPS'].config.activity;

    var mnTyp = $('mnTyp').value;
    var invalidDate = $('invdate').value;
    var haveInvalidDate = (invalidDate === 'invdate');

    var msg = messages.general.msg.confirmToModifyRealization();

    if(mnTyp === 'R'){
      msg = messages.general.msg.confirmToModifyRealization.Risiko();
    }

    if (( $('editAllRight') && $('editAllRight').value == "true")
        || ( $('AK_EDIT') && $('AK_EDIT').value == "true")) {

      var allowModifyDate = false;

      if (haveInvalidDate) {
        allowModifyDate = confirm(msg);
        if(allowModifyDate && $('modifyMN') ) {
          $('modifyMN').value = 1;
        }
      }

      if(!haveInvalidDate || allowModifyDate){

        var url = sysCfg.action + sysCfg.dispatch + (($('id').value!=0 && $('id').value!='')?
          '.editAktivitaet.do' : '.insertNewAktivitaet.do');

        console.log('detect save on activities: set uploadUpdateFlag=true');
        window.parent.uploadUpdateFlag = true;        
        top.DialogManager.registerDialogReloadFlag(self);
        
        document.forms['AktivitaetForm'].action = url;
        document.forms['AktivitaetForm'].submit();
      }
    }
  },

  doAction : function(system, action) {
    if (action === 'deleteAktivitaet' && !confirm(messages.admin.msg.confirmdelete())) {
      return false;
    }

    var sysCfg = MN.Basis.Massnahme[system || 'ZPS'].config.activity;

    console.log('save clicked - changes detected: set uploadUpdateFlag=true');
    window.parent.uploadUpdateFlag = true;

    top.DialogManager.registerDialogReloadFlag(self);

    var url = sysCfg.action + sysCfg.dispatch + '.' + action + '.do';
      document.forms['AktivitaetForm'].action = url;
      document.forms['AktivitaetForm'].submit();
  },

  /**
   * statusClickObsrever
   *
   * @param {type}
   *            event
   */
  statusClickObsrever : function(event) {
    MN.DEBUG_ON() ? console.debug('clicked: %s', event.element().id) : '';

    var ns = MN.Basis.Aktivitaet, trigger = event.element(), pattern = 'grau';

    ns.config.clickableImgs = ns.replaceImgSrc(trigger,
        ns.config.clickableImgs, pattern);
    ns.config.status.value = trigger.id.split('_')[0];
  },
  /**
   * standClickObsrever
   *
   * @param {type}
   *            event
   */
  standClickObsrever : function(event) {
    MN.DEBUG_ON() ? console.debug('clicked: %s', event.element().id) : '';

    var ns = MN.Basis.Aktivitaet, trigger = event.element(), pattern = 'grau';

    ns.config.clickableStandImgs = ns.replaceStandImgSrc(trigger,
        ns.config.clickableStandImgs, pattern);
    ns.config.stand.value = trigger.id.split('_')[0];
  },
  /**
   * replaceImgSrc
   *
   * @param {Element}
   *            trigger
   * @param {Array}
   *            imgs
   * @param {String}
   *            pattern
   */
  replaceImgSrc : function(trigger, imgs, pattern) {

    if (trigger.className.include(pattern)) {
      trigger.className = trigger.className.replace(pattern, '');

      imgs
          .each(function(item) {
            if (item.id !== trigger.id
                && !item.className.include(pattern)) {
              var ids = item.id.split('_');
              var itemId = ids[2] + '-' + ids[0];
              item.className = item.className.replace(itemId,
                  itemId + pattern);
            }
          });
    }
    return imgs;
  },

  /**
   * replaceStandImgSrc
   *
   * @param {Element}
   *            trigger
   * @param {Array}
   *            imgs
   * @param {String}
   *            pattern
   */
  replaceStandImgSrc : function(trigger, imgs, pattern) {

    if (trigger.className.include(pattern)) {
      trigger.className = trigger.className.replace(pattern, '');

      imgs
          .each(function(item) {
            if (item.id !== trigger.id
                && !item.className.include(pattern)) {
              var ids = item.id.split('_');
              var itemId = ids[0];
              item.className = item.className.replace('ws_'
                  + itemId, 'ws_' + itemId + pattern);
            }
          });
    }
    return imgs;
  },

  resetAllStatusImg : function() {
    var ns = MN.Basis.Aktivitaet, pattern = 'grau';

    ns.config.clickableImgs.each(function(item) {
      if (!item.className.include(pattern)) {
        var ids = item.id.split('_');
        var itemId = ids[2] + '-' + ids[0];
        item.className = item.className.replace(itemId, itemId
            + pattern);
      }
    });

    $('status').value = '';
  },

  showOrHideStatusImg : function() {
    var akStateTitle = $('changeToLabel');
    if ($('status_on')) {
      if ($('status_on').checked) {
        $('akStateButtons').show();
        if (akStateTitle) {
          akStateTitle.show();
        }
      } else {
        $('akStateButtons').hide();
        if (akStateTitle) {
          akStateTitle.hide();
        }
        MN.Basis.Aktivitaet.resetAllStatusImg();
        $('status').value = 'Z';
      }
    }
  }
};

MN.Basis.Bauteil = {
  /**
   * onSelectionChange
   *
   * @param {type}
   *            param
   */
  onSelectionChange : function(variantenSel, potArtSel) {

    var tpjId = MN.Basis.Massnahme.context.tpjId, mnId = document
        .getElementById('mnId').value;

    // Variante kann via Combobox oder hidden Field übergeben werden
    var vaId = variantenSel.value;
    if (variantenSel.selectedIndex) {
      vaId = variantenSel.options[variantenSel.selectedIndex].value;
    }
    jQuery('#bauteileMitSNR')
        .load(
            'bauteil.do?dispatch=doAfterSelection',
            {
              'mnId' : mnId,
              'tpjId' : tpjId,
              'vaId' : vaId,
              'potArtId' : potArtSel.options[potArtSel.selectedIndex].value
            },
            function() {
              var productBtn = jQuery('#assignProductBtn');
              if (productBtn) {
                productBtn
                    .click(Anforderung.Zuordnung.showWindowToAssign);
              }
            });
  },

  remove : function(actionName, mnId, bauteilId, snr, beId, bewId, idKvId,
      trId) {
    jQuery.ajax({
      url : actionName,
      data : {
        'mnId' : mnId,
        'id' : bauteilId,
        'snr' : snr,
        'beId' : beId,
        'bewId' : bewId,
        'idKvId' : idKvId
      }
    }).done(function() {
      document.forms['MassnahmeForm'].submit();
    });

  },
  removeExtended : function(actionName, mnId, bauteilId, snr, beId, bewId,
      idKvId, trId, modul, pose, pv) {

    jQuery.ajax({
      url : actionName,
      data : {
        'mnId' : mnId,
        'id' : bauteilId,
        'snr' : snr,
        'beId' : beId,
        'bewId' : bewId,
        'idKvId' : idKvId,
        'modul' : modul,
        'pose' : pose,
        'pv' : pv
      }
    }).done(function() {
      document.forms['MassnahmeForm'].submit();
    });

  },
  removeStructures : function(formName, objectId, objectType, structureId,
      structureType) {
    if (confirm(messages.general.msg.confirmDelete())) {

      jQuery.ajax({
        url : 'ProductProvider.deleteStructures.do',
        data : {
          'objectId' : objectId,
          'objectType' : objectType,
          'structureId' : structureId,
          'structureType' : structureType
        }
      }).done(function() {
        // This. This is exactly why we need a rewrite.
        if(formName == 'BewElementForm' && document.forms['BewElementForm']['activetab']) {
            document.forms['BewElementForm']['activetab'].value = 'overview';
        }
        document.forms[formName].submit();
      });

    }
  }
};
