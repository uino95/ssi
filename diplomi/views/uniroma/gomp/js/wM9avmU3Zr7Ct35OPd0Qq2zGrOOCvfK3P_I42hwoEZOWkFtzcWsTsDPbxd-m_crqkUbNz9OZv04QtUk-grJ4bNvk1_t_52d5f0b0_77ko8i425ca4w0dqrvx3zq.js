Type.registerNamespace("Infragistics.Web.UI");
var $IG = Infragistics.Web.UI;

/******************************************ObjectBase ENUM************************************/
$IG.ObjectBaseProps = new function()
{
	this.Count = 0;
};
/******************************************END ObjectBase ENUM********************************/

/******************************************OBJECTBASE**********************************************/
$IG.ObjectBase = function(adr, element, props, owner, csm)
{
	/// <summary locid="T:J#Infragistics.Web.UI.ObjectBase">
	/// The base object for all Infragistics.Web.UI objects.
	/// </summary>
	this._props = props;
	this._element = element;
	this._owner = owner;
	this._address = adr;
	if (element)
		element._object = this;
	this._csm = csm;
	$IG.ObjectBase.initializeBase(this);
}

$IG.ObjectBase.prototype =
{
	get_element: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ObjectBase.element">
		/// Returns the element assoicated with the item.
		/// </summary>
		/// <value domElement="true"></value>

		return this._element;
	},
	set_element: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ObjectBase.element">Sets html element associated with the object.</summary>
		/// <param name="val" domElement="true">Reference to html element.</param>
		this._element = val;
	},

	_get_owner: function() { return this._owner; },
	_set_owner: function(value) { this._owner = value; },

	_get_address: function() { return this._address; },
	_set_address: function(val) { this._address = val; },

	_createObjects: function(objectManager)
	{
	},

	_createCollections: function(collectionsManager)
	{
	},

	_set_value: function(index, value)
	{
		if (this._csm)
			this._csm.set_value(index, value, this._address);
	},

	_get_value: function(index, isBool)
	{
		return this._csm ? this._csm.get_value(index, isBool, this._address) : null;
	},

	_get_clientOnlyValue: function(propName)
	{
		return this._csm ? this._csm.get_clientOnlyValue(propName, this._address) : null;
	},

	_get_occasionalProperty: function(propName)
	{
		return this._csm ? this._csm.get_occasionalProperty(propName, this._address) : null;
	},

	_set_occasionalProperty: function(propName, val)
	{
		return this._csm ? this._csm.set_occasionalProperty(propName, val, this._address) : null;
	},


	_saveAdditionalClientState: function()
	{

	},

	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ObjectBase.dispose">
		/// Prepares the object for deletion.
		/// </summary>
		if (this._element)
			this._element._object = null;
		this._element = null;
		this._owner = null;
		if (this._props)
		{
			if (this._props.objectsManager)
				this._props.objectsManager.dispose();

			if (this._props.collectionsManager)
				this._props.collectionsManager.dispose();

			this._props = null;
		}
		this._csm = null;
		$IG.ObjectBase.callBaseMethod(this, "dispose");
	}
}
$IG.ObjectBase.registerClass('Infragistics.Web.UI.ObjectBase', Sys.Component);
/******************************************END OBJECTBASE**********************************************/

/******************************************ControlObjectProps ENUM************************************/
$IG.ControlObjectProps = new function()
{
	/// <summary>For internal use only.</summary>
	this.Flags = [$IG.ObjectBaseProps.Count + 0, 0];
	this.Count = $IG.ObjectBaseProps.Count + 1;
};
/******************************************END ControlObjectProps ENUM********************************/

/******************************************UIObject**********************************************/
$IG.UIObject = function(adr, element, props, owner, csm)
{
	/// <summary locid="T:J#Infragistics.Web.UI.UIObject">
	/// An object that has UIFlags associated with it. 
	/// </summary>
	this._flags = null;
	$IG.UIObject.initializeBase(this, [adr, element, props, owner, csm]);
}

$IG.UIObject.prototype =
{
	_getFlags: function()
	{
		if (this._flags == null)
		{
			this.__flagHelper = new $IG.FlagsHelper();
			var key = [$IG.ObjectBaseProps.Count + 0, this.__getDefaultFlags()]
			this._flags = new $IG.FlagsObject(this._get_value(key), this);
		}
		return this._flags;
	},

	__getDefaultFlags: function()
	{
		if (this.__defaultFlags == null)
		{
			this._ensureFlags();
			this.__defaultFlags = this.__flagHelper.calculateFlags();
		}
		return this.__defaultFlags;
	},

	_updateFlags: function(flags)
	{
		var key = [$IG.ObjectBaseProps.Count + 0, this.__getDefaultFlags()]
		this._set_value(key, flags)
	},

	_ensureFlags: function()
	{

	},

	_ensureFlag: function(flag, val)
	{
		this.__flagHelper.updateFlag(flag, val);
	},

	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.UIObject.dispose">
		/// Prepares the object for deletion.
		/// </summary>
		if (this._flags != null)
			this._flags.dispose();
		$IG.UIObject.callBaseMethod(this, "dispose");
	}

}
$IG.UIObject.registerClass('Infragistics.Web.UI.UIObject', $IG.ObjectBase);
/******************************************END UIObject******************************************/

/******************************************ListItemProps ENUM************************************/
$IG.ListItemProps = new function()
{
	/// <summary>For internal use only.</summary>
	this.KeyTag = [$IG.ControlObjectProps.Count + 0, ""];
	this.NavigateUrl = [$IG.ControlObjectProps.Count + 1, ""];
	this.Target = [$IG.ControlObjectProps.Count + 2, ""];
	this.Tooltip = [$IG.ControlObjectProps.Count + 3, ""];
	this.Count = $IG.ControlObjectProps.Count + 4;

};
/******************************************END ListItemProps ENUM********************************/

/******************************************List Item**********************************************/
$IG.ListItem = function(adr, element, props, owner, csm, collection, parent)
{
	/// <summary locid="T:J#Infragistics.Web.UI.ListItem">
	/// Represents an item for flat data controls. 
	/// </summary>
	$IG.ListItem.initializeBase(this, [adr, element, props, owner, csm]);
	this._parent = parent;
	this._itemCollection = collection
}

$IG.ListItem.prototype =
{
	_ensureFlags: function()
	{
		$IG.ListItem.callBaseMethod(this, "_ensureFlag");
		this._ensureFlag($IG.ClientUIFlags.Hoverable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Selectable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Draggable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Droppable, $IG.DefaultableBoolean.True);
	},
	set_key: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.key">Sets key for item.</summary>
		/// <param name="value" type="String">Key for item.</param>
		this._set_value($IG.ListItemProps.KeyTag, value);
	},
	get_key: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.key">
		/// Returns/sets a string value that can be used to store extra information on the item.
		/// </summary>
		///<value type="String"> the key </value>
		return this._get_value($IG.ListItemProps.KeyTag);
	},

	set_navigateUrl: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.navigateUrl">Sets url for item.</summary>
		/// <param name="value" type="String">Url for item.</param>
		this._set_value($IG.ListItemProps.NavigateUrl, value);
	},
	get_navigateUrl: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.navigateUrl">
		/// Returns/sets a url that will be navigated to when an item is clicked.
		/// </summary>
		///<value type=""String"> the navigate URL  </value>
		return this._get_value($IG.ListItemProps.NavigateUrl);
	},

	set_target: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.target">Sets NavigateUrl for item.</summary>
		/// <param name="value" type="Object">Url for item.</param>
		this._set_value($IG.ListItemProps.Target, value);
	},
	get_target: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.target">
		/// Returns/sets where the NavigateUrl will be navigated to when an item is clicked.
		/// </summary>         
		///<value type="String"> target for the navigate URL </value>
		return this._get_value($IG.ListItemProps.Target);
	},

	set_tooltip: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.tooltip">Sets tooltip for item.</summary>
		/// <param name="value" type="String">Tooltip for item.</param>
		this._set_value($IG.ListItemProps.Tooltip, value);
	},
	get_tooltip: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ListItem.tooltip">
		/// Returns/sets the text that will be displayed when the mouse is over the item. 
		/// </summary>
		///<value type="String"> Tooltip </value>         
		return this._get_value($IG.ListItemProps.Tooltip);
	},

	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ListItem.dispose">
		/// for internal use
		/// </summary>
		$IG.ListItem.callBaseMethod(this, "dispose");

		this._parent = null;
		this._itemCollection = null
	}
}
$IG.ListItem.registerClass('Infragistics.Web.UI.ListItem', $IG.UIObject);
/******************************************END List Item******************************************/

/******************************************DataItemProps ENUM************************************/
$IG.DataItemProps = new function()
{
	/// <summary>For internal use only.</summary>
	this.DataPath = [$IG.ControlObjectProps.Count + 0, null];
	this.Populated = [$IG.ControlObjectProps.Count + 1, false];
	this.IsEmptyParent = [$IG.ControlObjectProps.Count + 2, false];
	this.Count = $IG.ControlObjectProps.Count + 3;

};
/******************************************END NavItemProps ENUM********************************/

/******************************************NavItemProps ENUM************************************/
$IG.NavItemProps = new function()
{
	/// <summary>For internal use only.</summary>
	this.Text = [$IG.DataItemProps.Count + 0, ""];
	this.Value = [$IG.DataItemProps.Count + 1, ""];
	this.Key = [$IG.DataItemProps.Count + 2, ""];
	this.NavigateUrl = [$IG.DataItemProps.Count + 3, ""];
	this.Target = [$IG.DataItemProps.Count + 4, ""];
	this.Count = $IG.DataItemProps.Count + 5;
};
/******************************************END NavItemProps ENUM********************************/

/******************************************Nav Item**********************************************/
$IG.NavItem = function(adr, element, props, owner, csm, collection, parent)
{
	/// <summary locid="T:J#Infragistics.Web.UI.NavItem">
	/// Represents an item for hierarchical data controls. 
	/// </summary>
	$IG.NavItem.initializeBase(this, [adr, element, props, owner, csm]);
	this._parent = parent;
	this._itemCollection = collection

}

$IG.NavItem.prototype =
{

	//NavItem Properties
	_ensureFlags: function()
	{
		$IG.NavItem.callBaseMethod(this, "_ensureFlag");
		this._ensureFlag($IG.ClientUIFlags.Visible, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Hoverable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Selectable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Draggable, $IG.DefaultableBoolean.True);
		this._ensureFlag($IG.ClientUIFlags.Droppable, $IG.DefaultableBoolean.True);
	},

	//DataItem properties
	set_dataPath: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.dataPath">Sets datapath for item.</summary>
		/// <param name="value" type="String">Datapath for item.</param>
		this._set_value($IG.DataItemProps.DataPath, value);
	},
	get_dataPath: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.dataPath">
		/// Sets or gets a string value representing the datapath into the data source used to popuplate the children of this item (if any).
		/// </summary>
		///<value type="String"> data path </value>   
		return this._get_value($IG.DataItemProps.DataPath);
	},
	set_populated: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.populated">Sets item state.</summary>
		/// <param name="value" type="Boolean">True: item was populated.</param>
		this._set_value($IG.DataItemProps.Populated, value);
	},
	get_populated: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.populated">
		/// Sets or gets a boolean value that indicates whether or not this item has been populated with children.
		/// </summary>
		///<value type="Boolean"> indicates if the item is populated or not </value>   
		return this._get_value($IG.DataItemProps.Populated, true);
	},

	set_isEmptyParent: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.isEmptyParent">Sets state of item parent.</summary>
		/// <param name="value" type="Boolean">True: empty parent.</param>
		this._set_value($IG.DataItemProps.IsEmptyParent, value);
	},
	get_isEmptyParent: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.isEmptyParent">
		/// Sets or gets a boolean value that indicates whether or not this item is a parent that has yet to be populated from an Ajax request to expand the node.
		/// </summary>
		///<value type="Boolean"> indicates if the item is a parent that has yet to be populated </value>   
		return this._get_value($IG.DataItemProps.IsEmptyParent, true);
	},

	set_text: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.text">Sets text for item.</summary>
		/// <param name="value" type="String">Text for item.</param>
		this._set_value($IG.NavItemProps.Text, value);
	},
	get_text: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.text">
		/// Gets/Sets the text of the NavItem.
		/// </summary>
		///<value type="String"> Item text </value>   
		return this._get_value($IG.NavItemProps.Text);
	},
	set_valueString: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.valueString">Sets value for item.</summary>
		/// <param name="value" type="String">Value for item.</param>
		this._set_value($IG.NavItemProps.Value, value);
	},
	get_valueString: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.valueString">
		/// Gets/Sets the value of the NavItem.
		/// </summary>
		///<value type="String"> value as string </value>   
		return this._get_value($IG.NavItemProps.Value);
	},
	get_navigateUrl: function() {
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.navigateUrl">
		/// Get the URL associated with this navigation item.
		///</summary>
		///<value type="String" />
		return this._get_value($IG.NavItemProps.NavigateUrl);
	},
	set_navigateUrl: function(url) {
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.navigateUrl">
		/// Set the URL associated with this navigation item.
		///</summary>
		///<param name="url" type="String">Specify valid url.</param>
		this._set_value($IG.NavItemProps.NavigateUrl, url);
	},
	get_target: function() {
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.target">
		/// Get the URL associated target.
		///</summary>
		///<value type="String" />
		return this._get_value($IG.NavItemProps.Target);
	},
	set_target: function(target) {
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.target">
		/// Set the URL associated target.
		///</summary>
		///<param name="target" type="String">Specify valid url target.</param>
		this._set_value($IG.NavItemProps.Target, target);
	},
	set_key: function(value)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.key">Sets key for item.</summary>
		/// <param name="value" type="String">Key for item.</param>
		this._set_value($IG.NavItemProps.Key, value);
	},
	get_key: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.NavItem.key">
		/// Gets/Sets the key of the NavItem.
		/// </summary>
		///<value type="String"> Item key </value>   
		return this._get_value($IG.NavItemProps.Key);
	},

	getItems: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.NavItem.getItems">
		/// Returns the collection of child items of a NavItem.
		/// </summary>
		/// <returns type="Object"> the collection of child items of a NavItem </returns> 
		return this._itemCollection;
	},
	
	get_selected: function() 
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.selected">
		/// Returns a boolean value which indicates if this item is currently selected.
		///</summary>
		///<value type="Boolean"> indicates if item is currently selected or not </value>  
		return this._getFlags().getSelected(this._owner);
	},
	
	set_selected: function(value)
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.selected">
		/// Sets this item's selected state
		///</summary>
		///<param type="Boolean" name="value"> value indicating if the item should be selected or not</param>
		this._getFlags().setSelected(value);
	},
	
	get_enabled: function() 
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.enabled">
		/// Returns a boolean value which indicates if this item is currently enabled.
		///</summary>
		///<value type="Boolean"> indicates if the item is enabled or not </value>  
		return this._getFlags().getEnabled(this._owner);
	},
	
	set_enabled: function(value)
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.enabled">
		/// Sets this item's enabled state
		///</summary>
		///<param type="Boolean" name="value">value indicating if the item should be enabled or not</param>
		this._getFlags().setEnabled(value);
	},

	get_visible: function() 
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.visible">
		/// Returns a boolean value which indicates if this item is currently visible.
		///</summary>
		///<value type="Boolean"> Indicates if the item is visible or not. </value>  
		return this._getFlags().getVisible(this._owner);
	},

	set_visible: function(value)
	{
		///<summary locid="P:J#Infragistics.Web.UI.NavItem.visible">
		/// Sets this item's visible state
		///</summary>
		///<param type="Boolean" name="value">Value indicating if the item should be visible or not</param>
		this._getFlags().setVisible(value);

		if(value) {
			this.get_element().style.display="";
		} else {
			this.get_element().style.display="none";
		}
	}
}
$IG.NavItem.registerClass('Infragistics.Web.UI.NavItem', $IG.UIObject);
/******************************************END Nav Item******************************************/

