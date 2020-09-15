import { promises as fs } from "fs"
import path = require("path")

export async function createConfigurationFile(sourceDir: string) {
  await fs.writeFile(
    path.join(sourceDir, "./text-run.yml"),
    `# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: "**/*.md"

# black-list of files not to test
# This is applied after the white-list above.
exclude: []

# the formatter to use (detailed, dot, progress, silent, summary)
format: detailed

# Define which folders of your Markdown source get compiled to HTML
# and published under a different URL path.
#
# In this example, the public URL "/blog/foo"
# is hosted as "post/foo.md":
# publications:
#   - localPath: /posts/
#     publicPath: /blog
#     publicExtension: ''

# Name of the default filename in folders.
# If this setting is given, and a link points to a folder,
# the link is assumed to point to the default file in that folder.
# defaultFile: index.md

# prefix that makes anchor tags active regions
regionMarker: type

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
systemTmp: false

# whether to verify online files/links (warning: this makes tests flaky)
online: false`
  )
}