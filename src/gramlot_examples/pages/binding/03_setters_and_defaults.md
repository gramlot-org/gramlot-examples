# 03 · Setters and defaults

`dataSetter` writes a value in the Data. All the setters of a branch run before its first render, wherever they sit: here they come after the form and in a later section, yet the first DOM already shows their values.

- Setters run parents before descendants, in document order. Two setters write `.customer`; the one in the later section runs last, so the customer is Grace Hopper.
- A dictionary (Python) or a plain object (JavaScript) becomes a Bag: `.shipping.city` reads inside it.
- A control fills an empty value path with its `default`. `default_value` wins over `default`. Only a null or missing value is empty: `0`, `false` and `''` are values.
- `attr_currency='EUR'` sets the attribute `currency` on the Data node of the control's value, after the defaults. `^.price?currency` reads it.

**Try it:** Remove the setter in the later section: the customer becomes Ada Lovelace. Add a setter of `.quantity` with `0`: the default no longer applies.
