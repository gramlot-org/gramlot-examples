# 5. Resolver-owned menu content

A menu owns its resolver directly, without a `dataRemote` declaration or a separate
Data scope. Both the popup and toolbar Export entries use:

```python
menu.menuline(caption="Export").menu(
    resolver="export_menu", resolver_document_id="^document.id",
    resolver_fail="^document.fail", cacheTime=30)
```

The submenu loads when opened. Changed resolver arguments invalidate its content;
visible menus reload, while closed menus wait until opened. Existing RpcResolver
cache behavior applies. A permanent menu with a resolver loads on mounting.

The endpoint returns an ordered `Bag`; node labels are stable occurrence identities.
This lesson returns all three record kinds:

```python
result.setItem("current", None, kind="command", command="documenti:export",
    parameters=dict(id=document_id, format="PDF"), disabled="^document.locked")
result.setItem("separator", None, kind="separator")
result.setItem("formats", formats_bag, kind="submenu", caption="Other formats")
result.setItem("recent", None, kind="submenu", caption="Recent documents",
    resolver="recent_menu", resolver_document_id=document_id)
```

Other formats is an already supplied nested Bag. Recent documents has its own lazy
resolver, called when that submenu opens. A submenu chooses one content source.
A command record has no child Bag; a separator accepts only its kind.

Checked, disabled and hidden can contain `^` bindings in the returned records.
They stay live after loading and do not require another request. Captions are
literal text; resolver data cannot inject executable event handlers.

Try document 0 for **Nessuna voce**. Enable Resolver error and open Export for
**Impossibile caricare / Riprova**. Retry is explicit, not automatic. Disable the
error and reopen to recover. The endpoint and Bag schema are visible in Python;
the receiver's local effects are shown in logic.js.
