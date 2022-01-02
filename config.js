const enviroments = {}

environments.staging = {
  port: 3000,
  envName: "staging",
}

environments.production = {
  port: 5000,
  envName: "production",
}

//determine environment passed in from the cmd
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : ""

const enviromentToExport =
  typeof environments[currentEnvironment]
    ? environments.production
    : environments.staging
