# 22 · Button commands

**Sample data:** `01-button_data.tytx` supplies the initial Bag for both Python and JavaScript. Interface controls use defaults where shown; edits and remote updates use the normal Data bindings.

Compare the Gramlot command button with plain HTML. Try confirmation and a delayed command.

**Uses:** built-in command components, Source, Data and the shared action engine. No endpoints or database.

<details>
<summary>More detail</summary>

`button` is a Web Component with an internal native button. It reuses action, ask, fire, nested controllers and _delay. `html_button` stays plain HTML, including native form submission. Here its explicit click connection updates Data. Gramlot command buttons do not implicitly submit forms.

</details>
