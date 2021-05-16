/**
 * This represents the jqxComboBox used for selection the cluster, project and Subproject.
 * The implementation supports RATSD and ZKS.
 *
 * The displayed cluster information is loaded from a rest service implemented in the
 * ClusterSelectionController class in PMRights.
 */
var ClusterComboBox = {
  clusterRowCount : 0,

  /**
   * Init the Cluster selector, parameters are
   * appId = Id of the application supported are "pmrat" or "pmzks"
   * componentId = The id of the input or div element that represents the cluster selector.
   * 				 That also depends on the type. For type "combobox" the element must be a div.
   * type = The type of the implementation. There are two implementations the value "combobox"
   * 	 	  will use the jqxWidget jqxComboBox on the specified div element,
   *        any other value will use the jquery ui autocomplete widget for the input field specified.
   */
  init: function(appId, componentId, type) {
    if (appId == undefined) {
      console.log("Mandatory parameter 'appId' missing");
    }
    if (componentId == undefined) {
      console.log("Mandatory parameter 'componentId' missing");
    }
    // prepare the data
    var apjSel = false;
    var tpjSel = false;
    var clusterSel = false;
    var url = "";
    // if appId not specified try to guess it.
    if (appId == undefined && Session) {
      if ("rat" == Session.appName) {
        appId = "pmrat";
        url = "/RATSD/";
      } else if ("zks" == Session.appName) {
        appId = "pmzks";
        url = "/ZKS/";
      }
    }

    var userName = jQuery("#mdsToolsetUserId").val();
    /* use when using the service in PMRights
    var pmRightsUrl = jQuery("#pmRightsUrl").val();

    // should be like /PMRights/action/clusterSearch/jereese/pmrat?term=test
    if(pmRightsUrl) {
      url = pmRightsUrl;
    }*/

    url = url + "action/clusterSearch/" + userName + "/" + appId;
    if (type == "combobox") {
      this.createComboBox(url, componentId, appId);
    } else {
      this.createAutoComplete(url, componentId, appId);
    }
  },

  createComboBox : function(url, componentId, appId) {

    var source = {
      datatype: "json",
            datafields: [
                { name: 'clId'},
                { name: 'clBez'},
        { name: 'apjId'},
                { name: 'apj'},
        { name: 'tpjId'},
                { name: 'tpj'},
                { name: 'description'},
                { name: 'kpkzValue'},
                { name: 'active'}
            ],
            url: url,
            async: false
    };
    var dataAdapter = new jQuery.jqx.dataAdapter(source,
      {
          formatData: function (data) {
            var searchTerm = jQuery("input[name="+componentId+"]").val();
            var res = null;
            if (searchTerm != undefined) {
              res = {term:searchTerm};
            } else {
              res = {};
            }

            return res;
          }
      }
    );

    jQuery("#"+componentId).jqxComboBox({
      width : '90',
      height : '21px',
      source : dataAdapter,
      displayMember: "clBez",
      valueMember: "clId",
      placeHolder: jQuery("#clusterName").val(),
      selectedIndex : -1,
      searchMode: 'contains',
      theme : "energyblue",
      dropDownHeight : 400,
      remoteAutoComplete: true,
      dropDownHorizontalAlignment: 'left',
      dropDownWidth: 530,
      renderer: function (index, label, value) {
        var searchTerm = jQuery("input[name="+componentId+"]").val();
        var datarecord = dataAdapter.records[index];
        var table = ClusterComboBox.itemRenderer(datarecord, searchTerm);

        return table;
      },
      search: function(searchString) {
        dataAdapter.dataBind();
      }
    });
    jQuery("#"+componentId).on('select', function(event) {
      if (event.args && event.args.item) {
        var item = event.args.item.originalItem;
          if (item) {
            var config = {
              'mainActivePaket' : undefined,
              'mode' : 'base'
            };

            ClusterComboBox.submitClusterSelection(config, item, appId);
          }
        }
    });
  },

  itemRenderer : function(datarecord, searchTerm) {
    var clusterId = jQuery("#clusterId").val();
    var projektId = jQuery("#apjPdsId").val();
    var teilprojektId = jQuery("#tpjPdsId").val();


    var classContainerDiv = 'clusterResultFixed';

    if (datarecord.active === 'false') {
      classContainerDiv = classContainerDiv + ' clusterInactive';
    }

    if(datarecord.clBez && datarecord.apj == "") {
      this.clusterRowCount++;
    }

    if ((this.clusterRowCount % 2) == 0) {
      classContainerDiv = classContainerDiv + ' even';
    } else {
      classContainerDiv = classContainerDiv + ' odd';
    }

    var classClusterSelTd = '';
    if (clusterId == datarecord.clId && projektId == datarecord.apjId && teilprojektId == datarecord.tpjId) {
      classClusterSelTd = ' clusterSelTd';
    }

    var line = '<div class="' + classContainerDiv + '"><span class="cCol' + classClusterSelTd +'">'
            + datarecord.clBez
            + '</span><span class="apjCol' + classClusterSelTd +'">'
            + datarecord.apj
            + '</span><span class="tpjCol' + classClusterSelTd +'">'
            + datarecord.tpj
            + '</span><span class="descCol' + classClusterSelTd +'">'
            + datarecord.description
            + '</span></div>';

    line = ClusterComboBox.highlightInText(line, searchTerm);

    return line;
  },

  createAutoComplete : function (url, componentId, appId) {
    var comp = jQuery("#"+ componentId );
    comp.autocomplete({
      source: url,
      minLength: 0,
      select: function(event, ui) {
        var item = ui.item;
        if (item) {
          var config = {
            'mainActivePaket' : undefined,
            'mode' : 'base'
          };

          ClusterComboBox.submitClusterSelection(config, item, appId);
        }
      },
      create: function () {
        jQuery('#'+componentId+'Trigger').click(function() {
            ClusterComboBox.triggerClick(componentId);
        });
      },
      search: function(event, ui) {
        jQuery('#allClusterLink').show();
      },
      response: function(event, ui) {
        jQuery('#allClusterLink').hide();
      },
      open : function(event, ui) {
		  var menu_ul = jQuery(this).data('ui-autocomplete').menu.element;
		  jQuery('<li>')
              .append(jQuery('#allClusterLink a').clone(true))
              .appendTo(menu_ul);
		  menu_ul.animate({scrollTop:0}, 0);
	  }
    })
    .val(jQuery("#clusterName").val())
    .data("ui-autocomplete")._renderItem = function(ul, item){
      var searchTerm = comp.val();
      var line = ClusterComboBox.itemRenderer(item, searchTerm);
      var res = jQuery( '<li>' )
        .append('<a>'+line+'</a>')
        .appendTo( ul );

      return res;
      };
	  
      comp.click(function(){
        jQuery(this).select();
      });
  },

    onCreatePicker: function(pickerId) {
        return function(event,ui){
      var presetValue = jQuery("#clusterName").val();
            if (presetValue) {
                jQuery(pickerId).val(presetValue);
            }
        };
    },

    highlightInText : function(text, searchTerm){
      if (searchTerm != undefined && searchTerm !== "") {
        var cleanTerm = searchTerm.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
        var pattern = new RegExp("("+cleanTerm+")", "gi");

        text = text.replace(pattern, "<mark>$1</mark>");
        text = text.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
        }

      return text;
    },

  submitClusterSelection: function(config, item, appId) {
    if (appId == "pmrat") {
      ClusterComboBox.submitToRat(config, item);
    } else if (appId == "pmzks") {
      ClusterComboBox.submitToZks(item);
    }
  },

  createIdString: function(item) {
    var selection = "";

    if (item.clBez) {
      selection = item.clId;
    }

    if (item.apj) {
      selection = item.clId + "X_X" + item.apjId;
    }

    if (item.tpj) {
      selection = item.clId + "X_X"+ item.apjId + "X_X" + item.tpjId;
    }
    return selection;
  },

  submitToRat: function(config, item) {

    var selection = ClusterComboBox.createIdString(item);

    jQuery("#selection").val(selection);

    var sidebarStatus = '';
    if (top.sidebarFrame) {
      sidebarStatus = $w(top.sidebarFrame.document.getElementById('main').className)[0];
    }
    var form = document.forms[0];
    form.action = "clusterSelect.execute.action?sidebarStatus="+sidebarStatus+"&mode="+ config.mode;

    if (config.mode === 'base') {
      form.target = '_top';
    } else if (config.mode === 'copysd' && this.triggerId === 'repTypeBtn') {
      form.target = '_self';
    } else {
      form.target = '_parent';
    }

    form.submit();
  },

  submitToZks: function(item) {
    var url = "ClusterApjTpj.changeClusterApjTpj.do?clId="+item.clId
    if (item.apjId) {
      url = url + "&pjId="+item.apjId;
    }

    if (item.tpjId) {
      url = url +"&tpId="+ item.tpjId;
    }

    top.frames['main'].location.replace(encodeURI(url));
  },

  triggerClick: function(componentId) {
    var searchVal = jQuery("#"+componentId).val();
    //if (searchVal) {
      jQuery("#"+componentId).autocomplete( "search", searchVal );
    //} else {
    //	alert("Bitte mindestens 3 Zeichen eingeben.");
    //}
  },

  selectAll: function(componentId) {
    jQuery("#"+componentId).autocomplete( "search", "" );
  }
};