# Buttons: icons, labels and commands

**Try this:** Confirm the first command, then click the delayed command several times quickly. Its result reports one execution for the burst of clicks.

Compare the Gramlot command button with plain HTML. Try confirmation and a delayed command.

**Uses:** built-in command components, Source, Data and the shared action engine. No endpoints or database.

<details>
<summary>More detail</summary>

`button` is a Web Component with an internal native button. It reuses action, ask, fire, nested controllers and _delay. `html_button` stays plain HTML, including native form submission. Here its explicit click connection updates Data. Gramlot command buttons do not implicitly submit forms.

**Sample data:** `01-button_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
