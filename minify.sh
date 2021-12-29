#!/bin/bash
uglifyjs \
  public/js/entities/cube.js \
  public/js/entities/projectile.js \
  public/js/game.js \
  public/js/index.js \
  -o public/index.min.js
