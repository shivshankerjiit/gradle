// make sure, that our namespace exists
MN.Namespace.create('Bewertung');

Bewertung.Messwerte = {

    minVisibleChars : 165, // number of chars displayed for read only text
    maxCharsinTextArea : {
        'bezeichnung':255,
        'ausgangslage':1500,
        'bemerkung':1500,
        'entscheidungsVorschlag':1024,
        'istWert':1024,
        'label1':50,
        'label2':50,
        'label3':50,
        'label4':50,
        'impact1BewertungsText':255,
        'impact2BewertungsText':255,
        'impact3BewertungsText':255,
        'impact4BewertungsText':255,
        'default':1024
    }, // max number of chars of a Textarea
    remainingCharsinTextArea : 0,
    counter : '',
    clickedOutside: false,

    dynaNodes : {// Config-Object for DOM-Elements in Bewertungs-view, which are created or modified at runtime
        moreLink : {
            type : 'a',
            msg : messages.general.lbl.more(),
            configObj : {
                'class' : 'moreLink'
            }
        },
        excerpt : {
            type : 'p',
            configObj : {
                'class' : 'excerpt',
                accesskey : 'TODO',
                title : messages.general.lbl.more.tooltip() + ' (Alt + )'
            }
        },
        collapseAnchor : {
            type : 'a',
            configObj : {
                title: messages.measurements.lbl.hide()
            }
        },
        collapseMesswert : {
            configObj : {
               title: messages.global.msg.dirty()
            }
        },
        counterDiv : {
            type : 'span',
            configObj : {
               id : 'counterDiv',
               'class' : 'counterDiv'
            }
        },
        count : {
            type : 'span',
            configObj : {
               id : 'counter',
               'class' : 'counter'
            }
        }
    },
    /**
     * Config Object which defines the behaviour of certain anchors
     * - lessLink
     * - moreLink
     * - collapseTableBtn
     * - expandTableBtn
     */
    anchorConfig : {
        lessLink : function(elem){
            var paragraph = elem.up(),
                ns = Bewertung.Messwerte;
            // 'weniger' link
            if (paragraph && paragraph.tagName.toLowerCase() === 'p') {
                paragraph.hide();

                ns.dynaNodes.excerpt.msg = paragraph.firstChild.nodeValue.truncate(ns.minVisibleChars, '');
                var p = MN.DOM.createElement(ns.dynaNodes.excerpt);

                var anchor = MN.DOM.createElement(ns.dynaNodes.moreLink);

                if( paragraph.id === 'ausgangslageCntr'){
                    p.setStyle({height:'86px'});
                }

                Element.insert(p, {bottom: anchor});
                Element.insert(paragraph, {after: p});
                p.identify();
            }
        },
        moreLink : function(elem){
            var paragraph = elem.up();
            // 'mehr' link
            if (paragraph && paragraph.tagName.toLowerCase() === 'p') {
                var fulltextParagraph = paragraph.previous('p');
                fulltextParagraph.show();
                paragraph.remove();
            }
        },
        collapseTableBtn : function(elem){
            // expand/collapse button for a table
            var cssClassNames = $w(elem.className),
                ns = Bewertung.Messwerte;
            cssClassNames = cssClassNames.reject(function(s) {
                return s == 'collapseTableBtn' || s == 'expandTableBtn' || !s.startsWith('dynTable');
            });

            if (cssClassNames.length == 1) {
                if (elem.hasClassName('expandTableBtn')) {
                    // expand the table
                    var parentContainer = elem.up('div');
                    var dynTable = parentContainer.select('div.'+cssClassNames[0]);
                    if (dynTable.size() == 1) {
                        dynTable[0].show();

                        elem.remove();

                        var anchorCollapse = parentContainer.down('a.'+cssClassNames[0]);
                        anchorCollapse.show();
                    }
                } else {
                    // collapse the table
                    var dynTable = elem.up('div').select('div.'+cssClassNames[0]);
                    if (dynTable.size() == 1) {
                        dynTable[0].hide();

                        // insert a clone
                        ns.dynaNodes.collapseAnchor.configObj['class'] = 'collapseTableBtn ' + cssClassNames[0];
                        var collapseAnchor = MN.DOM.createElement(ns.dynaNodes.collapseAnchor);

                        collapseAnchor.hide();
                        Element.insert(elem, {before: collapseAnchor});

                        // move the original anchor to new location in the DOM
                        Element.insert(dynTable[0], {before: elem});
                        // change the background image
                        elem.toggleClassName('expandTableBtn');
                        Element.writeAttribute(elem, ns.dynaNodes.collapseMesswert.configObj);
                    }
                }
            }
        }
    },
    /**
     * Prepares all paragraphs in the content container. It truncates long text
     * and adds shortend representations including expand/collapse JS logic.
     */
    prepareParagraphs: function(container) {
        var cntr = container && container._extendedByPrototype ? container : ($(container) || {}),
            paragraphs = cntr.select('p.dynParagraph'),
            ns = Bewertung.Messwerte;

        paragraphs.invoke('hide');

        paragraphs.each(function(elem, index) {
            var orgText = ns.extractText(elem) || elem.insert({top : '&nbsp;'}).innerHTML,
                lessLink,
                excerptText = orgText.truncate(ns.minVisibleChars, '');

            if (excerptText.length == orgText.length) {
                lessLink = elem.down('.lessLink');
                if(lessLink) {lessLink.remove();}
                elem.show();
            } else {
                ns.dynaNodes.excerpt.msg = elem.firstChild.nodeValue.truncate(ns.minVisibleChars, '');
                var p = MN.DOM.createElement(ns.dynaNodes.excerpt);

                p.addClassName(elem.className.replace('dynParagraph', ''));

                if( elem.id === 'ausgangslageCntr'){
                    p.setStyle({height:'86px'});
                }

                var anchor = MN.DOM.createElement(ns.dynaNodes.moreLink);

                Element.insert(p, {bottom: anchor});
                Element.insert(elem, {after: p});
                p.identify();
            }
        });
    },

    extractText: function(domElem) {

        var elems = $A(domElem.childNodes);
        var extraction = '';

        elems.each(function(i){
            if(i.tagName !== 'A'){
                if(i.tagName !== 'BR'){
                    extraction += i.nodeValue;
                }
            }
        });

        return extraction;
    },

    resizeTextarea : function(event) {
        /**
         * collapsedRows {Number} The number of text rows when in collapsed mode.
         * expandedRows {Number} The number of text rows when in expanded mode.
         */
        var elem = event.element(),
            ns = Bewertung.Messwerte,
            collapsedRows = 2,
            expandedRows = 8;

        if (event.type == 'focus') {
            elem.rows = expandedRows;

            if (ns.resizableElems) {
                ns.resizableElems.each(function(el) {
                    if (el.id !== elem.id) {
                        el.rows = collapsedRows;
                    }
                });
            }

            ns.prevSelectedTxtArea = elem.id;
        } else if (event.type == 'blur') {
            var callback = function() {
                if (ns.clickedOutside && !ns.prevSelectedTxtArea) {
                    ns.clickedOutside = false;

                    if (elem.rows === collapsedRows) {
                        elem.rows = expandedRows;
                    } else {
                        elem.rows = collapsedRows;

                        // remove the id reference
                        delete ns.expandedTextareaId;

                        // hide the char counter
                        $(ns.dynaNodes.counterDiv.configObj.id).hide();
                    }
                    ns.prevSelectedTxtArea = elem.id;
                } else {
                    if (ns.prevSelectedTxtArea) {
                        if (ns.resizableElems) {
                            ns.resizableElems.each(function(el) {
                                if (el.rows === expandedRows && el.id !== ns.prevSelectedTxtArea) {
                                    el.rows = collapsedRows;
                                }
                            });
                        }
                        delete ns.prevSelectedTxtArea;
                    }
                }
            };
            setTimeout(callback, 200);
        }
    },
    /**
     * determines the remaining chars of a textfield
     * and returns the remaining number
     */
    count : function(event) {
        var elem = event.element(),
            mnNS = Bewertung.Messwerte;

        var elemMaxLength = mnNS.maxCharsinTextArea[elem.id] || mnNS.maxCharsinTextArea['default'];
        //Prio1-Textareas have lenght 512
        if(elem.id.indexOf('p1')== 0){
          elemMaxLength = 500;
        }

        // count line breaks (see BUG-220 and BUG-2007)
        var linebreaks = elem.value.split("\n").length;
        linebreaks = linebreaks - 1;
        mnNS.remainingCharsinTextArea = elemMaxLength - elem.value.length - linebreaks;

        if (mnNS.counter) {
            mnNS.counter.update(mnNS.remainingCharsinTextArea + '&nbsp;');
            mnNS.counter.setStyle({color: (mnNS.remainingCharsinTextArea < 0 ? 'red' : 'green')});
        }
        return mnNS.remainingCharsinTextArea;
    },

    /**
     * erzeugt ein DIV zur Anzeige der noch zur Verfügung stehenden Zeichen eines Textfeldes
     * wenn es shon auf der Seite vorhanden ist, wird es lediglich eingeblendet
     */
    showCounterDiv : function(event){
        var mnNS = Bewertung.Messwerte,
            elem = event.element(),
            dynElem = $('counterDiv'),
            count,
            charsLeft = mnNS.count(event);

        // create new div if necessary
        mnNS.dynaNodes.count.msg = charsLeft;

        MN.LOG_ON() ? console.log('count: %d', mnNS.count(event)) : '';

        if (!dynElem) {
            count = MN.DOM.createElement(mnNS.dynaNodes.count);
            dynElem = MN.DOM.createElement(mnNS.dynaNodes.counterDiv);
            dynElem.insert({top : count});
        } else {
            dynElem.show();
        }
        elem.insert({after : dynElem});
        MN.DOM.moveElement(dynElem, elem, {offsetTop:0, offsetLeft:elem.getWidth()})
        if (!mnNS.counter) {
            mnNS.counter = $(mnNS.dynaNodes.count.configObj.id);
        }
        mnNS.counter.setStyle({color: (charsLeft < 0 ? 'red' : 'green')});
    },

    hideCounterDiv : function(){
        $(Bewertung.Messwerte.dynaNodes.counterDiv.configObj.id).hide();
    },

    clickObserver: function(event) {
        var elem = event.element(),
            ns = Bewertung.Messwerte;
        if (elem.tagName.toLowerCase() === 'textarea') {
            // handle a textarea click
            //elem.toggleClassName('expanded');
        } else if (elem.tagName.toLowerCase() === 'a') {
            // handle an anchor click
            $w(elem.className).each(function(clsName){
                if(ns.anchorConfig[clsName]){
                    ns.anchorConfig[clsName](elem);
                    event.stop(); // stop any following processing (prevent normal click action)
                }
            });
        }
    },

    /**
     * Handles global document clicks to determine if a click was done outside of
     * an expandable textarea (class resizeable). This is a necessary hack/fix for the IE
     * because this browsers treats clicks on scrollbars as real clicks as well. If this
     * is not handled properly you cannot scroll on the page and view the hidden/expanded part
     * of the textarea by using the scrollbar directly (only possible by using the mouse wheel).
     * This handler sets the scope global property Bewertung.Messwerte.clickedOutside to true if
     * the click has been done outside of some elements.
     * The workaround is adopted from the following script.aculo.us code fragment:
     * https://prototype.lighthouseapp.com/projects/8887/tickets/248-results-popup-from-ajaxautocompleter-disappear-when-user-clicks-on-scrollbars-in-ie6ie7
     *
     * @see Bewertung.Messwerte#resizeTextarea()
     * @param {Object} e The passed event object.
     * @param {Array} An array of DOM elements on which clicks should considered as "inside".
     */
    onDocumentClick: function(e) {
        var resizeableElem = false;

        var targetId = Event.element(e).id;
        var data = $A(arguments);
        data.shift();

        data[0].each(function(elem) {
            if (elem.id === targetId) {
                resizeableElem = true;
            }
        });
        if (!resizeableElem) {
            Bewertung.Messwerte.clickedOutside = true;
            Bewertung.Messwerte.prevSelectedTxtArea = undefined;
            //alert('clicked outside');
        }
    },

    /**
     * initResizableElements - Initialize a given container with an click observer,
     *   which enables dynamic folding of long text paragraphs.
     *   Form elements which are marked with a class name called 'resizable' are
     *   also initialized. Those elements are provided with folding mechanism and a dynamic div,
     *   which counts down remaining chars in such a textfield.
     */
    initResizableElements : function(targetCntr){
      var content = $('content'),
          centerContent = targetCntr || (content ? content.down('div[id=centerContent]') : ''),
          ns = Bewertung.Messwerte;

      if (centerContent) {
        /*
         * Truncate the text of the paragraphs marked with css class 'dynParagraph'
         * and replace them with shortend versions including a expand link for each
         * element. The container within to search for the p-tags is passed as the
         * only method parameter.
         */
        ns.prepareParagraphs(centerContent);

        /*
         * Register a clickObserver for the container on the center of the page.
         * Depeding on the event source element a paragraph, a textarea or a table
         * is processed (expand/collapse).
         */
        centerContent.observe('click' , ns.clickObserver);

      }


      ns.resizableElems = MN.DOM.getFormElementsWithClsName('resizable');


      if (ns.resizableElems) {
        // register "clickedOutside" handler
        Event.observe(document, 'click', ns.onDocumentClick.bindAsEventListener(document, ns.resizableElems));

        ns.resizableElems.invoke('observe', 'focus', ns.resizeTextarea);
        ns.resizableElems.invoke('observe', 'focus', ns.showCounterDiv);
        ns.resizableElems.invoke('observe', 'blur', ns.resizeTextarea);
        ns.resizableElems.invoke('observe', 'keyup', ns.count);

      }

      ns.txtLimitElems = MN.DOM.getFormElementsWithClsName('txtLimit');

      if (ns.txtLimitElems) {

          ns.txtLimitElems.invoke('observe', 'focus', ns.showCounterDiv);
          ns.txtLimitElems.invoke('observe', 'keyup', ns.count);
          ns.txtLimitElems.invoke('observe', 'blur', ns.hideCounterDiv);
      }
    }
};

