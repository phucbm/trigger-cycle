// public styles
import '@viivue/atomic-css';
// import 'honcau';

// private style
import './style.scss';

// source script
import '@/_index';
import {TriggerCycle} from "@/_index";

// import package info
const packageInfo = require('../package.json');

/**
 * Lib usage
 */
document.addEventListener("DOMContentLoaded", () => {
    const triggerElements = document.querySelectorAll('.trigger-element');
    new TriggerCycle({
        triggerElements: Array.from(triggerElements),
        intervalInSeconds: 1,
        loop: true,
        onDeactive: ({index, triggeredBy, element}) => {
            element.style.setProperty("--progress", `0`);
        },
        onProgress: (event) => {
            const progress = Math.round(event.progress * 100);
            event.element.style.setProperty('--progress', `${event.progress * 100}%`);
            // logEvent(`Progress: Element ${event.index + 1} at ${progress}%`);
        }
    });
});