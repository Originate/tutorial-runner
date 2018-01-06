# User-defined actions

It is possible to extend the set of
[built-in activity types](built-in-activity-types.md)
with your custom-built ones written in JavaScript.
Let's start by building the simplest possible action first.


## Hello-world example

The "hello-world" action prints the text "hello world"
in the test runner's console output when running.
It will be triggered via this piece of Markdown:

<a class="tr_createMarkdownFile">

```html
<a class="tr_helloWorld"></a>
```
</a>

When TextRunner encounters this block type,
it runs the method that the file <a class="tr_createFile">__text-run/hello-world-action.js__ exports.
All user-defined actions are in the "text-run" folder,
with the file name matching the action name
but in [kebab-case](http://wiki.c2.com/?KebabCase).
Let's create this file with the content:

```javascript
module.exports = function({ formatter }) {
  formatter.action('greeting the world')   // start the "greeting the world" activity type
  formatter.output('Hello world!')        // print something on the console
};
```

</a>

<a class="tr_runTextrun">
The formatter displays test progress on the console as the test runs:
</a>

<img src="async.gif" width="460" height="134" alt="output demonstration">

The handler function for our action is given an object containing various information and utility functions:

<!-- TODO: check this by creating a custom action that lists the arguments given to it -->
* __filename__, __startLine__, __endLine:__ location of the currently executed block in the documentation
* __nodes:__ the document content inside the `<a>` tag for this action,
  as an array of [AST nodes](#ast-nodes)
* __searcher:__ a utility that makes it easier to get content out of those AST nodes ([documentation](#the-searcher-helper))
* __formatter:__ the [Formatter](#formatter) instance to use, for signaling test progress and console output to TextRunner
* __configuration:__ TextRunner configuration data (which TextRunner options are enabled)
* __runner:__ the currently running handler function

TextRunner supports all forms of synchronous and asynchronous operations:
* just do something synchronous ([example](../examples/custom-action-sync)) -
  don't worry that synchronous operations prevent concurrency by blocking Node's event loop,
  all TextRunner steps are run strictly sequentially anyways
* return a Promise  <!-- TODO: example -->
* implement the action as a modern
  [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
  <!-- TODO: example -->
* take a callback function as a second parameter to your handler function and call it when you are done
  ([example](../examples/custom-action-async))

You can write the handler in any language that transpiles to JavaScript,
for example [BabelJS](https://babeljs.io),
[CoffeeScript](http://coffeescript.org),
or [LiveScript](http://livescript.net).
Just make sure that your project contains a local installation of your transpiler,
since TextRunner does not find globally installed transpilers.
This means your project should have a `package.json` file listing the transpiler you want TextRunner to call,
in addition to any other NPM modules that your handler method uses.


## AST Nodes

Document content is provided as [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) nodes.
Each node is an object that has these attributes:
* __line:__ the line in the file at which this AST node begins
* __type:__ the type of the AST node
* __content:__ textual content of the AST node
* __src:__ the content of the `src` attribute if this AST node is a link or image
* __level:__ if this AST node was nested in another one, the nesting level


## Formatter

One of the utilities availabe to actions is the formatter instance.
It allows to signal test progress to TextRunner and print test output to the console.

Call `formatter.action(<activity name>)` before you run an activity.
This tells TextRunner that whatever happens next (output, success, failure) is part of that activity.

`formatter.output(text)` allows to print output of the currently running action
on the console. Depending on the type of formatter, this output is printed or not.

When the test succeeds, call `formatter.success()`.
If it fails, call `formatter.error()` with the error message.

TextRunner supports a variety of formatters:

* __detailed formatter:__
  Prints each test performed, including test output.

* __dot formatter:__
  A minimalistic formatter, shows only dots for each test performed.


## The "searcher" helper

More realistic tests for your documentation
will need to access document content
in order to use it in tests.
The DOM nodes of the active block
including their type, content, and line number -
are provided to your handler function
via the the `nodes` field of the first argument.
You can access this data directly
or use a helper that is provided to you via the `searcher` field of the first parameter.
To demonstrate how this works,
here is a simple implementation of an action that runs a code block in the terminal.

<a class="tr_createMarkdownFile">

```
<a class="tr_consoleCommand">
`​``
echo "Hello world"
`​``
</a>
```
</a>

Here is the block definition implemented using the `searcher` helper,
as always implemented in a file called
<a class="tr_createFile">
__text-run/console-command.js__:

```javascript
child_process = require('child_process')

module.exports = function({formatter, searcher, nodes}) {

  // step 1: provide a first rough description of what this action does,
  // so that TextRunner can print a somewhat helpful error message
  // if loading more specific data below fails somehow
  formatter.action('running console command')

  // step 2: determine which command to run using the searcher utility
  // (you could also iterate the "nodes" array directly here)
  const commandToRun = searcher.tagContent('fence')

  // step 3: provide TextRunner a more specific description of this action
  formatter.action('running console command: ' + commandToRun)

  // step 4: perform the action
  formatter.output(child_process.execSync(commandToRun, {encoding: 'utf8'}))
}
```
</a>

<a class="tr_runTextrun"></a>

The `searcher.tagContent` method returns the content of the DOM node
that satisfies the given query.
In this case we are looking for a fenced code block,
hence the query is `'fence'`.
Providing an array for the type (e.g. `['code', 'fence']}`)
retrieves all nodes that have any of the given types.

This method throws if it finds more or less than one tag of the given type
in the active block. Other tag types are ignored.

The optional second argument allows you to provide a default value
in case no matching tag is found, e.g. `{default: ''}`.

<hr>

Read more about:
- the [built-in activity types](built-in-activity-types.md)
- [configure](configuration.md) TextRunner