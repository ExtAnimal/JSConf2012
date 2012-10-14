Ext.data.JsonP.upgrade_41({"guide":"<h1>Ext JS 4.1 Upgrade Guide</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/upgrade_41-section-1'>Component render called only on top-most components</a></li>\n<li><a href='#!/guide/upgrade_41-section-2'>Component onRender elements now exist in DOM at time of call</a></li>\n<li><a href='#!/guide/upgrade_41-section-3'>Component renderTpl now calls helper methods</a></li>\n<li><a href='#!/guide/upgrade_41-section-4'>Panels</a></li>\n<li><a href='#!/guide/upgrade_41-section-5'>callParent calls overridden method</a></li>\n<li><a href='#!/guide/upgrade_41-section-6'>FocusManager no longer requires subscribe</a></li>\n<li><a href='#!/guide/upgrade_41-section-7'>Component doLayout and doComponentLayout methods internal changes</a></li>\n<li><a href='#!/guide/upgrade_41-section-8'>config setters are called to set default values</a></li>\n<li><a href='#!/guide/upgrade_41-section-9'>Ext.data.Model can now join multiple Ext.data.Stores</a></li>\n<li><a href='#!/guide/upgrade_41-section-10'>Ext.layout.container.Border adds splitter components to the container</a></li>\n<li><a href='#!/guide/upgrade_41-section-11'>Infinite grid scrolling is simpler</a></li>\n<li><a href='#!/guide/upgrade_41-section-12'>XTemplate improvements</a></li>\n<li><a href='#!/guide/upgrade_41-section-13'>Grid plugins</a></li>\n<li><a href='#!/guide/upgrade_41-section-14'>History</a></li>\n</ol>\n</div>\n\n<p>This guide is meant to assist developers migrating from Ext JS 4.0.x to 4.1. Our goal was to maintain API compatibility\nas much as possible, despite the scope of the changes we are making to address bugs and user feedback. However, some\nchanges were needed, which you need to consider in further Ext JS development.</p>\n\n<p>If you encounter issues related to these API changes, please post your issues directly to our community forum found\n<a href=\"http://www.sencha.com/forum/forumdisplay.php?93-Ext-4.1\">here</a>. If you are a support subscriber, you can also file your\nissue through our support portal found <a href=\"http://www.sencha.com/support/\">here</a>.</p>\n\n<h2 id='upgrade_41-section-1'>Component render called only on top-most components</h2>\n\n<p>Previous releases used the <code>render</code> method  to render all components in a top-down traversal. In 4.1, rendering is\nperformed in memory as markup which is then written to the DOM. This means that the <code>render</code> method of child components\nis not called. It's recommended that code in the <code>render</code> method be moved to either <code>beforeRender</code> (new to 4.1) or\n<code>afterRender</code>. For best performance, make style or <code>add/removeCls</code> adjustments in <code>beforeRender</code> so that these values\nare generated in the initial markup and not made to the DOM element as it would be in <code>afterRender</code>.</p>\n\n<h2 id='upgrade_41-section-2'>Component onRender elements now exist in DOM at time of call</h2>\n\n<p>Previous releases created the component's primary element (<code>el</code>) when calling the parent class method. This is no longer\npossible because of bulk rendering. Any logic that was performed prior to calling the <code>parent</code> method can be moved to\nthe new <code>beforeRender</code> method</p>\n\n<h2 id='upgrade_41-section-3'>Component renderTpl now calls helper methods</h2>\n\n<p>As part of bulk rendering, a <code>renderTpl</code> now calls helper methods on the template instance to inject content and\ncontainer items. This can be best seen in the default <code>renderTpl</code> for components and containers:</p>\n\n<p>Code for components:</p>\n\n<pre><code>renderTpl: '{%this.renderContent(out,values)%}'\n</code></pre>\n\n<p>Code for containers:</p>\n\n<pre><code>renderTpl: '{%this.renderContainer(out,values)%}'\n</code></pre>\n\n<h2 id='upgrade_41-section-4'>Panels</h2>\n\n<p>To create a Panel with no header, configure it with <code>header: false</code>. This supercedes the <code>preventHeader</code> config option.</p>\n\n<h2 id='upgrade_41-section-5'>callParent calls overridden method</h2>\n\n<p>As part of formalizing <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>/override</code> in Ext JS 4.1, it is now possible to name and require overrides just as\nyou would a normal class:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('My.patch.Grid', {\n    override: '<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>',\n    foo: function () {\n        this.callParent(); // calls Ext.grid.Panel.foo\n    }\n});\n</code></pre>\n\n<p>The above code in Ext JS 4.0 would have called the base class <code>foo</code> method. You had to use the <code>callOverridden</code> to\naccomplish the above. In Ext JS 4.1, to bypass the overriden method, you just need to use the following code:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('My.patch.Grid', {\n    override: '<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>',\n    foo: function () {\n        Ext.grid.Panel.superclass.foo.call(this);\n    }\n});\n</code></pre>\n\n<p>It is even possible for a class to <code>require</code> its own overrides. This enables breaking up a large class into independent\nparts expressed as overrides (a better approach than <code>AbstractFoo</code> and <code>Foo</code>).</p>\n\n<h2 id='upgrade_41-section-6'>FocusManager no longer requires subscribe</h2>\n\n<p>In previous releases, use of <code>FocusManager</code> was inefficient. <code>FocusManager</code> used to have to be pointed at a container\n(that is, it had to subscribe to the Container), and it would dig out all descendant components and add listeners to\nboth the descendants' elements and the descendant components themselves. It also had to monitor for adds and removes\nwithin that container tree.</p>\n\n<p>In Ext JS 4.1, <code>onFocus</code> and <code>onBlur</code> template methods in <code>AbstractComponent</code> are called on focus and blur of the\ncomponent's <code>getFocusEl()</code>. This is part of a component’s natural functionality. Non-focusable components won't\nimplement <code>getFocusEl</code>, and so they will not be part of the focus tree. Containers are focusable so that you can\nnavigate between and into them.</p>\n\n<p>Now, <code>FocusManager</code> hooks directly into <code>AbstractComponent</code> template methods and hears what is being focused. Once it's\nenabled it globally tracks focus, and adds framing which follows focus, and allows navigation into the\ncontainer->component tree.</p>\n\n<h2 id='upgrade_41-section-7'>Component doLayout and doComponentLayout methods internal changes</h2>\n\n<p>The doLayout and doComponentLayout methods have been modified. Their previous functionality has been combined into\n<code>updateLayout</code>. As a component author, these methods can no longer be overridden to perform a custom layout since they\nwill not be called internally as they used to be. Instead you can override <code>afterComponentLayout</code>, which is given the\nnew size and old size as parameters, or you can respond to the resize event.  Overriding <code>afterComponentLayout</code> is a\npossible way of postprocessing a Component's structure after a layout. If you are writing a derived component, the\nmethod override should be preferred. Just be sure to use <code>callParent</code>.</p>\n\n<p>Note that the size of the component should not be changed by this method,since the size has been determined already. If\nthe size is changed again, this could lead to infinite recursion at worst (since <code>afterComponentLayout</code> will be called\nagain) or just wrong layout.</p>\n\n<h2 id='upgrade_41-section-8'>config setters are called to set default values</h2>\n\n<p>In Ext JS 4.0, the config mechanism in <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a></code> would create <code>getter</code> and <code>setter</code> methods, but the default value\nwould bypass the setter. In Ext JS 4.1 (and Touch 2), config defaults are now passed to the setter method. This can\naffect the timing of the first call to the setter method, but it is needed because setters are designed to enable\ntransformation-on-set semantics.</p>\n\n<p>The generated getter for a config property named “foo” looks like the following:</p>\n\n<pre><code>getFoo: function () {\n    if (!this._isFooInitialized) {\n        this._isFooInitialized = true;\n        this.setFoo(this.config.foo);\n    }\n    return this.foo; // or call user-provided getFoo method\n},\n</code></pre>\n\n<p>And the generated setter looks like this:</p>\n\n<pre><code>setFoo: function (newValue) {\n    var oldValue = this.foo;\n\n    if (!this._isFooInitialized) {\n        this._isFooInitialized = true;\n    }\n\n    this.applyFoo(newValue, oldValue);\n\n    if (typeof newValue != ‘undefined’) {\n        this.foo = newValue;\n        if (newValue !== oldValue) {\n            this.updateFoo(newValue, oldValue);\n        }\n    }\n}\n</code></pre>\n\n<p>If there is no <code>applyFoo</code> and/or <code>updateFoo</code> method, these calls are simply skipped. It is best to provide custom\nimplementations of <code>applyFoo</code> rather than a custom <code>setFoo</code> so that the rest of the provided boilerplate is preserved.\nAlternatively, responding only to changes in the property is often ideal, so implementing <code>updateFoo</code> may be better to\nignore setter calls that do not change the property.</p>\n\n<h2 id='upgrade_41-section-9'>Ext.data.Model can now join multiple Ext.data.Stores</h2>\n\n<p>A single record can belong to more than one store, especially in the case of a tree. The <code>store</code> property on a model\nnow only references the first store. Use the <code>stores</code> array to examine all stores.</p>\n\n<h2 id='upgrade_41-section-10'>Ext.layout.container.Border adds splitter components to the container</h2>\n\n<p>In Ext JS 4.1, when you configure components with <code>split: true</code>, Border layout inserts extra splitter components as\nsiblings of the current components. This simplifies Border and also allows enables it to dynamically modify regions.</p>\n\n<h2 id='upgrade_41-section-11'>Infinite grid scrolling is simpler</h2>\n\n<p>To scroll an indeterminate sized dataset within a grid, simply configure the Store with</p>\n\n<pre><code>buffered: true,\nautoLoad: true,\n</code></pre>\n\n<p>The grid will scroll through the whole dataset using natural scrolling, but only using as many table rows as are\nnecessary to display the visible portion of the data with a small (configurable) leading and trailing zone to provide\nscrolling.</p>\n\n<h2 id='upgrade_41-section-12'>XTemplate improvements</h2>\n\n<p>XTemplates now accept <code>&lt;tpl elseif&gt;</code> and  <code>&lt;tpl else&gt;</code> tags between <code>&lt;tpl if&gt;</code> and <code>&lt;/tpl&gt;</code></p>\n\n<p>XTemplates now evaluate embedded script fragments as \"scriptlets\" using \"{% code %}\". The code is executed, but nothing\nis placed into the template's output stream.</p>\n\n<p>XTemplate's <code>&lt;tpl for=\"\"&gt;</code> iteration template can now iterate over a <code>MixedCollection</code>, and within the loop,\n<code>values</code> references an entry in the collection.</p>\n\n<h2 id='upgrade_41-section-13'>Grid plugins</h2>\n\n<p>Certain Sencha-supplied Grid plugins and Features may now be used with lockable grids. Plugins and Features\nare cloned and distributed to both sides of the grid.</p>\n\n<p>Both sides of a lockable grid may be edited using the <code>CellEditing</code> plugin.</p>\n\n<p>Grouping Features on both sides of a lockable grid stay synchronized.</p>\n\n<p>To enable this, plugins and Features <em>must</em> extend their respective base classes <code><a href=\"#!/api/Ext.AbstractPlugin\" rel=\"Ext.AbstractPlugin\" class=\"docClass\">Ext.AbstractPlugin</a></code> and <code><a href=\"#!/api/Ext.grid.feature.Feature\" rel=\"Ext.grid.feature.Feature\" class=\"docClass\">Ext.grid.feature.Feature</a></code>\nand any implemented constructor <em>must</em> use <code>callParent</code> so that the configuration can be saved for the clone method to use.</p>\n\n<p>Note that <code>RowEditing</code> may <em>not</em> be used with lockable grids.</p>\n\n<p>See the <code>examples/grid/locking-group-summary-grid.html</code> example in your SDK for an example.</p>\n\n<h2 id='upgrade_41-section-14'>History</h2>\n\n<p>In previous versions of Ext JS, using the <a href=\"#!/api/Ext.util.History\" rel=\"Ext.util.History\" class=\"docClass\">Ext.util.History</a> class required you to manually add a form element to your\npage. This is no longer required. They will still be used if present, but it is best to remove them and allow the\nframework to generate what is required for the browser. The form that was required looked like this:</p>\n\n<pre><code>&lt;form id=\"history-form\" class=\"x-hide-display\"&gt;\n    &lt;input type=\"hidden\" id=\"x-history-field\" /&gt;\n    &lt;iframe id=\"x-history-frame\"&gt;&lt;/iframe&gt;\n&lt;/form&gt;\n</code></pre>\n","title":"Upgrade 4.0 to 4.1"});