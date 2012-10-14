# Developing Single-Page Ext JS Apps

{@img ../command/sencha-command-128.png}

## Introduction

Many Ext JS applications are implemented as a single, dynamic page that provides all of
the functionality required for the application. If the folder structure of the application
does not follow that produced by Sencha Command as described in
[Developing Ext JS Apps](#/guide/command_app), then the convenient commands like
"sencha app build" won't understand the application and cannot be used.

There are, however, lower-level commands provided by Sencha Command that can be used to
produce builds and perform all of the same tasks that are automated by the high-level
commands.

The most significant piece of this process is handled by Sencha Command's Compiler.

## Important Considerations

The ideal organization of code for consumption by the compiler is that used by Java, which
is also very much what the dynamic loader prefers.

To summarize this in a few basic rules:

 * Each JavaScript source file contains one `Ext.define` statement at global scope.
 * The name of a source file matches the last segment of the name of the defined type (e.g.,
 the name of the source file containing `Ext.define("MyApp.foo.bar.Thing", ...` would be
 "Thing.js".
 * All source files are stored in a folder structure that is based on the namespace of the
 defined type. For example, given `Ext.define("MyApp.foo.bar.Thing", ...`, the source file
 would be in a path ending with "/foo/bar".

## The Application

    index.php           # The application's markup file.
    build/              # The folder where build output is placed.
    ext/                # The framework distribution.
        src/            # The framework source tree.
    js/                 # Folder containing the application's JavaScript code.
        app.js          # Contains the Ext Application

The "index.php" file would look similar to this:

    <html>
        <head>
            <script src="ext/ext-dev.js" type="text/javascript"></script>

            <script src="js/app.js" type="text/javascript"></script>
        </head>
        <body>
            <?php ... ?>
        </body>
    </html>

### Preparing To Compile

In order for Sencha Command to support as many server-side technologies as possible, the
compiler has to be guided to the parts of the markup file that are for its consumption.
This is done using directives inside comments.

For example:

    <html>
        <head>
            <!-- <x-compile> -->
              <!-- <x-bootstrap> -->
                <script src="ext/ext-dev.js" type="text/javascript"></script>
              <!-- </x-bootstrap> -->

                <script src="js/app.js" type="text/javascript"></script>
            <!-- </x-compile> -->
        </head>
        <body>
            <?php ... ?>
        </body>
    </html>

The open and close tags of the `x-compile` directive enclose the part of the markup file
where the compiler will operate. The only thing that should be contained in this block
are `script` tags. The compiler will process all of these scripts for dependencies.

The exception to this, however, is the "ext-dev.js" file. This file is considered to be a
"bootstrap" file for the framework and should not be processed in the same way. The files
in the `x-bootstrap` block are ignored by the compiler, but are also removed from the final
page as we will see later.

## Compiling Your Page

The first job of the compiler is to examine and parse your JavaScript source code and
analyze its dependencies. These dependencies are expressed in code using `Ext.define` and
the `requires` (or `uses`) directives. Also, base classes and mixins are considered to be
dependencies the same as `requires`.

Obviously, the application requires its own code (in the "js" folder) as well as some of
the framework (in the "ext" folder). The goal is to create a single JavaScript file that
contains all of the code needed from both folders and exclude any code that is not used.

Since most build processes create the production build in a separate folder, let's use the
"build" folder to hold the outputs and thereby avoid overwriting any source code.

Lets start with this command:

    sencha compile -classpath=ext/src,js page +yui -in index.php -out build/index.php

This command will perform the following steps:

 * The `-classpath` switch provides the compiler with all of the folders containing source
 code to be considered. In this case, the "ext/src" and "js" folders.
 * The compiler's `page` command will then include all of the `script` tags in "index.php"
 that are contained in the `x-compile` block.
 * Given all of the contents of "ext/src", "js" and "index.php", the compiler will analyze
 the JavaScript code and determine what is ultimately needed by "index.php".
 * A modified version of "index.php" file will be written to "build/index.php".
 * All of the JavaScript files needed by "index.php" will be concatenated, compressed using
 the [YUI Compressor](http://developer.yahoo.com/yui/compressor/) and written to the single
 file "build/all-classes.js".

The compiled version of "index.php" will look approximately like this:

    <html>
        <head>
            <script src="all-classes.js" type="text/javascript"></script>
        </head>
        <body>
            <?php ... ?>
        </body>
    </html>

The entire `x-compile` section is replaced by the single `script` tag that includes the
"all-classes.js" file. The rest of the page remains unchanged.

This is just one step of a complete build process, but the others are typically simpler
(e.g., copying files) and so they are not considered here.

## Trimming The Excess

Due to the nature of dependency analysis, sometimes you may find that your application
contains code you know will never be used.

If you were to remove the `+yui` switch from the compile command show above, you can
examine "all-classes.js" and inspect all of the code that was identified as being needed
by your application. If you determine that there are classes present that you would like
to remove, this can be accomplished using slightly more advanced features of the compiler.

At its core, the compiler uses the concept of "sets" and set operations to manage what is
included in the concatenated output file. It first builds the set of all files as it reads
the code from the `-classpath`. The `page` command then determines the subset of files used
by "index.php".

To illustrate, let's assume that somehow the Tree package (Ext.tree.*) was being pulled in
to "all-classes.js" and we are certain that is incorrect. The following command shows how
to remove this namespace:

    sencha compile -classpath=ext/src,js \
        page -name=page -in index.php -out build/index.php and \
        restore page and \
        exclude -namespace Ext.tree and \
        concat +yui build/all-classes.js

The first change is to provide a name for the set of files produced by the `page` command.
By naming the set we disable the automatic generation of "all-classes.js" so we can adjust
its contents before generating it explicitly.

This also illustrates the use of "command chaining" and "category state" discussed in more
detail in [Advanced Sencha Command](#/guide/command_advanced). The summary of those two
concepts is that:

 * Each use of `and` separates commands in the same category (`compile` in this case).
 * The state of the `compile` is preserved across these commands.

Lets break down the individual steps in the above command as it deviates from what the
original command accomplished.

The `compile` command does the same as before and reads the code in the `-classpath`.

    sencha compile -classpath=ext/src,js \

The `page` command determines what is needed by "index.php" and generates the modified
version in "build/index.php". The `page` command also saves the set of files in a set
named "page" (and does not write out  "all-classes.js").

        page -name=page -in index.php -out build/index.php and \

The `restore` command restores the named set ("page") as the "current set". Most of the
sub-commands of the compiler operate on the "current set". Without this command, the
current set would be "all files".

        restore page and \

The `exclude` command removes all files in the `Ext.tree` namespace from the current set.

        exclude -namespace Ext.tree and \

The `concat` command concatenates and compresses all files in the current set and writes
the result to "build/all-classes.js".

        concat +yui build/all-classes.js

There are many more commands and options provided to manipulate the current set. Basically,
if you can imagine a way to arrive at the desired set of files using a sequence of set
operations, the compiler can combine just those files for you. For more on this topic,
see the [Sencha Compiler Reference](#/guide/command_compiler).

## Generating A Custom Bootstrap

The "bootstrap" file included in the example application ("ext-dev.js") contains two very
important things:

 * The minimal amount of the framework required to perform dynamic loading.
 * All of the metadata describing the classes and aliases in the framework.

This second part is what allows `requires` statements to use wildcards as in:

    Ext.define(..., {
        requires: [
            'Ext.grid.*'
        ]
    });

To use similar syntax in your application, you need to provide the required metadata for
the dynamic loader.

The following command will generate such a file:

    sencha compile -classpath=js \
        meta +alias -out build/bootstrap.js and \
        meta +alt +append -out build/bootstrap.js

This file should be added to the `x-bootstrap` section like so:

    <html>
        <head>
            <!-- <x-compile> -->
              <!-- <x-bootstrap> -->
                <script src="ext/ext-dev.js" type="text/javascript"></script>
                <script src="build/bootstrap.js" type="text/javascript"></script>
              <!-- </x-bootstrap> -->

                <script src="js/app.js" type="text/javascript"></script>
            <!-- </x-compile> -->
        </head>
        <body>
            <?php ... ?>
        </body>
    </html>

There are other uses for code metadata. For details on generating metadata and what kinds
of metadata are provided, see [Generating Metadata](#/guide/command_compiler_meta).

## Building Themes

The process for generating image slices for custom themes is simpler and more flexible than
in previous releases. For details on building your custom themes, please refer to
[Building Themes for Ext JS](#/guide/command_theme).
