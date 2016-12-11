require! {
  'chalk' : {bold, dim, green, magenta, red, yellow}
  'figures'
  'indent-string'
  'log-update'
  'prelude-ls' : {compact, unique}
  'strip-ansi'
}


# The standard formatter, uses green, yellow, and red icons
class IconicFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @start-line = null
    @end-line = null

    # the header for the current activity, which will be printed differently later
    @activity-header = ''

    # the console output created by the current activity
    @activity-console = ''

    # Note: I have to define these attributes here,
    #       since doing so at the class level
    #       binds them to the class scope for some reason
    @stdout =
      write: @output

    @stderr =
      write: @output

    @console =
      log: (text) ~>
        @output "#{text}\n"



  # called when we start processing a markdown file
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity that was defined in a block
  start: (@activity-text) ->
    @_set-activity-header yellow(figures.pointer), yes
    @activity-console = ''
    @_print!


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_set-activity-header green figures.tick
    @activity-console = ''
    @_print!
    log-update.done!
    @activity-header = ''


  # Called on general errors
  error: (@error-message) ->
    @_set-activity-header red figures.cross
    @_print!
    process.exit 1


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @_set-activity-header yellow(figures.pointer), yes
    @_print!


  set-lines: (@start-line, @end-line) ->


  # Called on general warnings
  warning: (@warning-message) ->
    @activity-text = ''
    @_set-activity-header magenta figures.warning
    @activity-console = ''
    @_print!
    log-update.done!
    @activity-header = ''


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update bold green "\nSuccess! #{steps-count} steps passed"


  _set-activity-header: (figure, newline) ->
    @activity-header = "#{figure} "
    if @documentation-file-path
      @activity-header += "#{@documentation-file-path}"
      if @start-line
        @activity-header += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      @activity-header += " -- "
    if @error-message
      @activity-header += bold(@error-message)
    else if @warning-message
      @activity-header += bold(@warning-message)
    else
      @activity-header += bold(@activity-text) if @activity-text
    @activity-header += "\n" if newline


  _print: ->
    log-update @activity-header + @activity-console


  output: (text) ~>
    @activity-console += dim strip-ansi text
    @_print!



module.exports = IconicFormatter