/******************************************FlagsHelper Object******************************************/
$IG.FlagsHelper = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.FlagsHelper">
	/// This class is for internal use only.
	/// Provides helper methods for decoding and coding UIFlags.
	/// </summary>
	this._flagsHT = [];
};

$IG.FlagsHelper.prototype =
{
	updateFlag: function(flag, val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.updateFlag">
		/// Stores the ClientUIFlag in the private flags Hashtable.
		/// </summary>
		///<param name="flag" type="Infragistics.Web.UI.ClientUIFlag"> the client UI flag </param>
		///<param name="val" type="Infragistics.Web.UI.DefaultableBoolean"> defaultable boolean (true,false, not set) </param>
		this._flagsHT[flag] = val;
	},
	getBoolFlag: function(flag)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getBoolFlag">
		/// Gets the bool value of a flag
		/// </summary>
		///<param name="flag" type="Infragistics.Web.UI.ClientUIFlag"> the client UI flag </param>
		///<returns type="Boolean"> extracted boolean flag </returns>
		var obj = this._flagsHT[flag];
		if (obj == null)
			return false;
		else
			return obj;
	},

	getDBFlag: function(flag)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getDBFlag">
		/// Gets the DefaultableBoolean value of a flag
		/// </summary>
		///<param name="flag" type="Infragistics.Web.UI.ClientUIFlag"> the client UI flag </param>
		///<returns type="Infragistics.Web.UI.DefaultableBoolean"> extracted defaultable boolean flag </returns>
		var obj = this._flagsHT[flag];
		if (obj == null)
			return $IG.DefaultableBoolean.NotSet;
		else
			return obj;
	},

	calcBoolFlag: function(flag)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.calcBoolFlag">
		/// Calculates the integer value for the specified ClientUIFlag based off of the passed in value.
		/// </summary>
		///<param name="flag" type="Infragistics.Web.UI.ClientUIFlag"> the client UI flag </param>
		///<returns type="Boolean"> extracted defaultable boolean flag </returns>
		var val = this.getBoolFlag(flag);
		return (val) ? flag : 0;
	},

	calcDBFlag: function(flag)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.calcDBFlag">
		/// Calculates the integer value for the specified ClientUIFlag based off of the passed in value.
		/// </summary>
		///<param name="flag" type="Infragistics.Web.UI.ClientUIFlag"> the client UI flag </param>
		///<returns type="Infragistics.Web.UI.DefaultableBoolean"> extracted defaultable boolean flag </returns>
		var val = this.getDBFlag(flag);
		return parseInt(flag * .5 * val);
	},

	calculateFlags: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.calculateFlags">
		/// Calculates the Flags property value of a UIObject based on the values of the list of passed in parameters.
		/// </summary
		///<returns type="Infragistics.Web.UI.ClientUIFlag"> returns the calculated flags object </returns>
		var flags = 0;
		flags += this.calcDBFlag($IG.ClientUIFlags.Visible);
		flags += this.calcDBFlag($IG.ClientUIFlags.Enabled);
		flags += this.calcDBFlag($IG.ClientUIFlags.Selectable);
		flags += this.calcBoolFlag($IG.ClientUIFlags.Selected);
		flags += this.calcDBFlag($IG.ClientUIFlags.Hoverable);
		flags += this.calcBoolFlag($IG.ClientUIFlags.Hovered);
		flags += this.calcDBFlag($IG.ClientUIFlags.Editable);
		flags += this.calcDBFlag($IG.ClientUIFlags.Focusable);
		flags += this.calcBoolFlag($IG.ClientUIFlags.Focused);
		flags += this.calcDBFlag($IG.ClientUIFlags.Draggable);
		flags += this.calcDBFlag($IG.ClientUIFlags.Droppable);
		flags += this.calcDBFlag($IG.ClientUIFlags.KBNavigable);
		return flags;
	}
}

$IG.FlagsHelper.registerClass('Infragistics.Web.UI.FlagsHelper');
/******************************************END Flags Object******************************************/

/******************************************Flags Object******************************************/
$IG.FlagsObject = function(flags, object)
{
	/// <summary>
	/// For internal use only.
	/// A helper object that manages UIFlags for a UIObject.
	/// </summary
	this._flags = flags;
	this._object = object
};

$IG.FlagsObject.prototype =
{
	dispose: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.FlagsHelper.dispose">
		/// for internal use
		///</summary>
		this._flags = null;
		this._object = null;
	},

	getVisible: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getVisible">
		/// Returns the resolved visibility of a UIObject.
		/// </summary
		///<param name="parent" type="Object"> the parent UI Object</param>
		///<returns type="Boolean"> boolean flag indicating whether the object is visible</returns>
		return this._getFlagValue($IG.ClientUIFlags.Visible, parent);
	},

	setVisible: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setVisible">Sets visibility.</summary>
		/// <param name="value" type="Boolean">True: visible.</param>
		this._setFlagValue($IG.ClientUIFlags.Visible, val);
	},

	getEnabled: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getEnabled">
		/// Returns the resolved enabled state of a UIObject.
		/// </summary
		///<param name="parent" type="Object">the parent UI Object</param>
		///<returns type="Boolean"> boolean flag indicating whether the object is enabled</returns>
		return this._getFlagValue($IG.ClientUIFlags.Enabled, parent);
	},
	setEnabled: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setEnabled">Sets enabled state.</summary>
		/// <param name="value" type="Boolean">True: enabled.</param>
		this._setFlagValue($IG.ClientUIFlags.Enabled, val);
	},

	getSelectable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getSelectable">
		/// Returns the resolved selectable property of a UIObject.
		/// </summary
		///<param name="parent" type="Object"> the parent UIObject </param>
		///<returns type="Boolean"> boolean flag indicating whether the object is selectable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Selectable, parent);
	},
	setSelectable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setSelectable">Sets ability to select.</summary>
		/// <param name="value" type="Boolean">True: selectable.</param>
		this._setFlagValue($IG.ClientUIFlags.Selectable, val);
	},

	getSelected: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getSelected">
		/// Returns true if the UIObject is Selected.
		/// </summary
		///<returns type="Boolean"> boolean flag indicating whether the object is selected</returns>
		return this._getFlagValue($IG.ClientUIFlags.Selected, null, true);
	},
	setSelected: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setSelected">Sets selected state.</summary>
		/// <param name="value" type="Boolean">True: selected.</param>
		this._setFlagValue2($IG.ClientUIFlags.Selected, val);
	},

	getHoverable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getHoverable">
		/// Returns the resolved hoverability of a UIObject.
		/// </summary>
		///<param name="parent" type="Object"> the parent UI Object </param>
		///<returns type="Boolean"> boolean flag indicating whether the object is hoverable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Hoverable, parent);
	},
	setHoverable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setHoverable">Sets ability to hover.</summary>
		/// <param name="value" type="Boolean">True: hoverable.</param>
		this._setFlagValue($IG.ClientUIFlags.Hoverable, val);
	},

	getHovered: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getHovered">
		/// Returns true if the UIObject is hovered.
		/// </summary
		///<returns type="Boolean"> boolean flag indicating whether the object is hovered</returns>
		return this._getFlagValue($IG.ClientUIFlags.Hovered, null, true);
	},
	setHovered: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setHovered">Sets hover state.</summary>
		/// <param name="value" type="Boolean">True: mouse is over.</param>
		this._setFlagValue2($IG.ClientUIFlags.Hovered, val);
	},

	getEditable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getEditable">
		/// Returns the resolved editablility of a UIObject.
		/// </summary
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object is editable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Editable, parent);
	},
	setEditable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setEditable">Sets ability to edit.</summary>
		/// <param name="value" type="Boolean">True: editable.</param>
		this._setFlagValue($IG.ClientUIFlags.Editable, val);
	},

	getFocusable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getFocusable">
		/// Returns the resolved focuability of a UIObject.
		/// </summary
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object is focusable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Focusable, parent);
	},
	setFocusable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setFocusable">Sets ability to get focus.</summary>
		/// <param name="value" type="Boolean">True: focusable.</param>
		this._setFlagValue($IG.ClientUIFlags.Focusable, val);
	},

	getFocused: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getFocused">
		/// Returns true if the UIObject is focused.
		/// </summary>
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object is focused</returns>
		return this._getFlagValue($IG.ClientUIFlags.Focused, null, true);
	},
	setFocused: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setFocused">Sets focus state.</summary>
		/// <param name="value" type="Boolean">True: has focus.</param>
		this._setFlagValue2($IG.ClientUIFlags.Focused, val);
	},

	getDraggable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getDraggable">
		/// Returns the resolved dragability of a UIObject.
		/// </summary>
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object is draggable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Draggable, parent);
	},
	setDraggable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setDraggable">Sets ability to drag.</summary>
		/// <param name="value" type="Boolean">True: draggable.</param>
		this._setFlagValue($IG.ClientUIFlags.Draggable, val);
	},

	getDroppable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getDroppable">
		/// Returns the resolved dropability of a UIObject.
		/// </summary>
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object is dropppable</returns>
		return this._getFlagValue($IG.ClientUIFlags.Droppable, parent);
	},
	setDroppable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setDroppable">Sets ability to drop.</summary>
		/// <param name="value" type="Boolean">True: droppable.</param>
		this._setFlagValue($IG.ClientUIFlags.Droppable, val);
	},

	getKBNavigable: function(parent)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.getKBNavigable">
		/// Returns true if the UIObject and be navigated with the keyboard.
		/// </summary>
		///<param name="parent" type="Object"></param>
		///<returns type="Boolean"> boolean flag indicating whether the object can participate in keyboard navigation</returns>
		return this._getFlagValue($IG.ClientUIFlags.KBNavigable, parent);
	},
	setKBNavigable: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.FlagsHelper.setKBNavigable">Sets ability to process keyboard.</summary>
		/// <param name="value" type="Boolean">True: process keyboard.</param>
		this._setFlagValue($IG.ClientUIFlags.KBNavigable, val);
	},

	// Returns a Bool
	_getFlagValue: function(flag, parent, isBoolFlag)
	{
		var returnDb = $IG.DefaultableBoolean.NotSet;
		var trueFlag = this._flags & (flag * .5);
		var falseFlag = this._flags & flag;

		if (trueFlag != 0 && falseFlag == 0)
			returnDb = $IG.DefaultableBoolean.True;
		else if (falseFlag != 0)
			returnDb = $IG.DefaultableBoolean.False;

		if (parent != null && returnDb == $IG.DefaultableBoolean.NotSet && parent._getFlags)
			returnDb = parent._getFlags()._getFlagValue(flag);

		if (isBoolFlag)
			return (returnDb == 2)
		else if (returnDb == $IG.DefaultableBoolean.True)
			return true;
		else
			return false;
	},


	// Sets a DefaultableBoolean
	_setFlagValue: function(flag, value)
	{
		if (typeof (value) == "boolean")
			value = (value) ? 1 : 2;

		var trueFlag = this._flags & (flag * .5);
		this._flags -= trueFlag;
		var falseFlag = this._flags & flag;
		this._flags -= falseFlag;

		this._flags += flag * (.5) * value;

		this._object._updateFlags(this._flags);
	},

	// Sets a Bool
	_setFlagValue2: function(flag, value)
	{
		if (typeof (val) == "boolean")
			val = (val) ? 1 : 0;

		this._flags -= this._flags & flag;
		this._flags += (value) ? flag : 0;
		this._object._updateFlags(this._flags);
	},

	_getFlags: function()
	{
		return this._flags;
	}
}

$IG.FlagsObject.registerClass('Infragistics.Web.UI.FlagsObject');
/******************************************END Flags Object******************************************/

/*****************************IMAGEOBJECT**********************************************/

$IG.ImageObjectProps = new function() 
{
	this.Count = $IG.ObjectBaseProps.Count + 0;
};

