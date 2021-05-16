MN.Namespace.create('ProzessMenu');

ProzessMenu = Ext.extend(Ext.menu.Menu, {
  
    customClickHandler:null,
  
    customHandlerConfig:null,
  
    triggerId: null,

    /**
     * Constructor
     *
     * @param {Object} config - supported properties are...
     *                  - triggerId           (mandatory)
     *                    Id of trigger, which opens the menu
     *
     *                  - items (mandatory)
     *                    List of menu items in JSON format
     *                  
     *                  - customClickHandler  (optional)
     *                    Custom behaviour which must be performed when a menu item is clicked.
     *
     *                  - customHandlerConfig (optional)
     *                    Additional config data needed by the <code>customClickHandler</code>
     */
    constructor : function(config){
        ProzessMenu.superclass.constructor.apply(this, arguments);
  
        MN.LOG_ON() ? console.log('Init Prozess-Menü') : '';

        if(!this.triggerId){
            MN.WARN_ON() ? console.warn('No trigger id provided for registering a click Handler!') : '';
            return;
        }
      
        // Enable tooltips
        Ext.QuickTips.init();
        
        // Register global menu click handler for clicks at 1. level
        this.on('itemclick', this.onItemClick, this);
        
        // Register click handler for clicks in submenus
        this.items.each(this.addClickHandler, this);
        
        // Register click handler for trigger which opens the menu
        var trigger = $(this.triggerId);
        if(trigger){
            MN.LOG_ON() ? console.log('Register click handler for trigger: %s', trigger.id) : '';
            trigger.observe('click', this.openMenu.bind(this));
        }
    }, 
    

    /**
     * openMenu
     * @param {DOM-Event} event
     */
    openMenu : function(event){
        this.show(event.element());
    },
    /**
     * addClickHandler - Adds a clickhandler on each item which has the property <code>addHandler</code>
     * @param {Object} item: Ext menu item
     */
    addClickHandler : function(item){
        if(item.text){
            if(item.menu){
                item.menu.items.each(this.addClickHandler, this);
            }else{
                if(item.addHandler){
                    item.on('click', this.onItemClick, this);
                }
            }
        }
    },
    /**
     * onItemClick - Default handler for item clicks. Can be extended by
     * provided <code>customClickHandler</code> to enable client specific
     * submit actions.
     *
     * @param {Object} item
     */
    onItemClick : function(item){
        if(item.value){

            MN.LOG_ON() ? console.log('You clicked the "%d" menu item.', item.value) : '';

            if(this.customClickHandler){

                this.customClickHandler(this.customHandlerConfig, item);
            }
        }
    }
});