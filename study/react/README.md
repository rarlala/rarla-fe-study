# Build Your own React

https://pomb.us/build-your-own-react/

## STEP 0

### how React, JSX and DOM elements work

```javascript
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

1. react element 정의
2. DOM에서 하나의 node 가져오기
3. React요소를 컨테이너에 렌더링

JSX는 Babel과 같은 빌드 도구를 통해 JS로 변환된다.
변환 과정은 보통 단순하다.
태그 내부의 코드를 createElement 호출로 바꾸고 태그 이름, props 및 children을 매개변수로 전달한다.

```javascript
const element = <h1 title="foo">Hello</h1>;
```

```JSX
const element = React.createElement(
  "h1",
  {title: "foo"},
  "Hello"
)
```

React.createElement는 인수로부터 객체를 생성한다.
따라서 함수 호출을 해당 출력으로 안전하게 대체할 수 있다.

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};
```

type은 생성하려는 DOM node의 유형을 지정하는 문자열이다.
HTML 요소를 생성하려는 경우 document.createElement에 전달하는 tagName이다.

props는 또 다른 객체이며, JSX 속성의 모든 키와 값을 갖는다.
children이라는 특별한 속성도 있다.

위의 경우 children은 문자열이지만 일반적으로 더 많은 요소가 포함된 배열이다.
그렇기 때문에 요소도 tree다.

```JSX
ReactDOM.render(element, container)
```

교체해야 할 또 다른 React 코드 부분은 ReactDOM.render에 대한 호출이다.
render는 React가 DOM을 변경하는 곳이므로 직접 업데이트 해보겠다.

```javascript
const node = document.createElement(element.type);
node["title"] = element.props.title;
```

먼저 element type을 사용해 node를 만든다.
그 다음 모든 props를 해당 node에 할당한다.
(+. React 요소 지칭 시 element, DOM 요소 지칭 시 node 사용)

```javascript
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;
```

그 다음 children을 위한 node를 만든다.
자식으로 문자열만 있으므로 text node를 만든다.

innerText를 설정하는 대신 textNode를 사용하면 나중에 모든 요소를 동일한 방식으로 처리할 수 있다.

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello", // nodeValue: "hello"
  },
};
```

마지막으로 textNode를 h1에 추가하고 h1을 컨테이너에 추가한다.

```javascript
const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title;

const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

node.appendChild(text);
container.appendChild(node);
```

-> swift ui 구성하는 방식과 비슷한 듯!

결과적으로 우리는 React를 사용하는 아래 코드에서

```javascript
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

아래 코드로 React를 사용하지 않고 똑같은 app을 만들었다!

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title;

const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

node.appendChild(text);
container.appendChild(node);
```

## STEP 1

### The createElement Function

다른 앱으로 시작해보자.
이번에는 React 코드를 자체 버전의 React로 대체하겠다.

1. 자체 createElement 작성
   createElement 호출을 볼 수 있도록 JSX를 JS로 변환해보겠다.

이전 STEP에서 봤듯이, element는 type과 props이 있는 object다.
우리가 함수에서 해야할 일은 해당 object를 생성하는 것이다.

JSX 코드

```JSX
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

JS 코드