$IG.ImageObject = function(obj, element, props, owner, csm)
{
	///<summary locid="T:J#Infragistics.Web.UI.ImageObject">
	/// An object that has an associated image element and the concept of different states, such as Normal, Hover, Pressed, and Disabled.
	///</summary>
	if (!csm)
		csm = new $IG.ObjectClientStateManager(props[0]);
	$IG.ImageObject.initializeBase(this, [obj, element, props, owner, csm]);

	this._currentState = this._get_clientOnlyValue("s");
}

$IG.ImageObject.prototype =
{
	setState: function(state)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageObject.setState">
		/// Sets the ImageState of the ImageObject.
		/// </summary
		///<param name="state" type="Infragistics.Web.UI.ImageState"> value indicating the image state </param>
		if (this._element == null)
			return;
		var url = this._get_clientOnlyValue(state);
		if (url == null || url.length == 0)
			url = this._get_clientOnlyValue($IG.ImageState.Normal);

		this._element.src = url;
		this._currentState = state;
	},

	getState: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageObject.getState">
		/// Returns the ImageState of the ImageObject
		/// </summary
		///<returns type="Infragistics.Web.UI.ImageState"> the ImageState of the ImageObject</returns>
		return this._currentState;
	}
}
$IG.ImageObject.registerClass('Infragistics.Web.UI.ImageObject', $IG.ObjectBase);

$IG.ImageState = new function()
{
	///<summary>
	/// Image state of the ImageObject (normal, hover, pressed or disabled) 
	///</summary>
	///<field name="Normal" type="String" static="true"> Normal state </field>
	///<field name="Hover" type="String" static="true"> state when image is hovered </field>
	///<field name="Pressed" type="String" static="true"> state when image is pressed </field>
	///<field name="Disabled" type="String" static="true"> state when image is disabled </field>
	this.Normal = 'i';
	this.Hover = 'h';
	this.Pressed = 'p';
	this.Disabled = 'd';
};

/*****************************END IMAGEOBJECT**********************************************/

/*****************************ImageCheckBox**********************************************/

$IG.CheckBoxMode = function() 
{
	///<summary locid="T:J#Infragistics.Web.UI.CheckBoxMode">
	/// checkbox mode - off, bistate or tristate 
	///</summary>
	///<field name="Off" type="Number" integer="true" static="true"> checkbox mode when nothing should be checked </field>
	///<field name="BiState" type="Number" integer="true" static="true"> mode when bi-state only checking is allowed (on/off) </field>
	///<field name="TriState" type="Number" integer="true" static="true"> mode when there is a third state - partially checked (meaning that some of the children are checked and some aren't  </field>
}

$IG.CheckBoxMode.prototype = 
{
	Off:0,
	BiState:1,
	TriState:2
};

$IG.CheckBoxMode.registerEnum("Infragistics.Web.UI.CheckBoxMode");

$IG.CheckBoxState = function() 
{
	///<summary locid="T:J#Infragistics.Web.UI.CheckBoxState">
	/// single checkbox state - unchecked, checked or partial 
	///</summary>
	///<field name="Unchecked" type="Number" integer="true" static="true"> indicates that the current checkbox is unchecked </field>
	///<field name="Checked" type="Number" integer="true" static="true"> indicates that the current checkbox is checked </field>
	///<field name="Partial" type="Number" integer="true" static="true"> indicates that the current checkbox is partially checked  </field>
}

$IG.CheckBoxState.prototype = 
{
	Unchecked:0,
	Checked:1,
	Partial:2
};

$IG.CheckBoxState.registerEnum("Infragistics.Web.UI.CheckBoxState");

$IG.ImageCheckBoxProps = new function() 
{
	/*this.Mode = [$IG.ImageObjectProps.Count + 0, $IG.CheckBoxMode.BiState];*/
	this.State = [$IG.ImageObjectProps.Count + 0, $IG.CheckBoxState.Unchecked];
	this.Count = $IG.ImageObjectProps.Count + 1;
};

$IG.ImageCheckBox = function(obj, element, props, owner, csm) 
{
	///<summary locid="T:J#Infragistics.Web.UI.ImageCheckBox">
	/// Represents an Image CheckBox capable of display in tri-state or bi-state mode.
	/// In bi-state the checkbox offers two states - checked and unchecked.
	/// In tri-state the checkbox offers three states � checked, unchecked and partial.
	///</summary>
	$IG.ImageCheckBox.initializeBase(this, [obj, element, props, owner, csm]);
}

$IG.ImageCheckBox.prototype =
{
	set_uncheckedImageURL: function(value) 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.uncheckedImageURL">Sets the unchecked image URL of the ImageCheckBox.</summary>
		///<param name="value" type="String"> The unchecked image URL </param>
		this._uncheckedImageURL = value;
	},

	set_checkedImageURL: function(value) 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.checkedImageURL">Sets the checked image URL of the ImageCheckBox.</summary>
		///<param name="value" type="String">the checked image URL</param>
		this._checkedImageURL = value;
	},

	set_partialImageURL: function(value) 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.partialImageURL">Sets the partial image URL of the ImageCheckBox.</summary>
		///<param name="value" type="String">the partially checked image URL</param>
		this._partialImageURL = value;
	},
	
	/*set_mode: function(value) 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.mode">Sets the CheckBoxMode of the ImageCheckBox.</summary>
		this._set_value($IG.ImageCheckBoxProps.Mode, value);
	},
	get_mode: function() 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.mode">Returns the CheckBoxMode of the ImageCheckBox.</summary>
		return this._get_value($IG.ImageCheckBoxProps.Mode);
	},*/
	
	set_state: function(value) 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.state">
		/// Sets the CheckBoxState of the ImageCheckBox.
		/// </summary>
		///<param name="value" type="Infragistics.Web.UI.CheckBoxState">the checkbox state</param>
		this._set_value($IG.ImageCheckBoxProps.State, value);
		
		if (this._element == null)
			return;

		switch(value)
		{
			case $IG.CheckBoxState.Unchecked:
				this._element.src = this._uncheckedImageURL;
				break;
			case $IG.CheckBoxState.Checked:
				this._element.src = this._checkedImageURL;
				break;
			case $IG.CheckBoxState.Partial:
				this._element.src = this._partialImageURL;
				break;
		}
	},

	get_state: function() 
	{
		/// <summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.state">
		/// Returns the CheckBoxState of the ImageCheckBox.
		/// </summary>
		///<value type="Infragistics.Web.UI.CheckBoxState"></value>
		return this._get_value($IG.ImageCheckBoxProps.State);
	}
}
$IG.ImageCheckBox.registerClass('Infragistics.Web.UI.ImageCheckBox', $IG.ImageObject);

/*****************************END ImageCheckBox**********************************************/



/******************************************Utility Object******************************************/
Infragistics._Utility = function() { };

