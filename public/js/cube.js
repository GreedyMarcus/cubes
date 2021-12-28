class Cube {
  static render(ctx, cube) {
    Cube.update(cube)
    Cube.keepInBoundary(ctx, cube)
    Cube.draw(ctx, cube)
  }

  static update(cube) {
    cube.position.x = cube.position.x + cube.velocityMultiplier * cube.velocity.x
    cube.position.y = cube.position.y + cube.velocityMultiplier * cube.velocity.y
  }

  static keepInBoundary(ctx, cube) {
    const xMax = ctx.canvas.width - cube.size
    const yMax = ctx.canvas.height - cube.size

    if (cube.position.x < 0) cube.position.x = 0
    if (cube.position.x > xMax) cube.position.x = xMax
    if (cube.position.y < 0) cube.position.y = 0
    if (cube.position.y > yMax) cube.position.y = yMax
  }

  static draw(ctx, cube) {
    ctx.fillStyle = cube.color
    ctx.fillRect(cube.position.x, cube.position.y, cube.size, cube.size)
  }

  static isCollide(cube1, cube2) {
    return (
      cube1.position.x < cube2.position.x + cube2.size &&
      cube1.position.x + cube1.size > cube2.position.x &&
      cube1.position.y < cube2.position.y + cube2.size &&
      cube1.position.y + cube1.size > cube2.position.y
    )
  }
}
