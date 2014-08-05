//


/**
 * @fileoverview xxx
 */


goog.provide('fiahfy.mod.scene.shape.Circle');
goog.provide('fiahfy.mod.scene.shape.Line');
goog.provide('fiahfy.mod.scene.shape.Rectangle');
goog.provide('fiahfy.mod.scene.shape.Shape');
goog.provide('fiahfy.mod.scene.shape.StrokeType');

goog.require('fiahfy.mod.geometry.Dimension');
goog.require('fiahfy.mod.geometry.Point');
goog.require('fiahfy.mod.scene.paint.Color');


/**
 * @enum {string}
 */
fiahfy.mod.scene.shape.StrokeType = {
    CENTERED: 'centered',
    INSIDE: 'inside',
    OUTSIDE: 'outside'
};


/**
 * @constructor
 */
fiahfy.mod.scene.shape.Shape = function() {
    /**
     * Fill color
     * @protected
     * @type {?fiahfy.mod.scene.paint.Color}
     */
    this.fill = null;

    /**
     * Stroke color
     * @protected
     * @type {?fiahfy.mod.scene.paint.Color}
     */
    this.stroke = null;
    
    /**
     * Stroke width
     * @protected
     * @type {number}
     */
    this.strokeWidth = 1.0;

    /**
     * Stroke type
     * @protected
     * @type {fiahfy.mod.scene.shape.StrokeType}
     */
    this.strokeType = fiahfy.mod.scene.shape.StrokeType.CENTERED;
};

/**
 * @public
 * @param {CanvasRenderingContext2D} context Canvas DOM element
 */
 fiahfy.mod.scene.shape.Shape.prototype.draw = goog.abstractMethod;

/**
 * @public
 * @param {?fiahfy.mod.scene.paint.Color} color
 */
fiahfy.mod.scene.shape.Shape.prototype.setFill = function(color) {
    this.fill = color;
};

/**
 * @public
 * @param {?fiahfy.mod.scene.paint.Color} color
 */
fiahfy.mod.scene.shape.Shape.prototype.setStroke = function(color) {
    this.stroke = color;
};

/**
 * @public
 * @param {number} width
 */
fiahfy.mod.scene.shape.Shape.prototype.setStrokeWidth = function(width) {
    this.strokeWidth = width;
};

/**
 * @public
 * @param {fiahfy.mod.scene.shape.StrokeType} type
 */
fiahfy.mod.scene.shape.Shape.prototype.setStrokeType = function(type) {
    this.strokeType = type;
};


/**
 * @param {number} x Position x
 * @param {number} y Position y
 * @param {number} width Size width
 * @param {number} height Size height
 * @constructor
 * @extends {fiahfy.mod.scene.Shape}
 */
fiahfy.mod.scene.shape.Rectangle = function(x, y, width, height) {
    fiahfy.mod.scene.shape.Shape.call(this);
    /**
     * Position
     * @protected
     * @type {fiahfy.mod.geometry.Point}
     */
    this.position = new fiahfy.mod.geometry.Point(x, y);
    /**
     * Size
     * @protected
     * @type {fiahfy.mod.geometry.Dimension}
     */
    this.size = new fiahfy.mod.geometry.Dimension(width, height);

    this.fill = fiahfy.mod.scene.paint.Color.BLACK;
};
goog.inherits(fiahfy.mod.scene.shape.Rectangle, fiahfy.mod.scene.shape.Shape);

/**
 * @public
 * @param {CanvasRenderingContext2D} context Canvas DOM element
 * @override
 */
fiahfy.mod.scene.shape.Rectangle.prototype.draw = function(context) {
    if (this.fill) {
        context.fillStyle = this.fill.getWeb();
        context.fillRect(
            parseInt(this.position.getX()),
            parseInt(this.position.getY()),
            parseInt(this.size.getWidth()),
            parseInt(this.size.getHeight())
        );
    }

    if (this.stroke) {
        context.strokeStyle = this.stroke.getWeb();
        context.lineWidth = this.strokeWidth;

        var offsetPosition = offsetSize = 0;
        switch (this.strokeType) {
            case fiahfy.mod.scene.shape.StrokeType.OUTSIDE:
                offsetPosition = - 0.5 * this.strokeWidth;
                offsetSize = this.strokeWidth;
                break;
            case fiahfy.mod.scene.shape.StrokeType.INSIDE:
                offsetPosition = 0.5 * this.strokeWidth;
                offsetSize = - this.strokeWidth;
                break;
            case fiahfy.mod.scene.shape.StrokeType.CENTERED:
            default:
                offsetPosition = 0.5 * (this.strokeWidth % 2);
                offsetSize = 0
                break;
        }
        context.strokeRect(
            parseInt(this.position.getX()) + offsetPosition,
            parseInt(this.position.getY()) + offsetPosition,
            parseInt(this.size.getWidth()) + offsetSize,
            parseInt(this.size.getHeight()) + offsetSize
        );
    }
};


