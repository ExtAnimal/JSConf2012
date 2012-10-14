# Advanced Sencha Cmd

Sencha Cmd is a cross-platform command line tool that provides many automated tasks
around the full life-cycle of your Sencha applications, from generating a fresh new project
to deploying for production.

{@img ../command/sencha-command-128.png}

Before reading this guide, be sure you have covered the basics described in
[Introduction to Sencha Cmd](#/guide/command).

## Installation Considerations

### Location

The Installer allows you select a destination path, but changing this can have side-effects
(discussed next). Ideally, all versions of Sencha Cmd are installed in a single base
folder with sub-folders named by the version number. On Windows, the default install folder
for a single-user installation is:

    C:\Users\myself\bin\Sencha\Cmd\3.0.0\

It is highly recommended that if you change this path, you preserve the last piece (that
is, the version number) as well as install any other versions of Sencha Cmd in that
same parent folder.

### Multiple Installed Versions

At the command prompt, all calls to `sencha` will land in the most recently installed version
of Sencha Cmd. Sometimes, however, this version may not be compatible with the current
application.

To support such scenarios, Sencha Cmd will look at the required version as specified by
the application (in `./sdk/.sencha.cfg` which was copied from the SDK when the application
was generated). It will then delegate the command to the the proper version of Sencha
Cmd.

IMPORTANT: For this to work properly, both versions must be installed in a folder named by
their version number and located in a common parent folder.

Alternatively, each installed version also provides a version-specific name for Sencha
Cmd. This can be run as follows:

    sencha-3.0.0 ....

Finally, the installer also sets an environment variable of the form "SENCHA_CMD_3_0_0"
which can be used to adjust the PATH of the current console/shell:

On Windows:

    set PATH=%SENCHA_CMD_3_0_0%;%PATH%
    sencha ....

On Mac / Linux:

    set PATH=$SENCHA_CMD_3_0_0:$PATH
    sencha ....

## Configuration

Any parameter that can be passed to Sencha Cmd on the command line can be set as a
configuration option in one of the configuration files discussed below. If you know the
command line option, it is a simple matter to add that option to a configuration file.

For example, to specify the "name" parameter for "sencha generate app" in the configuration,
add this line:

    sencha.generate.app#name=MyApp

Of course, this particular parameter does not make sense to configure in this way. This is
just to illustrate the link-style syntax. The content before the "#" is the Sencha Cmd
commands separated by dots. Following the "#" is the option name.

To set global options (like "debug" logging), do this:

    sencha#debug=true

Configuration will become more important over time as Sencha Cmd (especially the
compiler) evolves.

### Configuration Files

Configuration is applied in a simple "cascade" starting with the configuration file found
in the Sencha Cmd folder called `.sencha.cfg`. This contains the default configuration
for Sencha Cmd. All properties in that file are loaded as Sencha Cmd launches.

If there is a `.sencha.cfg` in the current directory, it is loaded next and will override
any options from the previous file. This case comes in to play when using "sencha generate app"
from inside an SDK folder.

Lastly, when Sencha Cmd is run from your application folder, the `.sencha.cfg` file
from the `./sdk` folder is loaded. This file was placed there by `sencha generate app` and
can be use to contain project-specific configuration.

## Command Line Details

If you use Sencha Cmd frequently, there are some tricks that will be helpful to know.

### Shortest-Unique Prefix

All commands, categories and options in Sencha Cmd can be specified by their full name
or by the shortest prefix that is unique.

To illustrate, since "generate" is the only top-level category in Sencha Cmd that starts
with the letter "g" (at the present time), and likewise, "app" is the only command in that
category that starts with an "a", the following commands are equivalent:

    sencha generate app MyApp ../MyApp
    sencha g a MyApp ../MyApp

IMPORTANT: While this can be convenient at the console or terminal, it is not advisable to
use these shorthands in scripts. The use of such terse commands in scripts will needlessly
confuse anyone trying to understand or maintain the script in the future.

### Command Chaining

The Sencha Cmd command-line processor executes all commands given to it until they have
all been dispatched. This means you can avoid the cost of re-launching the whole Sencha
Cmd process to execute multiple commands. To take advantage of this, you just insert
"and" or "then" between commands.

The "and" and "then" commands are based on the execution model of Sencha Cmd and its
hierarchical structure of commands and categories. The "and" command is used to execute
another command in the same category as the previous command. This is the most common use
case.

For example, to generate a controller and 2 models:

    cd /path/to/MyApp
    sencha generate controller Central and model User id:int and model Ticket id,name,email

In the above, the 2 uses of "and" caused the 2 "generate model" commands to be executed. The
"then" command is similar to "and", except that the next command will be part of the "root"
category (that is, the "sencha" command).

For example, the following will generate a new model then build the application:

    cd /path/to/MyApp
    sencha generate model User id:int,name then app build

### Response Files

When command chaining starts to make command lines too long to be readable (perhaps in a
complex build script), it is possible to put command line arguments in a file and tell
Sencha Cmd to read arguments from that file.

For example:

    cd /path/to/MyApp
    sencha @file.sencha

In the above, the `file.sencha` file is read and each line is taken to be a command line
argument. Unless that line begins with "#", in which case it is skipped. All lines from
the specified file will be inserted into the command line arguments as if they had been
typed there instead of "@file.sencha". This means that `file.sencha` can contain response
file insertions as well (for example, "@file2.sencha").

### Category State

For performance reasons, some categories maintain state across multiply executed commands.
The best example of this is the new `compile` category of commands. Instead of reading all
the sources for each command, the `compile` category maintains a cache of all the files in
the "class path". This context is then available to all of the commands in the category.

For starters, the following command will rebuild the `ext-all-dev.js` and `ext-all.js` files
but read the framework sources only once:

    cd /path/to/MyApp
    sencha compile -c sdk/src --debug=true concat -o sdk/ext-all-dev.js \
        and --debug=false concat -c -o sdk/ext-all.js

If this caching is not wanted, perhaps because the set of files is not the same for the
next set of outputs, use the "then" command:

    cd /path/to/MyApp
    sencha compile -c sdk/src --debug=true concat -o sdk/ext-all-dev.js \
         then compile -c app/foo --debug=true concat -o app/foo/foo-all.js

At the present time, only the `compile` category maintains state across commands.

## SDK-specific Commands

The same Sencha Cmd install is used by both Ext JS and Sencha Touch and as such there
are many times when commands perform slightly different operations. Further, some commands
are only available for one framework (e.g., native packaging).

To accomodate this, the functionality of Sencha Cmd is partitioned across two (2) layers:
the command line (properly called "Sencha Cmd") and the lower-level interface for use
in [Ant](http://ant.apache.org/).

{@img sencha-command-diagram.png}

The SDK provides its logic in the form of two (2) Ant files that live in `./sdk/cmd`:

 * `./sdk/cmd/plugin.xml` - This file should be considered read only and is
   provided by the SDK at the time of `sencha generate app`.
 * `./sdk/command/plugin.xml` - This file includes `plugin-impl.xml` to provide the actual
   logic, but this file is intended for users to edit to set hooks that run before and/or
   after SDK actions such as `sencha generate model`.

The intended purpose of `plugin.xml` is to allow users to attach logic before and/or after
models are generated and added to the application. There are often outside issues to deal
with in this case.

If you want to do some checks to see if new model definitions follows project guidelines,
say that the first field is always "id:string", you could add this to
`sdk/command/plugins.xml`:

    <target name="-before-generate-model">
        <if>
            <not><matches string="${args.fields}" pattern="^id\:string,.*"/></not>
            <then>
                <fail>Models must have "id:string" as first field.</fail>
            </then>
        </if>
    </target>

You could also provide a hook to update other systems when a new model has been added.

    <target name="-after-generate-model">
        ... post new/updated Model ${args.name} and ${args.fields} ...
    </target>

For details on what sorts of hooks are available, see the comments in the plugin.xml file.

NOTE: The `plugins-impl.xml` file imports [Ant Contrib](http://ant-contrib.sourceforge.net/)
which provides many [useful tasks](http://ant-contrib.sourceforge.net/tasks/tasks/index.html).

## Use in Ant

While the primary use of Sencha Cmd is at the command line (hence its name), Sencha Cmd
also usable directly from Ant.

There are many commands provided at this level, so if you are interested, check out the
[Ant Integration](#/guide/command_ant) guide.
