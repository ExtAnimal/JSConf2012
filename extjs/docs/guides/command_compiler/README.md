# Sencha Compiler Reference

One of the major components new to V3 of Sencha Cmd is the compiler. In a nutshell, the
compiler is a JavaScript-to-JavaScript, framework-aware optimizer. It is designed to
"understand" your high-level, Ext JS and Sencha Touch code and produce the smallest, most
efficient code possible to support these high-level abstractions.

{@img ../command/sencha-command-128.png}

Before digging in to the depths of the compiler, it is a good idea to read up on the most
common use cases described in these guides:

 * [Using Sencha Cmd with Ext JS](#/guide/command_app)
 * [Single-Page Ext JS Apps](#/guide/command_app_single)
 * [Multi-Page Ext JS Apps](#/guide/command_app_multi)

With this basic understanding, the details below should help flesh out the possibilities.

In the above guides, the compiler's `page` command played a key role. This command is not
required, and so the majority of this reference focuses on using the compiler is a more
manual way without the `page` command.

While this shift of focus is important to explain the compiler, keep in mind that it is
**highly recommended** that you use the `page` command whenever possible. The `page` command
presents the compiler with the best vantage point on the code it is compiling, gives it
the most flexibility for future optimizations and also reduces repetition of code or page
content on the command line.

## Sets And The Current Set

The compiler manages a set of source files and analyzes these files to determine their
dependencies. The set of all files is determined by the "classpath":

    sencha compile -classpath=sdk/src,app ...

In this example, the compiler recursively loads "*.js" from the specified list of folders.
This set of all files defines the basis for all operations to follow (i.e., it defines the
"universe").

The compiler's output commands (e.g., `concat` and `metadata`) operate on the set of files
called the "current set". The current set starts out equal to the universe of all files,
but this can be manipulated using the many commands provided to perform set operations.

NOTE: With the compiler, you will often see rather long command lines using the command
chaining mechanism "and". Also, in practical use cases, once command lines start to get
very long, you will probably want to consider using [Ant](#/guide/command_ant) or a
"response file". See [Advanced Sencha Cmd](#/guide/command_advanced). In this guide,
all command lines will be complete (and potentially long) to keep the examples as clear
as possible.

## Generating Output with `concat`

A compiler ultimately is all about writing useful output given some number of inputs. The
`concat` command is designed to concatenate the source for the current set of files in the
appropriate dependency order.

The one required parameter is `-out` which indicates the name of the output file. There are
other options, however, that effect the generated file. You can pick one of the following
options for compression:

 * `-compress` - Compress the generated file using the default compressor. Currently this
 is the same as `-yui`.
 * `-max` - Compress the generated file using all compressors and keep the smallest.
 * `-closure` - Compress the generated file using [Google Closure Compiler](https://developers.google.com/closure/compiler/).
 * `-uglify` - Compress the generated file using [UglifyJS](https://github.com/mishoo/UglifyJS/).
 * `-yui` - Compress the source file using  [YUI Compressor](http://developer.yahoo.com/yui/compressor/).
 * `-strip` - Strip comments from the output file, but preserve whitespace. This is the
 option used to convert `ext-all-debug-w-comments.js` into `ext-all-debug.js`.

The following command illustrates how to produce three flavors of output given a single
read of the source.

    sencha compile -classpath=sdk/src \
        exclude -namespace Ext.chart and \
        concat ext-all-nocharts-debug-w-comments.js and \
        -debug=true -strip \
        concat ext-all-nocharts-debug.js and \
        -debug=false -yui \
        concat ext-all-nocharts.js

### Generating Metadata

The compiler can also generate metadata in many useful ways. For example, the names of all
source files, the set of files in dependency order, etc.. To see what is available, check
out [Generating Metadata](#/guide/command_compiler_meta).

## Saving And Restoring Sets

As you find the need to produce multiple output files, it can be very helpful to save the
current set for later use.

    sencha compile -classpath=sdk/src \
        exclude -namespace Ext.chart and \
        save nocharts and \
        ...
        restore nocharts and \
        ...

The `save` command simply takes a snapshot of the current set and stores it under the given
name ("nocharts" in the above).

The simplest use of a saved set is the `restore` command. This does the reverse and restores
the current set to its state at the time of the `save`.

## Set Operations

Many of the commands provided by the compiler are classified as "set operations". That is,
operations that work on and produce sets. In the case of the compiler, sets of files or
classes.

Before diving into the details of these commands, a quick primer on set terminology will
be helpful.

### A Little Set Theory

There are three classic set operations:

 * Intersection - The intersection of two sets is a set containing only what was in both
 sets.
 {@img set-intersect.png}

 * Union - The union of two sets is a set containing whatever was in either of the sets.
 {@img set-union.png}

 * Difference - The difference of two sets is the set of all things in the first set that
 are not in the second set.
 {@img set-difference.png}

### Set `include` and `exclude`

These two set operations are probably the most common (and flexible) set operations. Both
support these basic switches:

 * `-namespace` - Matches files that define types in the specified namespace.
 * `-class` - Matches a specific defined type.
 * `-file` - Matches filenames and/or folder names using Ant-style glob patterns (a "*"
 matches only filename characters, where "**" matches folders).
 * `-tag` - Matches any files with the specified tag(s) (see below).
 * `-set` - The files that are present in any of the specified named sets.

In all of these cases, the next command line argument is a comma-separate list of match
criteria. Also, a single `exclude` or `include` can have as many switch/value pairs as
needed.

So, let's start with a simple example and build an "ext-all-no-charts-debug-w-comments.js".

    sencha compile -classpath=sdk/src \
        exclude -namespace Ext.chart and \
        ...

What is happening here is that we started with only the Ext JS sources (in sdk/src) and
they were all part of the "current set". We then performed a set difference by excluding
all files in the "Ext.chart" namespace. The current set was then equivalent to "ext-all"
but without any of the Chart package.

### Negating `include` and `exclude` with `-not`

Both `include` and `exclude` support a rich set of matching criteria. To round this out,
there is also the `-not` switch. This switch negate the matching criteria that follows it
such that the files included or excluded will be all those that do not match the criteria.

For example:

    sencha compile -classpath=sdk/src,js \
        ... \
        exclude -not -namespace Ext and \
        ...

The above `exclude` command will exclude from the current set any classes that are not in
the "Ext" namespace.

### The `all` Set

In some cases, it is very handy to restore the current set to all files or to the empty set.
To do this, you simply use `include` or `exclude` with the `-all` switch. To build on the
previous example:

    sencha compile -classpath=sdk/src \
        ... \
        include -all and \
        ... \
        exclude -all and \
        ...

After the `include -all`, the current set is all files. After `exclude -all` it is the
empty set.

### Union

As you have seen, the `include` command is a form of set union: it performs a union of the
current set with the set of matching files. Sometimes it is desirable to not include the
current set in the union and only those file matching the desired criteria. This is what
the `union` command does.

The `union` command has all of the options of `include`. In fact, this `union` command:

    sencha compile -classpath=sdk/src ... and \
        union -namespace Ext.grid,Ext.chart and \
        ...

Is exactly equivalent to this pair of `exclude` and `include` commands:

    sencha compile -classpath=sdk/src ... and \
        exclude -all and \
        include -namespace Ext.grid,Ext.chart and \
        ...

### Transitivity / Recursive Union

One of the most important set operations is the union of all files explicitly specified
and all of the files they require. And also the files they require, etc.. This is the core
of a build process since this is how you select only the set of files you need. So, if you
have a small set of top-level files to start the process, say the class `MyApp.App`, you
can do something like this:

    sencha compile -classpath=sdk/src,app \
        union -r -class MyApp.App and \
        ...

The `union` command starts with no current set, includes only the class `MyApp.App` and
then proceeds to include all the things it needs recursively. The resulting current set
is all files needed by the application.

### Intersect (Strict)

The `intersect` command is a bit less flexible in the criteria it supports: it only accepts
named sets (using `-set`).

    sencha compile -classpath=sdk/src,common,page1/src,page2/src \
        ... \
        intersect -set page1,page2 and \
        ... \

This command above intersects the two page sets and produces their intersection as the
current set.

### Intersect (Fuzzy)

When dealing with more than two sets, `intersect` has an option called `-min` that sets
the threshold for membership in the current set. This option is discussed in more detail
in [Multi-Page Ext JS Apps](#/guide/command_app_multi).

For example,

    sencha compile ... \
        intersect -min=2 -set page1,page2,page3 and \
        ...

This use of `intersect` produces in the current set all files that are found in 2 of the 3
sets specified.

## Compiler Directives

In many situations, it is helpful to embed metadata in files that only the compiler will
pick up. To do this, the compiler recognizes special line comments as directives.

The list of directives is:

 * `//@tag`
 * `//@define`
 * `//@require`

### Tagging

In an ideal world, a namespace would be sufficient to define a set of interest. Sometimes,
however, a set can be quite arbitrary and even cross namespace boundaries. Rather than move
this issue to the command-line level, the compiler has the ability to track arbitrary tags
in files.

For example:

    //@tag foo,bar

The above will assign the tags "foo" and "bar" to the file. These tags can be used in the
`include`, `exclude` and `union` commands with their `-tag` option.

### Dealing with "Other" JavaScript Files

In some cases, JavaScript files define things and require things that are not expressed in
terms of `Ext.define` and `requires` or `Ext.require`. Using `Ext.define` you can still
say that a class `requires` such things and the dynamic loader will not complain so long
as those things exist (if they do not exist, the loader will try to load them which will
most likely fail).

To support arbitrary JavaScript approaches to defining and requiring types, the compiler
also provides these directives:

    //@define Foo.bar.Thing
    //@requires Bar.foo.Stuff

These directives set up the same basic metadata in the compiler that tracks what file
defines a type and what types that file requires. In most ways, then, these directives
accomplish the same thing as an `Ext.define` with `requires` property.

Of course, you can use either of these directives in a file without using the other.

## Conditional Compilation

You may have seen in the SDK sources, code that looks like this:

    foo: function () {
        //<debug>
        if (sometest) {
            Ext.log.warn("Something is wrong...");
        }
        //</debug>

        ...
    }

The idea here is that some code is very helpful in development, but too expensive to have
in production. The above illustrates only one of the many conditional compilation directives
supported by the compiler, but it is also the most useful.

IMPORTANT: The thing to be aware of when using conditional compilation is that unless you
are always running compiled code, these directives are just comments and the conditional
code will be "live" during development.

### The &lt;debug> directive

When compiling, by default, none of the preprocessor statements are examined. So in this
case, the result is development mode. If we switch on `-debug` we get a very similar result,
but with the preprocessor active. In fact, the only difference is that the preprocessor
directives are removed.

That is, this command:

    sencha compile -classpath=... \
        -debug \
        ...

Will generate code like this for the above:

    foo: function () {
        if (sometest) {
            Ext.log.warn("Something is wrong...");
        }

        ...
    }

Whereas this command:

    sencha compile -classpath=... \
        -debug=false \
        ...

Will generate code like this for the above:

    foo: function () {
        ...
    }

You can see that the "if" test and the log statement are both removed.

### The &lt;if> directive - TODO

The most general directive is `if`. The `if` directive tests one or more configured options
against the "attributes" of the directive and removes the code in the the block if any are
false.

For example:

    //<if debug>
    //</if>

This is equivalent to the `<debug>` directive.

TODO
