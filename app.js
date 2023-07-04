import { MediaPermissionsError, MediaPermissionsErrorType, requestAudioPermissions, requestVideoPermissions,
  requestMediaPermissions } from "mic-check"
import Bowser from "bowser"
import { en } from "./en"

const browser = Bowser.getParser(window.navigator.userAgent)

export const getHelp = function(language, errType) {
  const help = language[browser.parsedResult.platform.type][browser.parsedResult.browser.name][
      errType]
  return help
}

const help = getHelp(en, "PermissionRequired")
let html = "<h2>Message on page load</h2>"
for (let line of help.help) {
  html += `<li>${line}</li>`
}
document.getElementById("content").innerHTML += html
console.log(help)


requestMediaPermissions({audio: true, video: true})
  .then(() => {
    console.log("You got it, buddy!")
  })
  .catch((err) => {
    const help = getHelp(en, err.type)
    console.log({help, parsedResult: browser.parsedResult})
    let html = `
      <h2>${help.title}</h2>
      <dl>
        <dt>Platform</dt>
        <dd>${browser.parsedResult.platform.type}</dd>
        <dt>Browser</dt>
        <dd>${browser.parsedResult.browser.name} ${browser.parsedResult.browser.version}</dd>
        <dt>Os</dt>
        <dd>${browser.parsedResult.os.name}</dd>
      </dl>
    `
    for (let line of help.help) {
      html += `<li>${line}</li>`
    }
    document.getElementById("content").innerHTML += html
  }
)
