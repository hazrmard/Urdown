# Urdown
An online Urdu markdown editor written with AngularJS | انٹرنیٹ پر مبنی ٹیکسٹ ایڈیٹر

Live demo at [https://hazrmard.github.io/Urdown](https://hazrmard.github.io/Urdown).  

For documentation in Urdu, go to [https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown.md](https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown.md).  

**Urdown** (Udru + Markdown) is an online markdown editor with preference for right-to-left
languages like Urdu. It can embed blocks of left-to-right languages like English by
enclosing them in three commas `,,,` (in new lines). The rest of the markdown
rules are the same as [Showdown.js](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax).  

[**Urdown**](https://hazrmard.github.io/Urdown) is a fully client-side app that
can:  

* Render markdown instantaneously,
* Load markdown files from a URL,
* Load markdown files from disk,
* Save markdown files to disk,
* Export rendered markdown as PDF (using browsers' save-to-pdf ability),
* Export markdown as `HTML`,
* Switch between day/night modes,
* Switch between edit/read modes.

In addition **Urdown** can render markdown files passed as URL arguments:  
```
https://hazrmard.github.io/Urdown/#?src=URL_TO_MARKDOWN_FILE&editMode=[true|false]&nightMode=[true|false]
```

Where `[true|false]` is a placeholder for either `true` or `false`. A possible
use for this is to add that link in an `iframe` on another site to render Urdu
markdown without having to mess with `HTML` tags etc.

### What is markdown?
[`Markdown`](https://en.wikipedia.org/wiki/Markdown) is a lightweight way of
formatting text so that it can be easily converted into `HTML` for display on
web pages.

### How to type Urdu?
There are several excellent Urdu keyboards available. I use a phonetic keyboard
that can be found [here](https://urdu.ca/1). For convenience, you can quickly
switch between languages on your computer by using `Alt+Shift` (Windows) and
`Command+Space` or `Command+Option+Space` (Mac).

### Compatibility
I have tested **Urdown** on Internet Explorer 11, Edge, and Chrome 53. The best
experience, by far, was on Chrome.