```javascript
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
);
```

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```

props에는 spread 연산자를 사용하고 children에는 rest parameter 구문을 사용한다.
props는 객체로 전달되며, ...props는 객체의 모든 키-값 쌍을 복사해서 새로운 객체로 만든다.
children의 값은 나머지 인자로 전달된 요소들이 배열 형태로 들어간다.

예시로 살펴보자
아래의 코드가 호출되면

```javascript
createElement("div");
```

이 함수가 반환하는 객체는 아래가 된다.

```javascript
{
  "type": "div",
  "props": { "children": [] }
}
```

다른 예시로는

```javascript
createElement("div", { id: "myDiv", className: "container" }, "Hello", "World");
```

이 함수가 반환하는 객체는 아래가 된다.

```javascript
{
  type: 'div',
  props: {
    id: 'myDiv',
    className: 'container',
    children: ['Hello', 'World']
  }
}
```

createElement 함수가 children 요소를 처리하는지 알아보자.

```javascript
children: children.map((child) =>
  typeof child === "object" ? child : createTextElement(child)
);
```

children은 배열이다. 이 배열에는 div 안에 텍스트 같은 요소의 자식들이 들어있다. map 함수는 배열의 각 요소를 순회하며 새로운 배열을 생성하고, 각 child 요소에 대해 type이 object인지 확인한다.

child가 객체라면 그대로 반환한다.
child가 객체가 아니라면 createTextElement(child) 함수를 호출해 이를 특별한 요소로 래핑한다.

```javascript
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```

createTextElement 함수는 text 값을 받아 TEXT_ELEMENT라는 타입의 객체를 반환한다.
nodeValue 속성에 텍스트 값을 저장하고, children 배열은 비어있다. children 배열은 비어있는 이유는 텍스트 노드는 자식 요소를 가질 수 없기 때문이다.

즉

```javascript
createElement("div", null, "Hello", "World", 123);
```

위 코드가 호출되면 children은 ["Hello", "World", 123]이 된다.
children 배열은 map에 의해 순회된다. "Hello", "World", 123은 모두 객체가 아니므로 createTextElement 함수로 처리된다.
최종적으로 children 배열은 아래 코드와 같이 변환된다.

```javascript
[
  { type: "TEXT_ELEMENT", props: { nodeValue: "Hello", children: [] } },
  { type: "TEXT_ELEMENT", props: { nodeValue: "World", children: [] } },
  { type: "TEXT_ELEMENT", props: { nodeValue: "123", children: [] } },
];
```

실제 React에서는 원시 값을 자동으로 래핑하거나 빈 배열을 생성하진 않는다.
근데 이렇게 만드는 이유는 성능보다는 코드의 단순함을 우선시하기 때문이다.
모든 child가 객체로 일관되게 처리되도록 하는 것이 코드의 일관성을 유지하기 쉽기 때문이다.

즉, 위 설명은 child가 객체가 아닌 원시값으로 들어와도 코드의 일관성을 유지하기 위해 createTextElement를 호출해 객체로 변환한다는 설명이다.

우리는 여전히 React의 createElement를 사용하고 있다.
이를 대체하기 위해 라이브러리에 이름을 Didact라고 지정하겠다.

```javascript
const Didact = {
  createElement,
};

const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
);
```

Didact에서도 JSX를 사용하고 싶기 때문에, babel에게 React 대신 Didact의 createElement를 사용하도록 지시하는 방법이 필요하다.

```javascript
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
```

위와 같은 주석을 사용하면 babel이 JSX를 transpile할 때 우리가 정의한 함수를 사용할 것이다.

## STEP 2

### The render Function

렌더링 기능 다음으로 ReactDOM.render 함수 버전을 작성해한다.
업데이트 및 삭제는 나중에 처리하기로 하고, DOM에 항목을 추가하는 것만 해보자.

```javascript
function render(element, container) {
  // TODO create dom nodes
}

const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
```

```javascript
function render(element, container) {
  const dom = document.createElement(element.type);

  container.appendChild(dom);
}
```

element type을 사용해 DOM 노드를 생성한 다음 생성한 노드를 컨테이너에 추가한다.

우리는 각 자식에 대해서도 동일한 작업을 반복적으로 수행한다.

```javascript
function render(element, container) {
  const dom = document.createElement(element.type);

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}
```

또한 text elements를 처리해야한다. element type이 TEXT_ELEMENT인 경우 일반 노드 대신 text 노드를 생성한다.

```javascript
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}
```

여기서 마지막으로 해야 할 일은 element props를 node에 할당하는 것이다.

```javascript
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}
```

이렇게 하면 JSX를 DOM으로 렌더링 할 수 있는 라이브러리가 생성된다.

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
```

