const environments = {}

environments.staging = {
  httpPort: 9000,
  httpsPort: 9001,
  envName: "staging",
  hashingSecret: "thisIsASecret",
}

environments.production = {
  httpPort: 8000,
  httpsPort: 8001,
  envName: "production",
  hashingSecret: "thisIsAlsoASecret",
}

//determine environment passed in from the cmd
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : ""

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging

module.exports = environmentToExport
