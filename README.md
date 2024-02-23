# verify client sdk

VERIFY aims to be the central repository for content license and provenance, equipping the world with a backend to verify the source and license of digital content.

VERIFY is a public library of signed digital assets with capabilities that allow for a single DRM solution for digital assets. Every asset stored in VERIFY is signed by a real world entity that attests to the provenance of the asset. The publisher declares the asset’s license for access and reference through a smart contract module.

[verifymedia/client](https://github.com/verify-media/verify-client/pkgs/npm/verify-client/170509994) is a typesafe sdk for interacting with the [verify protocol](https://www.verifymedia.com/). It is written in typescript and is compiled to es6 and cjs bundles.

## Quick Start

- Since verify client sdk supports javascript, start by installing [nodejs](https://nodejs.org/en) version 18 or higher.
- Verify the node version `node --version` on your terminal.

  sdk requires:
    ```javascript
    "node": ">=18.15.0",
    "npm": "9.5.0"
    ```
- Setup a test project

  ```bash
  mkdir test-verifymedia-client
  cd test-verifymedia-client
  npm init -y
  touch index.mjs
  npm i @verifymedia/client
  ```

- Open test-verifymedia-client/index.mjs in your favorite IDE and add the following snippet

  ```javascript
  import { hashData } from '@verifymedia/client'
  console.log(hashData('hello world'))
  ```

- Head over to the terminal (within vscode or your favorite terminal which has the nodejs env setup) and try executing
  ```bash
  node index.mjs
  ```
  you should see some output like
  ```bash
  0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad
  ```
  Congratulations you have the sdk up and running!!!

## Getting started

Please check the [getting started](https://github.com/verify-media/verify-client/blob/main/GETTING_STARTED.md) guide to start using the sdk.

## Examples

The repository hosts various [examples](https://github.com/verify-media/verify-client/tree/master/example) of how to use the sdk.

## Tech Docs

For the most up to date API documentation, check out the [verify-client sdk docs](https://sdk.verifymedia.com/)


## License

Apache License Version 2.0
