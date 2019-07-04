//vs082510
Type.registerNamespace("Infragistics.Web.UI");
var $IG = Infragistics.Web.UI;

$IG.DragDropEffects = function()
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropEffects">
	/// The enumerator which is used as parameter for get_dragDropEffect method of DragDropManager and
	/// set_dragDropMode method of $IG.DragDropBehavior.
	/// The value of None means no effect.
	/// The value of Move means move effect regardless of Ctrl key.
	/// The value of Copy means copy effect regardless of Ctrl key.
	/// The value of Default means copy effect if Ctrl key is pressed and move is Ctrl key is not pressed.
	///</summary>
	/// <field name="None" type="Number" integer="true" static="true">No effect.</field> 
	/// <field name="Move" type="Number" integer="true" static="true">Move effect.</field> 
	/// <field name="Copy" type="Number" integer="true" static="true">Copy effect.</field> 
	/// <field name="Default" type="Number" integer="true" static="true">Default effect.</field> 
}
$IG.DragDropEffects.prototype = 
{
	None:0,
	Move:1,
	Copy:2,
	Default:3
};
$IG.DragDropEffects.registerEnum("Infragistics.Web.UI.DragDropEffects");

$IG.DragDropAction = function()
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropAction">
	/// The enumerator which is used as parameter for set_defaultDropAction method of $IG.DragDropBehavior.
	/// The value of None means that application should implement drop action.
	/// Otherwise, action will depend on get_dragDropEffect() of DragDropManager.
	/// If dragDropEffect is Copy and value is set to Append, then
	/// the copy/clone of source element will be appended to target.
	/// If dragDropEffect is Copy and value is set to Insert, then
	/// the copy/clone of source element will be inserted in the target as first child.
	/// If dragDropEffect is Move and value is set to Append, then source
	/// element will be removed from it original location and appended to target.
	/// If dragDropEffect is Move and value is set to Insert, then source
	/// element will be removed from it original location and inserted into target as first child.
	/// So, source element can be dragged and dropped on another target.
	///</summary>
	/// <field name="None" type="Number" integer="true" static="true">No action.</field> 
	/// <field name="Append" type="Number" integer="true" static="true">Append action.</field> 
	/// <field name="Insert" type="Number" integer="true" static="true">Insert action.</field> 
}
$IG.DragDropAction.prototype = 
{
	None:0,
	Append:1,
	Insert:2
};
$IG.DragDropAction.registerEnum("Infragistics.Web.UI.DragDropAction");

