
(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      // Get the index to set active.
      var active_index = false;
      wrapper.find('.accordion-item').each(function(i) {
        if ($(this).hasClass('field-group-accordion-active')) {
          active_index = i;
        }
      });

      wrapper.accordion({
        heightStyle: "content",
        active: active_index,
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {

        var $firstErrorItem = false;

        // Add required fields mark to any element containing required fields
        wrapper.find('div.field-group-accordion-item').each(function(i) {

          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header a').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            // Save first error item, for focussing it.
            if (!$firstErrorItem) {
              $firstErrorItem = $(this).parent().accordion("activate" , i);
            }
            $('h3.ui-accordion-header').eq(i).addClass('error');
          }
        });

        // Save first error item, for focussing it.
        if (!$firstErrorItem) {
          $('.ui-accordion-content-active', $firstErrorItem).css({height: 'auto', width: 'auto', display: 'block'});
        }

      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {

      var errorFocussed = false;

      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          // Focus the first tab with error.
          if (!errorFocussed) {
            Drupal.FieldGroup.setGroupWithfocus($(this));
            $(this).data('verticalTab').focus();
            errorFocussed = true;
          }
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    settings.field_group = settings.field_group || Drupal.settings.field_group;
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');

    // Add a new ID to each fieldset.
    $('.group-wrapper .horizontal-tabs-panes > fieldset', context).once('group-wrapper-panes-processed', function() {
      // Tats bad, but we have to keep the actual id to prevent layouts to break.
      var fieldgroupID = 'field_group-' + $(this).attr('id');
      $(this).attr('id', fieldgroupID);
    });
    // Set the hash in url to remember last userselection.
    $('.group-wrapper ul li').once('group-wrapper-ul-processed', function() {
      var fieldGroupNavigationListIndex = $(this).index();
      $(this).children('a').click(function() {
        var fieldset = $('.group-wrapper fieldset').get(fieldGroupNavigationListIndex);
        // Grab the first id, holding the wanted hashurl.
        var hashUrl = $(fieldset).attr('id').replace(/^field_group-/, '').split(' ')[0];
        window.location.hash = hashUrl;
      });
    });

  }
};

})(jQuery);

;/*})'"*/
;/*})'"*/
(function ($) {
  Drupal.behaviors.timeago = {
    attach: function (context) {
      $.extend($.timeago.settings, Drupal.settings.timeago);
      $('abbr.timeago, span.timeago, time.timeago', context).timeago();
    }
  };
})(jQuery);

