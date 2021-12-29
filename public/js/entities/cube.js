class Cube {
  static render(ctx, cube) {
    Cube.update(cube)
    Cube.keepInBoundary(ctx, cube)
    Cube.draw(ctx, cube)
  }

  static update(cube) {
    const { position, velocityMultiplier, velocity } = cube

    cube.position.x = position.x + velocityMultiplier * velocity.x
    cube.position.y = position.y + velocityMultiplier * velocity.y
  }

  static draw(ctx, cube) {
    const { color, position, size } = cube

    ctx.fillStyle = color
    ctx.fillRect(position.x, position.y, size, size)
  }

  static changeDirection(target, cube) {
    const angle = Math.atan2(target.y - cube.position.y, target.x - cube.position.x)

    cube.velocity.x = Math.cos(angle)
    cube.velocity.y = Math.sin(angle)
  }

  static keepInBoundary(ctx, cube) {
    const { size, position } = cube

    const xMax = ctx.canvas.width - size
    const yMax = ctx.canvas.height - size

    if (position.x < 0) cube.position.x = 0
    if (position.x > xMax) cube.position.x = xMax
    if (position.y < 0) cube.position.y = 0
    if (position.y > yMax) cube.position.y = yMax
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