document.observe('dom:loaded',  function () {
    var centerContent = $('mnDetails') || $('accBase'),
        ns = Bewertung.Messwerte;

    if(centerContent){
        /*
         * Truncate the text of the paragraphs marked with css class 'dynParagraph'
         * and replace them with shortend versions including a expand link for each
         * element. The container within to search for the p-tags is passed as the
         * only method parameter.
         */
        ns.prepareParagraphs(centerContent);

        /*
         * Register a clickObserver for the container on the center of the page.
         * Depeding on the event source element a paragraph, a textarea or a table
         * is processed (expand/collapse).
         */
        centerContent.observe('click' , ns.clickObserver);
        //var resizableElems = $('anForm').select('[class="resizable"]');
        ns.resizableElems = $$('textarea[class="resizable"]');
        ns.txtLimitElems = $$('[class*=txtLimit]');

        if (ns.resizableElems) {
            // register "clickedOutside" handler
            Event.observe(document, 'click', ns.onDocumentClick.bindAsEventListener(document, ns.resizableElems));

            ns.resizableElems.invoke('observe', 'focus', ns.resizeTextarea);
            ns.resizableElems.invoke('observe', 'focus', ns.showCounterDiv);
            ns.resizableElems.invoke('observe', 'blur', ns.resizeTextarea);
            ns.resizableElems.invoke('observe', 'keyup', ns.count);

            ns.txtLimitElems.invoke('observe', 'focus', ns.showCounterDiv);
            ns.txtLimitElems.invoke('observe', 'keyup', ns.count);
            ns.txtLimitElems.invoke('observe', 'blur', ns.hideCounterDiv);
        }
    }
});
