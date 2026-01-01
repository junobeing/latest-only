# latest-only

Guarantee that **only the latest async operation** is allowed to produce effects.

This library prevents **stale async results** from updating your UI — a very common bug in frontend applications.

---

## The problem

In real applications, async operations often overlap.

### Example

```ts
search("jo");     // slow request
search("john");   // fast request
```

If `"jo"` finishes **after** `"john"`, many applications accidentally show **wrong data**.

This is **not a backend issue**.  
This is a **frontend concurrency problem**.

JavaScript promises resolve whenever they want — older async work does not know it is obsolete.

---

## What this library guarantees

> **Only the most recent async execution is allowed to succeed.**

Older executions are:
- ignored automatically
- optionally aborted to save network and resources

---

## Installation

```bash
npm install latest-only
```

```bash
yarn add latest-only
```

```bash
pnpm add latest-only
```

```bash
bun add latest-only
```

---

## Usage

### 1️⃣ Simple usage — `latest(fn)`

Best for:
- search inputs
- event handlers
- effects
- user-driven async logic

```ts
import { latest } from "latest-only";

const searchUsers = latest(async (query: string) => {
  const res = await fetch(`/api/search?q=${query}`);
  return res.json();
});

const result = await searchUsers("john");

if (result !== undefined) {
  // safe to update UI
}
```

Only the **latest call** can return a value.  
Older calls return `undefined`.

---

### 2️⃣ Advanced usage — `createController()`

Best when you want to control multiple async tasks by key.

```ts
import { createController } from "latest-only";

const controller = createController();

async function loadUser(id: string) {
  const result = await controller.run("user", async ({ signal }) => {
    const res = await fetch(`/api/users/${id}`, { signal });
    return res.json();
  });

  if (result) {
    // safe to update UI
  }
}
```

Starting a new request with the same key:
- aborts the previous request
- ignores stale results
- guarantees correctness

---

### 3️⃣ React usage — `useLatest`

Best for React components.

```tsx
import { useLatest } from "latest-only";

function Search() {
  const search = useLatest(async (q: string) => {
    const res = await fetch(`/api/search?q=${q}`);
    return res.json();
  });

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const result = await search(e.target.value);
    if (result) {
      // update state safely
    }
  }

  return <input onChange={onChange} />;
}
```

- No debounce
- No race conditions
- No stale UI updates

---

## What this library does NOT do

- ❌ No caching
- ❌ No retries
- ❌ No polling
- ❌ No server-state management
- ❌ No UI abstractions

This library focuses on **one thing only**:

> **Async correctness**

---

## When should you use this?

- Search inputs
- Route-based data loading
- Auth token refresh
- Effects that re-run
- Any async code where **only the latest result matters**

---

## License

MIT
