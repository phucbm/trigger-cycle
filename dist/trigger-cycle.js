
/**!
 * Trigger Cycle v0.0.1
 * @author phucbm
 * @homepage https://github.com/phucbm/trigger-cycle
 * @license MIT 2024
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TriggerCycle: () => (/* binding */ TriggerCycle)
/* harmony export */ });
/**
 * Class representing an interval-based trigger system.
 */
class TriggerCycle{
    /**
     * Create a TriggerCycle instance.
     * @param {Object} options - The options for the instance.
     * @param {number} [options.intervalInSeconds=2] - Interval duration in seconds.
     * @param {HTMLElement[]} [options.triggerElements=[]] - Array of elements to trigger.
     * @param {string} [options.activeClass='active'] - Class to add to active elements.
     * @param {boolean} [options.loop=false] - Whether to loop through elements.
     * @param {Function} [options.onActive=() => {}] - Callback when an element becomes active.
     * @param {Function} [options.onDeactive=() => {}] - Callback when an element becomes inactive.
     * @param {Function} [options.onPause=() => {}] - Callback when the interval is paused.
     * @param {Function} [options.onResume=() => {}] - Callback when the interval is resumed.
     * @param {Function} [options.onStart=() => {}] - Callback when the interval starts.
     * @param {Function} [options.onProgress=() => {}] - Callback for interval progress.
     * @param {HTMLElement|null} [options.visibilityElement=null] - Element to observe for visibility.
     * @param {number} [options.visibilityThreshold=0.5] - Visibility threshold.
     * @param {number|null} [options.pauseOnBreakpoint=null] - Breakpoint width to pause on.
     */
    constructor({
                    intervalInSeconds = 2,
                    triggerElements = [],
                    activeClass = 'active',
                    loop = false,
                    onActive = () => {
                    },
                    onDeactive = () => {
                    },
                    onPause = () => {
                    },
                    onResume = () => {
                    },
                    onStart = () => {
                    },
                    onProgress = () => {
                    },
                    visibilityElement = null,
                    visibilityThreshold = 0.5,
                    pauseOnBreakpoint = null
                } = {}){
        this.intervalInSeconds = intervalInSeconds;
        this.triggerElements = triggerElements;
        this.activeClass = activeClass;
        this.loop = loop;
        this.onActive = onActive;
        this.onDeactive = onDeactive;
        this.onPause = onPause;
        this.onResume = onResume;
        this.onStart = onStart;
        this.visibilityElement = visibilityElement;
        this.visibilityThreshold = visibilityThreshold;
        this.pauseOnBreakpoint = pauseOnBreakpoint;
        this.onProgress = onProgress;
        this.currentIndex = 0;
        this.animationFrameId = null;
        this.isVisible = false;
        this.lastTimestamp = null;
        this.pausedByBreakpoint = false;
        this.isPaused = false;

        this.addEventListeners();
        this.activate(0, 'interval');

        if(this.visibilityElement){
            this.setupVisibilityObserver();
        }else{
            this.startInterval();
        }

        if(this.pauseOnBreakpoint !== null){
            this.setupResizeListener();
        }
    }

    /**
     * Create an event object for callbacks.
     * @param {number} index - Index of the element.
     * @param {Object} [additionalProps={}] - Additional properties for the event object.
     * @returns {Object} - Event object.
     */
    createEventObject(index, additionalProps = {}){
        return {
            index: index,
            element: this.triggerElements[index],
            ...additionalProps
        };
    }

