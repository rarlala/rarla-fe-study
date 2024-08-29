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