$IG._DragDropManager = function()
{
	this._dragging = false;
	this._curTargs = null;
	this._currentSource = null;
	this._zIndex = 99999;
	this._ctrl = false;
	this._shift = false;
	this._alt = false;
	this._targetElements = [];
	this._dragDropEffect = $IG.DragDropEffects.Default;
	this._supportsElemFromPoint = document.elementFromPoint != null;
	/* browser event delegates */
	this._mouseUpDelegate = Function.createDelegate(this, this._onMouseUp);
	this._mouseOutDelegate = Function.createDelegate(this, this._onMouseOut);
	this._mouseMoveShellDelegate = Function.createDelegate(this, this._onMouseMoveShell);
	if (window.navigator.userAgent.indexOf("MSIE 8.0") >= 0) //$util is not available at this point
		this._mouseMoveEFPDelegate = Function.createDelegate(this, this._onMouseMoveElemFromPoint);
	this._mouseMoveDelegate = Function.createDelegate(this, this._onMouseMove);
	this._selectDelegate = Function.createDelegate(this, this._onSelectStart);
	this._keyDelegate = Function.createDelegate(this, this._onKey);
}
$IG._DragDropManager.prototype =
{
	/**********************PUBLIC Properties *******************************/
	get_isDragging: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropAction.isDragging">Checks state of Drag and Drop.</summary>
		/// <value type="Boolean">True: Drag and Drop operation is currently occurring.</value>
		return this._dragging;
	},
	isCtrlKey: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.DragDropAction.isCtrlKey">Checks if Ctrl key is pressed.</summary>
		/// <returns type="Boolean">True: Ctrl key is pressed.</returns>
		return this._ctrl;
	},
	isShiftKey: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.DragDropAction.isShiftKey">Checks if Shift key is pressed.</summary>
		/// <returns type="Boolean">True: Shift key is pressed.</returns>
		return this._shift;
	},
	isAltKey: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.DragDropAction.isAltKey">Checks if Alt key is pressed.</summary>
		/// <returns type="Boolean">True: Alt key is pressed.</returns>
		return this._alt;
	},
	get_source: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.source">
		/// If a Drag operation is occurring, it will return an Object that contains
		/// the specified source html "element" member variable and if specified,
		/// then the "object" member variable. Otherwise it will return null.
		///</summary>
		/// <value mayBeNull="true">Reference to object with "element" and "object" member variables.</value>
		return this._currentSource;
	},

	get_sourceElement: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.sourceElement">
		/// If a Drag operation is occurring, it will return the specific HTML element that the drag 
		/// operation started on. Note, this can be different than the element returned by the 
		/// get_source() method, as it may be a child element of the source element. Otherwise it will 
		/// return null. 
		///</summary>
		/// <returns domElement="true" mayBeNull="true">Reference to html element.</returns>
		if (this._sourceBehavior)
			return this._sourceBehavior.__startElem;
		return null;
	},

	get_target: function(behavior)
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.target">
		/// If a Drag operation is occurring and the mouse is currently over a Target element, 
		/// it will return an object that contains the specified Target Element and, if specified,
		/// the Target Object.  Otherwise it will return null.
		///</summary>
		///<param name="behavior" optional="true" mayBeNull="true">
		/// The behavior for the target you want returned. If no behavior is specified, then target of behavior which started drag will be returned.
		///</param>
		/// <returns mayBeNull="true">Object.</returns>
		if (!behavior)
			behavior = this._sourceBehavior;
		var curTargs = this._curTargs;
		var j = curTargs ? curTargs.length : 0;
		while (j-- > 0)
		{
			var targets = curTargs[j].targets;
			if (!behavior)
				return targets[0];
			for (var i = 0; i < targets.length; i++)
			{
				var target = targets[i];
				if (target.behavior == behavior)
					return target;
			}
		}
		return null;
	},

	get_targetElement: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.targetElement">
		/// If a Drag operation is occurring and the mouse is currently over a Target element, 
		/// it will return the specific HTML element that the mouse is currently over. Note, this 
		/// can be different than the element returned by the get_target() method, as it may be a 
		/// child element of the target element. Otherwise it will return null. 
		///</summary>
		/// <returns domElement="true" mayBeNull="true">Reference to html element under mouse.</returns>
		if (this._curTargs)
			return this._curTargs.elemAtPoint;
		return null;
	},

	get_dragDropEffect: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.dragDropEffect">
		/// Returns the current DragDropEffect of the current Drag operation, if one is occurring.
		/// That method can be used while processing the DragEnd event, when DragDropBehavior.set_defaultDropAction was set.
		///</summary>
		/// <value type="Number">A constant defined by Infragistics.Web.UI.DragDropEffects.</value>
		if (this._sourceBehavior && this._sourceBehavior._dragDropMode != $IG.DragDropEffects.Default)
			return this._sourceBehavior._dragDropMode;
		return this._dragDropEffect;
	},

	_set_dragDropEffect: function(effect)
	{
		this._dragDropEffect = effect;
		this._updateCursor(effect);
	},

	get_dataObject: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.dataObject">
		/// Gets the data of the current Drag operation. Note, if a drag operation is not 
		/// occurring it will return null. 
		///</summary>
		/// <value mayBeNull="true">Reference to object which was set by set_dataObject or null.</value>
		return this._dataObject;
	},

	set_dataObject: function(data)
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.dataObject">
		/// Sets the data of the current Drag operation.
		///</summary>
		///<param name="data" mayBeNull="true">Object associated with drag operation.</param>
		this._dataObject = data;
	},

	get_dataText: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.dataText">
		/// Gets sets the data text of the current Drag operation. Note, if a drag operation is 
		/// not occurring it will return null. 
		///</summary>
		/// <value type="String" mayBeNull="true">Reference to string set by set_dataText.</value>
		return this._dataText;
	},
	set_dataText: function(text)
	{
		this._dataText = text;
	},

	get_dragMarkupElement: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.dragMarkupElement">
		/// If a Drag operation is currently occurring, it will return the actual HTML element 
		/// that is being used to drag around. This information is useful if you want to know the 
		/// top and left coordinates of the dragging element, instead of the x and y coordinates 
		/// of mouse, as they may be different, depending on the browser. Otherwise it will return null.
		///</summary>
		/// <returns domElement="true" mayBeNull="true">Reference to drag markup element or null.</returns>
		return this._draggingMarkup;
	},
	get_defaultActionDropElement: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropAction.defaultActionDropElement">
		/// That method can be used while processing the DragEnd event, when DragDropBehavior.set_defaultDropAction was set.
		///</summary>
		/// <returns domElement="true" mayBeNull="true">Reference to dropped element or null.</returns>
		return this._defDropElem;
	},
	/**********************END PUBLIC Properties***************************/

	/*********************PUBLIC Methods **********************************/
	endDrag: function(cancel)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropAction.endDrag">
		/// This method will end the current drag operation, if one is currently occurring. 
		///</summary>
		///<param name="cancel" type="Boolean" optional="true" mayBeNull="true">
		/// Determines if the Drop event should fire if the mouse is currently over a target element.
		///</param>
		var beh = this._sourceBehavior;
		if (!this._dragging || !beh)
			return;
		var elemAt = this._curTargs ? {elem: this._curTargs.elementAtPoint} : null;
		/* reset _dragging before firing event, because if handler has alert or similar, then multiple Drop/End events can be fired */
		this._dragging = false;
		if (this._curTargs && !cancel)
		{
			if (this.__fireTargetEvent("Drop", elemAt))
				this._defaultDrop(beh);
		}
		else
			beh._events._fireEvent("DragCancel", elemAt);
		beh._events._fireEvent("DragEnd", elemAt);
		this._shift = this._alt = this._ctrl = false;
		if (this._draggingMarkup)
			document.body.removeChild(this._draggingMarkup);
		this.__setCursor('', true);
		if (this._dragShell)
			this._dragShell.style.display = "none";
		this._dragDropEffect = $IG.DragDropEffects.Default;
		beh.__startElem = this._mouseDown = this._dataObject = this._dataText = this._draggingMarkup = this._dragShell = this._copyTargs = this._curTargs = this._currentSource = this._sourceBehavior = this._defDropElem = null;
		if (this._dragTime > 0)
		{
			/* all listeners besides "shell" are dynamic and they are removed after dragging */
			$removeHandler(document, 'selectstart', this._selectDelegate);
			$removeHandler(document, 'keydown', this._keyDelegate);
			$removeHandler(document, 'keyup', this._keyDelegate);
			$removeHandler(document, 'mouseout', this._mouseOutDelegate);
			$removeHandler(document, 'mouseup', this._mouseUpDelegate);
			if (!this._supportsElemFromPoint)
			{
				this.__handleWindowedElems(false);
				$removeHandler(document, 'mousemove', this._mouseMoveDelegate);
			}
			else if (this._docMove)
			{
				$removeHandler(document, 'mousemove', this._mouseMoveShellDelegate);
				$removeHandler(document, 'scroll', this._mouseUpDelegate);
			}
		}
		this._dragTime = 0;
	},

	elementFromPoint: function(x, y)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropAction.elementFromPoint">
		/// Gets html element located at point.
		///</summary>
		/// <param name="x" type="Number" integer="true">Left position.</param>
		/// <param name="y" type="Number" integer="true">Top position.</param>
		/// <returns domElement="true" mayBeNull="true">Reference to element or null.</returns>
		if (!this._supportsElemFromPoint)
			return null;
		var efp = document.elementFromPoint(x, y);
		/*IE8 elementFromPoint hack. It needs to have it in a separate 
		thread otherwise right after display is set to "none", 
		elementFromPoint returns null.*/
		if (efp == null)
			efp = this._elementFromPoint;
		return efp;
	},

	dispose: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropAction.dispose">
		/// Removes event handlers and clears objects.
		///</summary>
		this.endDrag(true);
		var shell = this._dragShell;
		if (!shell)
			return;
		if (this._shellLsnr)
		{
			var doc = shell.contentWindow.document;
			$util.removeHandler(doc, 'mousemove', this._mouseMoveShellDelegate);
			if ($util.IsIE8)
				$util.removeHandler(doc, 'mousemove', this._mouseMoveEFPDelegate);
			$util.removeHandler(doc, 'mouseup', this._mouseUpDelegate);
		}
		if (this._shellLoadDelegate)
			$removeHandler(shell, 'load', this._shellLoadDelegate);
		document.body.removeChild(shell);
		this._dragShell = null;
	},
	/*********************END PUBLIC Methods ******************************/

	/*********************EVENT HANDLERS **********************************/
	_fixCtrl: function(e, cursor)
	{
		if (!e)
			return;
		this._shift = e.shiftKey;
		this._alt = e.altKey;
		var ctrl = e.ctrlKey;
		if (ctrl == this._ctrl)
			return;
		this._ctrl = ctrl;
		if (cursor)
			this._validateCursor(e);
	},
	_onSelectStart: function(e)
	{
		$util.cancelEvent(e);
	},
	_onMouseOut: function(e)
	{
		/* Bug 20250: IE8 may have huge delay on move, so include validation for first move */
		/* iframe-shell is used: any mouseout means out of browser */
		if (this._waitMove || (new Date()).getTime() < this._dragTime + 300)
			return;
		/* check for edges of browser: source is HTML element */
		var elem = this._supportsElemFromPoint ? null : e.target;
		if (!elem || elem.nodeName == 'HTML')
			this.endDrag();
	},
	_onMouseUp: function(e)
	{
		this._fixCtrl(e);
		this.endDrag();
	},
	_onKey: function(e)
	{
		if (e.keyCode == Sys.UI.Key.esc)
			this.endDrag(true);
		this._fixCtrl(e, 1);
	},
	/* That method is called on mousemove event for iframe (windows:IE, Firefox3, Safari) */
	/* and for main document (windows:Opera, Mac:Safari). */
	/* Calculation of parameters for elementFromPoint is quite messy. */
	/* Results of experiments with those situations are following: */
	/* Adjustments for scroll is required for all cases. When main document is used */
	/* (Windows:Opera and Mac:Safari), then scrolls should be added to mouse location, */
	/* otherwise, scroll should be substructed from mouse location. */
	/* Also, in case of Mac:Safari, the scroll should be obtained from body, but for */
	/* all other browsers it should be obtained from documentElement. */
	_onMouseMoveShell: function(e)
	{
		var beh = this._sourceBehavior, elem = this._draggingMarkup;
		if (!elem || !this._dragging || !beh)
			return;
		this._waitMove = null;
		var scrollX = this._getScroll(1), scrollY = this._getScroll();
		var x = e.clientX + beh._offsetX, y = e.clientY + beh._offsetY;
		if (!beh._alignToMouse)
		{
			x += elem._x0 ? elem._x0 : 0;
			y += elem._y0 ? elem._y0 : 0;
		}
		else if ($util.IsOpera)
		{
			x += scrollX;
			y += scrollY;
		}
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
		/* get around bugs in IE8 (Bug36274). I found that "fix" by acident, maybe dummy line below refreshes iframe. */
		this._getScroll();
		/* elementFromPoint in Safari works differently from Chrome and others */
		/* elementFromPoint in latest version of Opera(10.53) behaves differently compare to earlier versions */
		if ($util.IsOpera || ($util.IsSafari && !$util.IsChrome))
			scrollX = scrollY = 0;
		else if (this._docMove)
		{
			scrollX = -scrollX;
			scrollY = -scrollY;
		}
		var curTargs = this._getTargetFromPoint(e.clientX - scrollX, e.clientY - scrollY);
		this._validateTarget(curTargs, e);
	},
	/*IE8 elementFromPoint hack*/
	_elementFromPoint: null,
	_deferredEFPDelegate: null,
	_efpX: -1,
	_efpY: -1,
	_onMouseMoveElemFromPoint: function(e)
	{
		this._waitMove = null;
		if (!this._deferredEFPDelegate)
			this._deferredEFPDelegate = Function.createDelegate(this, this._checkElementFromPoint);
		this._efpX = e.clientX;
		this._efpY = e.clientY;
		if (this._draggingMarkup)
			this._draggingMarkup.style.display = "none";
		if (this._dragShell)
			this._dragShell.style.display = "none";
		window.setTimeout(this._deferredEFPDelegate);
	},
	_checkElementFromPoint: function()
	{
		this._elementFromPoint = document.elementFromPoint(this._efpX, this._efpY);
		if (this._draggingMarkup)
			this._draggingMarkup.style.display = "";
		if (this._dragShell)
			this._dragShell.style.display = "";
	},
	/*end IE8 hack*/
	_onMouseMove: function(e)
	{
		var elem = e.target;
		if (!elem || !this._dragging)
			return;
		this._waitMove = null;
		if (this._currentElement != elem)
		{
			this._previousElement = this._currentElement;
			this._currentElement = elem;
		}
		else
			this._previousElem = null;
		var mark = this._draggingMarkup;
		if (!mark)
			return;
		mark.style.top = (e.clientY + this._getScroll() + 1) + 'px';
		mark.style.left = (e.clientX + this._getScroll(1) + 1) + 'px';
		var curTargs = this._validateElem(elem);
		this._validateTarget(curTargs, e);
	},
	_onLoadFrame: function()
	{
		var win = this._dragShell;
		if (!win || this._cursorElem)
			return;
		win = win.contentWindow;
		var doc = win.document;
		/* This is Neccessary for the cursor to be applied correctly in Safari*/
		var body = doc.body, div = doc.createElement('DIV');
		var style = div.style;
		body.appendChild(div);
		body.leftMargin = body.rightMargin = body.topMargin = body.bottomMargin = '0';
		body.style.height = style.height = style.width = '100%';
		style.position = 'absolute';
		style.top = style.left = '0px';
		this._cursorElem = div;
		/* VS: I tried to add/remove those listeners on start/end drag, but under Firefox it was very unstable */
		if (!this._docMove)
		{
			this._shellLsnr = true;
			$util.addHandler(doc, 'mousemove', this._mouseMoveShellDelegate);
			if ($util.IsIE8)
				$util.addHandler(doc, 'mousemove', this._mouseMoveEFPDelegate);
			$util.addHandler(doc, 'mouseup', this._mouseUpDelegate);
		}
	},
	/*********************END EVENT HANDLERS*******************************/

	/*********************PROTECTED Methods *******************************/
	_startDrag: function(dragBehavior, source, e, md)
	{
		this.endDrag();
		if (!dragBehavior)
			return;
		this._currentSource = source;
		this._sourceBehavior = dragBehavior;
		if (dragBehavior._events._fireEvent("DragStart", { elem: dragBehavior.__startElem, x: md.x, y: md.y }))
		{
			this._dragging = true;
			this._docMove = !$util.IsFireFox && ($util.IsOpera || $util.IsMac);
			if (this._supportsElemFromPoint)
				this._showShell();
			this.__setupVisibleDragMakup(e.clientX, e.clientY, dragBehavior._underMouseElem ? dragBehavior.__startElem : source.element);
			this._dragTime = (new Date()).getTime();
			/* all listeners besides "shell" are dynamic and they are added only while dragging */
			$addHandler(document, 'selectstart', this._selectDelegate);
			$addHandler(document, 'keydown', this._keyDelegate);
			$addHandler(document, 'keyup', this._keyDelegate);
			$addHandler(document, 'mouseout', this._mouseOutDelegate);
			$addHandler(document, 'mouseup', this._mouseUpDelegate);
			if (!this._supportsElemFromPoint)
			{
				this.__handleWindowedElems(true);
				$addHandler(document, 'mousemove', this._mouseMoveDelegate);
			}
			else if (this._docMove)
			{
				$addHandler(document, 'mousemove', this._mouseMoveShellDelegate);
				$addHandler(document, 'scroll', this._mouseUpDelegate);
			}
			this._fixCtrl(e);
		}
		else
			this.endDrag();
	},

	_validateTarget: function(curTargs, e)
	{
		var ii = curTargs ? curTargs.length : 0;
		if (ii < 1)
		{
			if (this._curTargs)
				this.__fireTargetEvent("DragLeave");
			this._set_dragDropEffect($IG.DragDropEffects.None);
			this._copyTargs = this._curTargs = null;
			return;
		}
		var fire = false;
		while (ii-- > 0 && !fire)
		{
			var targets = curTargs[ii].targets;
			for (var i = 0; i < targets.length && !fire; i++)
			{
				var target = targets[i];
				var elem = target._includeChildren ? curTargs.elemAtPoint : curTargs[ii].element;
				/* VS 04/15/2009 Bug 16717: multiple raising DragEnter, when event was canceled */
				var copyTargs = this._copyTargs;
				var jj = copyTargs ? copyTargs.length : 0;
				if (jj < 1)
					fire = true;
				while (jj-- > 0 && !fire)
				{
					var targs = copyTargs[jj].targets;
					for (var j = 0; j < targs.length && !fire; j++)
					{
						var jElem = targs[j]._includeChildren ? copyTargs.elemAtPoint : copyTargs[jj].element;
						if (elem != jElem)
						{
							this.__fireTargetEvent("DragLeave", {elem: copyTargs.elemAtPoint});
							fire = true;
						}
					}
				}
			}
		}
		if (fire)
		{
			/* VS 04/15/2009 Bug 16717: multiple raising DragEnter, when event was canceled */
			this._copyTargs = this._curTargs = curTargs;
			if (!this.__fireTargetEvent("DragEnter", {elem: curTargs.elemAtPoint}))
			{
				this._set_dragDropEffect($IG.DragDropEffects.None, {elem: curTargs.elemAtPoint});
				/* keep this._copyTargs, because it can be used to raise DragLeave events */
				this._curTargs = null;
				return;
			}
		}
		this._validateCursor(e);
		this.__fireTargetEvent("DragMove", { elem: curTargs.elemAtPoint, x: e.clientX, y: e.clientY });
	},

	_validateCursor: function(e)
	{
		var src = this._sourceBehavior;
		if (!src)
			return;
		var mode = src._dragDropMode;
		if (mode == $IG.DragDropEffects.Default && this._curTargs)
			this._set_dragDropEffect(e.ctrlKey ? $IG.DragDropEffects.Copy : $IG.DragDropEffects.Move);
		else
			this._updateCursor(mode)
	},

	_updateCursor: function(effect)
	{
		if (!this._dragging)
			return;
		if (effect == $IG.DragDropEffects.None)
			this.__setCursor(this._sourceBehavior._noneCursor);
		else if (effect == $IG.DragDropEffects.Move)
			this.__setCursor(this._sourceBehavior._moveCursor);
		else if (effect == $IG.DragDropEffects.Copy)
			this.__setCursor(this._sourceBehavior._copyCursor);
	},

	_getTargetFromPoint: function(x, y)
	{
		this._draggingMarkup.style.display = this._dragShell.style.display = "none";
		var elemAtPoint = this.elementFromPoint(x, y);
		this._draggingMarkup.style.display = this._dragShell.style.display = "";
		return this._validateElem(elemAtPoint);
	},

	_validateElem: function(elemAtPoint)
	{
		if (!elemAtPoint)
			return null;
		var targets = this._targetElements;
		var i = targets ? targets.length : 0, curTargs = null;
		/* check all targets if they contain elemAtPoint as their target element */
		while (i-- > 0)
		{
			var target = targets[i];
			var elem = target ? target.element : null;
			if (elem && (elem == elemAtPoint || (elem.contains && elem.contains(elemAtPoint)) || (!elem.contains && $util.isChild(elem, elemAtPoint))))
			{
				if (!curTargs)
				{
					curTargs = new Array();
					curTargs.elemAtPoint = elemAtPoint;
				}
				curTargs[curTargs.length] = target;
			}
		}
		return curTargs;
	},

	_registerTarget: function(behavior, target)
	{
		/* index of new target element within existing target elements */
		var index = -1;
		var targets = this._targetElements;
		for (var i = 0; i < targets.length; i++)
		{
			if (targets[i].element == target.element)
			{
				index = i;
				break;
			}
		}
		if (index == -1)
		{
			index = targets.length;
			targets.push({ element: target.element, targets: [] });
		}
		target.behavior = behavior;
		targets[index].targets.push(target);
	},

	_unRegisterTarget: function(behavior, target)
	{
		var targets = this._targetElements;
		var i = targets ? targets.length : 0;
		while (i-- > 0)
		{
			var iTarget = targets[i];
			if (iTarget.element == target.element)
			{
				var count = iTarget.targets.length;
				for (var j = 0; j < count; j++)
				{
					if (iTarget.targets[j] == target)
					{
						Array.removeAt(iTarget.targets, j);
						break;
					}
				}
				if (count == 1)
					Array.removeAt(targets, i);
				break;
			}
		}
	},
	_defaultDrop: function(beh)
	{
		var act = beh.get_defaultDropAction();
		var effect = this.get_dragDropEffect();
		if (act <= 0 || effect <= 0)
			return;
		var src = this.get_source().element;
		var target = this.get_target().element;
		if (!target || !src)
			return;
		var elem = src, parent = src.parentNode;
		var move = effect == 1;
		/* clone: AppendClone:3, InsertClone:4 */
		if (!move)// || act > 2)
		{
			var div = document.createElement('DIV');
			div.appendChild(elem.cloneNode(true));
			div.innerHTML = div.innerHTML;
			elem = div.firstChild;
		}
		else if (parent == elem)
			return;
		this._defDropElem = elem;
		if (move)
			parent.removeChild(src);
		/* insert action: Append:1, Insert:2 */
		if ((act & 1) == 0)
			target.insertBefore(elem, target.firstChild);
		else
			target.appendChild(elem);
	},
	/********************END PROTECTED Methods *****************************/

	/********************PRIVATE Methods************************************/
	__setCursor: function(cursor, clear)
	{
		/* that will fail in Opera: looks like it does not support dynamic cursors */
		if (this._cursorElem)
		{
			this._cursorElem.style.cursor = cursor;
			return;
		}
		var curElem = this._currentElement, prevElem = this._previousElement;
		if (prevElem)
		{
			if (prevElem.__originalCursor != null)
			{
				prevElem.style.cursor = prevElem.__originalCursor;
				prevElem.__originalCursor = null;
			}
		}
		if (curElem)
		{
			if (clear)
			{
				if (curElem.__originalCursor != null)
				{
					document.body.style.cursor = document.body.__originalCursor;
					curElem.style.cursor = curElem.__originalCursor;
					document.body.__originalCursor = curElem.style.cursor = null;
				}
			}
			else
			{
				if (document.body.__originalCursor == null)
					document.body.__originalCursor = document.body.style.cursor;
				if (curElem.__originalCursor == null)
					curElem.__originalCursor = curElem.style.cursor;
				document.body.style.cursor = curElem.style.cursor = cursor;
			}
		}
	},

	__handleWindowedElems: function(hide)
	{
		var tags = ['IFRAME', 'OBJECT'];
		for (var j = 0; j < 2; j++)
		{
			var elems = document.getElementsByTagName(tags[j]);
			for (var i = 0; i < elems.length; i++)
			{
				var elem = elems[i];
				if (hide)
				{
					var height = elem ? elem.offsetHeight : 0, width = elem ? elem.offsetWidth : 0;
					if (!height || !width || width == 0)
						continue;
					var div = elem.__dragDropDiv = document.createElement('DIV');
					var style = div.style;
					style.height = (height + 4) + 'px';
					style.width = (width + 4) + 'px';
					var pos = Sys.UI.DomElement.getLocation(elem);
					style.top = (pos.y - 2) + 'px';
					style.left = (pos.x - 2) + 'px';
					style.position = 'absolute';
					style.background = 'white';
					style.zIndex = this._zIndex;
					document.body.appendChild(div);
					$util.setOpacity(div, 1);
					continue;
				}
				if (!elem || !elem.__dragDropDiv)
					continue;
				document.body.removeChild(elem.__dragDropDiv);
				elem.__dragDropDiv = null;
			}
		}
	},

	__fireTargetEvent: function(evntName, props)
	{
		var curTargs = this._curTargs, returnVal = false;
		var ii = curTargs ? curTargs.length : 0, evtKey = evntName + (new Date()).getTime();
		while (ii-- > 0)
		{
			var targets = curTargs[ii].targets;
			var i = targets ? targets.length : 0;
			while (i-- > 0)
			{
				var target = targets[i];
				var behavior = target.behavior;
				if (!behavior || behavior._evtKey == evtKey)
					continue;
				var dropChannels = behavior._dropChannels;
				if (!dropChannels || dropChannels.length == 0)
				{
					returnVal = true;
					behavior._evtKey = evtKey;
					if (!behavior._events._fireEvent(evntName, props))
						return false;
				}
				else
				{
					var dragChannels = this._sourceBehavior ? this._sourceBehavior._dragChannels : null;
					if (!dragChannels && (target = this._targetElements))
						if (target[0] && target[0].targets && target[0].targets[0])
							if (target = target[0].targets[0].behavior)
								dragChannels = target._dragChannels;
					var j = dragChannels ? dragChannels.length : 0;
					while (j-- > 0) if (Array.contains(dropChannels, dragChannels[j]))
					{
						returnVal = true;
						/* do not raise event for same behavior more than once */
						j = 0;
						behavior._evtKey = evtKey;
						if (!behavior._events._fireEvent(evntName, props))
							return false;
					}
				}
			}
		}
		return returnVal;
	},
	_getScroll: function(x)
	{
		return Math.max(document.body[x ? 'scrollLeft' : 'scrollTop'], document.documentElement[x ? 'scrollLeft' : 'scrollTop']);
	},
	__setupVisibleDragMakup: function(x, y, elem)
	{
		var style, markup = document.createElement("DIV");
		var dragMarkup = this._sourceBehavior.get_dragMarkup();
		if (dragMarkup)
			markup.appendChild(dragMarkup);
		else
		{
			var clone = elem.cloneNode(true);
			style = clone.style;
			/* in case anyone set any properties to achieve special functionality, lets remove them so the clone appears correctly */
			style.position = 'static';
			style.left = style.top = '0px';
			style.display = '';
			style.visibility = 'visible';
			style.height = elem.offsetHeight + 'px';
			style.width = elem.offsetWidth + 'px';
			markup.appendChild(clone);
		}
		style = markup.style;
		style.position = "absolute";
		style.zIndex = this._zIndex;
		var updateDisplay = elem.style.display == "none";
		if (updateDisplay)
			elem.style.display = "";
		var pos = Sys.UI.DomElement.getLocation(elem);
		if (updateDisplay)
			elem.style.display = "none";
		var scrollX = this._getScroll(1), scrollY = this._getScroll();
		var beh = this._sourceBehavior;
		if (beh._alignToMouse)
		{
			x += scrollX;
			y += scrollY;
		}
		else
		{
			markup._x0 = pos.x;
			markup._y0 = pos.y;
			if (this._quirks == 7)
			{
				pos.x += scrollX;
				pos.y += scrollY;
			}
			else if (!this._docMove)
			{
				x += scrollX;
				y += scrollY;
			}
			markup._x0 -= x;
			markup._y0 -= y;
			x = pos.x;
			y = pos.y;
		}
		style.left = (x + beh._offsetX) + 'px';
		style.top = (y + beh._offsetY) + 'px';
		document.body.appendChild(markup);
		$util.setOpacity(markup, beh.get_dragMarkupOpacity());
		this._draggingMarkup = markup;
	},

	_showShell: function()
	{
		/* Bug 20250: IE8 may have huge delay on move, set wait-for-move flag */
		this._waitMove = true;
		var style, id = '_ig_DragDropShellFrame';
		var shell = this._dragShell;
		if (!shell)
			this._dragShell = shell = $get(id);
		if (!shell)
		{
			this._dragShell = shell = document.createElement("IFRAME");
			shell.src = 'javascript:new String("")';
			shell.frameBorder = 0;
			shell.scrolling = 'no';
			shell.allowtransparency = 'true';
			shell.id = id;
			style = shell.style;
			style.zIndex = this._zIndex + 1;
			style.position = 'absolute';
			style.left = style.top = '0px';
			document.body.appendChild(shell);
			$util.setOpacity(shell, 0);
			if ($util.IsSafari)
				window.setTimeout(Function.createDelegate(this, this._onLoadFrame), 5);
			else
				$addHandler(shell, 'load', this._shellLoadDelegate = Function.createDelegate(this, this._onLoadFrame));
		}
		style = shell.style;
		var rect = $util.getWinRect();
		if (!$util.IsIE)
		{
			var elem = $util.IsSafari ? document.body : document.documentElement;
			/* Account for Scrollbars. We don't need to do this in IE */
			var sb = $util.IsSafari ? 16 : 18;
			if (rect.height < elem.scrollHeight)
				rect.maxWidth -= sb;
			if (rect.width < elem.scrollWidth)
				rect.maxHeight -= sb;
		}
		style.height = (rect.maxHeight - 2) + 'px';
		style.width = (rect.maxWidth - 1) + 'px';
		style.display = '';
	}
	/********************END PRIVATE Methods********************************/
}
$IG._DragDropManager.registerClass("Infragistics.Web.UI._DragDropManager");
$IG.DragDropManager = new $IG._DragDropManager();

