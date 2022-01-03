const http = require("http")
const https = require("https")
const url = require("url")
const StringDecoder = require("string_decoder").StringDecoder
const config = require("./config")

const fs = require("fs")

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, () => {
  console.log(
    `HTTP Server listening on PORT: ${config.httpPort} in ${config.envName}`
  )
})

const httpsServerOptions = {
    'key': fs.readFileSync("./https/key.pem"),
    'cert': fs.readFileSync("./https/cert.pem")
}

const httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
    unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, ()=>{
    console.log(`HTTPS Server is running on port: ${config.httpsPort}`)
}))

const unifiedServer = (req, res) => {
  //get the url and parse
  const parsedUrl = url.parse(req.url, true)

  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, "")

  const method = req.method.toLowerCase()

  const queryStringObject = parsedUrl.query

  const headers = req.headers

  //getting payload
  const decoder = new StringDecoder("utf-8")
  let buffer = ""
  req.on("data", (data) => {
    buffer += decoder.write(data)
  })
  req.on("end", () => {
    buffer += decoder.end()

    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound

    //data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    }

    //call the handler picked
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200

      payload = typeof payload == "object" ? payload : {}

      const payloadString = JSON.stringify(payload)

      //response to the user
      res.setHeader("Content-Type", "application/json")
      res.writeHead(statusCode)
      res.end(payloadString)

      //log
      console.log(
        `sending back payload: ${payloadString}, statusCode: ${statusCode}`
      )
    })
  })
}

const handlers = {}

handlers.sample = (data, callback) => {
  callback(406, { name: "sample handler" })
}

handlers.notFound = (data, callback) => {
  callback(404)
}

const router = {
  sample: handlers.sample,
}
