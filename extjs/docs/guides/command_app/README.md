# Developing Ext JS Apps

{@img ../command/sencha-command-128.png}

## Introduction

This guide will walk through the process of developing an Ext JS application starting with
the `sencha generate app` command and using the corresponding `sencha app build` command
to produce your build.

If you have an existing, single page application you might consider using Sencha Command
to build an application skeleton and transporting your application into this preferred
structure. This will provide you with the maximum leverage from Sencha Command.

If this path is not suitable, however, you can still use Sencha Command to help with many
aspects of your development. For developing single-page applications with a custom folder
structure, see [Developing Single-Page Ext JS Apps](#/guide/command_app_single).

For those applications that have multiple pages, it may be helpful to start by learning
about the simple uses of Sencha Command described in this and the above guide. The details
of more complex, multi-page applications can be found in
[Developing Multi-Page Ext JS Apps](#/guide/command_app_multi).

## Generating Your Application

The starting point for most projects is to generate an application skeleton. This is done
using:

    sencha generate app MyApp /path/to/MyApp

**IMPORTANT:** The above command must be able to determine your desired SDK. This can be
satisfied by either executing this command from a folder containing an extracted SDK
distribution or by using the `-sdk` switch like so:

    sencha -sdk /path/to/SDK generate app MyApp /path/to/MyApp

The application you have generated will look like this:

    index.html              # The entry point to your application
    app.json                # Application configuration
    app/                    # Your application's source code in MVC structure
        app.js              # Your application's initialization logic
        controller/
            Main.js         # The initial default Controller
        model/
        store/
        view/
            Main.js         # The initial default View

    build/                  # The folder where build output is placed.

    resources/
        css/
            app.css         # The main stylesheet, compiled from ../sass/app.scss
            default/        # Contains content generated for the default theme
                theme.css   # The CSS file generated from ../sass/default

        sass/
            app.scss        # The SASS file which compiles to ../css/app.css
            default/        # Contains the SASS code for the default theme

        theme/              # This folder contains Theme Builder information
            custom.js       # Contains any theme customizations (like custom components)
            manifest.js     # Generated (do not edit)
            render.js       # Generated (do not edit)
            shortcuts.js    # Generated (do not edit)
            styles.css      # Generated (do not edit)
            default/        # The name of the theme ("default" is generated initially)
                theme.html  # The control file for generating a theme

    sdk/                    # A copy of the SDK from which this application was generated

## Extending Your Application

`sencha generate` helps you quickly generate common MVC components such as controllers or
models:

    sencha help generate

You should see this:

    Sencha Command v3.0.0
    HELP -- generate

    COMMANDS:
    * app - Generates a starter application
    * controller - Generates a Controller for the current application
    * model - Generates a Model for the current application
    * profile - (Touch Only) Generates a profile for the current application
    * store - Generates a Store for the current application
    * view - Generates a View for the current application

**IMPORTANT**: In order to execute these commands, the current directory **must** be the
top-level folder of your application (in this case, "/path/to/MyApp").

### Adding New Models

Adding a model to your application is done by making the /path/to/MyApp your current
directory and running Sencha Command:

    cd /path/to/MyApp
    sencha generate model User id:int,name,email

This command will add a model to the application called "User" with the given 3 fields.

### Adding New Controllers

Adding a controller is similar to adding a Model:

    cd /path/to/MyApp
    sencha generate controller Central

There are no other parameters in this case beyond the controller name.

### Adding New Views

TODO

### Adding New Stores

TODO

## Custom Themes

All applications start with a "default" theme, so it is typically not necessary to add any
themes. If you application wants to support multiple themes, however, then this is the
first step:

    cd /path/to/MyApp
    sencha generate theme red

This will create the following folders and some starter content:

 * `./resources/theme/red`
 * `./resources/css/red`
 * `./resources/sass/red`

For details on how to manage and build themes, see [Building Themes](#/guide/command_theme).

## Building Your Application

All that is required to build your application is to run the following command:

    sencha app build

**IMPORTANT**: In order to execute this command, the current directory **must** be the
top-level folder of your application (in this case, "/path/to/MyApp").

This command will build your markup page, JavaScript code, SASS and themes into the "build"
folder.

## Upgrading Your Application

Generated applications always have their own copies of the SDK from which they were originally
generated. Upgrading these application to the a new of the SDK means replacing the old copy
with the new one.

This is done by changing directories to your application folder and running the following
command:

    sencha app upgrade ../downloads/ext-4.1.2

Where the path is the path to a downloaded and extracted SDK.