$IG.DragDropBehavior = function()
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropBehavior">
	/// An object that allows the developer to specify elements and/or UIObjects that 
	/// should be source elements and/or target elements.  This object handles all aspects 
	/// of a Drag operation and provides hooks such as events that allow the developer to 
	/// interact with the operation. 
	///</summary>
	this.__sources = [];
	this.__targets = [];
	this._events = new $IG.DragDropEvents(this);   
	this._dragMarkupOpacity = 40;
	this._moveCursor = "move";
	this._copyCursor = $util.IsIE ? "default" : "copy";
	this._noneCursor = "not-allowed";
	this._dragDropMode = $IG.DragDropEffects.Default;
	this._defAction = $IG.DragDropAction.None;
	this._minShiftX = 0;
	this._minShiftY = 0;
	this._offsetX = 0;
	this._offsetY = 0;
	this._alignToMouse = false;
	/* browser event delegates */
	this._mouseDownDelegate = Function.createDelegate(this, this._onMouseDown);
	this._clickDelegate = Function.createDelegate(this, this._onClick);
	this._mouseMoveDelegate = Function.createDelegate(this, this._onMouseMove);
	this._dragStartDelegate = Function.createDelegate(this, this._onDragStart);
}

$IG.DragDropBehavior.prototype =
{
	/************************************PROTECTED METHODS*******************************************/
	_addTarget: function(elem, object, includeChildren)
	{
		var target = { element: elem, object: object, _includeChildren: includeChildren };
		this.__targets.push(target);
		$IG.DragDropManager._registerTarget(this, target);
	},

	_addSource: function(elem, obj)
	{
		var source = { element: elem, object: obj };
		this.__sources.push(source);
		elem.__source = source;
		$addHandler(elem, 'mousedown', this._mouseDownDelegate);
		$addHandler(elem, 'mousemove', this._mouseMoveDelegate);
		$addHandler(elem, 'dragstart', this._dragStartDelegate);
		$addHandler(elem, 'click', this._clickDelegate);
	},

	_removeSrc: function(source)
	{
		var elem = source.element;
		if (!elem || !elem.__source)
			return;
		elem.__source = source.element = null;
		try
		{
			$removeHandler(elem, 'mousedown', this._mouseDownDelegate);
			$removeHandler(elem, 'mousemove', this._mouseMoveDelegate);
			$removeHandler(elem, 'dragstart', this._dragStartDelegate);
			$removeHandler(elem, 'click', this._clickDelegate);
		} catch (ex) { };
	},

	dispose: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.dispose">
		/// Removes event handlers and clears objects.
		///</summary>
		var list = this.__sources;
		var i = list ? list.length : 0;
		while (i-- > 0)
			this._removeSrc(list[i]);
		this.get_events().clearHandlers();
		list = this.__targets;
		i = list ? list.length : 0;
		while (i-- > 0)
		{
			var item = list[i];
			$IG.DragDropManager._unRegisterTarget(this, item);
			item.element = item.behavior = null;
		}
	},
	/************************************END PROTECTED METHODS****************************************/

	/************************************EVENT HANDLERS***********************************************/
	_onMouseDown: function(e)
	{
		if (e.button == 0)
		{			
			/* support for delay of drag due to new props of behavior _minShiftX/Y */
			$IG.DragDropManager._mouseDown = this._mouseDown = {x:e.clientX, y:e.clientY};
			this.__startElem = e.target;
			/* disable default drag-drop of firefox */
			if (!$IG.DragDropManager._supportsElemFromPoint || $util.IsFireFox)
			{
				$util.cancelEvent(e);
				/* 02/24/2010 OK 27369 - we can just cancel the mouse down event, other code might care about it too. */				
				this._events._fireEventWithCurrentArgs("_MouseDown", e);
			}
		}
	},
	_onClick: function(e)
	{
		if ($IG.DragDropManager.get_isDragging())
			$IG.DragDropManager.endDrag(true);
		/* support for delay of drag due to new props of behavior _minShiftX/Y */
		this.__startElem = this._mouseDown = null;
	},
	_onDragStart: function(e)
	{
		$util.cancelEvent(e);
	},
	_onMouseMove: function(e)
	{
		/* support for delay of drag due to new props of behavior _minShiftX/Y */
		var md = this._mouseDown, man = $IG.DragDropManager;
		if (!md || !e)
			return;
		if (man._quirks == null)
			man._quirks = $util.IsQuirks ? ($util.IsIE8 ? 8 : ($util.IsIE ? 7 : 1)) : 0;
		/* if drag was not started after 1sec after previous move, then remove request to start drag */
		if (!man._mouseDown || man.get_isDragging())
		{
			this.__startElem = this._mouseDown = null;
			return;
		}
		$util.cancelEvent(e);
		if (Math.abs(e.clientX - md.x) > this._minShiftX || Math.abs(e.clientY - md.y) > this._minShiftY)
		{
			this._mouseDown = null;
			var elem = this.__startElem;
			while (elem && !elem.__source)
				elem = elem.parentNode;
			if (elem)
				man._startDrag(this, elem.__source, e, md);
		}
	},
	/***********************************END EVENT HANDLERS**********************************************/

	/************************************PUBLIC METHODS*************************************************/
	set_currentElementDragMarkup: function(enable)
	{
		this._underMouseElem = enable;
	},

	get_currentElementDragMarkup: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.currentElementDragMarkup">
		/// Gets sets option to use html element located under mouse as drag markup, or use whole source element.
		///</summary>
		///<value type="Boolean">True: use html element located under mouse. False: use whole source element. Default value is false.</value>
		return this._underMouseElem == true;
	},

	set_dragMarkup: function(markup)
	{
		this._dragMarkup = markup;
	},

	get_dragMarkup: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkup">
		/// Gets sets the custom drag markup that will be used to simulate an element during the 
		/// Drag operation. If no markup is specified, a clone will be made of the source 
		/// element, and that will be used.  
		/// If your drag markup will change based on what is being dragged, you can set the drag 
		/// markup as late as the DragStart event.  If you do not want any drag markup, you can pass 
		/// in a empty element, such as document.createElement(�div�).
		///</summary>
		/// <returns domElement="true" mayBeNull="true">Reference to html element which was set by set_dragMarkup.</returns>
		return this._dragMarkup ? this._dragMarkup : null;
	},

	set_dragMarkupOpacity: function(opacity)
	{
		this._dragMarkupOpacity = opacity;
	},

	get_dragMarkupOpacity: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupOpacity">
		/// Gets/sets the opacity of the drag markup. 
		/// The method expects a value between 0 and 100, where 0 is invisible and 100 is opaque.  
		/// By default the opacity is set to 40.
		///</summary>
		/// <value type="Number" integer="true">Opacity of drag markup element.</value>
		return this._dragMarkupOpacity;
	},

	get_moveCursor: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.moveCursor">
		/// Gets sets the cursor that should be used if the DragDropEffect is Move.
		/// Note: the set_moveCursor may contain optional second param, which specifies whether the cursor is a default browser cursor (false), or a custom url(true).
		///</summary>
		///<value type="String">Either a default browser cursor name, or a custom url.</value>
		return this._moveCursor;
	},
	set_moveCursor: function(cursor, isUrl)
	{
		this._moveCursor = isUrl ? ("url(" + cursor + "), move") : cursor;
	},

	get_copyCursor: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.copyCursor">
		/// Gets sets the cursor that should be used if the DragDropEffect is Copy.
		/// Note: the set_copyCursor may contain optional second param, which specifies whether the cursor is a default browser cursor (false), or a custom url(true).
		///</summary>
		///<value type="String">Either a default browser cursor name, or a custom url.</value>
		return this._copyCursor;
	},
	set_copyCursor: function(cursor, isUrl)
	{
		this._copyCursor = isUrl ? ("url(" + cursor + "), copy") : cursor;
	},

	get_noneCursor: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.noneCursor">
		/// Gets sets the cursor that should be used if the DragDropEffect is None.
		/// Note: the set_noneCursor may contain optional second param, which specifies whether the cursor is a default browser cursor (false), or a custom url(true).
		/// </summary>
		/// <value type="String">Either a default browser cursor name, or a custom url.</value>
		return this._noneCursor;
	},
	set_noneCursor: function(cursor, isUrl)
	{
		this._noneCursor = isUrl ? ("url(" + cursor + "), not-allowed") : cursor;
	},

	get_dragDropMode: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragDropMode">
		/// Gets sets drag-drop mode. If set, the DragDropEffect won�t be overridable via the keyboard. 
		/// Which means it doesn�t matter if the user presses the Ctrl or Shift key, 
		/// because the specified effect will remain.  
		/// To turn off this behavior the developer can pass in a DragDropEffect of Default. 
		///</summary>
		///<value type="Number" integer="true">A constant of Infragistics.Web.UI.DragDropEffects.</value>
		return this._dragDropMode;
	},
	set_dragDropMode: function(effect)
	{
		this._dragDropMode = effect;
	},

	set_defaultDropAction: function(action)
	{
		this._defAction = action;
	},

	get_defaultDropAction: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.defaultDropAction">
		/// Gets sets default action which should occur when source element was dropped on target.
		///</summary>
		///<remarks>
		/// The value of None means that application should implement drop action.
		/// Otherwise, action will depend on get_dragDropEffect() of DragDropManager.
		/// If dragDropEffect is Copy and value is set to Append, then
		/// the copy/clone of source element will be appended to target.
		/// If dragDropEffect is Copy and value is set to Insert, then
		/// the copy/clone of source element will be inserted in the target as first child.
		/// If dragDropEffect is Move and value is set to Append, then source
		/// element will be removed from it original location and appended to target.
		/// If dragDropEffect is Move and value is set to Insert, then source
		/// element will be removed from it original location and inserted into target as first child.
		/// So, source element can be dragged and dropped on another target.
		///</remarks>
		/// <value type="Number" integer="true">A constant of Infragistics.Web.UI.DragDropAction</value>
		return this._defAction;
	},

	get_minimumStartDragShiftX: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.minimumStartDragShiftX">
		/// Gets sets the minimum horizontal shift between mouse-down and mouse-drag points, which triggers start drag action.
		///</summary>
		/// <value type="Number" integer="true">Shift between mousedown and mousedrag in pixels</value>
		return this._minShiftX;
	},
	set_minimumStartDragShiftX: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.minimumStartDragShiftX">Sets the minimum horizontal shift between mouse-down and mouse-drag points, which triggers start drag action.</summary>
		/// <param name="val" type="Number" integer="true">Shift between mousedown and mousedrag in pixels</param>
		this._minShiftX = val;
	},
	get_minimumStartDragShiftY: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.minimumStartDragShiftY">
		/// Gets sets the minimum vertical shift between mouse-down and mouse-drag points, which triggers start drag action.
		///</summary>
		/// <value type="Number" integer="true">Shift between mousedown and mousedrag in pixels</value>
		return this._minShiftY;
	},
	set_minimumStartDragShiftY: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.minimumStartDragShiftY">Sets the minimum vertical shift between mouse-down and mouse-drag points, which triggers start drag action.</summary>
		/// <param name="val" type="Number" integer="true">Shift between mousedown and mousedrag in pixels</param>
		this._minShiftY = val;
	},
	
	get_dragMarkupMouseOffsetX: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupMouseOffsetX">
		/// Gets sets the horizontal offset of drag markup relative to the source element.
		///</summary>
		/// <value type="Number" integer="true">Offset in pixels</value>
		return this._offsetX;
	},
	set_dragMarkupMouseOffsetX: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupMouseOffsetX">Sets the horizontal offset of drag markup relative to the source element.</summary>
		/// <param name="val" type="Number" integer="true">Offset in pixels</param>
		this._offsetX = val;
	},
	get_dragMarkupMouseOffsetY: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupMouseOffsetY">
		/// Gets sets the vertical offset of drag markup relative to the source element.
		///</summary>
		/// <value type="Number" integer="true">Offset in pixels</value>
		return this._offsetY;
	},
	set_dragMarkupMouseOffsetY: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupMouseOffsetY">Sets the vertical offset of drag markup relative to the source element.</summary>
		/// <param name="val" type="Number" integer="true">Offset in pixels</param>
		this._offsetY = val;
	},
	get_dragMarkupAlignedToMouse: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupAlignedToMouse">
		/// Gets sets ability to shift top left corner of markup to the location of mouse.
		///</summary>
		/// <value type="Boolean">True: top left corner of markup is shifted to the location of mouse, false: markup at original location of source.</value>
		return this._alignToMouse;
	},
	set_dragMarkupAlignedToMouse: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.dragMarkupAlignedToMouse">Sets ability to shift top left corner of markup to the location of mouse.</summary>
		/// <param name="val" type="Boolean">True: top left corner of markup is shifted to the location of mouse, false: markup at original location of source.</param>
		this._alignToMouse = val;
	},

	addTargetElement: function(element, includeChildren)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addTargetElement">
		/// Notifies the behavior that the following element is a possible drop target, 
		/// which means that events such as DragEnter, DragLeave, DragMove, and Drop will 
		/// fire when the mouse enters the element while in a Drag operation.
		///</summary>
		///<param name="element" domElement="true">
		/// The element that should be marked as droppable.
		///</param>
		///<param name="includeChildren" type="Boolean" optional="true" mayBeNull="true">
		/// Determines whether the DragEnter and DragLeave events should fire only when 
		/// the mouse enters the specified target element (false), or for each child element 
		/// of the specified target element (true).
		///</param>
		this._addTarget(element, null, includeChildren);
	},

	addTargetObject: function(obj, includeChildren)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addTargetObject">
		/// Notifies the behavior that the following element associated with the object is 
		/// a possible drop target, which means that events such as DragEnter, DragLeave, 
		/// DragMove, and Drop will fire when the mouse enters the element while in a Drag operation.  
		///</summary>
		///<param name="obj" type="Infragistics.Web.UI.UIObject">
		/// The object whose associated element should be marked droppable.
		///</param>
		///<param name="includeChildren" type="Boolean" optional="true" mayBeNull="true">
		/// Determines whether the DragEnter and DragLeave events should fire only when 
		/// the mouse enters the specified target element (false), or for each child element 
		/// of the specified target element (true).
		///</param>
		this._addTarget(obj.get_element(), obj, includeChildren);
	},

	removeTarget: function(obj)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.removeTarget">
		/// Removes target which was set by addTargetElement or by addTargetObject.
		///</summary>
		///<param name="obj">
		/// Reference to DOM element or to Infragistics.Web.UI.UIObject.
		///</param>
		var elem = obj;
		if (!obj)
			return;
		if (typeof obj.get_element == 'function')
		{
			elem = obj.get_element();
			if (!elem)
				return;
		}
		else
			obj = null;
		var list = this.__targets;
		var i = list ? list.length : 0;
		while (i-- > 0)
		{
			var item = list[i];
			if (!item || item.element != elem || item.object != obj)
				continue;
			$IG.DragDropManager._unRegisterTarget(this, item);
			item.element = item.behavior = null;
			Array.removeAt(list, i);
		}
	},

	addSourceElement: function(elem)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addSourceElement">
		/// Notifies the behavior that the following element is draggable. 
		///</summary>
		///<param name="elem" domElement="true">
		/// The element that should be marked draggable.
		///</param>
		this._addSource(elem, null);
	},

	addSourceObject: function(obj)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addSourceObject">
		/// Notifies the behavior that the element associated with the object is draggable.
		///</summary>
		///<param name="obj" type="Infragistics.Web.UI.UIObject">
		/// The object whose associated element should be marked draggable.
		///</param>
		this._addSource(obj.get_element(), obj);
	},

	removeSource: function(obj)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.removeSource">
		/// Removes source which was set by addSourceElement or by addSourceObject.
		///</summary>
		///<param name="obj">
		/// Reference to DOM element or to Infragistics.Web.UI.UIObject.
		///</param>
		var elem = obj;
		if (!obj)
			return;
		if (typeof obj.get_element == 'function')
		{
			elem = obj.get_element();
			if (!elem)
				return;
		}
		else
			obj = null;
		var list = this.__sources;
		var i = list ? list.length : 0;
		while (i-- > 0)
		{
			var item = list[i];
			if (!item || item.element != elem || item.object != obj)
				continue;
			this._removeSrc(item);
			Array.removeAt(list, i);
		}
	},

	addDragChannels: function(channels)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addDragChannels">
		/// Sets the channels that the source object is allowed to be dragged onto.
		///</summary>
		///<param name="channels" type="Array">
		/// An array of keys (strings or integers).
		///</param>
		///<remarks>
		/// Once a channel is specified, a source object will only be allowed to be dragged 
		/// onto a target that is listening on the same channel, or a target that is not listening 
		/// on any channels.  
		/// One use of Channels is to protect a Infragistics.Web.UI.DragDropBehavior from receiving 
		/// unwanted drop elements from another DragDropBehavior.
		///</remarks>
		if (!this._dragChannels)
			this._dragChannels = [];
		Array.addRange(this._dragChannels, channels);
	},

	addDropChannels: function(channels)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropBehavior.addDropChannels">
		/// Sets the channels that a target object is listening for.
		///</summary>
		///<param name="channels" type="Array">
		/// An array of keys (strings or integers).
		///</param>
		///<remarks>
		/// Once a channel is specified, a target object will only allow source objects that are on 
		/// the same channel.
		/// One use of Channels is to protect a Infragistics.Web.UI.DragDropBehavior from receiving 
		/// unwanted drop elements from another DragDropBehavior.
		///</remarks>
		if (!this._dropChannels)
			this._dropChannels = [];
		Array.addRange(this._dropChannels, channels);
	},

	get_events: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropBehavior.events">
		/// Returns a reference to the Infragistics.Web.UI.DragDropEvents object, which contains all the events of the behavior.
		///</summary>
		/// <value type="Infragistics.Web.UI.DragDropEvents">Reference to events.</value>
		return this._events;
	}
	/************************************END PUBLIC METHODS*********************************************/
};
$IG.DragDropBehavior.registerClass("Infragistics.Web.UI.DragDropBehavior");

