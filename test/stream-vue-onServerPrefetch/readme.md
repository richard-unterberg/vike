# Reproducer for [#1318](https://github.com/vikejs/vike/discussions/1318)

(Vue + SSR streaming + Suspense + partial hydration)

## Steps to reproduce

```bash
pushd ../../
pnpm reset
popd
pnpm run dev
```

```bash
curl http://localhost:3000
```

## Expected result

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <div id="app">
      <h1>Pinia Example</h1>
      <span>Counter that keeps its state on navigation</span>: <button type="button">Counter 0</button>
      <div id="todo-list">
        <!-- No todo list, will be streamed later -->
      </div>
    </div>
    <script id="vike_pageContext" type="application/json">{...}</script>
    <script type="module" async>
      import("/@vite/client");
      import("/@fs/home/lourot/Documents/git/vike/vite-plugin-ssr/vike/dist/esm/client/client-routing-runtime/entry.js");
    </script>

    <!-- Hanging 2000 ms -->

    <!-- Stream populating #todo-list -->
    <script>
      document.getElementById("todo-list").innerHTML = ...
    </script>
  </body>
</html>
```

## Actual result

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>

    <!-- Hanging 2000 ms -->

    <div id="app">
      <h1>Pinia Example</h1>
      <span>Counter that keeps its state on navigation</span>: <button type="button">Counter 0</button>
      <h2>To-do List</h2>
      <ul>
        <li><a href="/todos/0">Buy milk</a></li>
        <li><a href="/todos/1">Buy chocolate</a></li>
      </ul>
    </div>
    <script id="vike_pageContext" type="application/json">{...}</script>
    <script type="module" async>
      import("/@vite/client");
      import("/@fs/home/lourot/Documents/git/vike/vite-plugin-ssr/vike/dist/esm/client/client-routing-runtime/entry.js");
    </script>
  </body>
</html>
```
