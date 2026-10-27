# Sieve of Eratosthenes: animate reactive Data

**Try this:** Press Step to discover 2, then again to cross out 4. Start animates the same operation; Pause preserves progress and Reset restores the grid while keeping the chosen speed.

This learning example finds all 25 primes from 1 to 100. It starts **paused**.
The limit is deliberately fixed so the page can build its 100 cells with one loop;
the lesson focuses on reactive state and timing, not dynamic grid construction.

## Try it

1. Press **Step**: 2 becomes prime. Press it again: 4 becomes composite.
2. Press **Start**. The outlined cell and message explain the current operation.
3. Change **Seconds per step**: a smaller interval plays faster.
4. Press **Pause**: colors, the current position and counters stay where they are.
5. Use **Step** to advance one operation, or **Start** to resume.
6. Press **Reset**, including while running: playback stops, 1 is excluded, and
   all other cells return to their initial state. The chosen speed is preserved.

Start and Step are disabled during playback and after completion. Pause is enabled
only while playing. Reset is always available. A legend, crossed-out composites,
a current-cell outline and the explanatory message supplement the colors.

## Timer → Data Bag → bindings → visible state

The Python declaration contains the entire scheduling mechanism:

```python
main_content.dataFormula(
    ".interval", "running ? delay : 0",
    running="^.running", delay="^.delay", _init=True)
main_content.dataController(func="step", _timing="^.interval")
```

`_timing` is in **seconds**. A positive value schedules repeated controller calls;
zero stops them. Start sets `.running` to true; Pause sets it to false. The formula
turns those values and the chosen `.delay` into the controller interval. Changing
that interval restarts the timer. Browser timers schedule discrete steps, not
precise real-time frames; a busy or background tab may delay them.

Both the timer and the Step button name **the same `Logic.step(node)` method**.
The algorithm does not need to know whether a person or the timer called it.
The manual Step button is disabled while playing, keeping one source of progress.

One algorithm operation writes a classification into Data:

```javascript
node.SET(`.cells.n${multiple}`, 'composite');
```

Each cell was authored once, with a class bound to that value:

```python
grid.span(str(number),
          class_=f"^.cells.n{number}:sieve-cell sieve-{{}}")
```

When `sieve.cells.n4` becomes `composite`, the binding produces the classes
`sieve-cell sieve-composite`. CSS supplies the appearance. Another binding on
`aria_current` outlines the number being processed. **No DOM queries, cell replacement,
manual repaint or CSS animation loop is involved.** The apparent animation is a
sequence of visible reactions to changes in the Data Bag.

The framework owns the controller timer and disposes it with its Source node. The
example does not create an independent `setInterval` or cleanup mechanism.

## The algorithm and its state

`reset()` creates a fresh Bag of cell classifications. This is derived algorithm
state, not server sample data, so it is initialized by the named reset operation.
The state is explicit:

| Data | Meaning |
| --- | --- |
| `cells.n1` … `cells.n100` | `pending`, `prime`, `composite`, or `excluded` for 1 |
| `prime` | Prime whose multiples are being visited; 0 before the first step |
| `multiple` | Next multiple to cross out |
| `current` | Cell outlined in the grid; 0 when none |
| `count`, `steps` | Discovered primes and completed algorithm operations |
| `running`, `done` | Playback and completion state |
| `delay`, `interval` | Chosen speed and effective timer interval |
| `message` | Explanation of the most recent operation |

`step()` either marks one multiple, or finds the next pending number and marks it
prime. Multiples begin at the square of the prime: smaller ones already have a
smaller prime factor. Some composites are encountered again by later primes; that
is harmless, and the outline/message still show the operation. Primes whose squares
exceed 100 require no further strikes. Completion stops the timer automatically.

## Read and reuse the code

The Python Page separates `controls()`, `grid()` and `explanation()`. The matching
JavaScript Page declares equivalent Source. The **same browser Logic class** serves
both versions: `reset`, `start`, `pause`, and `step` are shown in the JS source below.
There is no hidden Python implementation of the algorithm and no server call per tick.

All Data paths are relative to the `sieve` context. The controls and grid illustrate
the same context-based composition as Color Maker. For side-by-side instances, also
remove or parameterize the example's explicit button IDs; Data relocation alone
does not make fixed HTML IDs unique.