$IG.DragDropEvents = function (behavior) 
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropEvents">
	/// An object that allows the developer to attach event listeners associated with a 
	/// Infragistics.Web.UI.DragDropBehavior. All handlers should have the following signature: 
	/// handler (behavior, evntArgs)
	///</summary>
	///<param name="behavior" type="Infragistics.Web.UI.DragDropBehavior">Behavior</param>
	this._handlers ={};
	this._behavior = behavior;
}
$IG.DragDropEvents.prototype =
{
	addDragStartHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragStartHandler">
		/// Attaches an event listener to the DragStart event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired when a drag operation is about to begin.  This event is cancelable. 
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropCancelEventArgs.
		///</remarks>
		this.__addHandler("DragStart", handler, $IG.DragDropCancelableMoveEventArgs);
		//this.__addHandler("DragStart", handler, $IG.DragDropCancelEventArgs);
	},

	addDropHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDropHandler">
		/// Attaches an event listener to the Drop event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired when a dragged element is released over a target element.  
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropEventArgs. 
		///</remarks>
		this.__addHandler("Drop", handler, $IG.DragDropEventArgs);
	},

	addDragEnterHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragEnterHandler">
		/// Attaches an event listener to the DragEnter event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired when a dragged element enters a target element.  This event is cancelable.   
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropCancelEventArgs. 
		///</remarks>
		this.__addHandler("DragEnter", handler, $IG.DragDropCancelEventArgs);
	},

	addDragLeaveHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragLeaveHandler">
		/// Attaches an event listener to the DragLeave event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired when a dragged element leaves a target element.   
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropEventArgs. 
		///</remarks>
		this.__addHandler("DragLeave", handler, $IG.DragDropEventArgs);
	},

	addDragCancelHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragCancelHandler">
		/// Attaches an event listener to the DragCancel event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired when a drag operation is canceled. This can happen if the dragged element is 
		/// released while not over a target element, the escape key is pressed, or a developer 
		/// calls the endDrag method off of the DragDropManager with a parameter of true.  
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropEventArgs. 
		///</remarks>
		this.__addHandler("DragCancel", handler, $IG.DragDropEventArgs);
	},

	addDragMoveHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragMoveHandler">
		/// Attaches an event listener to the DragMove event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired every time the mouse moves while over a target element.   
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropMoveEventArgs. 
		///</remarks>
		this.__addHandler("DragMove", handler, $IG.DragDropMoveEventArgs);
	},

	addDragEndHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.addDragEndHandler">
		/// Attaches an event listener to the DragEnd event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that should be called when the event is fired.
		///</param>
		///<remarks>
		/// Fired every time a drag operation ends, whether it was canceled or a drop occurred. 
		/// This event is always the last event fired.   
		/// The EventArgs are of type: Infragistics.Web.UI.DragDropEventArgs. 
		///</remarks>
		this.__addHandler("DragEnd", handler, $IG.DragDropEventArgs);
	},

	removeDragStartHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragStartHandler">
		///Removes the event listener to the DragStart event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragStart", handler);
	},

	removeDropHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDropHandler">
		///Removes the event listener to the Drop event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("Drop", handler);
	},

	removeDragEnterHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragEnterHandler">
		///Removes the event listener to the DragEnter event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragEnter", handler);
	},

	removeDragLeaveHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragLeaveHandler">
		///Removes the event listener to the DragLeave event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragLeave", handler);
	},

	removeDragCancelHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragCancelHandler">
		///Removes the event listener to the DragCancel event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragCancel", handler);
	},

	removeDragMoveHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragMoveHandler">
		///Removes the event listener to the DragMove event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragMove", handler);
	},

	removeDragEndHandler: function(handler)
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.removeDragEndHandler">
		///Removes the event listener to the DragEnd event of a Infragistics.Web.UI.DragDropBehavior.          
		///</summary>
		///<param name="handler" type="Function">
		/// The function that was used originally to fire the event..
		///</param>
		this.__removeHandler("DragEnd", handler);
	},

	clearHandlers: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.DragDropEvents.clearHandlers">Removes event listeners.</summary>
		this._handlers = {};
	},

	_removeHandler: function(name, handler)
	{
		var handlers = this._handlers[name];
		var i = handlers ? handlers.length : 0;
		while (i-- > 0)
		{
			if (handlers[i][0] == handler)
			{
				Array.removeAt(handlers, i);
				break;
			}
		}
	},

	__addHandler: function(name, handler, args)
	{
		if (!this._handlers[name])
			this._handlers[name] = [];
		this._handlers[name].push([handler, args]);
	},

	_fireEvent: function(name, evntArgs)
	{
		var handlers = this._handlers[name];
		var i = handlers ? handlers.length : 0;
		while (i-- > 0)
		{
			var handler = handlers[i];
			var evnt = handler[0];
			var args = new handler[1](evntArgs);
			evnt(this._behavior, args);
			if (args._cancel)
				return false;
		}
		return true;
	},
	
	_fireEventWithCurrentArgs: function(name, evntArgs)
	{
		var handlers = this._handlers[name];
		var i = handlers ? handlers.length : 0;
		while (i-- > 0)
		{
			var handler = handlers[i];
			var evnt = handler[0];			
			evnt(this._behavior, evntArgs);
			if (evntArgs._cancel)
				return false;
		}
		return true;		
	}
}
$IG.DragDropEvents.registerClass("Infragistics.Web.UI.DragDropEvents");

