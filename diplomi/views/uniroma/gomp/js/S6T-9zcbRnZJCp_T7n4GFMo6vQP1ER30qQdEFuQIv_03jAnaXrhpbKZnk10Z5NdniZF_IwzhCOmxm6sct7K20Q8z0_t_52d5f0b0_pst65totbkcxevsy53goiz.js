Type.registerNamespace("Infragistics.Web.UI");

/******************************************ANIMATION BASE******************************************/
$IG.AnimationBase = function(elem)
{
    ///<summary locid="T:J#Infragistics.Web.UI.AnimationBase">
    /// A base class that provides the ability to create a custom animation.
    ///</summary>
    this._element = elem;
    this._duration = 30;
    this._tickInterval = 30;
    this._curveDepth = 2;
};

$IG.AnimationBase.prototype =
{
	/*********PUBLIC METHODS ******/
	play: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AnimationBase.play">
		/// Starts the Animation
		///</summary>
		this._zero = (new Date()).getTime();
		this.onBegin();
		this._time = 1;
		if (this._animating == true)
			this.stop();
		this._animating = true;
		this._init();
		this.__tick('init');
	},

	stop: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AnimationBase.stop">
		/// Ends the Animation.
		///</summary>
		this._animating = false;
		if (!this._timerId)
			return;
		clearInterval(this._timerId);
		delete this._timerId;
	},
	/*********END PUBLIC METHODS ******/

	/*********EVENTS*******************/
	onBegin: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AnimationBase.onBegin">
		/// Should be overriden on the base class.
		/// Notifies the Animation that it is about to Begin
		///</summary>    
	},
	onNext: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AnimationBase.onNext">
		/// Should be overriden on the base class.
		/// Fired for each tick of the Animation
		///</summary>    
	},
	onEnd: function()
	{
		///<summary locid="M:J#Infragistics.Web.UI.AnimationBase.onEnd">
		/// Should be overriden on the base class.
		/// Notifies the Animation that the animation has ended.
		///</summary>    
	},

	/*********END EVENTS***************/

	/*********PUBLIC PROPERTIES *******/
	get_duration: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.AnimationBase.duration">
		/// Gets duration of the animation in ticks and sets duration in milliseconds.
		/// Meaning that the onNext method will be fired for each tick.
		/// The default Value is 35.
		///</summary>
		/// <value type="Number" integer="true">Duration in ticks for "get" and duration in milliseconds for "set".</value>
		return this._duration;
	},
	set_duration: function(ms)
	{
		///<summary locid="P:J#Infragistics.Web.UI.AnimationBase.duration">Sets duration in milliseconds.</summary>
		/// <param name="val" type="Number" integer="true">Number of milliseconds</param>
		ms = Math.ceil(ms / this._tickInterval);
		this._duration = (ms > 1) ? ms : 1;
	},
	get_isAnimating: function()
	{
		///<summary locid="P:J#Infragistics.Web.UI.AnimationBase.isAnimating">
		/// Returns true if the animation is currently occurring.
		///</summary> 
		/// <value type="Boolean">True: animation is running.</value>
		return this._animating;
	},
	/*********END PUBLIC PROPERTIES *******/

	/*********PRIVATE METHODS *********/
	__tick: function(init)
	{
		this.onNext();
		this._next();
		if (this._animating)
		{
			var time = ++this._time, max = Math.floor(((new Date()).getTime() - this._zero) / this._tickInterval) - 1;
			if (time < max)
				if ((time = max) > this._duration)
					time = this._duration;
			this._time = time;
			if (init == 'init')
				this._timerId = setInterval(Function.createDelegate(this, this.__tick), this._tickInterval);
		}
		else
			this.onEnd();

	},
	/*********END PRIVATE METHODS *********/

	/********Protected Virtual Methods ****/
	_init: function()
	{
		/* TO BE OVERRIDDEN ON DERIVED CLASS */
	},

	_next: function()
	{
		/* TO BE OVERRIDDEN ON DERIVED CLASS */
	},

	_calc: function(type, t, s, e, d)
	{
		/* t = current tick
		s = start position
		e = end position
		d = duration of animtation */
		var cd = this._curveDepth;
		if (type == $IG.AnimationEquationType.Linear)
			return ((e - s) / d) * t + s;
		else if (type == $IG.AnimationEquationType.EaseIn)
			return (Math.pow(t, cd) * (e - s)) / Math.pow(d, cd) + s;
		else if (type == $IG.AnimationEquationType.EaseOut)
			return ((-Math.pow(t, cd) * (e - s)) / Math.pow(d, cd)) + ((2 * t * (e - s)) / d) + s;
		else if (type == $IG.AnimationEquationType.EaseInOut)
		{
			if (t < (d / 2)) // is halfway through?
				return (Math.pow(t, cd) * ((e - s) / 2)) / Math.pow((d / 2), cd) + s; // Ease In
			else
				return ((-Math.pow((t - (d / 2)), cd) * ((e - s) / 2)) / Math.pow((d / 2), cd)) + ((2 * (t - (d / 2)) * ((e - s) / 2)) / (d / 2)) + (s + e) / 2; // Ease out;
		}
		/*else if (type == $IG.AnimationEquationType.Bounce)*/
		var ts = (t /= d) * t;
		var tc = ts * t;
		return (e - s) * (44.25 * tc * ts + -138.25 * ts * ts + 156.5 * tc + -76.5 * ts + 15 * t) + s;
	},
	/* set/remove property of a style */
	/* style: reference to style */
	/* name: name of property (IE) */
	/* val: value of property */
	/* name2: optional name of property for not IE */
	_setProp: function(style, name, val, name2)
	{
		if (style) if (val && val.length > 0)
			eval('style.' + name + '=val');
		else if(style.removeAttribute)
			style.removeAttribute(name);
		else if(style.removeProperty)
			style.removeProperty(name2 ? name2 : name);
	},
	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.AnimationBase.dispose">
		/// Disposes of the animation object.
		/// </summary>
		this.stop();
		this._element = null;
	}
};
$IG.AnimationBase.registerClass("Infragistics.Web.UI.AnimationBase");
/******************************************END ANIMATION BASE**************************************/

