Ext.data.JsonP.Ext_util_TaskRunner_Task({"subclasses":[],"mixins":[],"code_type":"assignment","inheritable":false,"meta":{},"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task' target='_blank'>TaskRunner.js</a></div></pre><div class='doc-contents'><p>Instances of this class are created by <a href=\"#!/api/Ext.util.TaskRunner-method-newTask\" rel=\"Ext.util.TaskRunner-method-newTask\" class=\"docClass\">Ext.util.TaskRunner.newTask</a> method.</p>\n\n<p>For details on config properties, see <a href=\"#!/api/Ext.util.TaskRunner-method-start\" rel=\"Ext.util.TaskRunner-method-start\" class=\"docClass\">Ext.util.TaskRunner.start</a>.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-fireOnStart' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-property-fireOnStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-property-fireOnStart' class='name expandable'>fireOnStart</a><span> : <a href=\"#!/api/Boolean\" rel=\"Boolean\" class=\"docClass\">Boolean</a></span></div><div class='description'><div class='short'>Override default behavior ...</div><div class='long'><p>Override default behavior</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-stopped' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-property-stopped' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-property-stopped' class='name expandable'>stopped</a><span> : <a href=\"#!/api/Boolean\" rel=\"Boolean\" class=\"docClass\">Boolean</a></span><strong class='private signature'>private</strong></div><div class='description'><div class='short'>This flag is set to true by stop. ...</div><div class='long'><p>This flag is set to <code>true</code> by <a href=\"#!/api/Ext.util.TaskRunner.Task-method-stop\" rel=\"Ext.util.TaskRunner.Task-method-stop\" class=\"docClass\">stop</a>.</p>\n<p>Defaults to: <code>true</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-destroy' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Destroys this instance, stopping this task's execution. ...</div><div class='long'><p>Destroys this instance, stopping this task's execution.</p>\n</div></div></div><div id='method-restart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-method-restart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-method-restart' class='name expandable'>restart</a>( <span class='pre'>[<a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> interval]</span> )</div><div class='description'><div class='short'>Restarts this task, clearing it duration, expiration and run count. ...</div><div class='long'><p>Restarts this task, clearing it duration, expiration and run count.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>interval</span> : <a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> (optional)<div class='sub-desc'><p>Optionally reset this task's interval.</p>\n</div></li></ul></div></div></div><div id='method-start' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-method-start' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-method-start' class='name expandable'>start</a>( <span class='pre'>[<a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> interval]</span> )</div><div class='description'><div class='short'>Starts this task if it is not already started. ...</div><div class='long'><p>Starts this task if it is not already started.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>interval</span> : <a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> (optional)<div class='sub-desc'><p>Optionally reset this task's interval.</p>\n</div></li></ul></div></div></div><div id='method-stop' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.util.TaskRunner.Task'>Ext.util.TaskRunner.Task</span><br/><a href='source/TaskRunner.html#Ext-util-TaskRunner-Task-method-stop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.util.TaskRunner.Task-method-stop' class='name expandable'>stop</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Stops this task. ...</div><div class='long'><p>Stops this task.</p>\n</div></div></div></div></div></div></div>","html_meta":{},"aliases":{},"files":[{"href":"TaskRunner.html#Ext-util-TaskRunner-Task","filename":"TaskRunner.js"}],"superclasses":[],"component":false,"tagname":"class","requires":[],"members":{"event":[],"property":[{"owner":"Ext.util.TaskRunner.Task","meta":{},"tagname":"property","name":"fireOnStart","id":"property-fireOnStart"},{"owner":"Ext.util.TaskRunner.Task","meta":{"private":true},"tagname":"property","name":"stopped","id":"property-stopped"}],"css_var":[],"method":[{"owner":"Ext.util.TaskRunner.Task","meta":{},"tagname":"method","name":"destroy","id":"method-destroy"},{"owner":"Ext.util.TaskRunner.Task","meta":{},"tagname":"method","name":"restart","id":"method-restart"},{"owner":"Ext.util.TaskRunner.Task","meta":{},"tagname":"method","name":"start","id":"method-start"},{"owner":"Ext.util.TaskRunner.Task","meta":{},"tagname":"method","name":"stop","id":"method-stop"}],"css_mixin":[],"cfg":[]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Ext.util.TaskRunner.Task","extends":null,"id":"class-Ext.util.TaskRunner.Task","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});