Infragistics._Utility.prototype =
{

	addCompoundClass: function(element, className)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.addCompoundClass">
		/// adds a class name to a list of existing css class names, for example class="class1, class 2..."
		///</summary>
		///<param name="element" domElement="true">the element which class attribute will be manipulated </param>
		///<param name="className" type="String">the class name to add to the list of already added CSS class names </param>
		
		/* VS 01/13/2008 grid may call that method with null */
		if (element)
			Sys.UI.DomElement.addCssClass(element, className);
	},

	containsCompoundClass: function(element, className)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.containsCompoundClass">
		/// identifies if the passed className is already contained in the class attribute of the element
		///</summary>
		///<param name="element" domElement="true">the element which class attribute will be manipulated </param>
		///<param name="className" type="String">the class name check </param>
		///<returns type="Boolean">value indicating if the passed class name is contained in the value of the class attribute or not </returns>
		
		/* VS 01/13/2008 grid may call that method with null */
		return (element && element.className.indexOf(className) >= 0);
	},

	removeCompoundClass: function(element, className)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.removeCompoundClass">
		/// removes a class name from a list of existing css class names, for example class="class1, class 2..."
		///</summary>
		///<param name="element" domElement="true">the element which class attribute will be manipulated </param>
		///<param name="className" type="String">the class name to remove from the list of already added CSS class names </param>
		
		/* VS 01/13/2008 grid may call that method with null */
		if (!element)
			return;
		element.className = element.className.replace(className, "");
		element.className = element.className.replace("  ", " ");
	},

	toggleCompoundClass: function(element, className, apply)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.toggleCompoundClass">
		/// adds or removes a class name to a list of existing css class names, for example class="class1, class 2..."
		///</summary>
		///<param name="element" domElement="true">the element which class attribute will be manipulated </param>
		///<param name="className" type="String">the class name to add/remove from the list of already added CSS class names </param>
		///<param name="apply" type="Boolean">value indicating if the class should be added or removed </param>
		
		if (apply)
		{
			if (!this.containsCompoundClass(element, className))
				this.addCompoundClass(element, className);
		}
		else
			this.removeCompoundClass(element, className);
	},

	/* add ClientEvent handler to a Control or Behavior */
	/* obj - reference to control/behavior, evtName - name of ClientEvent, val - name of function or function */
	addClientEvent: function(obj, evtName, val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.addClientEvent">For internal use. Adds client event.</summary>
		/// <param name="obj" type="Object">Reference to object.</param>
		/// <param name="evtName">Name of client event.</param>
		/// <param name="fnc" type="Object">Reference to function.</param>
		var fnc = this.toFunction(val);
		if (fnc)
			obj.get_events().addHandler(evtName, fnc);
		else
			alert('The "' + val + '" for "' + evtName + '" should be a function, function name, or function text');
	},

	/* remove ClientEvent handler from Control or Behavior which was added by addHandler */
	/* obj - reference to control/behavior, evtName - name of ClientEvent, val - name of function or function */
	removeClientEvent: function(obj, evtName, fnc)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.removeClientEvent">For internal use. Removes client event.</summary>
		/// <param name="obj" type="Object">Reference to object.</param>
		/// <param name="evtName">Name of client event.</param>
		/// <param name="fnc" type="Object">Reference to function.</param>
		obj.get_events().removeHandler(evtName, fnc);
	},

	/* return object which contains following members: */
	/* x-left position of elem, y-top position, scrollX-horizontal scroll, scrollY-vertical scroll */
	getPosition: function(elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getPosition">For internal use. Gets location of element on page.</summary>
		/// <param name="elem" type="Object">Reference to html element which position should be calculated.</param>
		/// <returns type="Object">Object which contains 4 numeric values: x-left position of elem, y-top position, scrollX-horizontal scroll, scrollY-vertical scroll.</returns>
		var htm, name, style, elem0 = elem;
		var first = true, noTD = true, ieRect = false, end = false;
		var o = { x: 0, y: 0, scrollX: 0, scrollY: 0 };
		var ie = document.all && elem.getBoundingClientRect;
		var body2 = !ie;
		while (elem)
		{
			name = elem.nodeName;
			style = this.getRuntimeStyle(elem);
			htm = name == 'HTML';
			if (end)
			{
				if (htm) break;
				elem = elem.parentNode;
				continue;
			}
			var body = name == 'BODY';
			var bdr = false;
			var pos = this.getStyleValue(style, 'position');
			var abs = pos == 'absolute', rel = pos == 'relative';
			if (ie && rel)
				ieRect = abs = true;
			end = body && !ie;
			if ((abs && body) || name == 'FORM')
				break;
			var v = elem.offsetTop;
			if (v)
			{
				if (elem.nodeName == 'TD' && elem.offsetParent != elem.parentNode)
					v = elem.parentNode.offsetTop;
				o.y += v;
			}
			v = elem.offsetLeft;
			if (v) o.x += v;
			if (!first && !htm)
			{
				var td = name == 'TD', tbl = name == 'TABLE';
				if (ie)
				{
					if (!tbl || (noTD && abs))
					{
						if (name != 'DIV' || !rel)
							bdr = true;
						if (td)/*disable border for possible coming TABLE*/
							noTD = false;
					}
					if (tbl || (!td && !tbl))/*reset border for next TD/TABLE*/
						noTD = true;
				}
				else if ((!tbl && !td) || (td && abs))
					bdr = true;
			}
			if (bdr)
			{
				/*body2: mozilla-fix for BODY-border when no abs pos*/
				v = body2 && body;
				/*mozilla-fix for DIV-border when scrollable with abs/rel pos*/
				if (!ie && !v && (abs || rel))
					v = this._isScroll(style, name);
				this._addBorder(style, o, false, v);
			}
			if (elem != elem0)/*ak - don't adjust for the original element's scroll offset*/
			/*adjust for scroll*/
				this._addScroll(elem, o);
			if (abs)/*do not fix mozilla HTML-border*/
				body2 = false;
			first = false;
			var pe = elem.parentNode;
			elem = elem.offsetParent;
			if (!elem && end)
			{
				elem = pe;
				continue;
			}
			/*mozilla-fix for scroll when no abs pos*/
			if (!ie && !abs && elem) while (pe && pe != elem)
			{
				if (this._isScroll(style = this.getRuntimeStyle(pe), pe.nodeName))
				{
					this._addScroll(pe, o);
					this._addBorder(style, o);
				}
				pe = pe.parentNode;
			}
		}
		if (body2 && htm)/*mozilla-fix for HTML-border when no abs pos*/
			this._addBorder(style, o, true);
		if (ieRect)/*IE fix for rel-position*/
		{
			v = elem0.getBoundingClientRect();
			o.x = v.left + o.scrollX;
			o.y = v.top + o.scrollY;
			if (htm && style)
				this._addBorder(style, o, true);
		}
		o.absX = o.x - o.scrollX;
		o.absY = o.y - o.scrollY;
		return o;
	},
	_addScroll: function(elem, o)/* private used by getPosition */
	{
		var v = elem.scrollLeft;
		if (v) o.scrollX += v;
		v = elem.scrollTop;
		if (v) o.scrollY += v;
	},
	_addBorder: function(style, o, neg, twice)/* private used by getPosition */
	{
		var v = this.toIntPX(style, 'borderLeftWidth', 0);
		if (twice) v += v;
		o.x += neg ? -v : v;
		v = this.toIntPX(style, 'borderTopWidth', 0);
		if (twice) v += v;
		o.y += neg ? -v : v;
	},
	_isScroll: function(style, name)/* private used by getPosition */
	{
		var v = name == 'DIV' ? this.getStyleValue(style, 'overflow') : '';
		return v == 'auto' || v == 'scroll';
	},

	/* cancel browser event e; type: cancel only particular type if multiple events are processed */
	cancelEvent: function(e, type, raw)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.cancelEvent">For internal use. Cancels browser event.</summary>
		/// <param name="e" type="Object">Reference to event.</param>
		/// <param name="type" type="String" mayBeNull="true" optional="true">Name of event.</param>
		/// <param name="raw" type="Boolean" mayBeNull="true" optional="true">Cancel rawEvent.</param>
		if (!e && !raw) e = window.event;
		if (!e) return true;
		if (type && type.substring && e.type != type)
			return true;
		if (e.stopPropagation)
			e.stopPropagation();
		if (e.preventDefault)
			e.preventDefault();
		e.cancelBubble = true;
		e.returnValue = false;
		if (raw)
			return false;
		return this.cancelEvent(e.rawEvent, null, true);
	},

	/* return run time style of element */
	getRuntimeStyle: function(elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getRuntimeStyle">For internal use. Gets reference to run time style of element.</summary>
		/// <param name="elem" type="Object">Reference to html element which position should be calculated.</param>
		/// <returns type="Object" mayBeNull="true">Style.</returns>
		if (!elem)
			return null;
		var s = elem.currentStyle;
		if (s)
			return s;
		var win = document.defaultView;
		if (!win)
			win = window;
		if (win.getComputedStyle)
			s = win.getComputedStyle(elem, '');
		return s ? s : elem.style;
	},

	/* return property value of style */
	/* style/elem one of those param is optional */
	/* prop - full name of property, like 'borderTopWidth' */
	getStyleValue: function(style, prop, elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getStyleValue">For internal use. Gets reference to run time style of element.</summary>
		/// <param name="style" type="Object" mayBeNull="true" optional="true">Reference to style.</param>
		/// <param name="prop" type="String" mayBeNull="false" optional="false">Name of property, like borderTopWidth.</param>
		/// <param name="elem" type="Object" mayBeNull="true" optional="true">Reference to html element.</param>
		/// <returns type="String" mayBeNull="true">Value of property.</returns>
		if (!style)
			style = this.getRuntimeStyle(elem);
		if (!style)
			return null;
		var val = style[prop];
		if (!this.isEmpty(val) || !style.getPropertyValue)
			return val;
		return style.getPropertyValue(prop);
	},

	getPropFromCss: function(elem, prop)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getPropFromCss">For internal use for width and height properties. Firefox fails in getStyleValue for them. Gets value of css property from style or className.</summary>
		/// <param name="elem" type="Object" mayBeNull="true" optional="true">Reference to html element.</param>
		/// <param name="prop" type="String" mayBeNull="false" optional="false">Name of property, like width or height.</param>
		/// <returns type="String" mayBeNull="true">Value of property.</returns>
		var i, v = null;
		/* check if inline style has it */
		try { v = elem.style[prop]; } catch (i) { }
		if (v && v.length && v.length > 0)
			return v;
		/* build array of css class names used by elem */
		var len = -1, cn = elem.className;
		if (!cn || cn.length < 1)
			return null;
		cn = cn.split(' ');
		while (++len < cn.length)
			cn[len] = '.' + cn[len];
		/* find our css names among all rules in all style sheets on page */
		var sheets = document.styleSheets;
		i = sheets ? sheets.length : 0;
		while (i-- > 0) try
		{
			var rules = sheets[i].cssRules;
			if (!rules)
				rules = sheets[i].rules;
			var r = rules.length;
			while (r-- > 0)
			{
				var text = null, rule = rules[r], n = len;
				try { text = rule.selectorText; } catch (elem) { }
				while (n-- > 0) if (text == cn[n])
				{
					/* success: that rule is used by elem. Get style value. */
					try { v = rule.style[prop]; } catch (elem) { }
					if (v && v.length && v.length > 0)
						return v;
				}
			}
		} catch (v) { }
		return null;
	},

	getStyleSheet: function(name)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getStyleSheet">Returns a reference to the style object defined in the style sheets collection of the document.</summary>
		/// <param name="name" type="String" mayBeNull="false" optional="false">CSS class name.</param>
		/// <returns type="String" mayBeNull="true">Style object in the style sheets collection of the document with specified name. Null if the css class is not found.</returns>
		var nameAr = name.split(".");
		if (nameAr.length > 2)
			return null;
		else if (nameAr.length == 2)
		{
			if ($util.IsIE)
				nameAr[0] = nameAr[0].toUpperCase();
			else
				nameAr[0] = nameAr[0].toLowerCase();
			name = nameAr.join(".");
		}
		else
			name = "." + name;
		for (var i = document.styleSheets.length - 1; i >= 0 ; i--)/*AK search in reverse as we need the last one if css classes with the same name are present*/
		{
			var ssrules = null;
			try
			{
				if ($util.IsIE)
					ssrules = document.styleSheets[i].rules;
				else
					ssrules = document.styleSheets[i].cssRules;
			} catch (e) { ; }
			if (ssrules)
				for (var j = ssrules.length - 1; j >= 0; j--)/*AK search in reverse as we need the last one if css classes with the same name are present*/
					if (ssrules[j].selectorText == name)
						return ssrules[j].style;
		}
		return null;
	},

	/* convert string val to int, def - value returned in case of failure to convert */
	toInt: function(val, def)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.toInt">For internal use. Gets integer from string.</summary>
		/// <param name="val" type="Object">String or numeric value.</param>
		/// <param name="def" type="Number" mayBeNull="true" optional="true">Value returned in case of failure.</param>
		/// <returns type="Number">Integer.</returns>
		var ok = false;
		var i = -1, len = val ? val.length : 0;
		while (++i < len)
		{
			var ch = val.charCodeAt(i);
			if (ch == 45 && i == 0)
				continue;
			if (ch < 48 || ch > 57)
			{
				val = val.substring(0, i);
				break;
			}
			ok = true;
		}
		return ok ? parseInt(val) : def;
	},

	/* return number of pixels in a property value */
	/* style/elem one of those param is optional */
	/* def - value returned in case of failure to convert */
	/* prop - full name of property, like 'borderTopWidth' */
	toIntPX: function(style, prop, def, elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.toIntPX">For internal use. Gets integer from string with validation for pixel units.</summary>
		/// <param name="style" type="Object" mayBeNull="true" optional="true">Reference to style.</param>
		/// <param name="prop" type="String" mayBeNull="false" optional="false">Name of property, like borderTopWidth.</param>
		/// <param name="def" type="Number" mayBeNull="true" optional="true">Value returned in case of failure.</param>
		/// <param name="elem" type="Object" mayBeNull="true" optional="true">Reference to html element.</param>
		/// <returns type="Number">Integer.</returns>
		var px = (elem && (prop == 'width' || prop == 'height')) ? this.getPropFromCss(elem, prop) : null;
		if (!px)
			px = this.getStyleValue(style, prop, elem);
		return (px && px.indexOf('px') > 0) ? this.toInt(px, 0) : (def ? def : 0);
	},

	/* convert string/function to Function */
	toFunction: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.toFunction">For internal use. Gets reference to function.</summary>
		/// <param name="val" type="Object">Reference to function, its text, etc.</param>
		/// <returns type="Number" mayBeNull="true">Reference to function.</returns>
		if (val instanceof Function)
			return val;
		if (!val || !val.length || !val.charCodeAt)
			return null;
		var fnc = window[val];
		if (fnc instanceof Function)
			return fnc;
		try { fnc = eval(val); } catch (val) { }
		return (fnc instanceof Function) ? fnc : null;
	},

	/* check if val (string, array) is not null and has length larger than 0 */
	isEmpty: function(val)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.isEmpty">For internal use. Checks if value is empty.</summary>
		/// <param name="val" type="Object">Object to test.</param>
		/// <returns type="Boolean">True: string or array is empty.</returns>
		if (!val)
			return true;
		val = val.length;
		return !val || val.length < 1;
	},
	/* returns value of opacity (supposed to be in range of 0..100) */
	getOpacity: function(elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getOpacity">For internal use. Gets opacity of element.</summary>
		/// <param name="elem" type="Object">Object to test.</param>
		/// <returns type="Number">Value in range of 0-100.</returns>
		var op = this.getStyleValue(null, 'opacity', elem);
		if (op)
		{
			op = parseFloat(op);
			if (op)
			{
				op = Math.floor(op * 100);
				return (op < 100 && op >= 0) ? op : 100;
			}
		}
		op = this.getStyleValue(null, 'filter', elem);
		if (!op)
			return 100;
		op = this.replace(op.toLowerCase(), ' ', '');
		var i = op.indexOf('opacity=');
		return (i < 0) ? 100 : this.toInt(op.substring(i + 8), 100);
	},

	/* find reference to IG control by its ID */
	/* id: value of ID or ClientID of control */
	/* prefix: (optional) value of prefix which should contain ClientID */
	findControl: function(id, prefix)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.findControl">Find Infragistics control from partial match of its id.</summary>
		/// <param name="id" type="String">Trailing part of id (after undescore).</param>
		/// <param name="prefix" type="String" mayBeNull="true" optional="true">Prefix of id.</param>
		/// <returns type="Object" mayBeNull="true">Reference to control.</returns>
		for (var ig in ig_controls)
		{
			var ctl = ig_controls[ig];
			if (!ctl.get_id || (prefix && ig.indexOf(prefix) != 0))
				continue;
			var i = ig.lastIndexOf(id), len = id.length;
			if (i >= 0 && i + id.length == ig.length) if (i == 0 || ig.charAt(i - 1) == '_')
				return ctl;
		}
	},

	/* find child element which id ends-up with id */
	/* elem: parent element */
	/* id: full or partial-suffix id of child element */
	findChild: function(elem, id)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.findChild">Find html element with partial match of its id.</summary>
		/// <param name="elem" type="Object">Parent container.</param>
		/// <param name="id" type="String">Trailing part of id (after undescore).</param>
		/// <returns type="Object" mayBeNull="true">Reference to html element.</returns>
		var id0 = elem.id;
		var i = id0 ? id0.lastIndexOf(id) : -1;
		if (i >= 0 && i + id.length == id0.length) if (i == 0 || id0.charAt(i - 1) == '_')
			return elem;
		var elems = elem.childNodes;
		i = elems ? elems.length : 0;
		while (i-- > 0)
		{
			elem = this.findChild(elems[i], id);
			if (elem)
				return elem;
		}
	},

	/* find parent LayoutManager (like a splitter pane or WebDialogWindow) and add target which should be notified about resize/layout event happened in LayoutManager */
	addLayoutTarget: function(target)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.addLayoutTarget">For internal use only.</summary>
		/* index of (splitter) pane located within LayoutManager */
		var index = -1, elem = target._element;
		while ((elem = elem.parentNode) != null)
		{
			if (!elem.getAttribute)
				continue;
			/* assume that (splitter) pane has mkr="c#" attribute where #-index of pane */
			var ctl = null, id = elem.getAttribute('mkr');
			if (id && id.length > 1 && id.substring(0, 1) == 'c')
				index = this.toInt(id.substring(1), -1);
			id = elem.getAttribute('CtlMain');
			if (!id)
				continue;
			if (id == 'layout')
			{
				id = elem.id;
				if (id)
					ctl = ig_controls[id];
			}
			if (!ctl || !ctl.getLayoutManager)
			{
				index = -1;
				continue;
			}
			/* get reference to LayoutManager (ctl or its LayoutPane at index) */
			ctl = ctl.getLayoutManager(index);
			if (!ctl) continue;
			/* add target as listener for resize events which will be raised by LayoutManager */
			var i = -1, ids = ctl._layoutListeners, id = target._id;
			if (!ids)
				ctl._layoutListeners = ids = new Array();
			/* avoid multiple references to same target */
			while (++i < ids.length)
				if (ids[i] == id)
				break;
			ids[i] = id;
			/* set reference to LayoutManager in target */
			target._layoutManager = ctl;
			return true;
		}
		return false;
	},

	/* notify listeners of LayoutManager about size-change */
	/* This method will call layout(width, height) member function of child controls located in LayoutManager. */
	/* The layout() function should return false/null/nothing in case of success or true in case of failure (if elem.offsetWidth/Height was 0). */
	raiseLayoutEvent: function(man)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.raiseLayoutEvent">For internal use only.</summary>
		/* check for special condition: if main element has _ctlsForLayout member */
		/* if yes, then use that only once because it is interrupted initialization of child control */
		var ctl, elem = man._element;
		var lsnrs = elem ? elem._ctlsForLayout : null;
		var i = lsnrs ? lsnrs.length : 0;
		while (i-- > 0)
		{
			ctl = lsnrs[i];
			if (ctl && ctl.layout)
			/* if layout at this point fails, then move listener control into normal notification line */
				if (ctl.layout(man.getClientWidth ? man.getClientWidth(ctl) : null, man.getClientHeight ? man.getClientHeight(ctl) : null))
				if (!ctl._layoutManager)
			/* find actual container/manager and assign ctl to it (as containerManager._layoutListeners) */
				this.addLayoutTarget(ctl);
			lsnrs[i] = null;
		}
		if (lsnrs)
		{
			elem._ctlsForLayout = null;
			return;
		}
		lsnrs = man._layoutListeners;
		i = lsnrs ? lsnrs.length : 0;
		while (i-- > 0)
		{
			var ctl = ig_controls[lsnrs[i]];
			if (ctl && ctl.layout)
			{
				var width = man.getClientWidth ? man.getClientWidth(ctl) : null, height = man.getClientHeight ? man.getClientHeight(ctl) : null;
				ctl.layout(width, height);
			}
		}
	},
	/* check all parents of control (ctl) for element which belongs to layout manager */
	/* NOTES: */
	/* That function should be called by a control which size (not set or in %) is controled by LayoutManager. */
	/* The ctl should call that function while first initialization only once. */
	/* If returned value is true, then ctl should skip the rest of logic and wait when layout manager will call ctl.layout(...) */
	/* If returned value is true, then ctl may optionally create a flag for that special wait "layout" condition. */
	/* NOTES for listener: */
	/* Control which expects notification from LayoutManager should implement layout(width,height) function. */
	/* The layout() function should return false/null/nothing in case of success or true in case of failure (if elem.offsetWidth/Height was 0). */
	checkLayoutManager: function(ctl)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.checkLayoutManager">For internal use only.</summary>
		var i = 0, elem = ctl._element;
		/* go through parents to find element of LayoutManager */
		/* at this point the LayoutManager object is not created yet, so, only html element is available */
		while (i++ < 10 && elem && (elem = elem.parentNode) != null)
		{
			/* it uses assumption that main element of layout manager will have className ending with ':=CtlMain:layout' */
			var css = elem.id ? elem.className : null;
			if (css && css.indexOf(':=CtlMain:layout') == css.length - 16)
			{
				/* if element is found, then the element._ctlsForLayout will be created with reference to ctl and returns true */
				if ((i = elem._ctlsForLayout) == null)
					i = elem._ctlsForLayout = new Array();
				i[i.length] = ctl;
				return true;
			}
		}
		return false;
	},

	/* style:  reference to run-time style of element */
	/* width:  boolean-true: return horizontal offset of width, false: return vertical offset of height */
	/* noTrail: boolean-true: calculate only left/top gaps (optional) */
	/* noLead: boolean-true: calculate only right/bottom gaps (optional) */
	/* return: gap between bounds of element and its client content */
	getOffset: function(style, width, noTrail, noLead)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getOffset">For internal use only.</summary>
		var val = 0;
		if (style) while (!noLead || !noTrail)
		{
			var prop = noLead ? (width ? 'Right' : 'Bottom') : (width ? 'Left' : 'Top');
			if (noLead)
				noTrail = true;
			noLead = true;
			val += this.toIntPX(style, 'border' + prop + 'Width') + this.toIntPX(style, 'padding' + prop);
		}
		return val;
	},

	/* style: reference to run-time style of element */
	/* horiz: boolean-true: return horizontal/vertical margin */
	/* return: marginLeft+marginRight, or marginTop+marginBottom */
	getMargin: function(style, horiz)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getMargin">For internal use only.</summary>
		return this.toIntPX(style, 'margin' + (horiz ? 'Left' : 'Top')) + this.toIntPX(style, 'margin' + (horiz ? 'Right' : 'Bottom'));
	},

	/* show/hide element */
	/* elem: element to show/hide */
	/* hide: if it is true, then element is hidden, otherwise it is displayed */
	display: function(elem, hide)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.display">For internal use only.</summary>
		var style = elem ? elem.style : null;
		if (!style) return;
		style.display = hide ? 'none' : '';
		style.visibility = hide ? 'hidden' : 'visible';
	},

	/* check if mouseout event exits container */
	/* e-reference to event, elem-reference to container element */
	isOut: function(e, elem)
	{
		var to = e.toElement;
		if (!to) to = e.relatedTarget;
		e = e.rawEvent;
		if (!to && e) if ((to = e.toElement) == null)
			to = e.relatedTarget;
		while (to)
		{
			if (to == elem)
				return false;
			try
			{
				to = to.parentNode;
			}
			catch(to)
			{
				return false;
			}
		}
		return true;
	},

	/* replace all oldVal substrings by newVal */
	/* str: original string */
	/* oldVal: old substring or array of old/new pairs */
	/* newVal: new string or null */
	/* If newVal is missing, then oldVal is assumed to be an array of pairs old and new strings */
	/* Examples: */
	/* val=&util.replace('okxok','ok','?'); will return '?x?' */
	/* val=&util.replace('okxok',['ok','?','x','+']); will return '?+?' */
	replace: function(str, oldVal, newVal)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.replace">For internal use only.</summary>
		if (newVal == null)
			for (var i = 0; i < oldVal.length; i += 2)
			str = this.replace(str, oldVal[i], oldVal[i + 1]);
		else while (str.indexOf(oldVal) >= 0)
			str = str.replace(oldVal, newVal);
		return str;
	},

	/* replaces all occurrences of &, <, > characters with their HTML encoding: &amp; &lt; &gt; */
	htmlEscapeCharacters: function(str)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.htmlEscapeCharacters">For internal use only.</summary>
		return (typeof (str) === "string") ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : str;
	},

	/* replaces all occurrences of &amp; &lt; &gt; html with their corresponding character: &, <, >*/
	htmlUnescapeCharacters: function(str)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.htmlUnescapeCharacters">For internal use only.</summary>
		return (typeof (str) === "string") ? str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : str;
	},

	/* get reference to element which defines size of page */
	getHTML: function(win)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getHTML">Find HTML element.</summary>
		/// <param name="win" type="Object" mayBeNull="true" optional="true">Reference to window.</param>
		/// <returns type="Object" mayBeNull="true">Reference to HTML.</returns>
		if (!win)
			win = window;
		var doc = win.document;
		var htm = doc.body;
		while (htm && htm.nodeName != 'HTML')
			htm = htm.parentNode;
		return htm ? htm : doc.body;
	},

	/* get visible left(x), top(y), positions of window and its size (width, height) */
	getWinRect: function(win)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getWinRect">For internal use only.</summary>
		if (!win)
			win = window;
		var doc = win.document;
		var body = doc.body, htm = this.getHTML(win), de = doc.documentElement;
		if (!de)
			de = htm;
		var size = (this.IsQuirks && this.IsIE) ? body : htm;
		var x = de.scrollLeft, y = de.scrollTop, wi = win.innerWidth, hi = win.innerHeight, wd = de.clientWidth, hd = de.clientHeight, w = size.clientWidth, h = size.clientHeight;
		var maxWidth = w ? w : 0, maxHeight = h ? h : 0, w2 = htm.scrollWidth, h2 = htm.scrollHeight;
		if (wd)
		{
			maxWidth = Math.max(maxWidth, wd);
			maxHeight = Math.max(maxHeight, hd);
		}
		if (wi)
		{
			maxWidth = Math.max(maxWidth, wi);
			maxHeight = Math.max(maxHeight, hi);
		}
		if (w2 && h2)
		{
			maxWidth = Math.max(maxWidth, w2);
			maxHeight = Math.max(maxHeight, h2);
		}
		maxWidth = Math.max(maxWidth, body.scrollWidth);
		maxHeight = Math.max(maxHeight, body.scrollHeight);
		w2 = body.offsetWidth;
		h2 = body.offsetHeight
		maxWidth = Math.max(maxWidth, w2);
		maxHeight = Math.max(maxHeight, h2);
		var noClientSize = false;
		/* find largest left and top scrolls */
		if (!x)
			x = htm.scrollLeft;
		if (!x)
			x = body.scrollLeft;
		if (!y)
			y = htm.scrollTop;
		if (!y)
			y = body.scrollTop;
		/* find smallest valid width */
		if (!wi || wi < 50)
			wi = 99999;
		if (!wd || wd < 50)
			wd = 99999;
		if (!w || w < 50)
			w = 99999;
		if (w > wd)
			w = wd;
		if (w > wi)
			w = wi;
		if (w == 99999)
		{
			w = w2;
			noClientSize = true;
		}
		/* find smallest valid height */
		if (!hi || hi < 50)
			hi = 99999;
		if (!hd || hd < 50)
			hd = 99999;
		if (!h || h < 50)
			h = 99999;
		if (h > hd)
			h = hd;
		if (h > hi)
			h = hi;
		if (h == 99999)
		{
			h = h2;
			noClientSize = true;
		}
		return { x: x, y: y, width: w, height: h, maxWidth: maxWidth, maxHeight: maxHeight, noClientSize: noClientSize };
	},
	/* return location {x:x, y:y} to fit elem within visible window relativele to element edit */
	/* if elem fits below edit, then that location is returned, otherwise elem is located above edit */
	_getDropPoint: function(edit, elem)
	{
		var size, rect = $util.getWinRect();
		var height = edit.offsetHeight, width0 = elem.offsetWidth, height0 = elem.offsetHeight;
		var p = Sys.UI.DomElement.getLocation(edit), pe = Sys.UI.DomElement.getLocation(elem);
		p.x -= pe.x;
		p.y -= pe.y;
		if ((size = rect.height) + 18 < rect.maxHeight)
			size -= 15;
		size += rect.y - p.y - height;
		p.up = height0 > size && size < p.y - rect.y;
		p.y += p.up ? -height0 : height;
		if ((size = rect.width) + 18 < rect.maxWidth)
			size -= 15;
		if (p.x + width0 > (size += rect.x))
			p.x = size - width0;
		return p;
	},
	/* return maximum value of zIndex among all parents of elem */
	/* z0 - initial value of zIndex (suggested value is 9999) */
	_zIndexTop: function(elem, z0)
	{
		while (elem)
		{
			if (elem.nodeName == 'BODY' || elem.nodeName == 'FORM')
				break;
			var z = this.getStyleValue(null, 'zIndex', elem);
			if (z && z.substring)
				z = (z.length > 4 && z.charCodeAt(0) < 58) ? parseInt(z) : 0;
			if (z && z >= z0)
				z0 = z + 1;
			elem = elem.parentNode;
		}
		return z0;
	},

	/* Set the opacity of an element. The opacity should be an integer between 0 and 100 */
	setOpacity: function(element, opacity)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.setOpacity">For internal use only.</summary>
		if (!element)
			return;
		element.style.opacity = opacity / 100;
		if (element.filters)
		{
			if (!element.filters["alpha"] || element.style.filter.indexOf("alpha") == -1)
				element.style.filter += " alpha(opacity=" + opacity + ")";
			else
				element.filters["alpha"].opacity = opacity;
		}
	},

	/* try to get markup-attributes from encrypted id and from encrypted className of elem */
	/* returns true if elem has id and its id is not encrypted */
	_initAttr: function(elem)
	{
		var attr = elem.id;
		var j = 99, i = attr ? attr.length : 0;
		if (i < 1)
		/* no id: condition to continue walkThrough */
			return false;
		/* format of encrypted id "x:{0}.{1}:{2}:{3}" or "x:{0}.{1}:{2}:{3}:{4}:{5}" where */
		/* {0}.{1} - unique value for id which should be ignored */
		/* {2}/{4} - name of attribute, {3}/{5} - value for attribute */
		if (attr.length > 5 && attr.charAt(1) == ':' && attr.charAt(0) == 'x')
		{
			attr = attr.split(':');
			i = attr.length;
			if ((i >= 4 || (i % 2 == 0)) && attr[1].indexOf('.') > 0)
				j = 1;
		}
		/* normal id: check className for encryption */
		if (j > 2)
		{
			/* format of encrypted className "{0} :={1}:{2}" or "{0} :={1}:{2}:{3}:{4}" where */
			/* {0} - actual className */
			/* {1}/{3} - name of attribute, {2}/{4} - value for attribute */
			var css = elem.className;
			j = (css && css.length > 5) ? css.indexOf(' :=') : -1;
			if (j < 0)
			/* normal id: condition to end walkThrough */
				return true;
			attr = css.substring(j + 3);
			if (attr.indexOf(' ') >= 0)
			/* normal id: condition to end walkThrough */
				return true;
			attr = attr.split(':');
			i = attr.length;
			if (i < 2 || (i & 1) != 0)
			/* normal id: condition to end walkThrough */
				return true;
			elem.className = css.substring(0, j);
			j = -1;
		}
		while ((i -= 2) > j)
			elem.setAttribute(attr[i], attr[i + 1]);
		/* if(j < 0), then it is normal id: condition to end walkThrough */
		return j < 0;
	},

	/* Walks up the parent chain, until an element with an "adr", "mkr", or "obj" is found 
	* returns an array, where the first object is the element and the second object is the attribute
	* returns null if no element with a marker is found. */
	resolveMarkedElement: function(elem, checkControl)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.resolveMarkedElement">For internal use only.</summary>
		var adr = null;
		var control = null;
		var secondWalkthrough = false;
		while (elem)
		{
			if (elem.getAttribute)
			{
				adr = elem.getAttribute("adr");
				if (adr == null)
					adr = elem.getAttribute("mkr");
				if (adr == null)
					adr = elem.getAttribute("obj");
				if (adr == null && !secondWalkthrough)
				{
					adr = elem.getAttribute("id");
					if (adr)
					{
						secondWalkthrough = true;
						if (!$util._initAttr(elem))
							continue;
						adr = null;
					}
				}
				else
					secondWalkthrough = false;
			}
			if (typeof (adr) == "string")
			{
				if (adr.length > 0)
					break;
			}
			else
				if (typeof (adr) != "undefined" && adr !== null)
				break;

			elem = elem.parentNode;
		}
		if (elem == null)
			return null;
		else if (checkControl)
		{
			var parent = elem.parentNode;
			while (parent)
			{
				if (parent.control != null)
				{
					control = parent.control;
					break;
				}
				parent = parent.parentNode;
			}
		}
		return [elem, adr, control];
	},

	compare: function(val1, val2)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.compare">For internal use only.</summary>
		if (val1 === val2)
			return true;
		else if (val1 != null && val2 != null)
		{
			var type1 = Object.getType(val1).__typeName;
			var type2 = Object.getType(val2).__typeName;
			if (type1 != type2 || type1 == "String" || type1 == "Number" || type1 == "Boolean")
				return false;

			if (type1 == "Array")
			{
				if (val1.length != val2.length)
					return false;

				for (var i in val1)
				{
					if (!$util.compare(val1[i], val2[i]))
						return false;
				}
				return true;
			}
			else if (type1 == "Date")
			{
				if (val1.getTime() == val2.getTime())
					return true;
			}
			else
			{
				for (var i in val1)
				{
					if (!$util.compare(val1[i], val2[i]))
						return false;
				}
				return true;
			}
		}
		return false;
	},

	ensureBrowserInfo: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.ensureBrowserInfo">For internal use only.</summary>
		try { this.AgentName = navigator.userAgent.toLowerCase(); } catch (e) { this.AgentName = ""; }
		this.MajorVersionNumber = parseInt(navigator.appVersion);
		this.IsWebKit = this.AgentName.indexOf("webkit") >= 0;
		this.IsSafari = this.IsWebKit || this.AgentName.indexOf("safari") >= 0;
		this.IsChrome = this.AgentName.indexOf("chrome") >= 0;
		this.IsFireFox = this.AgentName.indexOf("firefox") >= 0;
		if (this.IsFireFox)
		{
			this.IsFireFox2 = this.AgentName.indexOf("firefox/2") >= 0;
			this.IsFireFox3 = this.AgentName.indexOf("firefox/3") >= 0;
		}
		this.IsOpera = this.AgentName.indexOf("opera") >= 0;
		this.IsMac = this.AgentName.indexOf("mac") >= 0;
		this.IsIE = document.all != null && !this.IsOpera && !this.IsSafari;
		if (this.IsIE)
		{
			this.IsQuirks = (document.compatMode != "CSS1Compat");
			this.IsIE9 = this.AgentName.indexOf("msie 9.0") >= 0;
			this.IsIE8 = this.AgentName.indexOf("msie 8.0") >= 0;
			this.IsIE7 = this.AgentName.indexOf("msie 7.0") >= 0;
			this.IsIEStandards = (this.IsIE8 || this.IsIE9/*|| following versions*/);
			this.IsIE6 = this.AgentName.indexOf("msie 6.0") >= 0;
		}
	},

	_getWidthMargin: function(element)
	{
		var style = this.getRuntimeStyle(element);
		var borderLeftWidth = 0;
		if (style.borderLeftStyle != "none")
		{
			if (style.borderLeftWidth == "thin")
				borderLeftWidth = 1;
			else if (style.borderLeftWidth == "medium")
				borderLeftWidth = 3;
			else if (style.borderLeftWidth == "thick")
				borderLeftWidth = 5;
			else
			{
				var w = parseInt(style.borderLeftWidth, 10);
				if (isNaN(w))
					w = 0;
				borderLeftWidth = w;
			}
		}

		var borderRightWidth = 0;
		if (style.borderRightStyle != "none")
		{
			if (style.borderRightWidth == "thin")
				borderRightWidth = 1;
			else if (style.borderRightWidth == "medium")
				borderRightWidth = 3;
			else if (style.borderRightWidth == "thick")
				borderRightWidth = 5;
			else
			{
				var w = parseInt(style.borderRightWidth, 10);
				if (isNaN(w))
					w = 0;
				borderRightWidth = w;
			}
		}

		var paddingLeft = parseInt(style.paddingLeft, 10);
		if (isNaN(paddingLeft))
			paddingLeft = 0;

		var paddingRight = parseInt(style.paddingRight, 10);
		if (isNaN(paddingRight))
			paddingRight = 0;

		return borderLeftWidth + borderRightWidth + paddingLeft + paddingRight;
	},

	_getHeightMargin: function(element)
	{
		var style = this.getRuntimeStyle(element);
		var borderTopWidth = 0;
		if (style.borderTopStyle != "none")
		{
			if (style.borderTopWidth == "thin")
				borderTopWidth = 1;
			else if (style.borderTopWidth == "medium")
				borderTopWidth = 3;
			else if (style.borderTopWidth == "thick")
				borderTopWidth = 5;
			else
			{
				var w = parseInt(style.borderTopWidth, 10);
				if (isNaN(w))
					w = 0;
				borderTopWidth = w;
			}
		}

		var borderBottomWidth = 0;
		if (style.borderBottomStyle != "none")
		{
			if (style.borderBottomWidth == "thin")
				borderBottomWidth = 1;
			else if (style.borderBottomWidth == "medium")
				borderBottomWidth = 3;
			else if (style.borderBottomWidth == "thick")
				borderBottomWidth = 5;
			else
			{
				var w = parseInt(style.borderBottomWidth, 10);
				if (isNaN(w))
					w = 0;
				borderBottomWidth = w;
			}
		}

		var paddingTop = parseInt(style.paddingTop, 10);
		if (isNaN(paddingTop))
			paddingTop = 0;

		var paddingBottom = parseInt(style.paddingBottom, 10);
		if (isNaN(paddingBottom))
			paddingBottom = 0;

		return borderTopWidth + borderBottomWidth + paddingTop + paddingBottom;
	},

	setAbsoluteWidth: function(element, width, doNotAdjust)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.setAbsoluteWidth">
		///Sets the outer width on an element. The width includes in itself the borders
		///and the paddings.
		///</summary>
		///<param name="element" domElement="true"> the element to manipulate </param>
		///<param name="width" type="Integer"> width to set </param>
		///<param name="doNotAdjust" type="Boolean"> adjust width so that boxing model is correct on all browsers (padding,margin and borders ) </param>

		width -= this._getWidthMargin(element);

		if (width < 0)
			width = 0;

		element.style.width = width + "px";

		/*OK 8854 10/21/08 - this adjustment is need here because the client and offset widths may not be
		what they should be without it. */
		/* A.T. we must check whether offsetWidth is not 0 , because otherwise width will be doubled . This 
		happens when style.display=0 and visibility is hidden
		*/
		if (!doNotAdjust && element.offsetWidth != 0)
		{
			var adjustment = width + (width - element.offsetWidth + this._getWidthMargin(element));
			if (adjustment > 0)
				element.style.width = adjustment + "px";
		}

	},

	getAbsoluteWidth: function(element)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getAbsoluteWidth">
		///Sets the outer width on an element. The width includes in itself the borders
		///and the paddings.
		///</summary>
		///<returns type="Integer">absolute width of the element </returns>

		var width = element.offsetWidth + this._getWidthMargin(element);

		if (width < 0)
			width = 0;

		return width;
	},

	setAbsoluteHeight: function(element, height)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.setAbsoluteHeight">
		///Sets the outer height on an element. The height includes in itself the borders
		///and the paddings.
		///</summary>
		///<param name="element" domElement="true"> the element to manipulate </param>
		///<param name="width" type="Integer"> height to set </param>
		///<param name="doNotAdjust" type="Boolean"> adjust width so that boxing model is correct on all browsers (padding,margin and borders ) </param>
		
		height -= this._getHeightMargin(element);

		if (height < 0)
			height = 0;

		element.style.height = height + "px";
	},

	getAbsoluteHeight: function(element)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getAbsoluteHeight">
		///Sets the outer height on an element. The height includes in itself the borders
		///and the paddings.
		///</summary>
		///<returns type="Integer">absolute height of the element </returns>

		var height = element.offsetHeight - this._getHeightMargin(element);

		if (height < 0)
			height = 0;

		return height;
	},

	addHandler: function(element, eventName, handler)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.addHandler">For internal use only.</summary>
		if (!handler)
			return;
		var browserHandler;
		if (element.addEventListener)
		{
			browserHandler = function(e)
			{
				return handler.call(element, new Sys.UI.DomEvent(e));
			}
			element.addEventListener(eventName, browserHandler, false);
		}
		else if (element.attachEvent)
		{
			browserHandler = function(e)
			{
				return handler.call(element, new Sys.UI.DomEvent(e));
			}
			element.attachEvent('on' + eventName, browserHandler);
		}
	},

	removeHandler: function(element, eventName, handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.removeHandler">
		/// for internal use only 
		///</summary>
		if (!handler)
			return;
		if (element.removeEventListener)
			element.removeEventListener(eventName, handler, false);
		else if (element.detachEvent)
			element.detachEvent('on' + eventName, handler);
	},

	isChild: function(parent, child)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.isChild">
		/// checks if the passed element (child) has (parent) as its parent
		///</summary>
		///<param name="parent" domElement="true"> potential parent of the child</param>
		///<param name="child" domElement="true"> child element </param>
		///<returns type="Boolean"> value indicating if the child has parent as its parent or not</returns>
		
		var p = child.parentNode;
		while (p != parent && p != document.body && p != null)
			p = p.parentNode;
		return (p == parent)
	},
	getRows: function(tbl)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.getRows">
		/// returns an array of row elements for the specified table (browser independent implementation)
		///<summary>
		///<param name="tbl" domElement="true">HTML table element</param>
		///<returns type="Array" elementDomElement="true">the array of table rows </returns>
		if (!tbl)
			return null;
		try
		{
			if (typeof tbl.rows == 'object')
				return tbl.rows;
		} catch (e) { }
		/* get around features of IE8 */
		if (tbl.nodeName == 'TABLE')
			tbl = tbl.firstChild;
		return (tbl.nodeName == 'TBODY') ? tbl.childNodes : null;
	},

	/* This functiona allows you to create a delegate and pass parameters to it. */
	createDelegate: function(instance, method, args)
	{
		///<summary locid="M:J#Infragistics.Web.UI.ImageCheckBox.createDelegate">
		/// for internal use only
		///</summary>
		return function()
		{
			return method.apply(instance, args);
		}
	},
	
	get_ajaxIndicator: function(prop)
	{
		///<summary locid="P:J#Infragistics.Web.UI.ImageCheckBox.ajaxIndicator">
		/// returns a reference to the infragistics ajax indicator
		///</summary>
		///<param name="prop" type="Object">state of the ajax indicator (props) </param>
		///<returns type="Infragistics.Web.UI.AjaxIndicator">reference to the $IG.AjaxIndicator </returns>
		var pi = this._pi;
		if (!pi && !this.isEmpty(prop))
			pi = this._pi = new $IG.AjaxIndicator(prop);
		return pi;
	},
	/* Function designed to show and hide transparent element which blocks mouse events from content of target DIV. */
	/* Control should also call that within its dispose. */
	/* targetDIV - null: hide transparent mouse-block element; not-null: reference to DIV which will have mouse-block-DIV as its first child. */
	_setMouseBlock: function(targetDIV)
	{
		/* reference to DIV which is used to block mouse events over content of targetDIV */
		/* that block-DIV is inserted as first child of targetDIV and has size as target and large zIndex */
		var mouseBlock = this._mouseBlock;
		if (!targetDIV && !mouseBlock)
			return;
		if (!mouseBlock)
		{
			this._mouseBlock = mouseBlock = document.createElement('DIV');
			var style = mouseBlock.style;
			style.zIndex = 100000;
			style.position = 'absolute';
			style.background = 'white';
			style.filter = 'alpha(opacity:0)';
			style.opacity = 0.0;
		}
		if (targetDIV)
		{
			if (mouseBlock._targetDIV != targetDIV)
			{
				/* close old mouseBlock */
				this._setMouseBlock();
				mouseBlock._targetDIV = targetDIV;
				targetDIV.insertBefore(mouseBlock, targetDIV.firstChild);
			}
			if (mouseBlock._w != targetDIV.offsetWidth)
				mouseBlock.style.width = (mouseBlock._w = targetDIV.offsetWidth) + 'px';
			if (mouseBlock._h != targetDIV.offsetHeight)
				mouseBlock.style.height = (mouseBlock._h = targetDIV.offsetHeight) + 'px';
			return;
		}
		if (!mouseBlock._targetDIV)
			return;
		mouseBlock._targetDIV = null;
		mouseBlock.parentNode.removeChild(mouseBlock);
	},

	isNullOrUndefined: function(val)
	{
		var u;
		return (u === val) || (val == null);
	},
	
	skipTextNodes: function(domNode, goUp)
	{
		while(domNode && domNode.nodeType == 3)
		{
			if($util.isNullOrUndefined(goUp) || !goUp)
				domNode = domNode.nextSibling;
			else
				domNode = domNode.previousSibling;
		}
		return domNode;
	}
};
Infragistics._Utility.registerClass("Infragistics._Utility");

