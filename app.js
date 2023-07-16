import { MediaPermissionsError, MediaPermissionsErrorType, requestAudioPermissions, requestVideoPermissions,
  requestMediaPermissions } from "mic-check"
import Bowser from "bowser"
import { da } from "./da"

const browser = Bowser.getParser(window.navigator.userAgent)

export const getHelp = function(language, errType) {
  const help = language[browser.parsedResult.platform.type][browser.parsedResult.browser.name][
      errType]
  return help
}

const help = getHelp(da, "PermissionRequired")
let html = document.createElement("div");
html.innerHTML = "<h2>Message on page load</h2>";
for (let line of help.help) {
  html.innerHTML += `<li>${line}</li>`
}

let modal = document.createElement("div")
let closeButton = document.createElement("button")
closeButton.innerHTML = "Close"
closeButton.onclick = function() {
  modal.style.display = "none";
}

modal.style.display = "none"
modal.style.position = "fixed"
modal.style.zIndex = "1"
modal.style.left = "0"
modal.style.top = "0"
modal.style.width = "100%"
modal.style.height = "100%"
modal.style.overflow = "auto"
modal.style.backgroundColor = "rgba(0,0,0,0.4)"

let content = document.createElement("div")
content.style.backgroundColor = "#fefefe"
content.style.margin = "15% auto"
content.style.padding = "20px"
content.style.border = "1px solid #888"
content.style.width = "80%"

content.appendChild(closeButton)
content.appendChild(html)

modal.appendChild(content)

document.body.appendChild(modal)
modal.style.display = "block"

console.log(help)

requestMediaPermissions({audio: true, video: true})
  .then(() => {
    console.log("You got it, buddy!")
    closeButton.click(); // close the modal when permissions are granted
  })
  .catch((err) => {
    const help = getHelp(da, err.type)
    console.log({help, parsedResult: browser.parsedResult})
    let html = document.createElement("div");
    html.innerHTML = "<br>"
    for (let line of help.help) {
      html.innerHTML += `<li>${line}</li>`
    }
    content.innerHTML = ''; // Clear previous content
    content.appendChild(closeButton);
    content.appendChild(html);
    modal.style.display = "block" // Display the modal with the error message
  }
)
