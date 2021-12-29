class Projectile {
  static render(ctx, projectile) {
    Projectile.update(projectile)
    Projectile.draw(ctx, projectile)
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
}