Infragistics.Utility = new Infragistics._Utility();
var $util = Infragistics.Utility;
$util.ensureBrowserInfo();
/*IE8 temp workaround*/
if ($util.IsIE8)
{
	Sys.UI.DomElement.getLocation = function Sys$UI$DomElement$getLocation(element)
	{
		/// <param name="element" domElement="true"></param>
		/// <returns type="Sys.UI.Point"></returns>
		var e = Function._validateParams(arguments, [
		{ name: "element", domElement: true }
	]);
		if (e) throw e;

		if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0, 0);

		var offsetX = 0;
		var offsetY = 0;
		var previous = null;
		var previousStyle = null;
		var currentStyle = null;
		for (var parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent)
		{
			var tagName = parent.tagName;
			currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);

			if ((parent.offsetLeft || parent.offsetTop) &&
			!((tagName === "BODY") &&
			(!previousStyle || previousStyle.position !== "absolute")))
			{

				offsetX += parent.offsetLeft;
				offsetY += parent.offsetTop;
			}

			if (previous !== null && currentStyle)
			{
				if ((tagName !== "TABLE") && (tagName !== "TD") && (tagName !== "HTML"))
				{
					offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
					offsetY += parseInt(currentStyle.borderTopWidth) || 0;
				}
				if (tagName === "TABLE" &&
				(currentStyle.position === "relative" || currentStyle.position === "absolute"))
				{
					offsetX += parseInt(currentStyle.marginLeft) || 0;
					offsetY += parseInt(currentStyle.marginTop) || 0;
				}
			}
		}

		currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
		var elementPosition = currentStyle ? currentStyle.position : null;
		var elementPositioned = elementPosition && (elementPosition !== "static");
		if (!elementPosition || (elementPosition !== "absolute"))
		{
			for (var parent = element.parentNode; parent; parent = parent.parentNode)
			{
				tagName = parent.tagName;

				if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop))
				{

					offsetX -= (parent.scrollLeft || 0);
					offsetY -= (parent.scrollTop || 0);

					currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
					offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
					offsetY += parseInt(currentStyle.borderTopWidth) || 0;
				}
			}
		}

		return new Sys.UI.Point(offsetX, offsetY);
	}
}
/*end IE8 temp workaround*/
/******************************************END Utility Object**************************************/

