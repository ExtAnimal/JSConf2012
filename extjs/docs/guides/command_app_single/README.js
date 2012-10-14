Ext.data.JsonP.command_app_single({"guide":"<h1>Developing Single-Page Ext JS Apps</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/command_app_single-section-1'>Introduction</a></li>\n<li><a href='#!/guide/command_app_single-section-2'>Important Considerations</a></li>\n<li><a href='#!/guide/command_app_single-section-3'>The Application</a></li>\n<li><a href='#!/guide/command_app_single-section-4'>Compiling Your Page</a></li>\n<li><a href='#!/guide/command_app_single-section-5'>Trimming The Excess</a></li>\n<li><a href='#!/guide/command_app_single-section-6'>Generating A Custom Bootstrap</a></li>\n<li><a href='#!/guide/command_app_single-section-7'>Building Themes</a></li>\n</ol>\n</div>\n\n<p><p><img src=\"guides/command_app_single/../command/sencha-command-128.png\" alt=\"\"></p></p>\n\n<h2 id='command_app_single-section-1'>Introduction</h2>\n\n<p>Many Ext JS applications are implemented as a single, dynamic page that provides all of\nthe functionality required for the application. If the folder structure of the application\ndoes not follow that produced by Sencha Command as described in\n<a href=\"#/guide/command_app\">Developing Ext JS Apps</a>, then the convenient commands like\n\"sencha app build\" won't understand the application and cannot be used.</p>\n\n<p>There are, however, lower-level commands provided by Sencha Command that can be used to\nproduce builds and perform all of the same tasks that are automated by the high-level\ncommands.</p>\n\n<p>The most significant piece of this process is handled by Sencha Command's Compiler.</p>\n\n<h2 id='command_app_single-section-2'>Important Considerations</h2>\n\n<p>The ideal organization of code for consumption by the compiler is that used by Java, which\nis also very much what the dynamic loader prefers.</p>\n\n<p>To summarize this in a few basic rules:</p>\n\n<ul>\n<li>Each JavaScript source file contains one <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a></code> statement at global scope.</li>\n<li>The name of a source file matches the last segment of the name of the defined type (e.g.,\nthe name of the source file containing <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>(\"MyApp.foo.bar.Thing\", ...</code> would be\n\"Thing.js\".</li>\n<li>All source files are stored in a folder structure that is based on the namespace of the\ndefined type. For example, given <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>(\"MyApp.foo.bar.Thing\", ...</code>, the source file\nwould be in a path ending with \"/foo/bar\".</li>\n</ul>\n\n\n<h2 id='command_app_single-section-3'>The Application</h2>\n\n<pre><code>index.php           # The application's markup file.\nbuild/              # The folder where build output is placed.\next/                # The framework distribution.\n    src/            # The framework source tree.\njs/                 # Folder containing the application's JavaScript code.\n    app.js          # Contains the Ext Application\n</code></pre>\n\n<p>The \"index.php\" file would look similar to this:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n\n        &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<h3>Preparing To Compile</h3>\n\n<p>In order for Sencha Command to support as many server-side technologies as possible, the\ncompiler has to be guided to the parts of the markup file that are for its consumption.\nThis is done using directives inside comments.</p>\n\n<p>For example:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;!-- &lt;x-compile&gt; --&gt;\n          &lt;!-- &lt;x-bootstrap&gt; --&gt;\n            &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n          &lt;!-- &lt;/x-bootstrap&gt; --&gt;\n\n            &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n        &lt;!-- &lt;/x-compile&gt; --&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>The open and close tags of the <code>x-compile</code> directive enclose the part of the markup file\nwhere the compiler will operate. The only thing that should be contained in this block\nare <code>script</code> tags. The compiler will process all of these scripts for dependencies.</p>\n\n<p>The exception to this, however, is the \"ext-dev.js\" file. This file is considered to be a\n\"bootstrap\" file for the framework and should not be processed in the same way. The files\nin the <code>x-bootstrap</code> block are ignored by the compiler, but are also removed from the final\npage as we will see later.</p>\n\n<h2 id='command_app_single-section-4'>Compiling Your Page</h2>\n\n<p>The first job of the compiler is to examine and parse your JavaScript source code and\nanalyze its dependencies. These dependencies are expressed in code using <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a></code> and\nthe <code>requires</code> (or <code>uses</code>) directives. Also, base classes and mixins are considered to be\ndependencies the same as <code>requires</code>.</p>\n\n<p>Obviously, the application requires its own code (in the \"js\" folder) as well as some of\nthe framework (in the \"ext\" folder). The goal is to create a single JavaScript file that\ncontains all of the code needed from both folders and exclude any code that is not used.</p>\n\n<p>Since most build processes create the production build in a separate folder, let's use the\n\"build\" folder to hold the outputs and thereby avoid overwriting any source code.</p>\n\n<p>Lets start with this command:</p>\n\n<pre><code>sencha compile -classpath=ext/src,js page +yui -in index.php -out build/index.php\n</code></pre>\n\n<p>This command will perform the following steps:</p>\n\n<ul>\n<li>The <code>-classpath</code> switch provides the compiler with all of the folders containing source\ncode to be considered. In this case, the \"ext/src\" and \"js\" folders.</li>\n<li>The compiler's <code>page</code> command will then include all of the <code>script</code> tags in \"index.php\"\nthat are contained in the <code>x-compile</code> block.</li>\n<li>Given all of the contents of \"ext/src\", \"js\" and \"index.php\", the compiler will analyze\nthe JavaScript code and determine what is ultimately needed by \"index.php\".</li>\n<li>A modified version of \"index.php\" file will be written to \"build/index.php\".</li>\n<li>All of the JavaScript files needed by \"index.php\" will be concatenated, compressed using\nthe <a href=\"http://developer.yahoo.com/yui/compressor/\">YUI Compressor</a> and written to the single\nfile \"build/all-classes.js\".</li>\n</ul>\n\n\n<p>The compiled version of \"index.php\" will look approximately like this:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;script src=\"all-classes.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>The entire <code>x-compile</code> section is replaced by the single <code>script</code> tag that includes the\n\"all-classes.js\" file. The rest of the page remains unchanged.</p>\n\n<p>This is just one step of a complete build process, but the others are typically simpler\n(e.g., copying files) and so they are not considered here.</p>\n\n<h2 id='command_app_single-section-5'>Trimming The Excess</h2>\n\n<p>Due to the nature of dependency analysis, sometimes you may find that your application\ncontains code you know will never be used.</p>\n\n<p>If you were to remove the <code>+yui</code> switch from the compile command show above, you can\nexamine \"all-classes.js\" and inspect all of the code that was identified as being needed\nby your application. If you determine that there are classes present that you would like\nto remove, this can be accomplished using slightly more advanced features of the compiler.</p>\n\n<p>At its core, the compiler uses the concept of \"sets\" and set operations to manage what is\nincluded in the concatenated output file. It first builds the set of all files as it reads\nthe code from the <code>-classpath</code>. The <code>page</code> command then determines the subset of files used\nby \"index.php\".</p>\n\n<p>To illustrate, let's assume that somehow the Tree package (Ext.tree.*) was being pulled in\nto \"all-classes.js\" and we are certain that is incorrect. The following command shows how\nto remove this namespace:</p>\n\n<pre><code>sencha compile -classpath=ext/src,js \\\n    page -name=page -in index.php -out build/index.php and \\\n    restore page and \\\n    exclude -namespace Ext.tree and \\\n    concat +yui build/all-classes.js\n</code></pre>\n\n<p>The first change is to provide a name for the set of files produced by the <code>page</code> command.\nBy naming the set we disable the automatic generation of \"all-classes.js\" so we can adjust\nits contents before generating it explicitly.</p>\n\n<p>This also illustrates the use of \"command chaining\" and \"category state\" discussed in more\ndetail in <a href=\"#/guide/command_advanced\">Advanced Sencha Command</a>. The summary of those two\nconcepts is that:</p>\n\n<ul>\n<li>Each use of <code>and</code> separates commands in the same category (<code>compile</code> in this case).</li>\n<li>The state of the <code>compile</code> is preserved across these commands.</li>\n</ul>\n\n\n<p>Lets break down the individual steps in the above command as it deviates from what the\noriginal command accomplished.</p>\n\n<p>The <code>compile</code> command does the same as before and reads the code in the <code>-classpath</code>.</p>\n\n<pre><code>sencha compile -classpath=ext/src,js \\\n</code></pre>\n\n<p>The <code>page</code> command determines what is needed by \"index.php\" and generates the modified\nversion in \"build/index.php\". The <code>page</code> command also saves the set of files in a set\nnamed \"page\" (and does not write out  \"all-classes.js\").</p>\n\n<pre><code>    page -name=page -in index.php -out build/index.php and \\\n</code></pre>\n\n<p>The <code>restore</code> command restores the named set (\"page\") as the \"current set\". Most of the\nsub-commands of the compiler operate on the \"current set\". Without this command, the\ncurrent set would be \"all files\".</p>\n\n<pre><code>    restore page and \\\n</code></pre>\n\n<p>The <code>exclude</code> command removes all files in the <code>Ext.tree</code> namespace from the current set.</p>\n\n<pre><code>    exclude -namespace Ext.tree and \\\n</code></pre>\n\n<p>The <code>concat</code> command concatenates and compresses all files in the current set and writes\nthe result to \"build/all-classes.js\".</p>\n\n<pre><code>    concat +yui build/all-classes.js\n</code></pre>\n\n<p>There are many more commands and options provided to manipulate the current set. Basically,\nif you can imagine a way to arrive at the desired set of files using a sequence of set\noperations, the compiler can combine just those files for you. For more on this topic,\nsee the <a href=\"#/guide/command_compiler\">Sencha Compiler Reference</a>.</p>\n\n<h2 id='command_app_single-section-6'>Generating A Custom Bootstrap</h2>\n\n<p>The \"bootstrap\" file included in the example application (\"ext-dev.js\") contains two very\nimportant things:</p>\n\n<ul>\n<li>The minimal amount of the framework required to perform dynamic loading.</li>\n<li>All of the metadata describing the classes and aliases in the framework.</li>\n</ul>\n\n\n<p>This second part is what allows <code>requires</code> statements to use wildcards as in:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>(..., {\n    requires: [\n        'Ext.grid.*'\n    ]\n});\n</code></pre>\n\n<p>To use similar syntax in your application, you need to provide the required metadata for\nthe dynamic loader.</p>\n\n<p>The following command will generate such a file:</p>\n\n<pre><code>sencha compile -classpath=js \\\n    meta +alias -out build/bootstrap.js and \\\n    meta +alt +append -out build/bootstrap.js\n</code></pre>\n\n<p>This file should be added to the <code>x-bootstrap</code> section like so:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;!-- &lt;x-compile&gt; --&gt;\n          &lt;!-- &lt;x-bootstrap&gt; --&gt;\n            &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n            &lt;script src=\"build/bootstrap.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n          &lt;!-- &lt;/x-bootstrap&gt; --&gt;\n\n            &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n        &lt;!-- &lt;/x-compile&gt; --&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>There are other uses for code metadata. For details on generating metadata and what kinds\nof metadata are provided, see <a href=\"#/guide/command_compiler_meta\">Generating Metadata</a>.</p>\n\n<h2 id='command_app_single-section-7'>Building Themes</h2>\n\n<p>The process for generating image slices for custom themes is simpler and more flexible than\nin previous releases. For details on building your custom themes, please refer to\n<a href=\"#/guide/command_theme\">Building Themes for Ext JS</a>.</p>\n","title":"Developing Single-Page Ext JS Apps"});