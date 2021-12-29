const GameEvents = Object.freeze({
  USER_CONNECTED: "user-connected",
  GAME_STARTED: "game-started",
  GAME_STATE_UPDATE: "game-state-update",
  GAME_STATE_CHANGED: "game-state-changed"
})

const GameStatus = Object.freeze({
  LOBBY: "lobby",
  STARTED: "started",
  FINISHED: "finished"
})

class GameScreen {
  static setup(ctx) {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
  }

  static clear(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  static resize(ctx, state) {
    const temp = GameScreen.convertToRelativeViewport(ctx, state)

    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight

    return GameScreen.convertFromRelativeViewport(ctx, temp)
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

  static displayPanel(display) {
    const panel = document.querySelector("#panel")
    panel.style.visibility = display ? "visible" : "hidden"
  }
}