/* Timer to process 1st paint. Most usage: control is invisible on start (inside unselected tab) and offsetWidth/Height of any element is 0 */
var ig_ui_all = null; /* global list of objects which need first painting */
function ig_ui_timer(o, del)/* function which is called by timer in endless loop (until stopped) */
{
	var all = ig_ui_all;
	var i, fn = all ? all._timerFn : null;
	/* Bug10700: in some versions of Firefox2 the default interval-handler may contain number param instead of nothing */
	if (typeof o != 'object')
		o = null;
	if (o)/* this function is called by object directly (add/remove timer) */
	{
		if (!o._onTimer) return; /* if object does have _onTimer, then nothing to add to global list */
		if (!all) ig_ui_all = all = new Array();
		i = all.length;
		while (i-- > 0) if (all[i] == o) break; /* find object in global list */
		if (del)/* when object is disposed, then its timer should be removed */
		{
			if (i < 0) return;
			delete o._onTimer;
			delete all[i];
			o = null; /* set request to stop timer */
			i = all.length;
			while (i-- > 0) if (all[i]) o = true; /* do not stop timer */
		}
		else/* add object to global list */
		{
			if (i < 0)
			{
				/* find first available index */
				while (all[++i]);
				all[i] = o;
			}
			if (!fn) all._timerFn = fn = window.setInterval(ig_ui_timer, 200); /* start timer */
		}
	}
	if (o) return;
	/* this function is called by timer: notify objects about timer-event */
	if (!del && fn) for (i = 0; i < all.length; i++)
	{
		o = all[i]; /* notify all objects in global list about timer event */
		if (o && o._onTimer)
		{
			if (!o._onTimer())
			{
				fn = null; /* paint function failed: global timer should not be stopped */
				continue;
			}
			delete o._onTimer; /* paint function was successful: remove object from list */
			delete all[i];
		}
	}
	if (!fn) return; /* one of the paint function failed: timer should continue */
	window.clearInterval(fn); /* clear all timer related objects */
	delete all._timerFn;
	ig_ui_all = null;
}

