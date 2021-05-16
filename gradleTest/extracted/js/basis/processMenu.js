function processMenu(jsonData) {
    var ul = jQuery("<ul/>").appendTo(jQuery("#processMenu"));
    jQuery.each(jsonData, function(id, item) {
        if(item !== "-") {
            var li = jQuery("<li/>").appendTo(ul).append(jQuery("<a id='" + item.value + "'href='#' class='" + item.cls +"'>" + item.text + "</a>"));
            if(item.menu != undefined) {
                var subUl = jQuery("<ul/>").appendTo(li);
                jQuery.each(item.menu.items, function(subId, subItem) {
                    jQuery("<li/>").appendTo(subUl).append(jQuery("<a id='" + subItem.value +"' href='#'>" + subItem.text + "</a>"));
                });
            }
        }
    });

}
function initMenu() {
    jQuery("#processMenu").jqxMenu({
        autoOpenPopup: false,
        mode: 'popup',
        theme: "energyblue",
        width: 120
    });
    jQuery("#processMenu").on("itemclick", function (event) {
        var element = event.args;
        var a = element.down();
        if(element.children.length > 1) {
            a = element.children[1];
        }
        startSubmitProcess(a.id);
    });
}
function showMenu(event) {
    var scrollTop = jQuery(window).scrollTop();
    var scrollLeft = jQuery(window).scrollLeft();
    jQuery("#processMenu").jqxMenu("open", parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
}
function startSubmitProcess(value) {
  if (Session) {
    if ("rat" == Session.appName) {
      var sidebarStatus = '';
      if (top.sidebarFrame) {
        sidebarStatus = $w(top.sidebarFrame.document.getElementById('main').className)[0];
      }
      var form = document.forms[0];

      var querystring = encodeURI("kpkzSelect.execute.action?sidebarStatus="+sidebarStatus+"&mode=base&selection="+ value);
      form.action = querystring;
      form.target = '_top';
      form.submit();
    }
    else {
      var querystring = encodeURI('ContextSelection.changeContext.do?' + (value ? 'selection=' + value : ''));
      if (top.document.getElementById('mainFrame')) {
            var fr = top.document.getElementById('mainFrame');
            fr.removeAttribute("cols");
            fr.setAttribute("rows", "100%,*");
            fr.removeAttribute("rows");
            fr.setAttribute("cols", "22, *");
        }
        if (top.frames['main']) {
            top.frames['main'].location.replace(querystring);
        }
        if (top.frames['navleft']) {
            top.frames['navleft'].location.replace('Sidebar.do?sbType=small');
        }
    }
  }
}