;/*})'"*/
;/*})'"*/
/* jQuery.fracs 0.15.0 - http://larsjung.de/jquery-fracs/ */
(function () {
'use strict';

// Some often used references.
var $ = jQuery;
var $window = $(window);
var $document = $(document);
var extend = $.extend;
var isFn = $.isFunction;
var mathMax = Math.max;
var mathMin = Math.min;
var mathRound = Math.round;

var getId = (function () {

        var ids = {};
        var nextId = 1;

        return function (element) {

            if (!element) {
                return 0;
            }
            if (!ids[element]) {
                ids[element] = nextId;
                nextId += 1;
            }
            return ids[element];
        };
    }());

function isTypeOf(obj, type) {

    return typeof obj === type;
}

function isInstanceOf(obj, type) {

    return obj instanceof type;
}

function isHTMLElement(obj) {

    return obj && obj.nodeType;
}

function getHTMLElement(obj) {

    return isHTMLElement(obj) ? obj : (isInstanceOf(obj, $) ? obj[0] : undefined);
}

function reduce(elements, fn, current) {

    $.each(elements, function (idx, element) {

        current = fn.call(element, current, idx, element);
    });
    return current;
}

function equal(obj1, obj2, props) {

    var i, l, prop;

    if (obj1 === obj2) {
        return true;
    }
    if (!obj1 || !obj2 || obj1.constructor !== obj2.constructor) {
        return false;
    }
    for (i = 0, l = props.length; i < l; i += 1) {
        prop = props[i];
        if (obj1[prop] && isFn(obj1[prop].equals) && !obj1[prop].equals(obj2[prop])) {
            return false;
        }
        if (obj1[prop] !== obj2[prop]) {
            return false;
        }
    }
    return true;
}




// Objects
// =======

// Rect
// ----
// Holds the position and dimensions of a rectangle. The position might be
// relative to document, viewport or element space.
function Rect(left, top, width, height) {

    // Top left corner of the rectangle rounded to integers.
    this.left = mathRound(left);
    this.top = mathRound(top);

    // Dimensions rounded to integers.
    this.width = mathRound(width);
    this.height = mathRound(height);

    // Bottom right corner of the rectangle.
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
}

// ### Prototype
extend(Rect.prototype, {

    // Checks if this instance equals `that` in position and dimensions.
    equals: function (that) {

        return equal(this, that, ['left', 'top', 'width', 'height']);
    },

    // Returns the area of this rectangle.
    area: function () {

        return this.width * this.height;
    },

    // Returns a new `Rect` representig this rect relative to `rect`.
    relativeTo: function (rect) {

        return new Rect(this.left - rect.left, this.top - rect.top, this.width, this.height);
    },

    // Returns a new rectangle representing the intersection of this
    // instance and `rect`. If there is no intersection the return value
    // is `null`.
    intersection: function (rect) {

        if (!isInstanceOf(rect, Rect)) {
            return null;
        }

        var left = mathMax(this.left, rect.left);
        var right = mathMin(this.right, rect.right);
        var top = mathMax(this.top, rect.top);
        var bottom = mathMin(this.bottom, rect.bottom);
        var width = right - left;
        var height = bottom - top;

        return (width >= 0 && height >= 0) ? new Rect(left, top, width, height) : null;
    },

    // Returns a new rectangle representing the smallest rectangle
    // containing this instance and `rect`.
    envelope: function (rect) {

        if (!isInstanceOf(rect, Rect)) {
            return this;
        }

        var left = mathMin(this.left, rect.left);
        var right = mathMax(this.right, rect.right);
        var top = mathMin(this.top, rect.top);
        var bottom = mathMax(this.bottom, rect.bottom);
        var width = right - left;
        var height = bottom - top;

        return new Rect(left, top, width, height);
    }
});

// ### Static methods
extend(Rect, {

    // Returns a new instance of `Rect` representing the content of the
    // specified element. Since the coordinates are in content space the
    // `left` and `top` values are always set to `0`. If `inDocSpace` is
    // `true` the rect gets returned in document space.
    ofContent: function (element, inContentSpace) {

        if (!element || element === document || element === window) {
            return new Rect(0, 0, $document.width(), $document.height());
        }

        if (inContentSpace) {
            return new Rect(0, 0, element.scrollWidth, element.scrollHeight);
        } else {
            return new Rect(element.offsetLeft - element.scrollLeft, element.offsetTop - element.scrollTop, element.scrollWidth, element.scrollHeight);
        }
    },

    // Returns a new instance of `Rect` representing the viewport of the
    // specified element. If `inDocSpace` is `true` the rect gets returned
    // in document space instead of content space.
    ofViewport: function (element, inContentSpace) {

        if (!element || element === document || element === window) {
            return new Rect($window.scrollLeft(), $window.scrollTop(), $window.width(), $window.height());
        }

        if (inContentSpace) {
            return new Rect(element.scrollLeft, element.scrollTop, element.clientWidth, element.clientHeight);
        } else {
            return new Rect(element.offsetLeft, element.offsetTop, element.clientWidth, element.clientHeight);
        }
    },

    // Returns a new instance of `Rect` representing a given
    // `HTMLElement`. The dimensions respect padding and border widths. If
    // the element is invisible (as determined by jQuery) the return value
    // is null.
    ofElement: function (element) {

        var $element = $(element);
        if (!$element.is(':visible')) {
            return null;
        }

        var offset = $element.offset();
        return new Rect(offset.left, offset.top, $element.outerWidth(), $element.outerHeight());
    }
});



// Fractions
// ---------
// The heart of the library. Creates and holds the
// fractions data for the two specified rects. `viewport` defaults to
// `Rect.ofViewport()`.
function Fractions(visible, viewport, possible, rects) {

    this.visible = visible || 0;
    this.viewport = viewport || 0;
    this.possible = possible || 0;
    this.rects = (rects && extend({}, rects)) || null;
}

// ### Prototype
extend(Fractions.prototype, {

    // Checks if this instance equals `that` in all attributes.
    equals: function (that) {

        return this.fracsEqual(that) && this.rectsEqual(that);
    },

    // Checks if this instance equals `that` in all fraction attributes.
    fracsEqual: function (that) {

        return equal(this, that, ['visible', 'viewport', 'possible']);
    },

    // Checks if this instance equals `that` in all rectangle attributes.
    rectsEqual: function (that) {

        return equal(this.rects, that.rects, ['document', 'element', 'viewport']);
    }
});

// ### Static methods
extend(Fractions, {

    of: function (rect, viewport) {

        var intersection, intersectionArea, possibleArea;

        rect = (isHTMLElement(rect) && Rect.ofElement(rect)) || rect;
        viewport = (isHTMLElement(viewport) && Rect.ofViewport(viewport)) || viewport || Rect.ofViewport();

        if (!(rect instanceof Rect)) {
            return new Fractions();
        }
        intersection = rect.intersection(viewport);
        if (!intersection) {
            return new Fractions();
        }

        intersectionArea = intersection.area();
        possibleArea = mathMin(rect.width, viewport.width) * mathMin(rect.height, viewport.height);
        return new Fractions(
            intersectionArea / rect.area(),
            intersectionArea / viewport.area(),
            intersectionArea / possibleArea,
            {
                document: intersection,
                element: intersection.relativeTo(rect),
                viewport: intersection.relativeTo(viewport)
            }
        );
    }
});



// Group
// -----
function Group(elements, viewport) {

    this.els = elements;
    this.viewport = viewport;
}

// ### Helpers

// Accepted values for `property` parameters below.
var rectProps = ['width', 'height', 'left', 'right', 'top', 'bottom'];
var fracsProps = ['possible', 'visible', 'viewport'];

// Returns the specified `property` for `HTMLElement element` or `0`
// if `property` is invalid.
function getValue(element, viewport, property) {

    var obj;

    if ($.inArray(property, rectProps) >= 0) {
        obj = Rect.ofElement(element);
    } else if ($.inArray(property, fracsProps) >= 0) {
        obj = Fractions.of(element, viewport);
    }
    return obj ? obj[property] : 0;
}

// Sorting functions.
function sortAscending(entry1, entry2) {

    return entry1.val - entry2.val;
}

function sortDescending(entry1, entry2) {

    return entry2.val - entry1.val;
}

// ### Prototype
extend(Group.prototype, {

    // Returns a sorted list of objects `{el: HTMLElement, val: Number}`
    // for the specified `property`. `descending` defaults to `false`.
    sorted: function (property, descending) {

        var viewport = this.viewport;

        return $.map(this.els, function (element) {

                    return {
                        el: element,
                        val: getValue(element, viewport, property)
                    };
                })
                .sort(descending ? sortDescending : sortAscending);
    },

    // Returns the first element of the sorted list returned by `sorted` above,
    // or `null` if this list is empty.
    best: function (property, descending) {

        return this.els.length ? this.sorted(property, descending)[0] : null;
    }
});



// ScrollState
// -----------
function ScrollState(element) {

    var content = Rect.ofContent(element, true);
    var viewport = Rect.ofViewport(element, true);
    var w = content.width - viewport.width;
    var h = content.height - viewport.height;

    this.content = content;
    this.viewport = viewport;
    this.width = w <= 0 ? null : viewport.left / w;
    this.height = h <= 0 ? null : viewport.top / h;
    this.left = viewport.left;
    this.top = viewport.top;
    this.right = content.right - viewport.right;
    this.bottom = content.bottom - viewport.bottom;
}

// ### Prototype
extend(ScrollState.prototype, {

    // Checks if this instance equals `that`.
    equals: function (that) {

        return equal(this, that, ['width', 'height', 'left', 'top', 'right', 'bottom', 'content', 'viewport']);
    }
});



// Viewport
// --------
function Viewport(element) {

    this.el = element || window;
}

// ### Prototype
extend(Viewport.prototype, {

    // Checks if this instance equals `that`.
    equals: function (that) {

        return equal(this, that, ['el']);
    },

    scrollState: function () {

        return new ScrollState(this.el);
    },

    scrollTo: function (left, top, duration) {

        var $el = this.el === window ? $('html,body') : $(this.el);

        left = left || 0;
        top = top || 0;
        duration = isNaN(duration) ? 1000 : duration;

        $el.stop(true).animate({scrollLeft: left, scrollTop: top}, duration);
    },

    scroll: function (left, top, duration) {

        var $el = this.el === window ? $window : $(this.el);

        left = left || 0;
        top = top || 0;

        this.scrollTo($el.scrollLeft() + left, $el.scrollTop() + top, duration);
    },

    scrollToRect: function (rect, paddingLeft, paddingTop, duration) {

        paddingLeft = paddingLeft || 0;
        paddingTop = paddingTop || 0;

        this.scrollTo(rect.left - paddingLeft, rect.top - paddingTop, duration);
    },

    scrollToElement: function (element, paddingLeft, paddingTop, duration) {

        var rect = Rect.ofElement(element).relativeTo(Rect.ofContent(this.el));

        this.scrollToRect(rect, paddingLeft, paddingTop, duration);
    }
});





// Callbacks
// =========

// callbacks mix-in
// ----------------
// Expects `context: HTMLElement` and `updatedValue: function`.
var callbacksMixIn = {

    // Initial setup.
    init: function () {

        this.callbacks = $.Callbacks('memory unique');
        this.currVal = null;
        this.prevVal = null;

        // A proxy to make `check` bindable to events.
        this.checkProxy = $.proxy(this.check, this);

        this.autoCheck();
    },

    // Adds a new callback function.
    bind: function (callback) {

        this.callbacks.add(callback);
    },

    // Removes a previously added callback function.
    unbind: function (callback) {

        if (callback) {
            this.callbacks.remove(callback);
        } else {
            this.callbacks.empty();
        }
    },

    // Triggers all callbacks with the current values.
    trigger: function () {

        this.callbacks.fireWith(this.context, [this.currVal, this.prevVal]);
    },

    // Checks if value changed, updates attributes `currVal` and
    // `prevVal` accordingly and triggers the callbacks. Returns
    // `true` if value changed, otherwise `false`.
    check: function (event) {

        var value = this.updatedValue(event);

        if (value === undefined) {
            return false;
        }

        this.prevVal = this.currVal;
        this.currVal = value;
        this.trigger();
        return true;
    },

    // Auto-check configuration.
    $autoTarget: $window,
    autoEvents: 'load resize scroll',

    // Enables/disables automated checking for changes on the specified `window`
    // events.
    autoCheck: function (on) {

        this.$autoTarget[on === false ? 'off' : 'on'](this.autoEvents, this.checkProxy);
    }
};



// FracsCallbacks
// --------------
function FracsCallbacks(element, viewport) {

    this.context = element;
    this.viewport = viewport;
    this.init();
}

// ### Prototype
extend(FracsCallbacks.prototype, callbacksMixIn, {
    updatedValue: function () {

        var value = Fractions.of(this.context, this.viewport);

        if (!this.currVal || !this.currVal.equals(value)) {
            return value;
        }
    }
});



// GroupCallbacks
// --------------
function GroupCallbacks(elements, viewport, property, descending) {

    this.context = new Group(elements, viewport);
    this.property = property;
    this.descending = descending;
    this.init();
}

// ### Prototype
extend(GroupCallbacks.prototype, callbacksMixIn, {
    updatedValue: function () {

        var best = this.context.best(this.property, this.descending);

        if (best) {
            best = best.val > 0 ? best.el : null;
            if (this.currVal !== best) {
                return best;
            }
        }
    }
});



// ScrollStateCallbacks
// --------------------
function ScrollStateCallbacks(element) {

    if (!element || element === window || element === document) {
        this.context = window;
    } else {
        this.context = element;
        this.$autoTarget = $(element);
    }
    this.init();
}

// ### Prototype
extend(ScrollStateCallbacks.prototype, callbacksMixIn, {
    updatedValue: function () {

        var value = new ScrollState(this.context);

        if (!this.currVal || !this.currVal.equals(value)) {
            return value;
        }
    }
});



/* modplug 1.4.1 - http://larsjung.de/modplug/ */
// This function is ment to be copied into your plugin file as a local
// variable.
//
// `modplug` expects a string `namespace` and a configuration object
// `options`.
//
//      options = {
//          statics: hash of functions,
//          methods: hash of functions,
//          defaultStatic: String/function,
//          defaultMethod: String/function
//      }
//
// For more details see <http://larsjung.de/modplug>.
var modplug = function (namespace, options) {
    'use strict';

        // Some references to enhance minification.
    var slice = [].slice,
        $ = jQuery,
        extend = $.extend,
        isFn = $.isFunction,

        // Save the initial settings.
        settings = extend({}, options),

        // Helper function to apply default methods.
        applyMethod = function (obj, args, methodName, methods) {

            // If `methodName` is a function apply it to get the actual
            // method name.
            methodName = isFn(methodName) ? methodName.apply(obj, args) : methodName;

            // If method exists then apply it and return the result ...
            if (isFn(methods[methodName])) {
                return methods[methodName].apply(obj, args);
            }

            // ... otherwise raise an error.
            $.error('Method "' + methodName + '" does not exist on jQuery.' + namespace);
        },

        // This function gets exposed as `$.<namespace>`.
        statics = function () {

            // Try to apply a default method.
            return applyMethod(this, slice.call(arguments), settings.defaultStatic, statics);
        },

        // This function gets exposed as `$(selector).<namespace>`.
        methods = function (method) {

            // If `method` exists then apply it ...
            if (isFn(methods[method])) {
                return methods[method].apply(this, slice.call(arguments, 1));
            }

            // ... otherwise try to apply a default method.
            return applyMethod(this, slice.call(arguments), settings.defaultMethod, methods);
        },

        // Adds/overwrites plugin methods. This function gets exposed as
        // `$.<namespace>.modplug` to make the plugin extendable.
        plug = function (options) {

            if (options) {
                extend(statics, options.statics);
                extend(methods, options.methods);
            }

            // Make sure that `$.<namespace>.modplug` points to this function
            // after adding new methods.
            statics.modplug = plug;
        };

    // Save objects or methods previously registered to the desired namespace.
    // They are available via `$.<namespace>.modplug.prev`.
    plug.prev = {
        statics: $[namespace],
        methods: $.fn[namespace]
    };

    // Init the plugin by adding the specified statics and methods.
    plug(options);

    // Register the plugin.
    $[namespace] = statics;
    $.fn[namespace] = methods;
};



// Register the plug-in
// ====================

// The namespace used to register the plug-in and to attach data to
// elements.
var namespace = 'fracs';

// The methods are sorted in alphabetical order. All methods that do not
// provide a return value will return `this` to enable method chaining.
modplug(namespace, {

    // Static methods
    // --------------
    // These methods are accessible via `$.fracs.<methodname>`.
    statics: {

        // Build version.
        version: '0.15.0',

        // Publish object constructors (for testing).
        Rect: Rect,
        Fractions: Fractions,
        Group: Group,
        ScrollState: ScrollState,
        Viewport: Viewport,
        FracsCallbacks: FracsCallbacks,
        GroupCallbacks: GroupCallbacks,
        ScrollStateCallbacks: ScrollStateCallbacks,

        // ### fracs
        // This is the **default method**. So instead of calling
        // `$.fracs.fracs(...)` simply call `$.fracs(...)`.
        //
        // Returns the fractions for a given `Rect` and `viewport`,
        // viewport defaults to `$.fracs.viewport()`.
        //
        //      $.fracs(rect: Rect, [viewport: Rect]): Fractions
        fracs: function (rect, viewport) {

            return Fractions.of(rect, viewport);
        }
    },

    // Instance methods
    // ----------------
    // These methods are accessible via `$(selector).fracs('<methodname>', ...)`.
    methods: {

        // ### 'content'
        // Returns the content rect of the first selected element in content space.
        // If no element is selected it returns the document rect.
        //
        //      .fracs('content'): Rect
        content: function (inContentSpace) {

            return this.length ? Rect.ofContent(this[0], inContentSpace) : null;
        },

        // ### 'envelope'
        // Returns the smallest rectangle that containes all selected elements.
        //
        //      .fracs('envelope'): Rect
        envelope: function () {

            return reduce(this, function (current) {

                var rect = Rect.ofElement(this);
                return current ? current.envelope(rect) : rect;
            });
        },

        // ### 'fracs'
        // This is the **default method**. So the first parameter `'fracs'`
        // can be omitted.
        //
        // Returns the fractions for the first selected element.
        //
        //      .fracs(): Fractions
        //
        // Binds a callback function that will be invoked if fractions have changed
        // after a `window resize` or `window scroll` event.
        //
        //      .fracs(callback(fracs: Fractions, prevFracs: Fractions)): jQuery
        //
        // Unbinds the specified callback function.
        //
        //      .fracs('unbind', callback): jQuery
        //
        // Unbinds all callback functions.
        //
        //      .fracs('unbind'): jQuery
        //
        // Checks if fractions changed and if so invokes all bound callback functions.
        //
        //      .fracs('check'): jQuery
        fracs: function (action, callback, viewport) {

            if (!isTypeOf(action, 'string')) {
                viewport = callback;
                callback = action;
                action = null;
            }
            if (!isFn(callback)) {
                viewport = callback;
                callback = null;
            }
            viewport = getHTMLElement(viewport);

            var ns = namespace + '.fracs.' + getId(viewport);

            if (action === 'unbind') {
                return this.each(function () {

                    var cbs = $(this).data(ns);

                    if (cbs) {
                        cbs.unbind(callback);
                    }
                });
            } else if (action === 'check') {
                return this.each(function () {

                    var cbs = $(this).data(ns);

                    if (cbs) {
                        cbs.check();
                    }
                });
            } else if (isFn(callback)) {
                return this.each(function () {

                    var $this = $(this),
                        cbs = $this.data(ns);

                    if (!cbs) {
                        cbs = new FracsCallbacks(this, viewport);
                        $this.data(ns, cbs);
                    }
                    cbs.bind(callback);
                });
            }

            return this.length ? Fractions.of(this[0], viewport) : null;
        },

        // ### 'intersection'
        // Returns the greatest rectangle that is contained in all selected elements.
        //
        //      .fracs('intersection'): Rect
        intersection: function () {

            return reduce(this, function (current) {

                var rect = Rect.ofElement(this);
                return current ? current.intersection(rect) : rect;
            });
        },

        // ### 'max'
        // Reduces the set of selected elements to those with the maximum value
        // of the specified property.
        // Valid values for property are `possible`, `visible`, `viewport`,
        // `width`, `height`, `left`, `right`, `top`, `bottom`.
        //
        //      .fracs('max', property: String): jQuery
        //
        // Binds a callback function to the set of selected elements that gets
        // triggert whenever the element with the highest value of the specified
        // property changes.
        //
        //      .fracs('max', property: String, callback(best: Element, prevBest: Element)): jQuery
        max: function (property, callback, viewport) {

            if (!isFn(callback)) {
                viewport = callback;
                callback = null;
            }
            viewport = getHTMLElement(viewport);

            if (callback) {
                new GroupCallbacks(this, viewport, property, true).bind(callback);
                return this;
            }

            return this.pushStack(new Group(this, viewport).best(property, true).el);
        },

        // ### 'min'
        // Reduces the set of selected elements to those with the minimum value
        // of the specified property.
        // Valid values for property are `possible`, `visible`, `viewport`,
        // `width`, `height`, `left`, `right`, `top`, `bottom`.
        //
        //      .fracs('min', property: String): jQuery
        //
        // Binds a callback function to the set of selected elements that gets
        // triggert whenever the element with the lowest value of the specified
        // property changes.
        //
        //      .fracs('min', property: String, callback(best: Element, prevBest: Element)): jQuery
        min: function (property, callback, viewport) {

            if (!isFn(callback)) {
                viewport = callback;
                callback = null;
            }
            viewport = getHTMLElement(viewport);

            if (callback) {
                new GroupCallbacks(this, viewport, property).bind(callback);
                return this;
            }

            return this.pushStack(new Group(this, viewport).best(property).el);
        },

        // ### 'rect'
        // Returns the dimensions for the first selected element in document space.
        //
        //      .fracs('rect'): Rect
        rect: function () {

            return this.length ? Rect.ofElement(this[0]) : null;
        },

        // ### 'scrollState'
        // Returns the current scroll state for the first selected element.
        //
        //      .fracs('scrollState'): ScrollState
        //
        // Binds a callback function that will be invoked if scroll state has changed
        // after a `resize` or `scroll` event.
        //
        //      .fracs('scrollState', callback(scrollState: scrollState, prevScrollState: scrollState)): jQuery
        //
        // Unbinds the specified callback function.
        //
        //      .fracs('scrollState', 'unbind', callback): jQuery
        //
        // Unbinds all callback functions.
        //
        //      .fracs('scrollState', 'unbind'): jQuery
        //
        // Checks if scroll state changed and if so invokes all bound callback functions.
        //
        //      .fracs('scrollState', 'check'): jQuery
        scrollState: function (action, callback) {

            var ns = namespace + '.scrollState';

            if (!isTypeOf(action, 'string')) {
                callback = action;
                action = null;
            }

            if (action === 'unbind') {
                return this.each(function () {

                    var cbs = $(this).data(ns);

                    if (cbs) {
                        cbs.unbind(callback);
                    }
                });
            } else if (action === 'check') {
                return this.each(function () {

                    var cbs = $(this).data(ns);

                    if (cbs) {
                        cbs.check();
                    }
                });
            } else if (isFn(callback)) {
                return this.each(function () {

                    var $this = $(this),
                        cbs = $this.data(ns);

                    if (!cbs) {
                        cbs = new ScrollStateCallbacks(this);
                        $this.data(ns, cbs);
                    }
                    cbs.bind(callback);
                });
            }

            return this.length ? new ScrollState(this[0]) : null;
        },

        // ### 'scroll'
        // Scrolls the selected elements relative to its current position,
        // `padding` defaults to `0`, `duration` to `1000`.
        //
        //      .fracs('scroll', element: HTMLElement/jQuery, [paddingLeft: int,] [paddingTop: int,] [duration: int]): jQuery
        scroll: function (left, top, duration) {

            return this.each(function () {

                new Viewport(this).scroll(left, top, duration);
            });
        },

        // ### 'scrollTo'
        // Scrolls the selected elements to the specified element or an absolute position,
        // `padding` defaults to `0`, `duration` to `1000`.
        //
        //      .fracs('scrollTo', element: HTMLElement/jQuery, [paddingLeft: int,] [paddingTop: int,] [duration: int]): jQuery
        //      .fracs('scrollTo', [left: int,] [top: int,] [duration: int]): jQuery
        scrollTo: function (element, paddingLeft, paddingTop, duration) {

            if ($.isNumeric(element)) {
                duration = paddingTop;
                paddingTop = paddingLeft;
                paddingLeft = element;
                element = null;
            }

            element = getHTMLElement(element);

            return this.each(function () {

                if (element) {
                    new Viewport(this).scrollToElement(element, paddingLeft, paddingTop, duration);
                } else {
                    new Viewport(this).scrollTo(paddingLeft, paddingTop, duration);
                }
            });
        },

        // ### 'scrollToThis'
        // Scrolls the viewport (window) to the first selected element in the specified time,
        // `padding` defaults to `0`, `duration` to `1000`.
        //
        //      .fracs('scrollToThis', [paddingLeft: int,] [paddingTop: int,] [duration: int,] [viewport: HTMLElement/jQuery]): jQuery
        scrollToThis: function (paddingLeft, paddingTop, duration, viewport) {

            viewport = new Viewport(getHTMLElement(viewport));

            viewport.scrollToElement(this[0], paddingLeft, paddingTop, duration);
            return this;
        },

        // ### 'softLink'
        // Converts all selected page intern links `<a href="#...">` into soft links.
        // Uses `scrollTo` to scroll to the location.
        //
        //      .fracs('softLink', [paddingLeft: int,] [paddingTop: int,] [duration: int,] [viewport: HTMLElement/jQuery]): jQuery
        softLink: function (paddingLeft, paddingTop, duration, viewport) {

            viewport = new Viewport(getHTMLElement(viewport));

            return this.filter('a[href^=#]').each(function () {
                var $a = $(this);
                $a.on('click', function () {
                    viewport.scrollToElement($($a.attr('href'))[0], paddingLeft, paddingTop, duration);
                });
            });
        },

        // ### 'sort'
        // Sorts the set of selected elements by the specified property.
        // Valid values for property are `possible`, `visible`, `viewport`,
        // `width`, `height`, `left`, `right`, `top`, `bottom`. The default
        // sort order is descending.
        //
        //      .fracs('sort', property: String, [ascending: boolean]): jQuery
        sort: function (property, ascending, viewport) {

            if (!isTypeOf(ascending, 'boolean')) {
                viewport = ascending;
                ascending = null;
            }
            viewport = getHTMLElement(viewport);

            return this.pushStack($.map(new Group(this, viewport).sorted(property, !ascending), function (entry) {
                return entry.el;
            }));
        },

        // ### 'viewport'
        // Returns the current viewport of the first selected element in content space.
        // If no element is selected it returns the document's viewport.
        //
        //      .fracs('viewport'): Rect
        viewport: function (inContentSpace) {

            return this.length ? Rect.ofViewport(this[0], inContentSpace) : null;
        }
    },

    // Defaults
    // --------
    defaultStatic: 'fracs',
    defaultMethod: 'fracs'
});

}());

