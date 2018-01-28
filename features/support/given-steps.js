// @flow

const {Given} = require('cucumber')
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const {cp} = require('shelljs')
const path = require('path')

Given(/^a broken file "([^"]*)"$/, function (filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== '.') {
    mkdirp.sync(path.join(this.rootDir, subdir))
  }
  fs.writeFileSync(path.join(this.rootDir, filePath), `
      <a href="missing">
      </a>
      `)
})

Given(/^a runnable file "([^"]*)"$/, function (filePath) {
  const subdir = path.dirname(filePath)
  if (subdir !== '.') {
    const subdirPath = path.join(this.rootDir, subdir)
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath)
    }
  }
  fs.writeFileSync(path.join(this.rootDir, filePath),
                   '<a textrun="verifyWorkspaceContainsDirectory">`.`</a>')
})

Given(/^I am in a directory that contains documentation without a configuration file$/, function () {
  fs.writeFileSync(path.join(this.rootDir, '1.md'), `
    <a textrun="verifySourceContainsDirectory">
        [.](.)
      </a>
      `)
})

Given(/^I am in a directory that contains the "([^"]*)" example$/, function (exampleName) {
  fs.copySync(path.join('documentation', 'examples', exampleName), this.rootDir)
})

Given(/^I am in a directory that contains the "([^"]*)" example with the configuration file:$/, function (exampleName, configFileContent) {
  fs.copySync(path.join('documentation', 'examples', exampleName), this.rootDir)
  fs.writeFileSync(path.join(this.rootDir, 'text-run.yml'), configFileContent)
})

Given(/^I am in a directory that contains the "([^"]*)" example(?: without a configuration file)$/, function (exampleName) {
  fs.copySync(path.join('documentation', 'examples', exampleName), this.rootDir)
})

Given(/^my documentation is starting the "([^"]*)" example$/, function (example) {
  fs.writeFileSync(path.join(this.rootDir, '0.md'), `
    <a textrun="startConsoleCommand">
      \`\`\`
      node ${path.join(__dirname, '..', '..', 'documentation', 'examples', 'long-running', 'server.js')}
      \`\`\`
      </a>
      `)
})

Given(/^my source code contains the directory "([^"]*)"$/, function (dirName) {
  mkdirp.sync(path.join(this.rootDir, dirName))
})

Given(/^my source code contains the file "([^"]*)"$/, function (fileName) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(fileName)))
  fs.writeFileSync(path.join(this.rootDir, fileName), 'content')
})

Given(/^my workspace contains the file "([^"]*)"$/, function (fileName) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', path.dirname(fileName)))
  fs.writeFileSync(path.join(this.rootDir, 'tmp', fileName), 'content')
})

Given(/^my source code contains the file "([^"]*)" with content:$/, function (fileName, content) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(fileName)))
  fs.writeFileSync(path.join(this.rootDir, fileName), content)
})

Given(/^my workspace contains testable documentation$/, function () {
  fs.writeFileSync(path.join(this.rootDir, '1.md'), `
<a textrun="runConsoleCommand">
\`\`\`
echo "Hello world"
\`\`\`
</a>
    `)
})

Given('my workspace contains the HelloWorld activity', function () {
  mkdirp.sync(path.join(this.rootDir, 'text-run'))
  fs.writeFileSync(path.join(this.rootDir, 'text-run', 'hello-world.js'), `
    module.exports = function ({formatter}) { formatter.output('Hello World!') }`)
})

Given(/^my workspace contains the file "([^"]*)" with content:$/, function (fileName, content) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', path.dirname(fileName)))
  fs.writeFileSync(path.join(this.rootDir, 'tmp', fileName), content)
})

Given(/^my text-run configuration contains:$/, function (text) {
  fs.appendFileSync(path.join(this.rootDir, 'text-run.yml'), `\n${text}`)
})

Given(/^my workspace contains a directory "([^"]*)"$/, function (dir) {
  mkdirp.sync(path.join(this.rootDir, 'tmp', dir))
})

Given(/^my workspace contains an empty file "([^"]*)"$/, function (fileName) {
  fs.writeFileSync(path.join(this.rootDir, fileName), '')
})

Given(/^my workspace contains an image "([^"]*)"$/, function (imageName) {
  mkdirp.sync(path.join(this.rootDir, path.dirname(imageName)))
  cp(path.join(__dirname, path.basename(imageName)),
       path.join(this.rootDir, imageName))
})

Given(/^the configuration file:$/, function (content) {
  fs.writeFileSync(path.join(this.rootDir, 'text-run.yml'), content)
})
