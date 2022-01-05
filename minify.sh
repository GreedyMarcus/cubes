#!/bin/bash
uglifyjs \
  public/js/entities/cube.js \
  public/js/entities/projectile.js \
  public/js/screen.js \
  public/js/panel.js \
  public/js/game.js \
  public/js/index.js \
  -o public/index.min.js
