# mobx-deku
Package with deku component wrapper for combining deku with mobx. Exports the observer function decorator. For documentation, see the [mobx](https://github.com/mobxjs/mobx) project.

`npm install mobx-deku`

## Boilerplate Projects that use mobx-deku
* Minimal MobX, deku, ES6, JSX, Hot reloading: [mobx-deku-boilerplate](https://github.com/orrybaram/mobx-deku-boilerplate)

## API documentation

### observer(component)

Function that converts a Deku component definition or stand-alone render function into a reactive component.
See the [mobx](https://mobxjs.github.io/mobx/refguide/observer-component.html) documentation for more details.

```javascript
import {observer} from "mobx-deku";

const TodoView = observer({
    render({props}) {
        return <div>{props.todo.title}</div>
    }
}));

```

## Full Example
```js
import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {observable} from 'mobx';
import {observer} from 'mobx-deku';

class AppState {
  @observable counter = 0;
  increaseCounter () {
    this.counter += 1;
  }
}
const appState = new AppState();

const App = observer({
  render ({props}) {
    return (
      <div>
        <div class='app'>{props.appState.counter}</div>
        <button onClick={onClick}>+</button>
      </div>
    );
    function onClick () {
      props.appState.increaseCounter();
    }
  }
});

render(tree(<App appState={appState} />), document.createElement('div'));
```

Special thanks to [mobx-react](https://github.com/mobxjs/mobx-react/blob/master/index.js) and [@mattmccray's gist](https://gist.github.com/mattmccray/d8740ea97013c7505a9b)