/******************************************Bounce Animation**************************************/
$IG.OpacityAnimation = function(elem, equationType)
{
	///<summary locid="T:J#Infragistics.Web.UI.OpacityAnimation">
	/// class implementing opacity animations 
	///</summary>
	
    $IG.OpacityAnimation.initializeBase(this, [elem]);
    /* AS 4/28/2009 Bug#17106 adding equationType to opacity animation also */
    this._equationType = equationType ? equationType : $IG.AnimationEquationType.Linear;
};

$IG.OpacityAnimation.prototype = 
{
	/* AS 4/28/2009 Bug#17106 adding equationType to opacity animation also */
	/* VS 06.04.2009 I do not recommend to use removeOpacityAtEnd, because under IE appearance may jump */
	play:function(startOpacity, endOpacity, removeOpacityAtEnd, hideOnStop)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.OpacityAnimation.play">Start animation.</summary>
		/// <param name="startOpacity" type="Number">Opacity in percents on start.</param>
		/// <param name="endOpacity" type="Number">Opacity in percents on end.</param>
		/// <param name="removeOpacityAtEnd" type="Boolean" optional="true" mayBeNull="true">True: request to remove opacity at the end.</param>
		/// <param name="hideOnStop" type="Boolean" optional="true" mayBeNull="true">True: request to hide element at the end.</param>
		this._startOpacity = startOpacity;
		$util.setOpacity(this._element, startOpacity);
		this._endOpacity = endOpacity;
		this._removeOnStop = removeOpacityAtEnd;
		this._hideOnStop = hideOnStop;
		$IG.OpacityAnimation.callBaseMethod(this, "play");
	},
    
	_next:function()
	{
		var start = this._startOpacity, end = this._endOpacity;
		var val = this._calc(this._equationType, this._time, start, end, this._duration);
		if (val < 0)
			val = 0;
		if (val > 100)
			val = 100;
		/* _elem2 and _opac2 are used by AjaxIndicator for second synchronous block element */
		$util.setOpacity(this._elem2, val * this._opac2);
		$util.setOpacity(this._element, val);
		if ((start < end && val >= end) || (start > end && val <= end))
			this.stop();
	},

	stop:function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.OpacityAnimation.stop">Stop animation.</summary>
		var elem = this._element;
		var style = elem ? elem.style : null;
		if (this._removeOnStop)
			this._setProp(style, 'filter', null, 'opacity');
		if (this._hideOnStop)
		{
			$util.display(elem, true);
			$util.display(this._elem2, true);
		}
		if (elem && elem._ig_sfa)
			elem._ig_sfa._stop(this);
		$IG.OpacityAnimation.callBaseMethod(this, "stop");
	}
};

