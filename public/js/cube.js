class Cube {
  static draw(ctx, cube) {
    ctx.fillStyle = cube.color
    ctx.fillRect(cube.position.x, cube.position.y, cube.size, cube.size)
  }
}
