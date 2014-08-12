//


/**
 * @fileoverview Provides the set of classes
 * for ease of use transition based animations.
 */


goog.provide('fiahfy.mod.animation.Animation');
goog.provide('fiahfy.mod.animation.AnimationTimer');
goog.provide('fiahfy.mod.animation.Timeline');

goog.require('fiahfy.mod.Object');
goog.require('fiahfy.mod.time.Duration');


/**
 * @param {number=} targetFramerate The custom target frame rate
 *     for this Animation.
 * @constructor
 * @extends {fiahfy.mod.Object}
 */
fiahfy.mod.animation.Animation = function(targetFramerate) {
    fiahfy.mod.Object.call(this);
};
goog.inherits(fiahfy.mod.animation.Animation, fiahfy.mod.Object);


/**
 * @param {...fiahfy.mod.animation.KeyFrame} var_args The keyframes
 *     of this Timeline.
 * @constructor
 * @extends {fiahfy.mod.animation.Animation}
 */
fiahfy.mod.animation.Timeline = function(var_args) {
    fiahfy.mod.animation.Animation.call(this);
};
goog.inherits(fiahfy.mod.animation.Timeline, fiahfy.mod.animation.Animation);


/**
 * @param {fiahfy.mod.time.Duration} duration The time.
 * @constructor
 * @extends {fiahfy.mod.Object}
 */
fiahfy.mod.animation.KeyFrame = function(duration) {
    fiahfy.mod.Object.call(this);
};
goog.inherits(fiahfy.mod.animation.KeyFrame, fiahfy.mod.Object);


/**
 * The class AnimationTimer allows to create a timer,
 * that is called in each frame while it is active.
 * @constructor
 * @extends {fiahfy.mod.Object}
 */
fiahfy.mod.animation.AnimationTimer = function() {
    fiahfy.mod.Object.call(this);

    /**
     * Timer id
     * @private
     * @type {number}
     */
    this.id_ = null;
};
goog.inherits(fiahfy.mod.animation.AnimationTimer, fiahfy.mod.Object);

/**
 * @public
 * @param {number} now The timestamp of the current frame given in milliseconds.
 */
fiahfy.mod.animation.AnimationTimer.prototype.handle = goog.abstractMethod;

/**
 * @public
 */
fiahfy.mod.animation.AnimationTimer.prototype.start = function() {
    this.stop();

    var me = this;
    (function animationLoop() {
        me.id_ = fiahfy.mod.animation.AnimationTimer.requestAnimationFrame_()(
            animationLoop
        );
        me.handle(Date.now());
    })();
};

/**
 * @public
 */
fiahfy.mod.animation.AnimationTimer.prototype.stop = function() {
    fiahfy.mod.animation.AnimationTimer.cancelAnimationFrame_()(
        this.id_
    );
    this.id_ = null;
};

/**
 * @const
 * @private
 * @return {Function} Enable request animation frame func.
 */
fiahfy.mod.animation.AnimationTimer.requestAnimationFrame_ = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /** @param {Function} callback */
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
};

/**
 * @const
 * @private
 * @return {Function} Enable cancel animation frame func.
 */
fiahfy.mod.animation.AnimationTimer.cancelAnimationFrame_ = function() {
    return window.cancelAnimationFrame ||
        window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        /** @param {number} id */
        function(id) {
            window.clearTimeout(id);
        };
};