## STEP 3

### Concurrent Mode

우선, 이어서 코드를 더 추가하기 전에 코드 리팩터링이 필요하다.

```javascript
element.props.children.forEach((child) => render(child, dom));
```

위 재귀 호출 코드에 문제가 있다.

렌더링을 시작하면 완벽한 엘리먼트 트리를 렌더링할 때까지 멈추지 않는다. 엘리먼트 트리가 크면 메인 스레드를 오랫동안 차단할 수 있다. 그러면 브라우저가 사용자 입력을 처리하거나 애니메이션을 매끄럽게 유지하는 것과 같이 우선순위가 높은 작업을 해야하는 경우에도 렌더링이 완료될 때까지 기다려야한다.

그래서 우리는 작업을 작은 단위로 나누고 각 단위를 마친 후에 수행해야 할 다른 작업이 있으면 브라우저가 렌더링을 중단하도록 할 것이다.

```javascript
let nextUntilOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUntilOfWork && !shouldYield) {
    nextUntilOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
```

우리는 requestIdleCallback을 사용해 loop를 만들 것이다.
requestIdleCallback을 setTimeout으로 생각할 수 있지만 실행 시기를 알려주는 대신 브라우저는 기본 스레드가 유휴 상태일 때 콜백을 실행한다.

+. React는 더 이상 requestIdleCallback을 사용하지 않고, [scheduler package](https://github.com/facebook/react/tree/main/packages/scheduler)를 사용한다. 하지만 이 예시에서는 개념적으론 동일하다.

requestIdleCallback은 deadline 매개변수도 제공한다. 이를 사용해 브라우저가 다시 제어애야 할 때까지 남은 시간을 확인 할 수 있다.

loop 사용을 시작하려면 첫번째 작업 단위를 설정한 다음 작업을 수행할 뿐만 아니라 다음 작업 단위를 반환하는 PerformUnitOfWork 함수를 작성해야한다.

## STEP 4

### Fibers

작업 단위를 구성하려면 fiber tree라는 데이터 구조가 필요하다.
각 element마다 하나의 fiber가 있고 각 fiber는 작업 단위가 된다.

![fiber](https://pomb.us/static/c1105e4f7fc7292d91c78caee258d20d/d3fa7/fiber2.png)

```javascript
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
);
```

위 코드를 element tree로 렌더링한다고 가정해보겠다.

렌더링에서 root fiber를 생성하고 nextUnitOfWork로 설정한다.
나머지 작업은 PerformUnitOfWork 함수에서 수행되며 각 fiber에 대해 세가지 작업을 수행한다.

1. element를 DOM에 추가한다.
2. element의 children에 대한 fiber를 생성
3. 다음 작업 단위를 선택

fiber tree 구조의 목표 중 하나는 **다음 작업 단위를 쉽게 찾을 수 있도록 하는 것**이다. 이것이 바로 각 Fiber가 첫 번째 자식, 다음 형제 및 부모에 대한 링크를 갖는 이유다.

Fiber에 대한 작업 수행이 끝나면, 해당 Fiber가 다음 작업 단위가 된다.
예를 들면 위 코드에서 div 파이버 작업을 마치면 다음 작업 단위는 h1 파이버가 된다.

만약 fiber가 child를 가지지 않는다면 다음 작업으로 sibling이 사용된다.
그리고 fiber가 자식이나 형제자매가 없으면 부모의 형제자매인 삼촌으로 이동한다.
위 예로 비유하면 a -> h2로의 이동이 해당된다.

위 작업들은 루트에 도달할 때까지 부모를 통해 계속 올라간다.
루트에 도달했다면 렌더링에 대한 모든 작업 수행을 완료했음을 의미한다.

<details>
<summary>여기서 잠깐, Fiber란?</summary>

- React에서 각 UI요소를 나타내는 데이터 구조다. 이는 Virtual DOM에서 각 요소를 더 세밀하게 관리하고 업데이트하기 위한 기반을 제공한다.
- Fiber는 작업 단위라고 할 수 있다. React의 업데이트는 Fiber 트리의 작업을 통해 이루어지며, 각 Fiber는 해당 UI 요소에 대한 정보를 담고 있다.

Fiber 아키텍처의 핵심 요소

- Fiber Node
  - 각 Fiber는 React 컴포넌트나 DOM 요소를 나타내는 데이터 구조다
  - Fiber 객체는 컴포넌트의 상태, 프로퍼티, 자식, 부모 등의 정보를 포함한다.
- Fiber Tree
  - Fiber는 Tree 구조로 연결되어있다. 각 Fiber는 부모 Fiber와 자식 Fiber를 가지며 전체 UI 구조를 나타내는 트리를 형성한다.
- 작업의 우선 순위
  - Fiber는 우선 순위에 따라 작업을 나누어 처리한다. 높은 우선순위를 가진 작업은 먼저 수행되고, 낮은 우선순위 작업은 나중에 수행된다.
  - 작업은 slice 형태로 나눠져 수행되며, 이로 인해 UI 업데이트를 더 부드럽고 동적으로 처리할 수 있다.
- 비동기 작업 처리
  - Fiber는 비동기적으로 작업을 처리할 수 있도록 설계되어있다. 이는 긴 작업을 여러 프레임에 걸쳐 나누어 처리할 수 있게 해준다.

다음 작업 단위의 의미
Fiber가 작업을 처리한 후 다음 작업을 수행할 준비가 된다는 것을 의미
Fiber가 계속해서 UI 업데이트를 처리하고 관리하는데 있어 다음 단계로 진행될 수 있음을 의미한다.

</details>

DOM 노드를 생성하는 부분을 함수에 보관하고 나중에 사용할 예정이다.
우선, render로 적었던 함수를 createDom으로 함수명을 변경한다.

```javascript
function createDom(fiber) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  return dom;
}
```

render 함수는 nextUnitOfWork를 Fiber tree의 root로 설정한다.

```javascript
function render(element, container) {
  nextUntilOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}
```

그 다음 브라우저가 준비되면 workLoop를 호출하고 root에서 작업을 시작한다.

1. 먼저 새 노드를 생성하고 이를 DOM 노드에 추가한다.
   우리는 fiber.dom 속성에서 DOM 노드를 추적한다.

2. 그 다음 각 children마다 새로운 fiber를 만든다.

그리고 첫 번째 child인지 아닌지에 따라 child 또는 sibling으로 설정해 fiber 트리에 추가한다.

3. 마지막으로 다음 작업 단위를 검색한다.
   먼저 child를 시도하고, 다음에는 sibling, 다음에는 uncle과 시도한다.

```javascript
function performUnitOfWork(fiber) {
  // 1. add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  // 2. create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // 3. return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

이렇게 우리의 performUnitOfWork가 만들어졌다.

## STEP 5

### Render and commit Phases

또 문제가 되는 코드가 있다.

```javascript
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

element에 대해 작업할 때마다 DOM에 새 노드를 추가하고 있다.
전체 트리 렌더링을 완료하기 전에 브라우저가 작업을 중단할 수 있는데, 이 경우 사용자에게는 불완전한 UI가 표시되는데 우리는 이를 원치 않는다.

따라서 DOM을 변경하는 저 부분을 제거하고,
대신 fiber tree의 root를 추적할 것이다.
이를 작업 진행 루트 또는 wipRoot라고 부른다.

```javascript
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUntilOfWork = wipRoot;
}

let nextUntilOfWork = null;
let wipRoot = null;
```

그리고 모든 작업을 마치면, 전체 파이버 트리를 DOM에 커밋한다.
commitRoot 함수에서 이를 수행한다. 여기서는 모든 노드를 dom에 재귀적으로 추가한다.

```javascript
function commitRoot() {
  // TODO add nodes to dom
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

...

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
​
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
​
  requestIdleCallback(workLoop)
}
​
```

## STEP 6

### Reconciliation

Reconciliation이란 재조정으로 컴포넌트 업데이트를 예측하는 비교(diffing) 알고리즘에 대해 알아보자. [리액트 공식 문서 참고](https://reactjs-kr.firebaseapp.com/docs/reconciliation.html)

지금까지는 DOM에만 항목을 추가했지만, 노드를 업데이트하거나 삭제하는 것은 어떻게 할까? 이 부분에 대해 알아보자. 렌더링 함수에서 받은 요소를 DOM에 커밋한 마지막 파이버 트리와 비교해야한다.

비교를 위해 커밋을 마친 후에 DOM에 커밋한 마지막 파이버 트리에 대한 참조를 저장해야하는데,
currentRoot라는 변수명에 저장했다.

```javascript
function commitRoot() {
  commitWork(wipRoot.child)
  **currentRoot = wipRoot**
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
​
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    **alternate: currentRoot,**
  }
  nextUnitOfWork = wipRoot
}
​
let nextUnitOfWork = null
let currentRoot = null
**let wipRoot = null**
```

위 코드에서 보면 모든 fiber에 alternate 프로퍼티를 추가했다.
alternate 프로퍼티는 이전 커밋 단계에서 DOM에 커밋한 파이버 이전 파이버에 대한 링크를 의미한다.

이제 새로운 Fiber를 생성하는 performUnitOfWork 함수에서 2. create new fibers에 해당하는 부분을 reconcileChildren() 함수로 빼서 작업해보겠습니다.

```javascript
function performUnitOfWork(fiber) {
  // 1. add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 2. create new fibers
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3. return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null,
    };

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

이 함수에서 오래된 fiber를 새로운 elements와 조정 시킬 것이다.
이전 fiber의 children과 조정하려는 elements 배열을 동시에 반복한다.

배열과 linked list를 동시에 반복하는데 필요한 모든 boilerplate를 무시하면 이 while 문에서 가장 중요한 oldFiber와 element가 남는다. element는 우리가 DOM에 렌더링하려는 항목이고, oldFiber는 마지막으로 렌더링한 항목이다.
DOM에 적용할 사항이 있는지 확인하려면 이를 비교해야한다.

그럼 어떻게 비교할까?

- 이전 Fiber와 새 요소의 유형이 동일한 경우 DOM 노드를 유지하고 새 prop으로 업데이트함
- 유형이 다르고 새 요소가 있으면 새 DOM 노드를 만들어야 함
- 유형이 다르고 오래된 Fiber가 있는 경우 기존 노드를 제거

여기서 React는 더 나은 조정을 위해 key를 사용한다. 예를 들어, 요소 배열에서 자식이 위치를 변경하는 경우를 감지합니다.

이전 파이버와 요소의 유형이 동일한 경우 이전 파이버의 DOM 노드와 요소의 소품을 유지하는 새 파이버를 만든다.
또한 fiber에 effectTag라는 새로운 속성을 추가합니다. 나중에 커밋 단계에서 이 속성을 사용한다.

```javascript
if (sameType) {
  // update the node
  newFiber = {
    type: oldFiber.type,
    props: element.props,
    dom: oldFiber.dom,
    parent: wipFiber,
    alternate: oldFiber,
    effectTag: "UPDATE",
  };
}
```

그다음 요소에 새 DOM 노드가 필요한 경우 PLACEMENT 효과 태그로 새 fiber에 태그를 지정한다.

```javascript
if (element && !sameType) {
  // add this node
  newFiber = {
    type: element.type,
    props: element.props,
    dom: null,
    parent: wipFiber,
    alternate: null,
    effectTag: "PLACEMENT",
  };
}
```

그리고 노드를 삭제해야 하는 경우, 새 Fiber가 없으므로 이전 Fiber에 효과 태그를 추가합니다.
하지만 파이버 트리를 DOM에 커밋할 때 이전 파이버가 없는 작업 진행 중인 루트에서 수행합니다.

```javascript
if (oldFiber && !sameType) {
  oldFiber.effectTag = "DELETION";
  deletions.push(oldFiber);
}
```

따라서 제거하려는 노드를 추적하려면 배열이 필요하다.

```javascript
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUntilOfWork = wipRoot;
}

let nextUntilOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
```

그런 다음 DOM에 변경 사항을 적용할 때 해당 배열의 파이버도 사용한다.

```javascript
function commitRoot() {
  deletions.forEach(commitWork);
  // add nodes to dom
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}
```

이제 새로운 effectTags를 처리하도록 commitWork 함수를 변경해보자

fiber에 effectTag가 PLACEMENT인 경우
이전과 동일한 작업을 수행하고 상위 Fiber의 노드에 DOM 노드를 추가한다.

```javascript
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;

  **if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  }**
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

fiber에 effectTag가 DELETION인 경우
반대로 자식을 제거한다.

```javascript
else if (fiber.effectTag === "DELETION") {
  domParent.removeChild(fiber.dom);
}
```

fiber에 effectTag가 UPDATE인 경우
변경된 props로 기존 DOM 노드를 업데이트 한다.

```javascript
function updateDom(dom, prevProps, nextProps) {
  //
}
...
else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
  updateDom(fiber.dom, fiber.alternate.props, fiber.props);
}
```

기존 Fiber의 props와 새 Fiber의 props를 비교하여 없어진 props는 제거하고, 새로 추가되거나 변경된 props는 세팅한다.

```javascript
const isProperty = (key) => key !== "children";
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}
```

업데이트해야하는 특별한 종류의 prop 중 하나는 이벤트 리스너다.
prop 이름이 'on' 접두사로 시작하는 경우 이를 다르게 처리한다.

```javascript
const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
```

이벤트 핸들러가 변경되면 노드에서 이를 제거한다.
그리고 새로운 이벤트 핸들러를 추가한다.

```javascript
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  //...

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
```

## STEP 7

### Function Components

다음으로 추가해야 할 것은 function components에 대한 지원이다.
h1 element를 반환하는 간단한 function component를 사용해겠다.

```javascript
function App(props) {
  return <h1>Hi {props.name}</h1>;
}
const element = <App name="foo" />;
const container = document.getElementById("root");
Didact.render(element, container);
```

jsx를 js로 변환하면 다음과 같습니다.

```javascript
function App(props) {
  return Didact.createElement("h1", null, "Hi ", props.name);
}
const element = Didact.createElement(App, { name: "foo" });
```

function component는 2가지 측면에서 다르다.

- function component의 fiber에는 dom 노드가 없다.
- children은 props에서 직접 가져오는 대신 함수를 실행해 나온다.

```javascript
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 1. add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 2. create new fibers
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3. return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function updateFunctionComponent(fiber) {
  // TODO
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}
```

fiber type이 function인지 확인하고 이에 따른 다른 업데이트 함수로 이동한다.
updateHostComponent에서는 이전과 동일한 작업을 수행한다.

```javascript
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
```

updateFunctionComponent에서 children을 가져오는 함수를 실행한다.
예를 들어, 여기에서 Fiber.type은 App 함수이고 이를 실행하면 h1 요소를 반환한다.

그 다음 children이 있으면 조정이 동일한 방식으로 작동하므로 아무것도 변경할 필요가 없다.

변경해야할 것은 commitWork 함수다
이제 DOM 노드가 없는 fiber가 있으므로 2가지를 변경해야한다.

```javascript
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

그리고 노드를 제거할 때 DOM 노드가 있는 하위 항목을 찾을 때까지 계속 진행해야한다.

```javascript
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}
```
