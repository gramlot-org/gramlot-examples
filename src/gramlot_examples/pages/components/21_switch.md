# 21 · Checkbox as a switch

A switch and a checkbox share one boolean. Compare their appearance, captions and read-only state.

**Uses:** the 0.3 inputs and layout collections, labelbox and Source/Data bindings. No database, form-save service or endpoints.

<details>
<summary>More detail</summary>

`checkbox(mode="switch")` retains the existing boolean value, labelbox, validation and native checkbox editing. Its internal input exposes `role="switch"`; Space toggles it. `readonly` and `disabled` prevent changes. The default mode remains `checkbox`. The first switch uses `switch_color="^switch_color"`, initially purple. Change that Data value to change its active track color; set it to null to restore the theme. The off state and the other switches keep their theme colors. Otherwise colors follow the theme and the touch mode enlarges the clickable caption area.

</details>