;/*})'"*/
;/*})'"*/
(function ($) {
  $(document).ready(function () {
    function callback(fracs, previousFracs) {

      var player_div = $(this).attr('id');
      var index = undefined;
      window.ooyalaplayers.forEach(
        function(element, key) {
          if(element.getElementId() == player_div) {
            index = key;
          }
        }
      , player_div, index);

      /*if(fracs.visible > 0.5) {
        if(window.ooyalaplayers[index].getState() == "paused" ||
            window.ooyalaplayers[index].getState() == "ready") {
          window.ooyalaplayers[index].play();
        }
      }*/
      else {
        if(window.ooyalaplayers[index].getState() == "playing" ||
                window.ooyalaplayers[index].getState() == "buffering") {
          window.ooyalaplayers[index].pause();
        }
      }
    };
    $(".ooyala-player").each(function() {
      $(this).children("div").fracs(callback);
    });
  });
})(jQuery);
;/*})'"*/
;/*})'"*/
/**
 * @file
 * Handles AJAX fetching of views, including filter submission and response.
 */
(function ($) {

/**
 * Attaches the AJAX behavior to Views exposed filter forms and key View links.
 */
Drupal.behaviors.ViewsAjaxView = {};
Drupal.behaviors.ViewsAjaxView.attach = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      Drupal.views.instances[i] = new Drupal.views.ajaxView(settings);
    });
  }
};

