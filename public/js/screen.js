class Screen {
  static fitWindow(ctx) {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
  }

  static clear(ctx, hard) {
    ctx.fillStyle = hard ? "#000" : "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  static resize(ctx, state) {
    if (!state) {
      Screen.fitWindow(ctx)
      return
    }

    const temp = Screen.convertToRelativeViewport(ctx, state)
    Screen.fitWindow(ctx)
    Screen.convertFromRelativeViewport(ctx, temp)
  }

  static convertFromRelativeViewport(ctx, state) {
    return {
      ...state,
      players: state.players.map((player) => ({
        ...player,
        cube: {
          ...player.cube,
          size: ctx.canvas.width * player.cube.size,
          position: {
            x: ctx.canvas.width * player.cube.position.x,
            y: ctx.canvas.height * player.cube.position.y
          }
        },
        projectiles: player.projectiles.map((projectile) => ({
          ...projectile,
          radius: ctx.canvas.width * projectile.radius,
          position: {
            x: ctx.canvas.width * projectile.position.x,
            y: ctx.canvas.height * projectile.position.y
          }
        }))
      }))
    }
  }

  static convertToRelativeViewport(ctx, state) {
    return {
      ...state,
      players: state.players.map((player) => ({
        ...player,
        cube: {
          ...player.cube,
          size: (1 / ctx.canvas.width) * player.cube.size,
          position: {
            x: (1 / ctx.canvas.width) * player.cube.position.x,
            y: (1 / ctx.canvas.height) * player.cube.position.y
          }
        },
        projectiles: player.projectiles.map((projectile) => ({
          ...projectile,
          radius: (1 / ctx.canvas.width) * projectile.radius,
          position: {
            x: (1 / ctx.canvas.width) * projectile.position.x,
            y: (1 / ctx.canvas.height) * projectile.position.y
          }
        }))
      }))
    }
  }
}
