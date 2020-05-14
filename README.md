# omni-chrome

## Installation

To install required packages, do the following:

```
npm install
```

## Development

To run the chrome extension in development, do the following:

1. Run the extension locally.

```
npm run dev
```

2. Open the **Extension Management** page on your Chrome browser by navigating to the link: [chrome://extensions](chrome://extensions).
3. Enable **Developer Mode** by clicking the toggle switch next to Developer mode.
4. Click the **LOAD UNPACKED** button and select the `omni-chrome/dev` folder.
5. Go to chrome://flags/#allow-insecure-localhost and enable this option: **Allow invalid certificates for resources loaded from localhost.**

You should now see the Chrome extension in your toolbar.
