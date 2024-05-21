<img src="https://github.com/phucbm/trigger-cycle/assets/14942380/9c8744a3-0c47-460e-8635-3c0622401401" width=100>

# TriggerCycle.js

**TriggerCycle** is a lightweight JavaScript library for creating interval-based activation and deactivation of DOM elements. It offers extensive customization options and event callbacks for visibility, progress, and breakpoints, making it perfect for creating dynamic and interactive web experiences.

## Features

- Interval-based element activation
- Customizable active class
- Looping through elements
- Event callbacks for activation, deactivation, pause, resume, start, and progress
- Visibility-based activation and deactivation
- Breakpoint-based pause and resume

## Installation

Include the `triggerCycle.js` file in your project:

```html
<script src="triggerCycle.js"></script>
```

## Usage

### Basic Example

Create a container with elements you want to activate and deactivate:

```html
<div id="trigger-container">
    <div class="trigger-element">Element 1</div>
    <div class="trigger-element">Element 2</div>
    <div class="trigger-element">Element 3</div>
</div>
<div id="event-log">
    <h2>Event Log</h2>
    <ul id="log-list"></ul>
</div>
```

Add some basic styles and styles for active elements:

```css
.trigger-element {
    padding: 20px;
    background-color: #ccc;
    border: 2px solid #999;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.trigger-element.active {
    background-color: #4caf50;
    border-color: #388e3c;
    color: #fff;
}

#log-list li {
    background-color: #fff;
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.log-highlight {
    background-color: #ffeb3b;
    transition: background-color 1s;
}
```

Initialize TriggerCycle with your elements and options:

```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const triggerElements = document.querySelectorAll('.trigger-element');
        const logList = document.getElementById('log-list');
        const maxLogItems = 20;

        const logEvent = (message) => {
            const li = document.createElement('li');
            li.textContent = message;
            logList.appendChild(li);
            li.classList.add('log-highlight');
            setTimeout(() => {
                li.classList.remove('log-highlight');
            }, 1000);

            if (logList.childElementCount > maxLogItems) {
                logList.removeChild(logList.firstChild);
            }
        };

        new TriggerCycle({
            triggerElements: Array.from(triggerElements),
            intervalInSeconds: 3,
            loop: true,
            onActive: (event) => logEvent(`Active: Element ${event.index + 1}`),
            onDeactive: (event) => logEvent(`Deactive: Element ${event.index + 1}`),
            onPause: (event) => logEvent(`Paused due to ${event.type}`),
            onResume: (event) => logEvent(`Resumed due to ${event.type}`),
            onStart: (event) => logEvent(`Started with Element ${event.index + 1}`),
            onProgress: (event) => {
                const progress = Math.round(event.progress * 100);
                logEvent(`Progress: Element ${event.index + 1} at ${progress}%`);
            }
        });
    });
</script>
```

### API

#### Constructor

`new TriggerCycle(options)`

##### Options

- `intervalInSeconds` (number): Interval duration in seconds. Default is `2`.
- `triggerElements` (HTMLElement[]): Array of elements to trigger.
- `activeClass` (string): Class to add to active elements. Default is `'active'`.
- `loop` (boolean): Whether to loop through elements. Default is `false`.
- `onActive` (function): Callback when an element becomes active. Receives an event object.
- `onDeactive` (function): Callback when an element becomes inactive. Receives an event object.
- `onPause` (function): Callback when the interval is paused. Receives an event object.
- `onResume` (function): Callback when the interval is resumed. Receives an event object.
- `onStart` (function): Callback when the interval starts. Receives an event object.
- `onProgress` (function): Callback for interval progress. Receives an event object with progress percentage.
- `visibilityElement` (HTMLElement|null): Element to observe for visibility. Default is `null`.
- `visibilityThreshold` (number): Visibility threshold. Default is `0.5`.
- `pauseOnBreakpoint` (number|null): Breakpoint width to pause on. Default is `null`.

### Example Usage

#### Interval and Active Class

```html
<script>
    new TriggerCycle({
        triggerElements: document.querySelectorAll('.trigger-element'),
        intervalInSeconds: 5,
        activeClass: 'active'
    });
</script>
```

#### Loop Through Elements

```html
<script>
    new TriggerCycle({
        triggerElements: document.querySelectorAll('.trigger-element'),
        intervalInSeconds: 3,
        loop: true
    });
</script>
```

#### Event Callbacks

```html
<script>
    new TriggerCycle({
        triggerElements: document.querySelectorAll('.trigger-element'),
        onActive: (event) => console.log(`Active: Element ${event.index + 1}`),
        onDeactive: (event) => console.log(`Deactive: Element ${event.index + 1}`),
        onPause: (event) => console.log(`Paused due to ${event.type}`),
        onResume: (event) => console.log(`Resumed due to ${event.type}`),
        onStart: (event) => console.log(`Started with Element ${event.index + 1}`),
        onProgress: (event) => {
            const progress = Math.round(event.progress * 100);
            console.log(`Progress: Element ${event.index + 1} at ${progress}%`);
        }
    });
</script>
```

#### Visibility-Based Activation

```html
<script>
    new TriggerCycle({
        triggerElements: document.querySelectorAll('.trigger-element'),
        visibilityElement: document.querySelector('#trigger-container'),
        visibilityThreshold: 0.75
    });
</script>
```

#### Breakpoint-Based Pause and Resume

```html
<script>
    new TriggerCycle({
        triggerElements: document.querySelectorAll('.trigger-element'),
        pauseOnBreakpoint: 600
    });
</script>
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.
