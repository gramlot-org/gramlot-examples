# Charts · Value and chart types

> **What you learn** — Show one value, or a shape of data other than rows, with a chart element that has its own parameters.

## Start here

- **Gauges:** one value on a needle dial, a progress ring or a half-circle arc. Change the value, the range, the thresholds, the mask and the presentation, and watch the same Data drive every gauge.

## How these elements differ from `chartView`

`chartView` and `chartPane` draw the rows of a store. The elements here draw the Data they point at: the node value is the value, written as a Data pointer such as `^.cpu.load` or `^.cpu.load?percent`. They write nothing back.

This family is experimental. The elements are in the `charts` collection of the core, which the server provides to every page.
