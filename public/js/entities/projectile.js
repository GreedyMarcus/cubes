class Projectile {
  static render(ctx, projectile) {
    Projectile.update(projectile)
    Projectile.draw(ctx, projectile)

    if (Projectile.isCollideWithBoundary(ctx, projectile)) {
      Projectile.reload(projectile)
    }
  }

  static update(projectile) {
    const { position, velocityMultiplier, velocity } = projectile

    projectile.position.x = position.x + velocityMultiplier * velocity.x
    projectile.position.y = position.y + velocityMultiplier * velocity.y
  }

  static draw(ctx, projectile) {
    const { position, radius, color } = projectile

    ctx.beginPath()
    ctx.arc(position.x, position.y, radius, Math.PI * 2, false)
    ctx.fillStyle = color
    ctx.fill()
  }

  static fire(projectile, cube) {
    projectile.fired = true
    projectile.position.x = cube.position.x + cube.size / 2
    projectile.position.y = cube.position.y + cube.size / 2
    projectile.velocity.x = cube.velocity.x
    projectile.velocity.y = cube.velocity.y
  }

  static reload(projectile) {
    projectile.fired = false
    projectile.position.x = 0
    projectile.position.y = 0
    projectile.velocity.x = 0
    projectile.velocity.y = 0
  }

  static isCollideWithBoundary(ctx, projectile) {
    const { radius, position } = projectile

    const xMax = ctx.canvas.width - radius
    const yMax = ctx.canvas.height - radius

    return position.x < radius || position.x > xMax || position.y < radius || position.y > yMax
  }

  static isCollide(projectile, cube) {
    const distX = Math.abs(projectile.position.x - cube.position.x - cube.size / 2)
    const distY = Math.abs(projectile.position.y - cube.position.y - cube.size / 2)

    if (distX > cube.size / 2 + projectile.radius) return false
    if (distY > cube.size / 2 + projectile.radius) return false

    if (distX <= cube.size / 2) return true
    if (distY <= cube.size / 2) return true

    const dx = distX - cube.size / 2
    const dy = distY - cube.size / 2

    return dx * dx + dy * dy <= projectile.radius * projectile.radius
  }
}
