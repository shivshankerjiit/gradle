// make sure, that our namespace exists
MN.Namespace.create('MN.Basis');

MN['Browsing'] = true;

MN.Basis.Browsing = {

    appendDisplayDiv : function(lnkElem) {
    	
        lnkElem.href = encodeURI(lnkElem.href + '&displayDiv=' + (document.getElementById('displayDiv') || MN.util.DUMMY).value);
    }
};

MN.Basis.Browsing.Massnahme = {
    /**
     * initBrowsing
     */
    init : function(){
        var browsingCntr = $('browsingCntr');

        if(browsingCntr){
            browsingCntr.observe('click', MN.Basis.Browsing.Massnahme.browse);
        }
    },

    browse: function(event){
        var actionUrl,
            prevUrl,
            element = event.element(),
            idParts = element.id.split(MN.util.idDelimiter),
            cfg = MN.Basis.Massnahme.config,
            aktiveTab = document.getElementById('displayDiv') || MN.util.DUMMY;

        if(idParts[0] === 'previousBtn' || idParts[0] === 'nextBtn'){

            actionUrl = 'Massnahme.viewMassnahme.do?'
                + 'id=' + idParts[1]
                + '&idKvId=' + cfg.idKvId
                + '&tpjId=' + cfg.tpjId
                + '&displayDiv=' + aktiveTab.value;

            top.main.location.replace(encodeURI(actionUrl));
        }

    }
};

MN.Basis.Browsing.BewElement = {
    /**
     * initBrowsing
     */
    init : function(){
        var browsingCntr = $('browsingCntr');

        if(browsingCntr){
            browsingCntr.observe('click', MN.Basis.Browsing.BewElement.browse);
        }
    },

    browse: function(event){
        var actionUrl,
            prevUrl,
            element = event.element(),
            idParts = element.id.split(MN.util.idDelimiter),
            aktiveTab = document.getElementById('displayDiv') || MN.util.DUMMY;

        if(idParts[0] === 'previousBtn' || idParts[0] === 'nextBtn'){

            actionUrl = 'anforderung.viewAnforderung.do'
                + 'beId=' + idParts[1]
                + '&displayDiv=' + aktiveTab.value;

            top.main.location.replace(actionUrl);
        }

    }
};