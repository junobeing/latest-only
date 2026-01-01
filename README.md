# latest-only

Guarantee that only the latest async operation can produce effects.

## What problem does this solve?

In real frontend apps, multiple async operations often overlap.
Older requests can finish later and overwrite newer, correct data.

This library makes that impossible.

## Status

🚧 Work in progress
