# React-Hook
This the note for react-hook

--- 
#### Quick Start
Why HOOK?  
- A better way to reuse states between components without modifying the structure of components.   
- Easier way to decompose complex components.  
- Without CLASS  

---
```
import React, { useState } from 'react';

function Example() {
  // useState is a hook which would add inner state for component
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```  
`useState` returns state and `setState()`, however, it would not merge old and new states.  
It accepts one parameter, the initial state.

--- 
```
function Example(){
    const [age, setAge] = useState(41);
    const [fruit, setFruit] = useState('Banana');
}
```
You can use different hook state in one component.  

--- 
`Effect Hook`  
Enable functional components to control effect.  
```
import {useState, useEffect } from react
function Eg() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = 'You clicked ${count} times';
});

return (
    div 
        p
        <button onClick={() => setCount(count+1)}>
    //...
```  
`UseEffect` would be called after rendering, which includes the first render.  

--- 
- Use Hook on the outside of function. 
- Use Hook only in function component.

---
custom hook  
A way to reuse states between hooks.  
`useSomthing`: call other HOOK in the custom hook. 