/*********************EventArgs (to fire ClientEvents)*******************************/

/* event which contains reference to the event of browser */
$IG.EventArgs = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.EventArgs">Base class for object used as parameter while raising client events related to browser action.</summary>
	$IG.EventArgs.initializeBase(this);
	this._props = [null, 0];
}
$IG.EventArgs.prototype =
{
	get_browserEvent: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.EventArgs.browserEvent">Gets reference to browser event.</summary>
		/// <value type="Sys.UI.DomEvent" mayBeNull="true">Reference to browser event.</value>
		return this._props[0];
	},
	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.EventArgs.dispose">Disposes object.</summary>
		this._props[0] = null;
	}
}
$IG.EventArgs.registerClass('Infragistics.Web.UI.EventArgs', Sys.EventArgs);

/* event which contains reference to the event of browser and allows to postback */
$IG.PostBackEventArgs = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.PostBackEventArgs">Base class for object used as parameter while raising client events related to postback action.</summary>
	$IG.PostBackEventArgs.initializeBase(this);
}
$IG.PostBackEventArgs.prototype =
{
	/* check if control should not trigger postback (0), trigger full postback (1), or trigger async postback (2) */
	get_postBack: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.PostBackEventArgs.postBack">Gets postback flag.</summary>
		/// <value type="Number">One of the following: 0 - do not trigger postback, 1 - trigger full postback, 2 - trigger async postback.</value>
		return this._props[1];
	},
	/* set request for control to do not trigger postback (0), trigger full postback (1), or trigger async postback (2) */
	set_postBack: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.PostBackEventArgs.postBack">Sets postback flag.</summary>
		/// <param name="val" type="Number">One of the following: 0 - do not trigger postback, 1 - trigger full postback, 2 - trigger async postback.</param>
		this._props[1] = val;
	}
}
$IG.PostBackEventArgs.registerClass('Infragistics.Web.UI.PostBackEventArgs', $IG.EventArgs);

/* cancelable event which contains reference to the event of browser and allows to postback */
$IG.CancelEventArgs = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.CancelEventArgs">Base class for object used as parameter while raising cancelable client events related to browser action.</summary>
	$IG.CancelEventArgs.initializeBase(this);
	this._cancel = false;
}
$IG.CancelEventArgs.prototype =
{
	/* check if event was canceled */
	get_cancel: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.CancelEventArgs.cancel">Checks if event was canceled.</summary>
		/// <value type="Boolean">True: event was canceled</value>
		return this._cancel;
	},
	/* cancel event */
	set_cancel: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.CancelEventArgs.cancel">Cancel event.</summary>
		/// <param name="val" type="Boolean">True: cancel event.</param>
		this._cancel = val;
	}
}
$IG.CancelEventArgs.registerClass('Infragistics.Web.UI.CancelEventArgs', $IG.EventArgs);

/* event used by MoveBehavior */
$IG.MoveEventArgs = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.MoveEventArgs">Class for object used as parameter while raising Move events.</summary>
	$IG.MoveEventArgs.initializeBase(this);
}
$IG.MoveEventArgs.prototype =
{
	/* this._props: 0-event, 1-postBackAction, 2-new x, 3-new y, 4-old x, 5-old y */
	get_x: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.x">Gets new left position.</summary>
		/// <value type="Number">Left position in pixels.</value>
		return this._props[2];
	},
	get_y: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.y">Gets new top position.</summary>
		/// <value type="Number">Top position in pixels.</value>
		return this._props[3];
	},
	get_oldX: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.oldX">Gets old left position.</summary>
		/// <value type="Number">Left position in pixels.</value>
		return this._props[4];
	},
	get_oldY: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.oldY">Gets old top position.</summary>
		/// <value type="Number">Top position in pixels.</value>
		return this._props[5];
	},
	set_x: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.x">Sets new left position.</summary>
		/// <param name="val" type="Number" integer="true">New left position in pixels.</param>
		this._props[2] = this._x = val;
	},
	set_y: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.MoveEventArgs.y">Sets new top position.</summary>
		/// <param name="val" type="Number" integer="true">New top position in pixels.</param>
		this._props[3] = this._y = val;
	}
}
$IG.MoveEventArgs.registerClass('Infragistics.Web.UI.MoveEventArgs', $IG.CancelEventArgs);

$IG.RelativeLocation = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.RelativeLocation">
	/// Location of target element relative to container.<br />
	/// That contains following integer members:<br />
	/// NotSet (-1), TopLeft (0), TopCenter (1), TopRight (2), TopInfront (3), TopBehind (3), MiddleLeft (8), MiddleCenter (9),
	/// MiddleRight (10), MiddleInfront (11), MiddleBehind (12), BottomLeft (16), BottomCenter (17), BottomRight (18),
	/// BottomInfront (19), BottomBehind (20), AboveLeft (32), AboveCenter (33), AboveRight (34), AboveInfront (35),
	/// AboveBehind (36), BelowLeft (64), BelowCenter (65), BelowRight (66), BelowInfront (67), BelowBehind (68)
	/// </summary>
	///<field name="NotSet" type="Number" integer="true" static="true"> indicates that location is not set </field>
	///<field name="TopLeft" type="Number" integer="true" static="true"> top left relative to container </field>
	///<field name="TopCenter" type="Number" integer="true" static="true"> top center </field>
	///<field name="TopRight" type="Number" integer="true" static="true"> top right relative to container </field>
	///<field name="TopInfront" type="Number" integer="true" static="true"> in front of container </field>
	///<field name="TopBehind" type="Number" integer="true" static="true"> behind container  </field>
	///<field name="MiddleLeft" type="Number" integer="true" static="true">  middle left side of container</field>
	///<field name="MiddleCenter" type="Number" integer="true" static="true"> middle center side of container </field>
	///<field name="MiddleRight" type="Number" integer="true" static="true"> middle right of container </field>
	///<field name="MiddleInfront" type="Number" integer="true" static="true"> in the middle, in front of container </field>
	///<field name="MiddleBehind" type="Number" integer="true" static="true"> in the middle behind container  </field>
	///<field name="BottomLeft" type="Number" integer="true" static="true"> on the bottom to the left </field>
	///<field name="BottomCenter" type="Number" integer="true" static="true"> on the bottom in he center </field>
	///<field name="BottomRight" type="Number" integer="true" static="true"> on the bottom to the right  </field>
	///<field name="BottomInfront" type="Number" integer="true" static="true"> on the bottom in front of container</field>
	///<field name="BottomBehind" type="Number" integer="true" static="true">  on the bottom behind container</field>
	///<field name="AboveLeft" type="Number" integer="true" static="true">  above the container to the left</field>
	///<field name="AboveCenter" type="Number" integer="true" static="true">  above the container in the center </field>
	///<field name="AboveRight" type="Number" integer="true" static="true">   above the container to the right</field>
	///<field name="AboveInfront" type="Number" integer="true" static="true">  above the container, in front of it </field>
	///<field name="AboveBehind" type="Number" integer="true" static="true">   above the container, behind it</field>
	///<field name="BelowLeft" type="Number" integer="true" static="true">  below the container to the left </field>
	///<field name="BelowCenter" type="Number" integer="true" static="true"> below the container in the center </field>
	///<field name="BelowRight" type="Number" integer="true" static="true"> below the container to the right  </field>
	///<field name="BelowInfront" type="Number" integer="true" static="true">  below the container in front of it </field>
	///<field name="BelowBehind" type="Number" integer="true" static="true">  below the container behind it</field>
}

$IG.RelativeLocation.prototype =
{
	NotSet:-1,
	TopLeft:0,
	TopCenter:1,
	TopRight:2,
	TopInfront:3,
	TopBehind:4,
	MiddleLeft:8,
	MiddleCenter:9,
	MiddleRight:10,
	MiddleInfront:11,
	MiddleBehind:12,
	BottomLeft:16,
	BottomCenter:17,
	BottomRight:18,
	BottomInfront:19,
	BottomBehind:20,
	AboveLeft:32,
	AboveCenter:33,
	AboveRight:34,
	AboveInfront:35,
	AboveBehind:36,
	BelowLeft:64,
	BelowCenter:65,
	BelowRight:66,
	BelowInfront:67,
	BelowBehind:68
};

$IG.RelativeLocation.registerEnum("Infragistics.Web.UI.RelativeLocation");

$IG.AjaxIndicatorBlockArea = function()
{
	/// <summary locid="T:J#Infragistics.Web.UI.AjaxIndicatorBlockArea">
	/// Type of block which is rendered above control or window while asynchronous postback.
	/// </summary>
	///<field name="NotSet" type="Number" integer="true" static="true">Block area is defined by webconfig, or by shared indicator, or by defaults of a particular control</field>
	///<field name="Disabled" type="Number" integer="true" static="true">Block area is not used</field>
	///<field name="Control" type="Number" integer="true" static="true">Block area is applied to bounds of control</field>
	///<field name="Page" type="Number" integer="true" static="true">Block area is applied to whole page</field>
}
$IG.AjaxIndicatorBlockArea.prototype =
{
	NotSet:0,
	Disabled:1,
	Control:2,
	Page:3
};
$IG.AjaxIndicatorBlockArea.registerEnum("Infragistics.Web.UI.AjaxIndicatorBlockArea");

