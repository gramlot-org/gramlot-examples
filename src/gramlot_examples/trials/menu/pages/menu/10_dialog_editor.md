# Complete dialog editor

This example combines existing layout and command components in Python. No new
window API is introduced. The instructions above the example describe the complete
Save/Cancel cycle. Values are local Data and do not survive reloading the page.

```python
window = root.dialog(title="Edit document", open="^editor.open",
                     beforeClose="discardOnClose", movable=True, resizable=True,
                     collapsible=True, maximizable=True,
                     maximized="^editor.maximized")
frame = window.frame
frame.top.menu(presentation="bar").menuline("documenti:undo", caption="Reset draft",
                                            parameters=dict(close=False))
center = frame.center.contentPane(frameTarget=True, selfsubscribe_save="save",
                                 selfsubscribe_undo="undo", overflow="auto")
center.input(value="^editor.draft.title", live=True)
footer = frame.bottom.menu(presentation="bar")
footer.spacer(flex=1)
actions = footer.menuline(group=True, overflowable=False)
actions.menuline("documenti:undo", caption="Cancel", parameters=dict(close=True))
actions.menuline("documenti:save")
```

The window owns its title controls. `window.frame` is a real Source framePane;
top and bottom contain permanent menus, while the center owns the editable fields
and receives published commands. The footer's elastic spacer aligns the action
group to the right. Keeping the group out of overflow preserves both actions;
very narrow space uses the existing toolbar scrolling behavior.

The existing menu-trial collection registers save, undo and toggleDetails. Reset
and Cancel are two occurrences of undo, distinguished by parameters.close. Their
handler runs on the frame's central recipient. Details binds the menu checkmark
and the optional Author field to the same Data value. The Document submenu reuses
the same commands; menu priority/overflow follows the existing component contract.

Opening copies saved fields into a draft. Save requires a nonblank title, commits
the three fields to saved Data and sets open=False. Cancel restores the draft and
closes. X/Escape call the named beforeClose handler, which discards the draft and
returns true. The guard is not a second Save action. Empty-title validation keeps
the dialog open and displays an error. All editing uses live bindings; there is
no DOM scraping, manual listener wiring or application-owned window rendering.

Try Save and reopen, Cancel and reopen, blank-title validation, Reset, Details,
the Document submenu, and maximize/collapse/restore while editing. The saved
summary outside the modal provides observable evidence of commit versus discard.


The editor overrides the trial registry's text icons with example-owned SVG images
through iconSrc: outlined Save, circular Reset, Cancel and Details share a 24-unit
viewBox and 1.8-unit stroke. Cancel has its own cross icon rather than reusing the
undo symbol. These are image resources, not injected SVG markup; registered command
identity and handlers are unchanged. The submenu uses the same vectors as the bar.


Both bars use `background="var(--gramlot-surface-subtle)"` and a one-pixel theme
border facing the center (`border_bottom` above, `border_top` below), making their
regions visible without changing menu behavior.
