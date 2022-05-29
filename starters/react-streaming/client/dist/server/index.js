import React, { createElement, Suspense, useState } from "react";
import { Router as Router$1, Routes, Route } from "react-router-dom";
import { atom, Provider, useAtom } from "jotai";
import { createRoutes } from "fastify-dx-react/routes.js";
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
process.env.NODE_ENV !== "production" ? function(obj) {
  return Object.freeze(obj);
} : function(obj) {
  return obj;
};
function createPath(_ref) {
  var _ref$pathname = _ref.pathname, pathname = _ref$pathname === void 0 ? "/" : _ref$pathname, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? "" : _ref$hash;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  var parsedPath = {};
  if (path) {
    var hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    var searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/"
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = Action.Pop;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state || null,
    key: locationProp.key || "default"
  };
  let staticNavigator = {
    createHref(to) {
      return typeof to === "string" ? to : createPath(to);
    },
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    }
  };
  return /* @__PURE__ */ createElement(Router$1, {
    basename,
    children,
    location,
    navigationType: action,
    navigator: staticNavigator,
    static: true
  });
}
const todoList = atom([]);
const Router = StaticRouter;
function create(routes2, ctx, url) {
  console.log("routes", routes2);
  return /* @__PURE__ */ React.createElement(Provider, {
    initialValues: [
      [todoList, ctx.data.todoList]
    ]
  }, /* @__PURE__ */ React.createElement(Suspense, null, /* @__PURE__ */ React.createElement(Router, {
    location: url
  }, /* @__PURE__ */ React.createElement(Routes, null, routes2.map(({ path, component: Component }) => {
    return /* @__PURE__ */ React.createElement(Route, {
      key: path,
      path,
      element: /* @__PURE__ */ React.createElement(Component, null)
    });
  })))));
}
function ClientOnly() {
  return /* @__PURE__ */ React.createElement("p", null, "This route is rendered on the client only!");
}
var __glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": ClientOnly
}, Symbol.toStringTag, { value: "Module" }));
function Index(props) {
  const [state, updateState] = useAtom(todoList);
  const [input, setInput] = useState(null);
  const addItem = async () => {
    updateState((todoList2) => {
      return [...todoList2, input.value];
    });
    input.value = "";
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", null, state.map((item, i) => {
    return /* @__PURE__ */ React.createElement("li", {
      key: `item-${i}`
    }, item);
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", {
    ref: setInput
  }), /* @__PURE__ */ React.createElement("button", {
    onClick: addItem
  }, "Add")));
}
var __glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": Index
}, Symbol.toStringTag, { value: "Module" }));
function ServerOnly() {
  return /* @__PURE__ */ React.createElement("p", null, "This route is rendered on the server only!");
}
var __glob_1_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": ServerOnly
}, Symbol.toStringTag, { value: "Module" }));
var routes = createRoutes({ "/pages/client-only.jsx": __glob_1_0, "/pages/index.jsx": __glob_1_1, "/pages/server-only.jsx": __glob_1_2 });
var index = {
  routes,
  create
};
export { index as default };