/**
 * @param {number} x Position x
 * @param {number} y Position y
 * @param {number} radius Radius
 * @constructor
 * @extends {fiahfy.mod.scene.Shape}
 */
fiahfy.mod.scene.shape.Circle = function(x, y, radius) {
    fiahfy.mod.scene.shape.Shape.call(this);
    /**
     * Position
     * @protected
     * @type {fiahfy.mod.geometry.Point}
     */
    this.position = new fiahfy.mod.geometry.Point(x, y);
    /**
     * Radius
     * @protected
     * @type {number}
     */
    this.radius = radius;

    this.fill = fiahfy.mod.scene.paint.Color.BLACK;
};
goog.inherits(fiahfy.mod.scene.shape.Circle, fiahfy.mod.scene.shape.Shape);

/**
 * @public
 * @param {CanvasRenderingContext2D} context Canvas DOM element
 * @override
 */
fiahfy.mod.scene.shape.Circle.prototype.draw = function(context) {
    if (this.fill) {
        context.beginPath();
        context.fillStyle = this.fill.getWeb();
        context.arc(
            parseInt(this.position.getX()),
            parseInt(this.position.getY()),
            this.radius,
            0, Math.PI * 2, false
        );
        context.fill();
    }

    if (this.stroke) {
        context.beginPath();
        context.strokeStyle = this.stroke.getWeb();
        context.lineWidth = this.strokeWidth;

        var offset = 0;
        switch (this.strokeType) {
            case fiahfy.mod.scene.shape.StrokeType.OUTSIDE:
                offset = 0.5 * this.strokeWidth;
                break;
            case fiahfy.mod.scene.shape.StrokeType.INSIDE:
                offset = - 0.5 * this.strokeWidth;
                break;
            case fiahfy.mod.scene.shape.StrokeType.CENTERED:
            default:
                offset = 0
                break;
        }
        context.arc(
            parseInt(this.position.getX()),
            parseInt(this.position.getY()),
            this.radius + offset,
            0, Math.PI * 2, false
        );
        context.stroke();
    }
};


/**
 * @param {number} startX Start position x
 * @param {number} startY Start position y
 * @param {number} endX End position x
 * @param {number} endY End position y
 * @constructor
 * @extends {fiahfy.mod.scene.Shape}
 */
fiahfy.mod.scene.shape.Line = function(startX, startY, endX, endY) {
    fiahfy.mod.scene.shape.Shape.call(this);
    /**
     * Start position
     * @protected
     * @type {fiahfy.mod.geometry.Point}
     */
    this.start = new fiahfy.mod.geometry.Point(startX, startY);
    /**
     * End position
     * @protected
     * @type {fiahfy.mod.geometry.Point}
     */
    this.end = new fiahfy.mod.geometry.Point(endX, endY);

    this.stroke = fiahfy.mod.scene.paint.Color.BLACK;
};
goog.inherits(fiahfy.mod.scene.shape.Line, fiahfy.mod.scene.shape.Shape);

/**
 * @public
 * @param {CanvasRenderingContext2D} context Canvas DOM element
 * @override
 */
fiahfy.mod.scene.shape.Line.prototype.draw = function(context) {
    if (this.stroke === null) return;

    context.beginPath();
    context.strokeStyle = this.stroke.getWeb();
    context.lineWidth = this.strokeWidth;

    var offset = 0.5 * (this.strokeWidth % 2);
    context.moveTo(
        parseInt(this.start.getX()) + offset,
        parseInt(this.start.getY()) + offset
    );
    context.lineTo(
        parseInt(this.end.getX()) + offset,
        parseInt(this.end.getY()) + offset
    );
    context.stroke();
};