$IG.DragDropEventArgs = function(props)
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropEventArgs">
	/// Provides data for Drag and Drop events of a DragDropBehavior.
	///</summary>
	///<param name="props">Object that contains elem member.</param>
	this._props = props;
}
$IG.DragDropEventArgs.prototype = 
{
	get_elementAtMouse:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropEventArgs.elementAtMouse">
		/// Returns a references to the html element under mouse or null.
		///</summary>
		/// <value domElement="true" mayBeNull="true">Reference to element under mouse or null.</value>
		return this._props ? this._props.elem : null;
	},
	get_manager:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropEventArgs.manager">
		/// Returns a references to the DragDropManager object.
		///</summary>
		/// <value type="Infragistics.Web.UI._DragDropManager">Reference to DragDropManager.</value>
		return $IG.DragDropManager;
	}
}
$IG.DragDropEventArgs.registerClass("Infragistics.Web.UI.DragDropEventArgs");

$IG.DragDropMoveEventArgs = function (props) 
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropMoveEventArgs">
	/// Inherits from DragDropEventArgs and adds additional information such as x and y coordinates.
	///</summary> 
	///<param name="props">Object that contains elem, x and y members.</param>
	$IG.DragDropMoveEventArgs.initializeBase(this, [props]);
}
$IG.DragDropMoveEventArgs.prototype = 
{
	get_x:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropMoveEventArgs.x">
		/// Returns the current x coordinate of the mouse in relation to the window. 
		///</summary>
		/// <value type="Number" integer="true">The current x coordinate.</value>
		return this._props.x;
	},
	get_y:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropMoveEventArgs.y">
		/// Returns the current y coordinate of the mouse in relation to the window.  
		///</summary>
		/// <value type="Number" integer="true">The current y coordinate.</value>
		return this._props.y;
	}
}
$IG.DragDropMoveEventArgs.registerClass("Infragistics.Web.UI.DragDropMoveEventArgs", $IG.DragDropEventArgs);

