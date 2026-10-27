# Nested borders and layout designs

**Try this:** Resize an outer region, then a region inside the editor. Each borderContainer owns its layout independently.

A whole application and one of its editors rarely need the same layout. The application may need navigation and a header; the editor may need its own tools and output. You can give each its own **borderContainer**, placing the editor's container in the center of the application's container.

Think of it as rooms inside a house: changing the arrangement of one room does not require rebuilding the house.

## Try it

Find the customer and note fields and enter something you will recognize. Now change **Outer design** from Headline to Sidebar. Look at the corners: Headline gives the header the full width, while Sidebar lets the side region run along the height. Your text remains in the editor.

Next, drag the separator above the inner output area. Only that inner layout changes. The outer header and navigation still belong to the outer container.

Close **Side** using its little handle, then open it again. This particular drawer has a fixed width: you can open and close it, but it is not a resizable splitter. A drawer and a splitter are two independent choices.

## How the pieces fit

Each container arranges its direct children. A child can be an ordinary contentPane holding fields, or another borderContainer holding more regions. The inner container only needs to know about its own children.

The design selector writes a shared Data value. The outer container reads that value through a **binding**, a connection that updates an attribute when its Data changes. Changing the design rearranges the existing screen; it does not create a new customer form.

## When this is useful

Use nesting when a section needs its own layout rules. Avoid adding another container just to add spacing: padding is enough for that. The next lesson combines nested layouts with rounded edges and popups.

**Sample data:** `02-nested_data.tytx` supplies the initial Bag in Python and JavaScript. Interface defaults initialize UI state; bindings handle later edits.
