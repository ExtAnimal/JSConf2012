# Introduction to Sencha Cmd

Sencha Cmd is a cross-platform command line tool that provides many automated tasks
around the full life-cycle of your applications, from generating a fresh new project to
deploying for production.

{@img sencha-command-128.png}

## Requirements

Step 1: Download and install a [Jave Run-time Environment or JRE](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
The JRE version must be at least JRE 6, but the most up-to-date version is usually the best choice.

Step 2: Download and install [Compass](http://compass-style.org/). Compass may also have
System Requirements that you will need to meet. Compass is required for most uses of
Sencha Cmd.

Step 3: Download and install the latest [Sencha Cmd](http://www.sencha.com/products/sdk-tools).

Step 4: Download the latest [Ext JS](http://www.sencha.com/products/extjs/) or
[Sencha Touch](http://www.sencha.com/products/touch/) SDK.

Step 5: Extract the SDK to a local directory.

Step 6: Verify that Sencha Cmd is working properly on your machine:

Open a command line terminal, and run the following commands. Replace `/path/to/sdk` with
the actual path to the SDK that you extracted to previously (**not the Sencha Cmd
directory**).

    cd /path/to/sdk
    sencha

You should see output that starts like this:

    Sencha Cmd v3.0.0
    ...

If the above message appears and the version number is "3.0.0" or newer you are all set.

## Command Basics

All of the features provided by Sencha Cmd are arranged in categories (or modules) and
commands.

    sencha [category] [command] [options...] [arguments...]

Help is available using the "help" command.

    sencha help [module] [action]

For example, try this:

    sencha help

And you should see this:

    Sencha Cmd v3.0.0

    OPTIONS
      * --debug, -d - Sets log level to higher verbosity
      * --plain, -p - enables plain logging output (no highlighting)
      * --quiet, -q - Sets log level to warnings and errors only
      * --sdk-path, -s - sets the path to the target sdk

    CATEGORIES
      * compile - Compile sources to produce concatenated output and metadata
      * generate - Generate code like models and controllers or raw templates
      * theme - Builds a set of theme images from a given html page
      * app - Perform various application build processes

    COMMANDS
      * ant - Invoke Ant with helpful properties back to Sencha Cmd
      * build - Builds a project from a JSB3 file.
      * config - Loads a config file or sets a configuration property
      * help - Get help on using Sencha Cmd

## Current Directory

In many cases, Sencha Cmd requires you have a specific current directory. Or it may just
need to know details about the relevant SDK. This can be determined easily when Sencha Cmd
is run form an extracted SDK folder or from a generated application.

The following is a summary of these needs organized by what is required and the commands
that have that requirement.

 * Require knowledge of which SDK is in use
    * `sencha generate app`
    * `sencha compile`
 * A generated application root folder
    * `sencha generate ...` (all commands other than `app` and `workspace`)
    * `sencha app ...`

The commands that require the current directory to be a generated application root folder
will fail if not run from such a folder.

When a command requires knowledge of the SDK but you are not currently in an extracted SDK
folder or an application root folder, you need to use the `-sdk` switch like so:

    sencha -sdk /path/to/sdk ...

## Developing Applications

The starting point for most projects is to generate an application skeleton. This is done
using:

    sencha generate app MyApp /path/to/MyApp

There are differences between the way Ext JS and Sencha Touch applications are structured.
Further, particularly for Ext JS users, applications can be quite large and may contain
multiple pages.

To get started building applications using Sencha Cmd, consult the
[Using Sencha Cmd](#/guide/command_app) guide.

## Beyond The Basics

There are many other details related to using Sencha Cmd that can be helpful. The `help`
command is a great reference, but if you want to walk through all the highlights, consult
[Advanced Sencha Cmd](#/guide/command_advanced).

## Troubleshooting

### Command Not Found

Upon running `sencha`, if there is an error message appears saying "sencha: command not found"
on OS X / Linux or "'sencha' is not recognized as an internal or external command, operable
program or batch file." on Windows, follow these steps to troubleshoot:

- Close all existing terminal / command prompt windows and re-open them. 
- Make sure that Sencha Cmd is properly installed:
    - The installation directory exists. By default, the installation path is:
        - Windows: `C:\Users\Me\bin\Sencha\Cmd\{version}`
        - Mac OS X: `~/bin/Sencha/Cmd/{version}`
        - Linux: `~/bin/Sencha/Cmd/{version}`
    - The path to Sencha Cmd directory is prepended to your PATH environment variable.
      From the terminal, run `echo $PATH` (`echo %PATH%` on Windows). The Sencha Cmd
      directory should be displayed in part of the output. If this is not the case, add it
      to your PATH manually.
    - The environment variable `SENCHA_CMD_{version}` is set, with the value being
      the absolute path to the installation directory mentioned above. For example: If the
      installed version is '3.0.0', a `SENCHA_CMD_3_0_0` must be set. If the output is
      empty, set the environment variable manually. To check, go to the Command Prompt (or
      "Terminal") and run:
        - Windows: `echo %SENCHA_CMD_3_0_0%`
        - Other - `echo $SENCHA_CMD_3_0_0`
	
### Wrong Current Directory

A common mistake is to perform a command that requires the current directory to be either
an extracted SDK directory or an application directory and yet not be in such a directory.
If this requirement is not met, Sencha Cmd will display an error and exit.
	
Note that a valid application directory is one that was generated by Sencha Cmd, or one
that exactly follows that structure.

### Errors While Resolving Dependencies

The `sencha app build` command works by reading your `index.html` and scanning for required
classes. If your application does not properly declare the classes it requires, the build
will usually complete but will not contain all the classes needed by your application.

To ensure that you have all required classes specified, always develop with the debugger
console enabled ("Developer Tools" in IE/Chrome, FireBug in FireFox and Web Inspector in
Safari) and resolve all warnings / error messages as they appear.

Whenever you see a warning like this:

    [Ext.Loader] Synchronously loading 'Ext.foo.Bar'; consider adding 'Ext.foo.Bar' explicitly as a require of the corresponding class
	
Immediately add 'Ext.foo.Bar' inside the `requires` array property of the class from which
the dependency originates. If it is a application-wide dependency, add it to the `requires`
array property inside `Ext.application(...)` statement.
