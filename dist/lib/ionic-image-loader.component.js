var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { ImageLoaderConfigService } from './services/image-loader-config.service';
import { ImageLoaderService } from './services/image-loader.service';
var propMap = {
    display: 'display',
    height: 'height',
    width: 'width',
    backgroundSize: 'background-size',
    backgroundRepeat: 'background-repeat',
};
var IonicImageLoaderComponent = /** @class */ (function () {
    function IonicImageLoaderComponent(_element, renderer, imageLoader, config) {
        this._element = _element;
        this.renderer = renderer;
        this.imageLoader = imageLoader;
        this.config = config;
        /**
         * Fallback URL to load when the image url fails to load or does not exist.
         */
        this.fallbackUrl = this.config.fallbackUrl;
        /**
         * Whether to show a spinner while the image loads
         */
        this.spinner = this.config.spinnerEnabled;
        /**
         * Whether to show the fallback image instead of a spinner while the image loads
         */
        this.fallbackAsPlaceholder = this.config.fallbackAsPlaceholder;
        /**
         * Attributes to pass through to img tag if _useImg == true
         */
        this.imgAttributes = [];
        /**
         * Enable/Disable caching
         */
        this.cache = true;
        /**
         * Width of the image. This will be ignored if using useImg.
         */
        this.width = this.config.width;
        /**
         * Height of the image. This will be ignored if using useImg.
         */
        this.height = this.config.height;
        /**
         * Display type of the image. This will be ignored if using useImg.
         */
        this.display = this.config.display;
        /**
         * Background size. This will be ignored if using useImg.
         */
        this.backgroundSize = this.config.backgroundSize;
        /**
         * Background repeat. This will be ignored if using useImg.
         */
        this.backgroundRepeat = this.config.backgroundRepeat;
        /**
         * Name of the spinner
         */
        this.spinnerName = this.config.spinnerName;
        /**
         * Color of the spinner
         */
        this.spinnerColor = this.config.spinnerColor;
        /**
         * Notify on image load..
         */
        this.load = new EventEmitter();
        /**
         * Indicates if the image is still loading
         */
        this.isLoading = true;
        this._useImg = this.config.useImg;
    }
    Object.defineProperty(IonicImageLoaderComponent.prototype, "useImg", {
        /**
         * Use <img> tag
         */
        set: function (val) {
            this._useImg = val !== false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonicImageLoaderComponent.prototype, "noCache", {
        /**
         * Convenience attribute to disable caching
         */
        set: function (val) {
            this.cache = val !== false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonicImageLoaderComponent.prototype, "src", {
        get: function () {
            return this._src;
        },
        /**
         * The URL of the image to load.
         */
        set: function (imageUrl) {
            this._src = this.processImageUrl(imageUrl);
            this.updateImage(this._src);
        },
        enumerable: true,
        configurable: true
    });
    IonicImageLoaderComponent.prototype.ngOnInit = function () {
        if (this.fallbackAsPlaceholder && this.fallbackUrl) {
            this.setImage(this.fallbackUrl, false);
        }
        if (!this.src) {
            // image url was not passed
            // this can happen when [src] is set to a variable that turned out to be undefined
            // one example could be a list of users with their profile pictures
            // in this case, it would be useful to use the fallback image instead
            // if fallbackUrl was used as placeholder we do not need to set it again
            if (!this.fallbackAsPlaceholder && this.fallbackUrl) {
                // we're not going to cache the fallback image since it should be locally saved
                this.setImage(this.fallbackUrl);
            }
            else {
                this.isLoading = false;
            }
        }
    };
    IonicImageLoaderComponent.prototype.updateImage = function (imageUrl) {
        var _this = this;
        this.imageLoader
            .getImagePath(imageUrl)
            .then(function (url) { return _this.setImage(url); })
            .catch(function (error) { return _this.setImage(_this.fallbackUrl || imageUrl); });
    };
    /**
     * Gets the image URL to be loaded and disables caching if necessary
     */
    IonicImageLoaderComponent.prototype.processImageUrl = function (imageUrl) {
        if (this.cache === false) {
            // need to disable caching
            if (imageUrl.indexOf('?') < 0) {
                // add ? if doesn't exists
                imageUrl += '?';
            }
            else {
                imageUrl += '&';
            }
            // append timestamp at the end to make URL unique
            imageUrl += 'cache_buster=' + Date.now();
        }
        return imageUrl;
    };
    /**
     * Set the image to be displayed
     * @param imageUrl image src
     * @param stopLoading set to true to mark the image as loaded
     */
    IonicImageLoaderComponent.prototype.setImage = function (imageUrl, stopLoading) {
        var _this = this;
        if (stopLoading === void 0) { stopLoading = true; }
        this.isLoading = !stopLoading;
        if (this._useImg) {
            // Using <img> tag
            if (!this.element) {
                // create img element if we dont have one
                this.element = this.renderer.createElement('img');
                this.renderer.appendChild(this._element.nativeElement, this.element);
            }
            // set it's src
            this.renderer.setAttribute(this.element, 'src', imageUrl);
            // if imgAttributes are defined, add them to our img element
            this.imgAttributes.forEach(function (attribute) {
                _this.renderer.setAttribute(_this.element, attribute.element, attribute.value);
            });
            if (this.fallbackUrl && !this.imageLoader.nativeAvailable) {
                this.renderer.listen(this.element, 'error', function () {
                    return _this.renderer.setAttribute(_this.element, 'src', _this.fallbackUrl);
                });
            }
        }
        else {
            // Not using <img> tag
            this.element = this._element.nativeElement;
            for (var prop in propMap) {
                if (this[prop]) {
                    this.renderer.setStyle(this.element, propMap[prop], this[prop]);
                }
            }
            this.renderer.setStyle(this.element, 'background-image', "url(\"" + (imageUrl || this.fallbackUrl) + "\")");
        }
        if (stopLoading) {
            this.load.emit(this);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "fallbackUrl", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonicImageLoaderComponent.prototype, "spinner", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonicImageLoaderComponent.prototype, "fallbackAsPlaceholder", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], IonicImageLoaderComponent.prototype, "imgAttributes", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], IonicImageLoaderComponent.prototype, "cache", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "width", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "height", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "display", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "backgroundSize", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "backgroundRepeat", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "spinnerName", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonicImageLoaderComponent.prototype, "spinnerColor", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], IonicImageLoaderComponent.prototype, "load", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], IonicImageLoaderComponent.prototype, "useImg", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], IonicImageLoaderComponent.prototype, "noCache", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], IonicImageLoaderComponent.prototype, "src", null);
    IonicImageLoaderComponent = __decorate([
        Component({
            selector: 'img-loader',
            template: "\n    <ion-spinner\n        *ngIf=\"spinner && isLoading && !fallbackAsPlaceholder\"\n        [name]=\"spinnerName\"\n        [color]=\"spinnerColor\"\n    ></ion-spinner>\n    <ng-content></ng-content>\n  ",
            styles: [
                'ion-spinner { float: none; margin-left: auto; margin-right: auto; display: block; }',
            ],
        }),
        __metadata("design:paramtypes", [ElementRef,
            Renderer2,
            ImageLoaderService,
            ImageLoaderConfigService])
    ], IonicImageLoaderComponent);
    return IonicImageLoaderComponent;
}());
export { IonicImageLoaderComponent };
//# sourceMappingURL=ionic-image-loader.component.js.map