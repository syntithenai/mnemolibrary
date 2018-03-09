# Ripple | Offline
[![Coverage Status](https://coveralls.io/repos/rijs/offline/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/offline?branch=master)
[![Build Status](https://travis-ci.org/rijs/offline.svg)](https://travis-ci.org/rijs/offline)

Loads resources from `localStorage` on startup (which has _massive_ impact on how fast your application is perceived) - as opposed to waiting for subsequent network events to render things. Asynchronously (debounced) caches resources when they change. 