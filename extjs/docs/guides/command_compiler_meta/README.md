# Generating Metadata

The compiler's primary role is to read JavaScript code and produce concatenated (and
compressed) output files. In doing this, the compiler has to understand many things about
the code. It turns out that this metadata tracked by the compiler can have many other
uses. To support these uses, the compiler can export and format this metadata in several
different ways.

{@img ../command/sencha-command-128.png}

## Generating Output with `meta`

One of the major new dimensions to using the compiler is the ability to export its meta-data
in various formats. This feature is used to produce the `ext.js` "bootstrap" file which
contains various classes and then a block of meta-data about all of the files in the
framework.

There are several forms of meta-data that the compiler can export using the `meta` command:

 * Class aliases
 * Alternate class names
 * Loader paths
 * Filenames

### Generating A Custom Bootstrap

The primary use for the `meta` command is to create your own "bootstrap" file. This file
will give the framework the same level of "awareness" of your application code that it has
of the framework code itself.

The simplest way to manage your bootstrap file is to store it along side your markup file.
If that cannot work for you, read on to see how to manage relative paths.

If you have your markup file in a source folder in your classpath, you will need to tell
the compiler to ignore the bootstrap file. You can do this using the `-ignore` switch:

    sencha compile -classpath=sdk/src,app -ignore bootstrap.js \
        ...

### Enabling Wildcard Support in `requires`

If you look at the end of `ext-debug.js`, you will find that it contains these two function
calls:

    Ext.ClassManager.addNameAlternateMappings({
        "Ext.draw.engine.ImageExporter": [],
        "Ext.layout.component.Auto": [],
        ...
    ]);

    Ext.ClassManager.addNameAliasMappings({
        "Ext.draw.engine.ImageExporter": [],
        "Ext.layout.component.Auto": [
            "layout.autocomponent"
        ],
        ...
    ]);

It is the presence of these two pieces of meta-data that allow wildcards to be used in
`requires` statements. That is:

    Ext.define('MyApp.App', {
        requires: [
            'Ext.grid.*'
        ],
        ...
    });

All that is required to use wildcards in your own code is to provide the same "bootstrap"
data for your app.

This command will produce a file that does just that:

    sencha compile -classpath=app \
        meta -alias -out bootstrap.js and \
        meta -alt -append -out bootstrap.js

The above command line tells the compiler to read in the source in the "app" folder and
generate two pieces of meta-data. The second piece of meta-data is written to the same
output file as the first, but using the `-append` option to append to the file and not
replace it.

Once you have the "bootstrap.js" file, change your page like so to add it to the
`x-bootstrap` section:

    <html>
        <head>
            <!-- <x-compile> -->
                <!-- <x-bootstrap> -->
                    <script src="../sdk/ext-dev.js" type="text/javascript"></script>

                    <script src="bootstrap.js" type="text/javascript"></script>
                <!-- </x-bootstrap> -->

                <script src="app/app.js" type="text/javascript"></script>
            <!-- </x-compile> -->
        </head>
        <body></body>
    </html>

Of course, the "bootstrap.js" file needs to be regenerated if you do any of the following:

 * Add a class
 * Remove a class
 * Change class aliases
 * Change class alternate names

This rebuild of the bootstrap data can be handled in a variety of ways, but the fundamental
question is whether or not to keep these files in source control, or require developers to
generate them locally. Both approaches work and can be automated to some degree.

### Exporting Loader Paths

In large applications it can be helpful to organize your namespace using multiple source
trees. In fact, Ext JS itself uses three source trees. This approach, however, has always
presented problems for the dynamic loader and you had to configure loader paths by hand to
work around the issue.

The compiler, however, has complete knowledge of class-to-file relationships given all of
the source in the classpath. And the `meta` command can export that data for use in your
application.

If you are already sold on the above to create a "bootstrap.js", this data can be added by
adding one more `meta` command (of course, the classpath will contain multiple folders in
this case):

    sencha compile -classpath=src1,src2,src3 \
        meta -alias -out bootstrap.js and \
        meta -alt -append -out bootstrap.js and \
        meta -loader -append -out bootstrap.js

Now the "bootstrap.js" file solves both problems. With this approach, the following things
will also require you to rebuild "bootstrap.js":

 * Rename a file or folder
 * Reorganize the classpath
 * Reorganize the content of any of the source trees

### Resolving Relative Paths with `-base-path`

For many good reasons, paths need to be relative. Whenever you deal with relative paths,
however, you eventually need to wrestle with the problem of where those relative paths are
based.

In the above examples we have "cheated" a bit and placed the "bootstrap.js" file next to
the markup file. This leverages the fact that the `meta` command defaults the base folder
to the location of the output file.

When this is not the case, you need to tell the `meta` command the base for determining
relative paths. Let's say we want to move the "bootstrap.js" file in to the "build" folder
(perhaps because we are not keeping it in source control). Since our page is in the current
folder and our source is in the "app" folder, this will generate the proper relative paths:

    sencha compile -classpath=src1,src2,src3 \
        meta -alias -out build/bootstrap.js and \
        meta -alt -append -out build/bootstrap.js and \
        meta -loader -append -base-path . -out build/bootstrap.js

Since the `-alias` and `-alt` modes do not deal in paths, the `-base-path` option is only
needed on the `-loader` use of the `meta` command.

### Changing the Format

By default, the `meta` command exports meta-data in JSONP format using a function call
wrapper appropriate for the type of meta-data requested. If a different function call is
desired or you want the data in JSON format, you can request this in the `meta` command.

In the example below, the "aliases.json" file will contain the alias data in JSON format.
You cannot use `-append` in this case because JSON format requires a single, top-level
object or array.

    sencha compile -classpath=src1,src2,src3 \
        meta -alias -json -out aliases.json

In this next example, we customize the JSONP wrapping by supplying the function to call:

    sencha compile -classpath=src1,src2,src3 \
        meta -alias -jsonp Foo.bar.doAliases -out aliases.js

This form can work with `-append` because it produces JavaScript code. The output of the
above will look roughly like this:

    Foo.bar.doAliases(
        // ... the JSON data ...
    );

### Exporting Filenames

The final useful form of meta-data supported by the `meta` command is filename data. That
is, the list of a files in the proper, dependency order. In many ways this is the same as
the other meta data forms in that this data can be exported in JSON or JSONP format, and
can be combined using `-append`.

The first difference with `-filenames` is that the default format is text. To produce JSON
or JSONP, you must specify one of the `-json` or `-jsonp` options.

In the default mode of text, the filenames are written as lines of text, one filename per
line. The following command will create "filenames.txt":

    sencha compile -classpath=src1,src2,src3 \
        meta -filenames -out filenames.txt

If we want, we can decorate each line of the file using the `-tpl` option. Because of the
special characters needed for this example, we use a response file to hold the template.

We put this in "template.txt":

    <script src="{0}" type="text/javascript"></script>

Then run the following command.

    sencha compile -classpath=src1,src2,src3 \
        meta -filenames -tpl @template.txt -out filenames.txt

We know have a chunk of markup that will script-tag in all of the files in their correct
order.
