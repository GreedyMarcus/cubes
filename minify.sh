#!/bin/bash
uglifyjs \
  public/js/cube.js \
  public/js/game.js \
  public/js/index.js \
  -o public/index.min.js