Drupal.views = {};
Drupal.views.instances = {};

/**
 * Javascript object for a certain view.
 */
Drupal.views.ajaxView = function(settings) {
  var selector = '.view-dom-id-' + settings.view_dom_id;
  this.$view = $(selector);

  // Retrieve the path to use for views' ajax.
  var ajax_path = Drupal.settings.views.ajax_path;

  // If there are multiple views this might've ended up showing up multiple times.
  if (ajax_path.constructor.toString().indexOf("Array") != -1) {
    ajax_path = ajax_path[0];
  }

  // Check if there are any GET parameters to send to views.
  var queryString = window.location.search || '';
  if (queryString !== '') {
    // Remove the question mark and Drupal path component if any.
    var queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
    if (queryString !== '') {
      // If there is a '?' in ajax_path, clean url are on and & should be used to add parameters.
      queryString = ((/\?/.test(ajax_path)) ? '&' : '?') + queryString;
    }
  }

  this.element_settings = {
    url: ajax_path + queryString,
    submit: settings,
    setClick: true,
    event: 'click',
    selector: selector,
    progress: { type: 'throbber' }
  };

  this.settings = settings;

  // Add the ajax to exposed forms.
  this.$exposed_form = $('#views-exposed-form-'+ settings.view_name.replace(/_/g, '-') + '-' + settings.view_display_id.replace(/_/g, '-'));
  this.$exposed_form.once(jQuery.proxy(this.attachExposedFormAjax, this));

  // Store Drupal.ajax objects here for all pager links.
  this.links = [];

  // Add the ajax to pagers.
  this.$view
    // Don't attach to nested views. Doing so would attach multiple behaviors
    // to a given element.
    .filter(jQuery.proxy(this.filterNestedViews, this))
    .once(jQuery.proxy(this.attachPagerAjax, this));

  // Add a trigger to update this view specifically. In order to trigger a
  // refresh use the following code.
  //
  // @code
  // jQuery('.view-name').trigger('RefreshView');
  // @endcode
  // Add a trigger to update this view specifically.
  var self_settings = this.element_settings;
  self_settings.event = 'RefreshView';
  this.refreshViewAjax = new Drupal.ajax(this.selector, this.$view, self_settings);
};

