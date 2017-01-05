# Urdown
An online Urdu markdown editor written with AngularJS | انٹرنیٹ پر مبنی ٹیکسٹ ایڈیٹر

Live demo at [https://hazrmard.github.io/Urdown](https://hazrmard.github.io/Urdown).  

For documentation in Urdu, go to [https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown.md](https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown.md).  

For documentation in English, go to [https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown_english.md&dir=ltr](https://hazrmard.github.io/Urdown/#?src=.%2Fdocs%2Furdown_english.md&dir=ltr).  

**Urdown** (Udru + Markdown) is an online markdown editor with preference for right-to-left
languages like Urdu. It supports left-to-right languages as well. It can embed blocks of 
left-to-right languages like English by enclosing them in three commas `,,,` (in new lines). 
The rest of the markdown rules are the same as [Showdown.js](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax).  

[**Urdown**](https://hazrmard.github.io/Urdown) is a fully client-side app that
can:  

* Render markdown instantly,
* Load markdown files from a URL,
* Load markdown files from disk,
* Save markdown files to disk,
* Export rendered markdown as PDF (using browsers' save-to-pdf ability),
* Export markdown as `HTML`,
* Switch between day/night modes,
* Switch between edit/read modes.

In addition **Urdown** can render markdown files passed as URL arguments:  
```
https://hazrmard.github.io/Urdown/#?src=URL_TO_MARKDOWN_FILE&editMode=[true|false]&nightMode=[true|false]&dir=[ltr|rtl]
```

Where `[true|false]` is a placeholder for either `true` or `false`, and 
`[ltr|rtl]` is a placeholder for either `rtl` (default, right-to-left) or 
`ltr`. A possible use for this is to add that link in an `iframe` on 
another site to render Urdu markdown without having to mess with 
`HTML` tags etc.

### What is markdown?
[`Markdown`](https://en.wikipedia.org/wiki/Markdown) is a lightweight way of
formatting text so that it can be easily converted into `HTML` for display on
web pages.

### How to type Urdu?
There are several excellent Urdu keyboards available. I use a phonetic keyboard
that can be found [here](https://urdu.ca/1). For convenience, you can quickly
switch between languages on your computer by using `Alt+Shift` (Windows) and
`Command+Space` or `Command+Option+Space` (Mac).  

For Chrome users, you can add the [Google Input Tools](https://www.google.com/inputtools/try/)
extension that allows you to use phonetic and standard Urdu keyboards on your
browser.

### Compatibility
I have tested **Urdown** on Internet Explorer 11, Edge, and Chrome 53. The best
experience, by far, was on Chrome.  

### Contributing
There are several venues for contributing:  

* Add a new user interface language. To do that duplicate `static/ui/english.json` and name it to language of choice (in english). Then translate all strings on right hand side into your language. Then add your language option to `js/urdown.js` in the `UILANGS` variable at the top.
* Add auto-scrolling feature. Currently you have to manually scroll down both the input and output panes to edit text longer than page height. A feature where the output pane scrolls to the corresponding location of the cursor on the input pane would be amazing.
