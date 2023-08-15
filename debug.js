function log (...args) {
    const isProdMode = 'update_url' in chrome.runtime.getManifest()

    console.log(isProdMode)
  const pill1 = 'background: #d9ecff; color: #2783e1; border-radius: 20px; margin-right: 4px; font-size: 10px; font-weight: 600; padding: 5px 10px; font-family: Sora, Helvetica, Montserrat, Arial, Sans-serif, Ariel;'
  console.log('%c wasteof.plus %c', pill1, args[0], ...args, '')
}

export { log }
// module.export.log = log
