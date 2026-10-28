# Bidirectional Bag binding

Two dataBinder nodes map server order to view.order and view.mirror. Snapshot initialization precedes live changes.

1. Change the first quantity to 5 and leave the field: the second becomes 5 and the total becomes 62.50.
2. Change the second quantity to 3: the first follows and the server total becomes 37.50.
3. Enter -1: the controller writes an error status, preserving the previous valid total.
4. Enter 4 to recover.

The separate PageStore builds its recipe in main. Its dataController reacts to order.quantity and writes the total and status. No dataSetter, client calculation or RPC is needed. The originating binder is excluded from the change echo; the other binder receives it.
