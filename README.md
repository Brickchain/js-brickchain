# Brickchain integration library 

This library helps you in creating a realm, controller or agent.
It depends on node-jose that actaully works in browser too, so 
the library can be included in browser and node code. 

The schemas are imported via and compiled into typescript via json-schema
definitions on site.  

See https://developer.brickchain.com/ for full documentation.

Building the library:

```sh
    npm install
    npm run build
```

This will create the dist folder with typescript declarations and
ES6 (import)/commonjs (require) bundles.

Importing the library:

```js
    import { Integrity } from "Brickchain/js-brickchain"
```