Drupal.views.ajaxView.prototype.attachExposedFormAjax = function() {
  var button = $('input[type=submit], button[type=submit], input[type=image]', this.$exposed_form);
  button = button[0];

  this.exposedFormAjax = new Drupal.ajax($(button).attr('id'), button, this.element_settings);
};

Drupal.views.ajaxView.prototype.filterNestedViews= function() {
  // If there is at least one parent with a view class, this view
  // is nested (e.g., an attachment). Bail.
  return !this.$view.parents('.view').size();
};

/**
 * Attach the ajax behavior to each link.
 */
Drupal.views.ajaxView.prototype.attachPagerAjax = function() {
  this.$view.find('ul.pager > li > a, th.views-field a, .attachment .views-summary a')
  .each(jQuery.proxy(this.attachPagerLinkAjax, this));
};

/**
 * Attach the ajax behavior to a singe link.
 */
Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function(id, link) {
  var $link = $(link);
  var viewData = {};
  var href = $link.attr('href');
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    this.settings,
    Drupal.Views.parseQueryString(href),
    // Extract argument data from the URL.
    Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
  );

  // For anchor tags, these will go to the target of the anchor rather
  // than the usual location.
  $.extend(viewData, Drupal.Views.parseViewArgs(href, this.settings.view_base_path));

  this.element_settings.submit = viewData;
  this.pagerAjax = new Drupal.ajax(false, $link, this.element_settings);
  this.links.push(this.pagerAjax);
};

