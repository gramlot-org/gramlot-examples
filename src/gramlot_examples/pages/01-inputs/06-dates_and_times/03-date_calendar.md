# Inline and popup calendars

**Try this:** Choose a day in the inline calendar, then open the popup calendar. Both calendars and the text field follow the same date.

Pick a day or type a date. The inline calendar, popup and text-only field share the same Data value. Learn when to use a calendar beside the page or inside a date field.

**Uses:** the 0.3 input collection, labelbox and typed Data bindings. No endpoints, stores or validation engine.

<details>
<summary>More detail</summary>

```python
fields.dateTextBox(value="^date", lbl="With popup")
fields.dateTextBox(value="^date", lbl="Text only", calendar=False)
fields.dateCalendar(value="^date", lbl="Choose a day")
```

`dateTextBox` has a calendar button by default (`calendar=True`). `dateCalendar` displays the same calendar directly in the page. All three declarations use the same pointer: choosing or typing a date updates every view. The Data holds a civil date (`D`), never the formatted caption. **Clear** writes null; **Today** and natural-language input use today's local date in the browser. The initial sample value does not set the reference day. An application may explicitly provide `workdate` when a different working date is intended.

Use the arrows to browse months. In the day grid, arrow keys move by day/week, Home/End move to Monday/Sunday, PageUp/PageDown change month, and Enter or Space selects. Navigation alone leaves Data unchanged. Alt+Down opens the text field's calendar; Escape closes it and returns focus to the field. A popup selection commits the date immediately. Invalid text remains a draft until corrected or cancelled.

The calendar has Monday-first weeks; month/day captions follow the page locale (`it-IT` here). **Read only** locks all three controls. Use Settings (⚙) in the gallery footer to compare label positions. The calendar shares the `lbl_position`, `lbl_` and `box_` contract of the other inputs. Cards stay within 24rem and text fields within 14rem.

**Sample data:** `03-date_calendar_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.

</details>
