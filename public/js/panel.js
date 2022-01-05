class Panel {
  static displayPanel(display) {
    const panel = document.querySelector("#panel")
    panel.style.display = display ? "block" : "none"
  }

  static hideStartButton() {
    const startButton = document.querySelector("#start-button")
    startButton.style.display = "none"
  }

  static displayMessage(display, text) {
    const message = document.querySelector("#message")

    message.textContent = text
    message.style.display = display ? "block" : "none"
    message.style.margin = display ? "8px" : "0px"
  }

  static printWinner(winner) {
    return winner ? `${winner} won` : "Draw"
  }
}
