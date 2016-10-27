# Help
___
Urdown is a markdown editor for Urdu with support for English as well.  

The editor operates in either left-to-right or right-to-left directions. You can switch the default direction by clicking on the ![switch](./static/img/switch.png =20x20) button.

## Use
___
Aside from the interface buttons, the following shortcuts can be used:  
`Ctrl+O`: **O**pen a markdown document.  
`Ctrl+M`: **M**ake a new document.  
`Ctrl+H`: Show **H**TML version of output.  
`Ctrl+P`: **P**rint/export document as **P**DF.  
`Ctrl+S`: **S**ave markdown to disk.  
`Ctrl+D`: Toggle **D**ay/Night mode.  
`Ctrl+E`: Toggle **E**dit/Read mode.  
`Ctrl+,`: Enter markdown in opposite direction.  
`Ctrl+Enter`: Press `OK` button.  
`Esc`: Press `Cancel` button.

## Writing
___
To embed text of the opposite alignment, enclose it in 3 commas `,,,` on either side n new lines.
For example, to embed a right-to-left script:  

```
\,,,
یہ اُردو متن ہے۔
\,,,
```
Which will show as:

,,,
یہ اُردو متن ہے۔
,,,

The rest of the markdown syntax documentation can be found here:  
[https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax)