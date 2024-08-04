### Type checks

Vite doesn't check types on build to improve performance.  
You can check types manually by doing `pnpm run typecheck`.

### CSS module types

When using CSS modules (`import styles from './App.module.css';`) with `"noUncheckedIndexedAccess": true` set in `tsconfig.json`, TypeScript will complain with `error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'` when you attempt to use the styles with `<div classList={{[styles.description]: true}}/>`.  
To avoid this, you can generate type definitions using `pnpm gen:csstypes`, which will create a corresponding `*.css.d.ts` file for each `*.module.css` file.  
NB! This does not automatically delete old `*.css.d.ts` files.

It uses a very basic self-made script for this.  
I tried using the `typed-css-modules` package, which the internet pointed me to, but:

-   The `--camelCase dashes` option which I wanted to use just didn't work
-   The package's version was 0.9.1, which doesn't necessarily mean anything, but didn't exactly inspire confidence
-   The project seemed semi-abandoned?
-   When I checked out the code (to investigate `--camelCase dashes` not working), the first thing I saw was a silly, although insignificant oversight.

---

# Default README below - TODO: modify/remove it

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
