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