$IG.AjaxIndicator = function(props)
{
	/// <summary locid="T:J#Infragistics.Web.UI.AjaxIndicator">Class used for progress indicator while async postbacks.</summary>
	this._props = props ? eval(props) : new Array();
	/* preload image, otherwise, first postback may have no image */
	this._getElem();
}
$IG.AjaxIndicator.prototype =
{
	_get: function(i, pi)
	{
		if (!this._props)
			return null;
		var val = this._props[i];
		return (val != null) ? val : (pi ? pi._props[i] : null);
	},
	get_imageUrl: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.imageUrl">Gets sets image url. Note: the "text" property has priority over IMG.
		/// However, if text contains "{0}" flag, then that flag is replaced by IMG with get_imageUrl().</summary>
		///<returns type="String">The url for IMG of ajax indicator.</returns>
		return this._props[0];
	},
	set_imageUrl: function(url)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.imageUrl">
		/// Sets the image URL for the Ajax Indicator 
		///</summary>
		///<param name="url" type="String">The image url</param>
		this._props[0] = url;
		/* remove old element */
		this._reset();
		/* load possible IMG for new element */
		this._getElem();
	},
	get_text: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.text">Gets sets innerHTML of DIV used for indicator. If text contains "{0}" flag, then that flag is replaced by IMG with get_imageUrl().</summary>
		///<value name="html" type="String">The html which is used to render indicator. That can include text and any valid html tags.</value>
		return this._props[1];
	},
	set_text: function(html)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.text">
		/// Sets the text of the ajax indicator (in HTML format) 
		///</summary>
		///<param name="html" type="String">The html which is used to render indicator. That can include text and any valid html tags.</param>
		this._props[1] = html;
		/* remove old element */
		this._reset();
		/* load possible IMG for new element */
		this._getElem();
	},
	get_location: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.location">Gets sets location of indicator relative to its container.</summary>
		/// <value type="Infragistics.Web.UI.RelativeLocation">Flags that represent relative location. That should be a number in range of 0-68.</value>
		var v = this._get(2, pi);
		/* 9-middle center */
		return (v != null) ? v : (pi ? 9 : -1);
	},
	set_location: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.location">Sets location of indicator relative to container</summary>
		/// <param name="val" type="Infragistics.Web.UI.RelativeLocation">Flags that represent relative location. That should be a number in range of 0-68.</param>
		this._props[2] = val;
	},
	get_css: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.css">Gets sets name of css class applied to indicator.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="String">Name of css</value>
		return this._get(3, pi);
	},
	set_css: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.css">Sets name of css class applied to indicator.</summary>
		/// <param name="val" type="String">Name of css</param>
		this._props[3] = val;
	},
	get_relativeToControl: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.relativeToControl">Gets sets option to align indicator relative to element of control or relative to window.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="Boolean">True: indicator is aligned to control, false: indicator is aligned to browser window.</value>
		var v = this._get(4, pi);
		return pi ? (v != 2) : (v ? true : false);
	},
	set_relativeToControl: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.relativeToControl">Sets option to align indicator relative to element of control or relative to window.</summary>
		/// <param name="val" type="Boolean">True: indicator is aligned to control, false: indicator is aligned to browser window.</param>
		this._props[4] = val ? 1 : 2;
	},
	get_enabled: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.enabled">Gets sets option to enable or disable indicator.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="Boolean">True: indicator is enabled.</value>
		var v = this._get(5, pi);
		return pi ? (v == 1) : (v ? true : false);
	},
	set_enabled: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.enabled">Sets option to enable or disable indicator.</summary>
		/// <param name="val" type="Boolean">True: enable indicator.</param>
		this._props[5] = val ? 1 : 2;
	},
	get_offsetLeft: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.offsetLeft">Gets sets additional horizontal offset of indicator.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="Number" integer="true">Offset in pixels.</value>
		var v = this._get(6, pi);
		return (v != null || !pi) ? v : 0;
	},
	set_offsetLeft: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.offsetLeft">Sets additional horizontal offset of indicator.</summary>
		/// <param name="val" type="Number" integer="true">Offset in pixels</param>
		this._props[6] = val;
	},
	get_offsetTop: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.offsetTop">Gets sets additional vertical offset of indicator.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="Number" integer="true">Offset in pixels.</value>
		var v = this._get(7, pi);
		return (v != null || !pi) ? v : 0;
	},
	set_offsetTop: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.offsetTop">Sets additional vertical offset of indicator.</summary>
		/// <param name="val" type="Number" integer="true">Offset in pixels</param>
		this._props[7] = val;
	},
	get_blockArea: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.blockArea">Gets sets option to use blocking element over control or window.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="Infragistics.Web.UI.AjaxIndicatorBlockArea">Type of block area.</value>
		var v = this._get(8, pi);
		return v ? v : 0;
	},
	set_blockArea: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.blockArea">Sets option to use blocking element over control or window.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AjaxIndicatorBlockArea">Type of block area.</param>
		this._props[8] = val;
	},
	get_blockCss: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.blockCss">Gets sets name of css class applied to blocking element.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="String">Name of css</value>
		return this._get(9, pi);
	},
	set_blockCss: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.blockCss">Sets name of css class applied to blocking element.</summary>
		/// <param name="val" type="String">Name of css</param>
		this._props[9] = val;
	},
	get_fadeInDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeInDuration">Gets sets duration of fade animation for show action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._get(10);
	},
	set_fadeInDuration: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeInDuration">Sets duration of fade animation for show action.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[10] = val;
		this._resetFade();
	},
	get_fadeInEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeInEquationType">Gets sets equation type of fade animation for show action.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type of fade animation. That should be a number in range of 0-4.</value>
		var v = this._get(11);
		return (v != null) ? v : 3;
	},
	set_fadeInEquationType: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeInEquationType">Sets equation type of fade animation for show action</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type of fade animation. That should be a number in range of 0-4.</param>
		this._props[11] = val;
	},
	get_fadeOutDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeOutDuration">Gets sets duration of fade animation for hide action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._get(12);
	},
	set_fadeOutDuration: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeOutDuration">Sets duration of fade animation for hide action.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[12] = val;
		this._resetFade();
	},
	get_fadeOutEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeOutEquationType">Gets sets equation type of fade animation for hide action.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type of fade animation. That should be a number in range of 0-4.</value>
		var v = this._get(13);
		return (v != null) ? v : 3;
	},
	set_fadeOutEquationType: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.fadeOutEquationType">Sets equation type of fade animation for hide action</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type of fade animation. That should be a number in range of 0-4.</param>
		this._props[13] = val;
	},
	get_alt: function(pi)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.alt">Gets alt attribute for image.</summary>
		/// <param name="pi" type="Infragistics.Web.UI.AjaxIndicator" mayBeNull="true">Reference to shared indicator or null. Internal use only.</param>
		/// <value type="String">The alt attribute for image</value>
		return this._get(14, pi);
	},
	set_alt: function(val)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AjaxIndicator.alt">Sets text for alt attribute of image</summary>
		/// <param name="val" type="String">Text for alt</param>
		this._props[14] = val;
	},
	setRelativeContainer: function(elem)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.AjaxIndicator.setRelativeContainer">Sets custom element which is used as container for alignment of indicator.</summary>
		/// <param name="elem" domElement="true" mayBeNull="true">Reference to html element or null.</param>
		this._rc = elem;
	},
	/* pi: reference to shared AjaxIndicator (while real rendering) */
	/* returns reference to this._elem */
	_getElem: function(pi)
	{
		var elem = this._elem;
		if (elem)
			return elem;
		var img = this.get_imageUrl(), html = this.get_text();
		/* if there is no IMG to load and not real rendering, then do nothing */
		if (!pi && !img && (!html || html.indexOf(' src=') < 1))
			return null;
		if (!img && !html)
		{
			if (pi && pi != 1)
			{
				elem = pi._getElem();
				if (elem)
					elem = elem.cloneNode(true);
				if (!elem)
					html = pi.get_text();
			}
			if (!html)
				html = 'Please wait...';
		}
		/* create indicator element */
		if (!elem)
		{
			if (!img && pi && pi != 1)
				img = pi.get_imageUrl();
			var alt = this.get_alt((pi == 1) ? null : pi);
			if (!alt)
				alt = '';
			elem = document.createElement(html ? 'DIV' : 'IMG');
			if (html)
				elem.innerHTML = html.replace('{0}', img ? '<IMG src="' + img + '" alt="' + alt + '" />' : '');
			else
			{
				elem.src = img;
				elem.alt = alt;
			}
		}
		elem.unselectable = 'on';
		elem.style.position = 'absolute';
		this._elem = elem;
		return elem;
	},
	_reset: function()
	{
		var e = this._elem;
		if (e && e._ok)
			e.parentNode.removeChild(e);
		this._elem = null;
		this._resetFade();
	},
	_resetFade: function()
	{
		var fade = this._fade;
		if (!fade)
			return;
		fade.stop();
		fade.dispose();
		fade._elem2 = null;
		this._fade = null;
	},
	/* validate if elem was added to body and add it */
	_add: function(elem, body, add)
	{
		if (elem && !elem._ok)
		{
			if (add)
				body.appendChild(elem);
			else
				body.insertBefore(elem, body.firstChild);
			elem._ok = true;
		}
	},
	show: function(ctrl)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.AjaxIndicator.show">Shows indicator.</summary>
		/// <param name="ctrl" type="Infragistics.Web.UI.ControlMain">Reference to Infragistics.Web.UI.ControlMain.</param>
		if (!this._props)
			return;
		var pi = $util.get_ajaxIndicator();
		var blocking = this.get_blockArea(pi);
		var show = this.get_enabled(pi);
		if (!show && blocking < 2)
			return;
		var rc = this._rc, block = (blocking > 1) ? this._block : null;
		if (!rc && ctrl)
			if (!(rc = ctrl._elements['ajaxElem']))
				if (!(rc = ctrl._element))
					return;
		/* if target is invisible, then do not show indicator */
		if (rc.offsetHeight == 0)
			return;
		var elem = show ? this._getElem(pi ? pi : 1) : null;
		var body = document.body, add = !$util.IsIE || document.readyState == 'complete';
		/* validate if elem was added to body */
		this._add(elem, body, add);
		/* NotSet=0,Disabled=1,Control=2,Page=3 */
		if (blocking > 1 && !block)
		{
			/* create block element and add it to body */
			this._block = block = document.createElement('DIV');
			block.style.position = 'absolute';
			block.unselectable = 'on';
		}
		/* validate if block was added to body */
		this._add(block, body, add);
		var css = this.get_css(pi);
		if (css && show)
			elem.className = css;
		var loc = this.get_location(pi);
		if (loc < 0)
			loc = 9;
		var pos = Sys.UI.DomElement.getLocation(rc);/*$util.getPosition(rc);*/
		var rect = $util.getWinRect();
		var iH = rect.height, iW = rect.width, iT = rect.y, iL = rect.x;
		var x = pos.x, y = pos.y, rcW = rc.offsetWidth, rcH = rc.offsetHeight;
		var style, zi = $util._zIndexTop(rc, 10000);
		if (block)
		{
			block.className = this.get_blockCss(pi);
			style = block.style;
			/* NotSet=0,Disabled=1,Control=2,Page=3 */
			blocking = blocking == 2;
			style.left = (blocking ? x : iL) + 'px';
			style.top = (blocking ? y : iT) + 'px';
			style.width = (blocking ? rcW : iW) + 'px';
			style.height = (blocking ? rcH : iH) + 'px';
			style.zIndex = zi++;
		}
		/* start fade animation after css for block was set, but before "display" call for elements */
		this._animate(0, pi, show ? elem : null, block);
		$util.display(block);
		this._on = true;
		if (!show || !elem)
			return;
		$util.display(elem);
		/* align indicator to visible part of window */
		if(!this.get_relativeToControl(pi))
		{
			x = iL; y = iT; rcW = iW; rcH = iH;
		}
		var piW = elem.offsetWidth, piH = elem.offsetHeight;
		/* horizontal behind */
		if ((loc & 4) != 0)
			x += rcW;
		/* horizontal infront */
		else if ((loc & 3) == 3)
			x -= piW;
		/* horizontal center */
		else if ((loc & 1) != 0)
			x += (rcW >> 1) - (piW >> 1);
		/* horizontal right */
		else if ((loc & 2) != 0)
			x += rcW - piW;
		/* vertical center */
		if ((loc & 8) != 0)
			y += (rcH >> 1) - (piH >> 1);
		/* vertical bottom */
		else if ((loc & 16) != 0)
			y += rcH - piH;
		/* above */
		else if ((loc & 32) != 0)
			y -= piH;
		/* below */
		else if ((loc & 64) != 0)
			y += rcH;
		/* static offsets */
		x += this.get_offsetLeft(pi);
		y += this.get_offsetTop(pi);
		/* validate that indicator in bounds of window */
		if (x + piW > iL + iW)
			x = iL + iW - piW;
		if (y + piH > iT + iH)
			y = iT + iH - piH;
		if (y < iT)
			y = iT;
		if (x < iL)
			x = iL;
		style = elem.style;
		style.left = x + 'px';
		style.top = y + 'px';
		style.zIndex = zi;
	},
	hide: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AjaxIndicator.hide">
		/// Hides the AJAX Indicator
		///</summary>
		if (!this._on)
			return;
		this._on = null;
		/// <summary>Hides indicator.</summary>
		var pi = $util.get_ajaxIndicator();
		/* successful animation will hide elements on the end */
		if (this._animate(2, pi))
			return;
		/* case when there is no fade animation */
		$util.display(this._elem, true);
		$util.display(this._block, true);
	},
	/* act: 0-show, 2-hide */
	/* pi: reference to global ajaxIndicator */
	/* elem: if (act==0), then it is reference to indicator element */
	/* block: if (act==0), then it is reference to block element */
	/* return false: no animation for act */
	_animate: function(act, pi, elem, block)
	{
		var fade = this._fade;
		if (fade)
			fade.stop();
		/* same as this.get_fadeInDuration(pi) or this.get_fadeOutDuration(pi) */
		var dura = this._get(10 + act, pi);
		if (!dura)
			dura = 0;
		if (typeof $IG.OpacityAnimation != 'function')
			return false;
		/* ensure animation and configure its elements */
		if (act == 0)
		{
			var duraX = this._get(12, pi);
			if (dura < 2 && (!duraX || duraX < 2))
				return false;
			if (!fade)
				fade = this._fade = new $IG.OpacityAnimation(elem);
			fade._elem2 = block;
			fade._element = elem;
			if (!fade._opac2)
				fade._opac2 = block ? $util.getOpacity(block) / 100 : 1;
		}
		/* no animation for that action */
		if (dura < 2 || !fade)
			return false;
		/* same as this.get_fadeInEquationType(pi) or this.get_fadeOutEquationType(pi) */
		var type = this._get(11 + act, pi);
		fade._equationType = (type == null) ? 3 : type;
		fade.set_duration(dura);
		/* change opacity from 0 to 100 on show (act=0) or from 100 to 0 on hide (act=2) */
		/* last param (act==2) means hide elements on end animation */
		fade.play(act * 50, (2 - act) * 50, false, act == 2);
		return true;
	},
	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.AjaxIndicator.dispose">
		/// Deletes members.
		/// </summary>
		if (!this._props)
			return;
		if (this._block)
			this._block.parentNode.removeChild(this._block);
		this._reset();
		delete this._props;
	}
}
$IG.AjaxIndicator.registerClass('Infragistics.Web.UI.AjaxIndicator');

/* VS: debug output/append of values on screen (let say on mousemove) */
/* Example to show value in top/left corner:  _bug('my val=' + myVal); */
/* Example to append value on new line in top/left corner:  _bug('<br>my val=' + myVal, true); */
/* Example to append value on new line in at x=300, y=50:  _bug('<br>my val=' + myVal, true, '300px', '50px'); */
var _bugE = null;
function _bug4(v) { _bug3(v); _bugE.style.background = 'yellow'; }
function _bug3(v) { _bug("<br />" + v, true, "400px"); }
function _bug2(v) { _bug(v, true, "400px"); }
function _bug1(v) { _bug(v, false, "400px"); }
function _bug(v, a, l, t)
{
	if (!_bugE)
	{
		_bugE = document.createElement('DIV');
		document.body.insertBefore(_bugE, document.body.firstChild);
		var s = _bugE.style;
		s.position = 'absolute';
		s.zIndex = 10000;
		s.left = s.top = '0px';
		s.border = '1px dotted red';
		s.fontSize = '12px';
		s.fontFamily = 'courier';
	}
	if (l) _bugE.style.left = l;
	if (t) _bugE.style.top = t;
	_bugE.innerHTML = (a ? _bugE.innerHTML : '') + v;
}
//*/