$IG.OpacityAnimation.registerClass("Infragistics.Web.UI.OpacityAnimation", $IG.AnimationBase);
/******************************************END Opacity Animation**********************************/

/* slide animation behavior */
$IG.SlideAnimation = function(elem)
{
	$IG.SlideAnimation.initializeBase(this, [elem]);
};
$IG.SlideAnimation.prototype =
{
	play: function(show, type, duration, direction, up, right)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.OpacityAnimation.play">Start animation.</summary>
		/// <param name="show" type="Boolean">True: request to show element, false: hide element.</param>
		/// <param name="type" type="Infragistics.Web.UI.AnimationEquationType">Type of animation.</param>
		/// <param name="duration" type="Number" integer="true">Duration of animation in milliseconds.</param>
		/// <param name="direction" type="Infragistics.Web.UI.AnimationSlideDirection">Direction of animation (horizontal, vertical, both).</param>
		/// <param name="up" type="Boolean" optional="true" mayBeNull="true">True: request to slide from bottom to up.</param>
		/// <param name="right" type="Boolean" optional="true" mayBeNull="true">True: request to slide from right to left.</param>
		var elem = this._element;
		if(!elem || this._div)
			return;
		this._type = type ? type : 0;
		if (duration)
			this.set_duration(duration);
		this._initDiv(elem, show, this._direction = direction ? direction : 1);
		if (this._height < 3)
			return;
		if (!this._div0)
		{
			this._up = up;
			this._right = right;
		}
		this._hideOnStop = !show;
		this._start = show ? 0 : this._height;
		this._end = show ? this._height : 0;
		$IG.SlideAnimation.callBaseMethod(this, 'play');
	},
	_initDiv: function(elem, show, dir)
	{
		var div0 = this._div0;
		var div = elem._slide_div;
		if (!div)
			if (!(div = div0))
				div = document.createElement('DIV');
		elem._slide_div = div;
		var style = div.style, eStyle = elem.style, dad = elem.parentNode;
		/* remove width/height set by possible previous action */
		if (!div0)
			style.width = style.height = '';
		/* ensure that style of elem is visible */
		$util.display(elem);
		this._div = div;
		/* validate that element is actually visible */
		if ((this._height = elem.offsetHeight) < 3)
			return;
		this._width = elem.offsetWidth;
		/* ratio to adjust animated width */
		this._ratio = this._width / this._height;
		if (div0)
		{
			/* memorize old overflow, width and height */
			this._div0o = div0.style.overflow;
			this._div0w = div0.style.width;
			this._div0h = div0.style.height;
			style.overflow = 'hidden';
			/* adjust 0px width/height only for show action */
			if (show)
			{
				if (dir > 1)
					style.width = '0px';
				if ((dir & 1) == 1)
					style.height = '0px';
			}
			return;
		}
		/* initial size of div */
		style.width = ((show && dir > 1) ? 0 : this._width) + 'px';
		style.height = ((show && (dir & 1) == 1) ? 0 : this._height) + 'px';
		style.overflow = 'hidden';
		style.position = 'absolute';
		/* copy position of div from elem */
		style.left = eStyle.left;
		style.top = eStyle.top;
		var rs = $util.getRuntimeStyle(elem);
		this._pos = $util.getStyleValue(rs, 'position');
		/* copy margin of div from elem */
		this._left = style.marginLeft = $util.getStyleValue(rs, 'marginLeft');
		this._top = style.marginTop = $util.getStyleValue(rs, 'marginTop');
		this._iLeft = $util.toInt(this._left);
		this._iTop = $util.toInt(this._top);
		var z = $util.getStyleValue(rs, 'zIndex');
		if (z && parseInt(z) > 0)
			style.zIndex = z;
		/* remove position and margin from elem */
		eStyle.position = eStyle.marginLeft = eStyle.marginTop = '';
		/* swap elem with div */
		dad.insertBefore(div, elem);
		dad.removeChild(elem);
		div.appendChild(elem);
	},
	_next: function()
	{
		var start = this._start, end = this._end, height = this._height;
		var val = this._calc(this._type, this._time, start, end, this._duration);
		if (val < 0)
			val = 0;
		if (val > height)
			val = height;
		var style = this._div.style;
		var val2 = Math.floor(val * this._ratio), dir = this._direction;
		if (this._up && (dir < 2 || dir == 3))
				style.marginTop = (this._iTop + height - val) + 'px';
		if (this._right && dir > 1)
			style.marginLeft = (this._iLeft + this._width - val2) + 'px';
		if (dir < 2 || dir == 3)
			style.height = val + 'px';
		if (dir > 1)
			style.width = val2 + 'px';
		if ((start < end && val >= end) || (start > end && val <= end))
			this.stop();
	},
	stop: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.OpacityAnimation.stop">Stop animation.</summary>
		var elem = this._element, div = this._div;
		this._div = null;
		if (elem && div)
		{
			if (this._hideOnStop)
				$util.display(elem, true);
			/* if element was invisible on start, then nothing to restore */
			if (this._height > 2) if (this._div0)
			{
				/* restore old overflow, width, height */
				this._setProp(style = this._div0.style, 'overflow', this._div0o);
				this._setProp(style, 'width', this._div0w);
				this._setProp(style, 'height', this._div0h);
			}
			/* if that validation failed, then it means animation was crashed: at least avoid exception */
			else if (elem.parentNode == div)
			{
				var dad = div.parentNode, style = elem.style;
				/* restore elem location */
				style.position = this._pos;
				style.marginLeft = this._left;
				style.marginTop = this._top;
				/* swap elem with div */
				div.removeChild(elem);
				dad.insertBefore(elem, div);
				dad.removeChild(div);
				/* Bug 33657. Get around bugs in IE: it may fail to repaint parent after child was removed. */
				if ($util.IsIE)
					dad.className = dad.className;
			}
		}
		if (elem && elem._ig_sfa)
			elem._ig_sfa._stop(this);
		this._div0 = null;
		$IG.SlideAnimation.callBaseMethod(this, 'stop');
	}
};
$IG.SlideAnimation.registerClass("Infragistics.Web.UI.SlideAnimation", $IG.AnimationBase);

