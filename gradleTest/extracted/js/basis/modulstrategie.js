
jQuery(document).ready(function(){
    	jQuery('[id^=systemrelevant]').click(function(){
            if(jQuery(this).attr("value")=="true"){
            	jQuery("#modulStrategieSelection").show();
            	jQuery("#systemrelevant_off").removeAttr("checked");
            }
            if(jQuery(this).attr("value")=="false"){
            	jQuery("#modulStrategieSelection").hide();
            	jQuery("#systemrelevant_on").removeAttr("checked");
            }
        });
    // Create a jqxDropDownList for mitbetroffene Modulstrategien
    initializeMitbetroffeneModulStrategien();
 });

function initializeMitbetroffeneModulStrategien(){
    // Load the data from the Select html element.
	var source=new Array();
	var optionsInSelect=jQuery("#mitbetrMS option").get();
	for(var i=0;i<optionsInSelect.length;++i){
		var item={
			value: optionsInSelect[i].getAttribute("id"),
			label:  optionsInSelect[i].textContent
		};
		source.push(item);
	}

	var dropDownDiv=jQuery("#jqxDropDownMitbetroffeneMSList");
	dropDownDiv.jqxDropDownList({
		width: '200px',
		height: '25px',
		checkboxes: true,
		source: source,
 	    theme: "energyblue",
 	    placeHolder: "",
	  	width: '100%',
	  	height: 20,
	  	dropDownWidth: 200,
	  	dropDownHeight: 150,
	});

     // initialise the checked items
     var preselected = jQuery("#mitbetroffeneMsAsString").val().trim();
     if(preselected.length >0){
		preselected= preselected.split(",");
		var allItems = dropDownDiv.jqxDropDownList('getItems');
				jQuery.each(allItems, function (index) {
					for ( var i = 0; i < preselected.length; i++) {
						if (preselected[i].trim()== this.value.trim()) {
							jQuery('#jqxDropDownMitbetroffeneMSList').jqxDropDownList('checkIndex', index);
						}
					}
				     if(jQuery("#mitbetrMS").is(':disabled')){
				    	 jQuery('#jqxDropDownMitbetroffeneMSList').jqxDropDownList('disableAt' , index);
				     }
				  });
     }

     // updates the dropdownlist's selection.
     dropDownDiv.on('checkChange', function (event) {
         var index = jQuery("#mitbetrMS")[0].selectedIndex;
         dropDownDiv.jqxDropDownList('selectIndex', index);
         dropDownDiv.jqxDropDownList('ensureVisible', index);
         var selectedValues = dropDownDiv.val();
         jQuery("#mitbetroffeneMsAsString").val(selectedValues);
     });
}

