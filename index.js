'use strict'

const tinder = require('tinderjs')
const async = require('async')
const config = require('./config.json')

let client = new tinder.TinderClient()

const FB_USER_TOKEN = process.env.FB_USER_TOKEN
const FB_USER_ID = process.env.FB_USER_ID

console.log('[*] Authenticating')

client.authorize(
  FB_USER_TOKEN,
  FB_USER_ID, () => {
    let isAuthorized = client.isAuthorized()

    if(! isAuthorized) {
      console.log('[-] Failed to Authorize with Facebook/Tinder')
      process.exit(1)
    } else {
      console.log('[+] Authenticated with Tinder')
    }

    console.log('[*] Fetching Tinder History')

    client.getHistory((err, history) => {
      if(err) {
        console.log('[-] Failed to fetch History', err)
        process.exit(1)
      }

      console.log('[+] Received Tinder History')

      let numMatches = history.matches.length

      console.log(`[*] Filtering ${numMatches} Matches`)

      let filteredMatches = filterMatches(history.matches)

      let numApplicableMatches = filteredMatches.length

      console.log(`[+] Found ${numApplicableMatches} Applicable Matches`)

      sendMessages(filteredMatches)
    })
})

// filter out matches

let oneDay = 1000 * 60 * 60 * 24
let currentTime = + new Date()

function filterMatches(matches){
  return matches.filter( match => {
    let numMessages = match.messages.length

    if(numMessages === 0) return false

    let lastMessage = match.messages[numMessages - 1]

    // Last message was sent from user
    if(lastMessage.from === client.userId){
      let timeDiff = currentTime - lastMessage.timestamp

      if(timeDiff > oneDay) return true
    }

    return false
  })
}

function sendMessages(matches){
  console.log('[*] Sending Prompts')
  async.eachSeries(matches, (match, callback) => {
    console.log(`[*] Prompting ${match.person.name}`)

    let randomIndex = Math.floor(Math.random() * config.prompts.length)
    let message = config.prompts[randomIndex]

    client.sendMessage(match._id, message, (err) => {
      if(err) {
        console.log(`[-] Failed to send message to ${match.person.name}`)
        process.exit()
      } else {
        console.log(`[+] Prompt send successfully to ${match.person.name}`)
        // Timeout so tinder does rate limit
        setTimeout(() => {
          callback()
        }, 2500)
      }
    })

  }, err => {
    if(err) {
      console.log('[-] An Error occured while sending prompts')
    }

    console.log('[+] Completed Sending Prompts')
  })
}