Drupal.ajax.prototype.commands.viewsScrollTop = function (ajax, response, status) {
  // Scroll to the top of the view. This will allow users
  // to browse newly loaded content after e.g. clicking a pager
  // link.
  var offset = $(response.selector).offset();
  // We can't guarantee that the scrollable object should be
  // the body, as the view could be embedded in something
  // more complex such as a modal popup. Recurse up the DOM
  // and scroll the first element that has a non-zero top.
  var scrollTarget = response.selector;
  while ($(scrollTarget).scrollTop() == 0 && $(scrollTarget).parent()) {
    scrollTarget = $(scrollTarget).parent();
  }
  // Only scroll upward
  if (offset.top - 10 < $(scrollTarget).scrollTop()) {
    $(scrollTarget).animate({scrollTop: (offset.top - 10)}, 500);
  }
};

})(jQuery);

;/*})'"*/
;/*})'"*/
/**
 * @file
 * Simple responsification of menus.
 */
(function ($) {
  /**
   * Handle clicks & toggling the menu.
   */
  var toggler_click = function() {
    $(this).parent().toggleClass('responsive-toggled');
  };
  /**
   * Unbind other mouse events on the menu items.
   *
   * @todo
   *   Not sure if it works 100%.
   *   Doesn't restore binds when out-of-responsive (if window dragging).
   */
  function remove_mouse_events(menuElement) {
    // Determine jQuery version and what disable options we have.
    var jqVersion = $.fn.jquery;
    if (jqVersion < 1.7) {
      $(menuElement).die('mouseover mouseout mouseenter mouseleave');
      $(menuElement + ' li').die('mouseover mouseout mouseenter mouseleave');
      $(menuElement + ' li a').die('mouseover mouseout mouseenter mouseleave');
    }
    else {
      $(menuElement).off('hover');
      $(menuElement + ' li').off('hover');
      $(menuElement + ' li a').off('hover');
    }
    $(menuElement).unbind('mouseover mouseout mouseenter mouseleave');
    $(menuElement + ' li').unbind('mouseover mouseout mouseenter mouseleave');
    $(menuElement + ' li a').unbind('mouseover mouseout mouseenter mouseleave');
  }

  /**
   * Store classes & IDs for restoring later (if window dragging).
   */
  function store_classes_ids(menuElement) {
    if (!$(menuElement).attr('id')) {
      $(menuElement).attr('id', 'rm-no-id-main');
    }
    if (!$(menuElement).attr('class')) {
      $(menuElement).attr('class', 'rm-no-class');
    }
    $(menuElement).data('removeattr', true)
      .data('rmids', $(menuElement).attr('id'))
      .data('rmclasses', $(menuElement).attr('class'));
    // Handle ULs if selector is parent div.
    var incr = 0;
    $(menuElement).find('ul').each(function() {
      incr++;
      // Prevent error if there is no id.
      if (!$(this).attr('id')) {
        $(this).attr('id', 'rm-no-id-' + incr);
      }
      // Prevent error if there is no class.
      if (!$(this).attr('class')) {
        $(this).attr('class', 'rm-no-class');
      }
      $(this).data('removeattr', true)
        .data('rmids', $(this).attr('id'))
        .data('rmclasses', $(this).attr('class'));
    });
    // Finally, add our class to the parent.
    $(menuElement).addClass('responsive-menus-simple');
  }

  /**
   * Remove classes & IDs from original menu for easier theming.
   */
  function remove_classes_ids(menuElement) {
    // Handle ULs if selector is parent div.
    $(menuElement).find('ul').each(function() {
      $(this).attr('class', 'rm-removed').attr('id', 'rm-removed');
    });
    // Remove classes/IDs.
    $(menuElement).attr('class', 'responsive-menus-simple').attr('id', 'rm-removed');
  }

  // Iterate through selectors, check window sizes, add some classes.
  Drupal.behaviors.responsive_menus = {
    attach: function (context, settings) {
      settings.responsive_menus = settings.responsive_menus || {};
      $('body').once('responsive-menus-load', function() {
        // Only doing this themes that don't include a viewport attribute.
        // e.g. Bartik for testing out-of-the-box... yeah, stupid.
        if (!$('meta[name=viewport]').length > 0) {
          $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }
        // Window width with legacy browsers.
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        $.each(settings.responsive_menus, function(ind, iteration) {
          if (iteration.responsive_menus_style != 'responsive_menus_simple') {
            return true;
          }
          if (!iteration.selectors.length) {
            return true;
          }
          var $media_unit = iteration.media_unit || 'px';
          if ($media_unit === 'em') {
            var $base_font_size = parseFloat($('body').css('font-size'));
            var $media_size = iteration.media_size * $base_font_size || 768;
          }
          else {
            var $media_size = iteration.media_size || 768;
          }

          // Handle clicks & toggling.
          var toggler_class = '';
          var toggler_text = iteration.toggler_text;
          // Iterate through our selectors.
          $.each(iteration.selectors, function(index, value) {
            // Stop if there is no menu element.
            if ($(value).length < 1) {
              return true;
            }
            // Handle nested menus.  Make sure we get the first, but not children.
            if ($(value).length > 1) {
              $(value).each(function(val_index) {
                if (!$(this).parents('ul').length) {
                  if (!$(this).hasClass('responsive-menus-simple')) {
                    toggler_class = 'responsive-menus-' + ind + '-' + index + '-' + val_index;
                    // Store classes & IDs before removing.
                    if (iteration.remove_attributes) {
                      store_classes_ids(this);
                    }
                    $(this).wrap('<div data-mediasize="' + $media_size + '" class="responsive-menus ' + toggler_class + '" />');
                    $('.' + toggler_class).prepend('<span class="toggler">' + toggler_text + '</span>');
                    $('.' + toggler_class + ' .toggler').bind('click', toggler_click);
                    // Unbind other mouse events.
                    if (iteration.disable_mouse_events) {
                      //$(this).data('disablemouse', true);
                      remove_mouse_events(this);
                    }
                    // Use absolute positioning.
                    if (iteration.absolute) {
                      $('.' + toggler_class).addClass('absolute');
                    }
                    // Handle first size check.
                    if (windowWidth <= $media_size) {
                      // Remove attributes setting.
                      if (iteration.remove_attributes) {
                        remove_classes_ids(this);
                      }
                      $('.' + toggler_class).addClass('responsified');
                    }
                  }
                }
              });
            }
            else {
              // Single level menus.
              if (!$(value).hasClass('responsive-menus-simple')) {
                toggler_class = 'responsive-menus-' + ind + '-' + index;
                // Store classes & IDs before removing.
                if (iteration.remove_attributes) {
                  store_classes_ids(value);
                }
                $(value).wrap('<div data-mediasize="' + $media_size + '" class="responsive-menus ' + toggler_class + '" />');
                $('.' + toggler_class).prepend('<span class="toggler">' + toggler_text + '</span>');
                $('.' + toggler_class + ' .toggler').bind('click', toggler_click);
                // Unbind other mouse events.
                if (iteration.disable_mouse_events) {
                  // @todo For rebinding mouse events.
                  /*if ($(value + ' li a').data('events')) {
                    $(value).data('tmpevents', $(value + ' li a').data('events'));
                  }*/
                  remove_mouse_events(value);
                }
                // Use absolute positioning.
                if (iteration.absolute) {
                  $('.' + toggler_class).addClass('absolute');
                }
                // Handle first size check.
                if (windowWidth <= $media_size) {
                  // Remove attributes setting.
                  if (iteration.remove_attributes) {
                    remove_classes_ids(value);
                  }
                  $('.' + toggler_class).addClass('responsified');
                }
              }
            }
          });
       });
        // Handle window resizing.
        $(window).resize(function() {
          // Window width with legacy browsers.
          windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          $('.responsive-menus').each(function(menuIndex, menuValue) {
            var mediasize = $(this).data('mediasize') || 768;
            // Prevent menu from going off the screen.  This only happens in
            // non-responsive themes (like Bartik default), but it looks bad.
            if ($(this).width() > windowWidth) {
              $(this).data('nonresponsive', true);
              $(this).width(windowWidth);
            }
            var menuElement = $(this).find('.responsive-menus-simple');
            if (windowWidth >= mediasize) {
              if (menuElement.data('removeattr')) {
                menuElement.addClass(menuElement.data('rmclasses'));
                menuElement.attr('id', menuElement.data('rmids'));
                menuElement.find('ul').each(function() {
                  $(this).addClass($(this).data('rmclasses'));
                  $(this).attr('id', $(this).data('rmids'));
                });
              }
              $(this).removeClass('responsified');
            }
            if (windowWidth <= mediasize) {
              // Now fix repercussions for handling non-responsive themes above.
              // Stretch width back out w/ the screen.
              if ($(this).data('nonresponsive') && $(this).width() < windowWidth) {
                $(this).width(windowWidth);
              }
              if (menuElement.data('removeattr')) {
                remove_classes_ids(menuElement);
              }
              $(this).addClass('responsified');
            }
          });
        });
      });
    }
  };

}(jQuery));

;/*})'"*/
;/*})'"*/
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox') && (Drupal.settings.googleanalytics.trackColorbox)) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Downloads",
            "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
            "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", {
            "hitType": "pageview",
            "page": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Mails",
            "eventAction": "Click",
            "eventLabel": this.href.substring(7),
            "transport": "beacon"
          });
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode !== 2 || (Drupal.settings.googleanalytics.trackDomainMode === 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Outbound links",
              "eventAction": "Click",
              "eventLabel": this.href,
              "transport": "beacon"
            });
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga("send", {
        "hitType": "pageview",
        "page": location.pathname + location.search + location.hash
      });
    };
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  if (Drupal.settings.googleanalytics.trackColorbox) {
    $(document).bind("cbox_complete", function () {
      var href = $.colorbox.element().attr("href");
      if (href) {
        ga("send", {
          "hitType": "pageview",
          "page": Drupal.googleanalytics.getPageUrl(href)
        });
      }
    });
  }

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);

;/*})'"*/
;/*})'"*/