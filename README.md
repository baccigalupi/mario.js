# Mario.js

Mario.js is a very small implementation of [Mustache](https://mustache.github.io/)
in JavaScript.

## Is Mustache still relevant? TL;DR: YES
Since [Mustache](https://mustache.github.io/) was first created many
moons ago as a "logicless" html markup, there has been a proliferation
of javascript frameworks that have gone the other direction. Frameworks
like Knockout, Angular, Polymer and React bake their own style of super
HTML that blurs template and view model. I still prefer the separation of
concerns afforded by almost logicless templates.

## Other Mustache implementations in JavaScript
There are already two great implementations of Mustache in JavaScript:

* [Mustache.js](https://github.com/janl/mustache.js), the original
* [Hogan.js](http://twitter.github.io/hogan.js/), a version by Twitter
  that added a compile step for faster rendering.

They are both great, and also good enough. I built this one because I
was looking for a high performing library that also had a smaller
download size. I was interested in putting it into
yet-another-front-end-framework, and mobile download times are important
to me.

## It's actually a Mustache subset

Mustache has some base features, and I chose not to implement a couple
of them:

* HTML Escaping: The specification has all variables escaped for HTML.
  That means that a string containing something like an ampersand, `&`, will
be converted when rendered to `&amp;`. You can render unescaped
content with triple staches: `{{{non_escaped_thing}}}`. I have found
this not to be a useful feature, and more often than not I have to work
around it. So, I left it off. That means that developers will have to be
more cautious with user entered content to avoid script injection
vulnerabilities. I think the right place for this html escape logic is
in the view!
* Delimiter customization: The specification also states that you can
  swap out the delimiters for tags. If you don't like `{{ my_tag }}`, you
can switch to something more to your liking: `<% my_tag %>`. While Mario
might pull it off, it hasn't been built into the system and working is
not guaraunteed.

## Concepts

Templates are strings with a few different types of tags that
are used for substitution. Views are objects that contain values and
functions that can be used for substition. Partials are templates that
get substituted within a parent template. When you put it all together
it looks like this:

    var template = 'Hello {{descriptor}} world. {{>then_what}}';
    var view = {descriptor: 'fine'};
    var partials = {then_what: 'How are you this {{descriptor}} day?'};

    Mario.render(template, view, partials);
    // 'Hello fine world, How are you this fine day?'

### Variable tags

The simplest tag with the least logic is a variable. It looks like this:

    {{my_variable}}

Mario will look in the view object for a value or function matching that
name:

    var view = {my_variable: 'it is mine!'};
    // or alternately
    var view = {
      my_variable: function() { return 'it is mine!'; }
    };

Although one of these views has `my_variable` as a direct attribute and
the other has it as a function attribute. They both resolve to the same
thing.

What happens if the key is not found in the object at all? It just
substitutes an empty string:

    var template = '{{my_variable}}';
    var view = {};

    Mario.render(template, view);
    // ''

### Presence tags

When a variable isn't present in the view, rendering happily ignore the
issue without error, but sometimes we want to see different content
depending on whether something exists. For example, we often see
different markup depending on whether a person is signed in or not:

    var template = '{{#current_user}}' +
      'Hello {{current_user.name}}' +
      '{{/current_user}}';
    var view = {};

    Mario.render(template, view);

Presence tags start with `{{#` and end with a double stache like a
normal tag.

Presences tags will create a section that ends with a 

In this case because there is no `current_user`, Mario will render an
empty string. If we change the view to include a `current_user` the
rendered content will be full of variables and the other content:

    var view = {current_user: {name: 'Mario'}};
    Mario.render(template, view);
    // 'Hello Mario'

### Lack of presence tags

Presence tags are great, but they also just ask for the 