/* container of properties for Slide and Opacity animations */
$IG.SlideFadeAnimation = function(props)
{
	/// <summary locid="T:J#Infragistics.Web.UI.SlideFadeAnimation">
	/// Container of properties used by Slide/OpacityAnimations.
	/// </summary>
	/// <param name="props" type="String">
	/// 10 properties separated by coma:
	/// 0-FadeOpenDuration,1-FadeOpenEquationType,2-SlideOpenDuration,3-SlideOpenEquationType,4-SlideOpenDirection
	/// 5-FadeCloseDuration,6-FadeCloseEquationType,7-SlideCloseDuration,8-SlideCloseEquationType,9-SlideCloseDirection.
	/// </param>
	if (!props)
		props = '300,0,300,0,1,200,0,200,0,1';
	this._props = props = props.split(',');
	for (var i = 0; i < 10; i++)
		props[i] = parseInt(props[i]);
	$IG.SlideFadeAnimation.initializeBase(this);
}
$IG.SlideFadeAnimation.prototype =
{
	play: function(elem, show, up, right, stopListnerObj, stopListnerFnc, customObj)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.SlideFadeAnimation.play">
		/// Calls fade.play(params) and slide.play(params) according to properties of this class.
		/// If hide is false or not set, then that method also make element visible.
		/// If hide is true and both fade and slide are null or both do not have duration, then that method also hides element.
		/// </summary>
		/// <param name="elem" domElement="true" optional="true" mayBeNull="true">Reference to html element. If elem is missing or null, then current slide and fade animations are disposed.</param>
		/// <param name="show" type="Boolean">True: request to show element, false: hide element.</param>
		/// <param name="up" type="Boolean" optional="true" mayBeNull="true">True: request to slide from bottom to up.</param>
		/// <param name="right" type="Boolean" optional="true" mayBeNull="true">True: request to slide from right to left.</param>
		/// <param name="stopListnerObj" optional="true" mayBeNull="true">Object which has member stopListnerFnc.</param>
		/// <param name="stopListnerFnc" type="Function" optional="true" mayBeNull="true">Member function of stopListnerObj, which is called on stop of animation.</param>
		/// <param name="customObj" optional="true" mayBeNull="true">Second param in stopListnerFnc. Note: first param is same as "show".</param>
		/// <returns type="Boolean">True: animation was started, false: no animation (missing element or no duration).</returns>
		var fade = this._fade, slide = this._slide;
		if (fade)
			fade.dispose();
		if (slide)
			slide.dispose();
		delete this._fade;
		delete this._slide;
		if (!elem)
			return false;
		/* 5 member variables below are used to raise event on stop animation */
		/* bit-1: fade animation is not finished yet, bit-2: slide animation is not finished yet */
		this._fire = 0;
		this._stopObj = stopListnerObj;
		this._stopFnc = stopListnerFnc;
		this._custom = customObj;
		this._show = show;
		/* _fadeParent used to get around bugs in IE: if elem is DIV without height, then opacity fails, */
		/* such DIV is used by ContainerGridRow of hierarchical grid */
		var el = this._fadeParent ? elem.parentNode : elem;
		if(show)
		{
			$util.display(elem);
			$util.display(el);
		}
		var has1 = false, props = this._props;
		var i = show ? 0 : 5;
		/* props[i] - fade duration */
		var duration = props[i];
		if (duration > 0)
		{
			/* set reference to this in order to process stop animation */
			el._ig_sfa = this;
			/* props[i + 1] - fade equation */
			this._fade = fade = new $IG.OpacityAnimation(el, props[i + 1]);
			this._fire = 1;
			fade.set_duration(duration);
			fade.play(show ? 0 : 100, show ? 100 : 0, false, !this._fadeParent && !show);
			has1 = true;
		}
		/* if no "show" fade duration, but "hide" fade duration is set, then restore opacity */
		else if (show && props[5] > 0)
			$util.setOpacity(el, 100);
		/* 0-FadeOpenDuration,1-FadeOpenEquationType,2-SlideOpenDuration,3-SlideOpenEquationType,4-SlideOpenDirection */
		/* 5-FadeCloseDuration,6-FadeCloseEquationType,7-SlideCloseDuration,8-SlideCloseEquationType,9-SlideCloseDirection */
		/* props[i + 2] - slide duration */
		duration = props[i + 2];
		if (duration > 0)
		{
			/* set reference to this in order to process stop animation */
			elem._ig_sfa = this;
			this._slide = slide = new $IG.SlideAnimation(elem);
			slide._div0 = this._div;
			this._fire += 2;
			slide.set_duration(duration);
			var old = '', temp = null;
			if (show)
			{
				/* if target elem does not have absolute position, then temporary before "play" */
				/* set position:absolute, otherwise, container of target will jump */
				if (!(temp = this._div))
					temp = elem;
				if (temp)
				{
					temp = temp.style;
					if ((old = temp.position) == 'absolute')
						temp = null;
					else
						temp.position = 'absolute';
				}
			}
			/* props[i + 3] - slide equation, props[i + 4] - slide direction */
			slide.play(show, props[i + 3], duration, props[i + 4], up);
			/* restore old position, which was temporary was set to absolute */
			if (temp)
				slide._setProp(temp, 'position', old);
			has1 = true;
		}
		/* no animation and element should be hidden */
		if (!show && !has1)
			$util.display(elem, true);
		return has1;
	},
	/* process stop event raised by slide/fade animations and notify listener about stop action */
	_stop: function(sfa)
	{
		var elem = null;
		if (this._fade == sfa)
		{
			elem = sfa._element;
			/* remove reference to this (elem._ig_sfa) only if _fadeParent is on */
			if (this._fadeParent)
				elem._ig_sfa = null;
			/* remove flag (bit-1) that fade animation is running */
			this._fire &= 2;
		}
		if (this._slide == sfa)
		{
			elem = sfa._element;
			/* remove flag (bit-2) that slide animation is running */
			this._fire &= 1;
		}
		/* one of animation is still running */
		if (this._fire != 0)
			return;
		/* remove reference to this from sfa._element */
		if (elem)
			elem._ig_sfa = null;
		if (!this._stopObj || !this._stopFnc)
			return;
		try
		{
			this._stopFnc.apply(this._stopObj, [this._show, this._custom]);
		}
		catch(elem){}
		delete this._stopFnc;
		delete this._stopObj;
		delete this._custom;
	},
	setSlideContainer: function(div)
	{
		/// <summary locid="M:J#Infragistics.Web.UI.SlideFadeAnimation.setSlideContainer">Set DIV element which is used as container for slide animation.</summary>
		/// <param name="div" domElement="true" mayBeNull="true">Reference to DIV which is used to adjust its width/height while sliding.</param>
		this._div = div;
	},
	get_fade: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fade">Gets reference to current OpacityAnimation or null.</summary>
		/// <value type="Infragistics.Web.UI.OpacityAnimation" mayBeNull="true">Reference to OpacityAnimation</value>
		return this._fade;
	},
	get_slide: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slide">Gets reference to current SlideAnimation or null.</summary>
		/// <value type="Infragistics.Web.UI.OpacityAnimation" mayBeNull="true">Reference to SlideAnimation</value>
		return this._slide;
	},
	get_fadeOpenDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeOpenDuration">Gets sets duration of fade for open action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._props[0];
	},
	set_fadeOpenDuration: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeOpenDuration">Sets duration of fade for open action in milliseconds.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[0] = val;
	},
	get_fadeCloseDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeCloseDuration">Gets sets duration of fade for close action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._props[5];
	},
	set_fadeCloseDuration: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeCloseDuration">Sets duration of fade for close action in milliseconds.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[5] = val;
	},
	get_slideOpenDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenDuration">Gets sets duration of slide for open action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._props[2];
	},
	set_slideOpenDuration: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenDuration">Sets duration of slide for open action in milliseconds.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[2] = val;
	},
	get_slideCloseDuration: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseDuration">Gets sets duration of slide for close action in milliseconds.</summary>
		/// <value type="Number" integer="true">Duration in milliseconds.</value>
		return this._props[7];
	},
	set_slideCloseDuration: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseDuration">Sets duration of slide for close action in milliseconds.</summary>
		/// <param name="val" type="Number" integer="true">Duration in milliseconds</param>
		this._props[7] = val;
	},
	get_fadeOpenEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeOpenEquationType">Gets sets equation type of fade for open action as Number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type.</value>
		return this._props[1];
	},
	set_fadeOpenEquationType: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeOpenEquationType">Sets equation type of fade for open action as Number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type.</param>
		this._props[1] = val;
	},
	get_fadeCloseEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeCloseEquationType">Gets sets equation type of fade for close action as Number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type.</value>
		return this._props[6];
	},
	set_fadeCloseEquationType: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.fadeCloseEquationType">Sets equation type of fade for close action as Number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type.</param>
		this._props[6] = val;
	},
	get_slideOpenEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenEquationType">Gets sets equation type of slide for open action as Number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type.</value>
		return this._props[3];
	},
	set_slideOpenEquationType: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenEquationType">Sets equation type of slide for open action as Number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type.</param>
		this._props[3] = val;
	},
	get_slideCloseEquationType: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseEquationType">Gets sets equation type of slide for close action as Number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationEquationType">Equation type.</value>
		return this._props[8];
	},
	set_slideCloseEquationType: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseEquationType">Sets equation type of slide for close action as Number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationEquationType">Equation type.</param>
		this._props[8] = val;
	},
	get_slideOpenDirection: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenDirection">Gets sets direction of slide for open action as number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationSlideDirection">Direction type.</value>
		return this._props[4];
	},
	set_slideOpenDirection: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideOpenDirection">Sets direction of slide for open action as number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationSlideDirection">Direction type.</param>
		this._props[4] = val;
	},
	get_slideCloseDirection: function()
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseDirection">Gets sets direction of slide for close action as number.</summary>
		/// <value type="Infragistics.Web.UI.AnimationSlideDirection">Direction type.</value>
		return this._props[9];
	},
	set_slideCloseDirection: function(val)
	{
		/// <summary locid="P:J#Infragistics.Web.UI.SlideFadeAnimation.slideCloseDirection">Sets direction of slide for close action as number.</summary>
		/// <param name="val" type="Infragistics.Web.UI.AnimationSlideDirection">Direction type.</param>
		this._props[9] = val;
	},
	dispose: function()
	{
		/// <summary locid="M:J#Infragistics.Web.UI.SlideFadeAnimation.dispose">
		/// Deletes member objects.
		/// </summary>
		if (!this._props)
			return;
		delete this._props;
		if (this._fade)
			this._fade.dispose();
		if (this._slide)
			this._slide.dispose();
		delete this._fade;
		delete this._slide;
		$IG.SlideFadeAnimation.callBaseMethod(this, 'dispose');
	}
}
$IG.SlideFadeAnimation.registerClass('Infragistics.Web.UI.SlideFadeAnimation', Sys.Component);