    /**
     * Set up visibility observer for the specified element.
     */
    setupVisibilityObserver(){
        const options = {
            threshold: this.visibilityThreshold
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.target === this.visibilityElement){
                    this.isVisible = entry.intersectionRatio >= this.visibilityThreshold;
                    if(this.isVisible){
                        this.resume('visibility');
                    }else{
                        this.pause('visibility');
                    }
                }
            });
        }, options);

        this.observer.observe(this.visibilityElement);
    }

    /**
     * Set up resize listener for breakpoints.
     */
    setupResizeListener(){
        window.addEventListener('resize', this.checkBreakpoint.bind(this));
        this.checkBreakpoint();
    }

    /**
     * Check if the current viewport width meets the breakpoint condition.
     */
    checkBreakpoint(){
        const viewportWidth = window.innerWidth;
        if(viewportWidth <= this.pauseOnBreakpoint){
            this.pause('breakpoint');
            this.pausedByBreakpoint = true;
        }else if(this.pausedByBreakpoint){
            this.resume('breakpoint');
            this.pausedByBreakpoint = false;
        }
    }

    /**
     * Start the interval.
     */
    startInterval(){
        if((this.visibilityElement && !this.isVisible) ||
            (this.pauseOnBreakpoint !== null && window.innerWidth <= this.pauseOnBreakpoint)){
            return;
        }

        this.lastTimestamp = null;
        this.onStart(this.createEventObject(this.currentIndex));
        this.animationFrameId = requestAnimationFrame(this.runInterval.bind(this));
    }

    /**
     * Run the interval.
     * @param {number} timestamp - The current timestamp.
     */
    runInterval(timestamp){
        if(!this.lastTimestamp){
            this.lastTimestamp = timestamp;
        }

        const elapsed = (timestamp - this.lastTimestamp) / 1000;
        const progress = elapsed / this.intervalInSeconds;
        this.onProgress(this.createEventObject(this.currentIndex, {progress}));

        for(let i = 0; i < this.currentIndex; i++){
            this.onProgress(this.createEventObject(i, {progress: 1}));
        }

        if(elapsed >= this.intervalInSeconds){
            this.lastTimestamp = timestamp;
            let nextIndex = this.currentIndex + 1;
            if(nextIndex >= this.triggerElements.length){
                if(this.loop){
                    nextIndex = 0;
                }else{
                    cancelAnimationFrame(this.animationFrameId);
                    return;
                }
            }
            this.activate(nextIndex, 'interval');
        }else{
            this.animationFrameId = requestAnimationFrame(this.runInterval.bind(this));
        }
    }

    /**
     * Activate the specified element.
     * @param {number} index - Index of the element to activate.
     * @param {string} triggeredBy - The source of the trigger.
     */
    activate(index, triggeredBy){
        cancelAnimationFrame(this.animationFrameId);

        const deactivatedElements = [];
        for(let i = index + 1; i < this.triggerElements.length; i++){
            if(this.triggerElements[i].classList.contains(this.activeClass)){
                this.triggerElements[i].classList.remove(this.activeClass);
                deactivatedElements.push(this.triggerElements[i]);
                this.onDeactive(this.createEventObject(i, {deactivatedElements, triggeredBy}));
            }
        }

        for(let i = 0; i <= index; i++){
            if(!this.triggerElements[i].classList.contains(this.activeClass) || i === index){
                this.triggerElements[i].classList.add(this.activeClass);
                if(i === index){
                    this.onActive(this.createEventObject(i, {triggeredBy}));
                }else{
                    this.onActive(this.createEventObject(i, {triggeredBy: 'immediate-active'}));
                }
            }
        }

        this.currentIndex = index;

        if(this.loop || index < this.triggerElements.length - 1){
            this.startInterval();
        }
    }

    /**
     * Add click event listeners to trigger elements.
     */
    addEventListeners(){
        this.triggerElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                this.activate(index, 'click');
            });
        });
    }

    /**
     * Pause the interval.
     * @param {string} [type=''] - The source of the pause.
     */
    pause(type = ''){
        if(this.isPaused) return;

        cancelAnimationFrame(this.animationFrameId);
        this.isPaused = true;
        this.onPause(this.createEventObject(this.currentIndex, {type}));
    }

    /**
     * Resume the interval.
     * @param {string} [type=''] - The source of the resume.
     */
    resume(type = ''){
        if(!this.isPaused) return;

        if(type === 'breakpoint' || !this.pausedByBreakpoint){
            this.isPaused = false;
            this.startInterval();
            this.onResume(this.createEventObject(this.currentIndex, {type}));
        }
    }
}

/******/ 	return __webpack_exports__;
/******/ })()
;
});