$IG.DragDropCancelEventArgs = function (props)
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropCancelEventArgs">
	/// Inherits from DragDropEventArgs, but is used for events that are cancelable. 
	///</summary>
	///<param name="props">Object that contains elem member.</param>
	this._cancel = false;
	$IG.DragDropCancelEventArgs.initializeBase(this, [props]);
}
$IG.DragDropCancelEventArgs.prototype = 
{
	get_cancel:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropCancelEventArgs.cancel">
		/// Checks whether the event should be canceled. 
		///</summary>
		/// <value type="Boolean">True: event is canceled.</value>
		return this._cancel;
	},
	set_cancel:function(cancel)
	{
		this._cancel = cancel;
	}
}
$IG.DragDropCancelEventArgs.registerClass("Infragistics.Web.UI.DragDropCancelEventArgs", $IG.DragDropEventArgs);

$IG.DragDropCancelableMoveEventArgs = function (props)
{
	///<summary locid="T:J#Infragistics.Web.UI.DragDropCancelableMoveEventArgs">
	/// Inherits from DragDropMoveEventArgs , but is used for events that are cancelable. 
	///</summary>
	///<param name="props">Object that contains elem, x and y members.</param>
	this._cancel = false;
	$IG.DragDropCancelableMoveEventArgs.initializeBase(this, [props]);
}
$IG.DragDropCancelableMoveEventArgs.prototype = 
{
	get_cancel:function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.DragDropCancelableMoveEventArgs.cancel">
		/// Checks whether the event should be canceled. 
		///</summary>
		/// <value type="Boolean">True: event is canceled.</value>
		return this._cancel;
	},
	set_cancel:function(cancel)
	{
		this._cancel = cancel;
	}
}
$IG.DragDropCancelableMoveEventArgs.registerClass("Infragistics.Web.UI.DragDropCancelableMoveEventArgs", $IG.DragDropMoveEventArgs);