/* enum for slide direction */
$IG.AnimationSlideDirection = function ()
{
	///<summary locid="T:J#Infragistics.Web.UI.AnimationSlideDirection">
	/// Direction used by SlideAnimation.
	/// It has 3 members: Vertical, Horizontal and Both. Their values are 1, 2, 3.
	///</summary> 
	///<field name="Vertical" type="Number" integer="true" static="true">Slide in vertical direction</field>
	///<field name="Horizontal" type="Number" integer="true" static="true">Slide in horizontal direction</field>
	///<field name="Both" type="Number" integer="true" static="true">Slide in vertical and horizontal directions</field>
}
$IG.AnimationSlideDirection.prototype = 
{
	Vertical: 1,
	Horizontal: 2,
	Both: 3
};
$IG.AnimationSlideDirection.registerEnum("Infragistics.Web.UI.AnimationSlideDirection");

/******************************************AnimationEquationType ENUM******************************/
$IG.AnimationEquationType = function ()
{
	///<summary locid="T:J#Infragistics.Web.UI.AnimationEquationType">
	/// The type of calculation that an animation will use to determine it's next position..
	///</summary> 
	///<field name="Linear" type="Number" integer="true" static="true">Linear action</field>
	///<field name="EaseIn" type="Number" integer="true" static="true">Ease-in action</field>
	///<field name="EaseOut" type="Number" integer="true" static="true">Ease-out action</field>
	///<field name="EaseInOut" type="Number" integer="true" static="true">Ease-in and ease-out actions</field>
	///<field name="Bounce" type="Number" integer="true" static="true">Bounce action</field>
}
$IG.AnimationEquationType.prototype = 
{
    Linear: 0,
    EaseIn:1,
    EaseOut:2,
    EaseInOut:3,
    Bounce: 4
};
$IG.AnimationEquationType.registerEnum("Infragistics.Web.UI.AnimationEquationType");
/******************************************END AnimationEquationType ENUM**************************/
