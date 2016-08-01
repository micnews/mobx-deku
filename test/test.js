import {render, tree} from 'deku';
import element from 'magic-virtual-element'; // eslint-disable-line
import {observable, action} from 'mobx';
import {observer} from '../';
import test from 'ava';

class AppState {
  @observable counter = 0;
  increaseCounter () {
    this.counter += 1;
  }
}

class AppState2 {
  @observable counter = 0;
  increaseCounter () {
    this.counter += 1;
  }
}

class AppState3 {
  @observable bool = false;
  @observable objectOne = {
    id: 42,
    something: 'ok!'
  }
  @observable simpleArray = [1, 2, 3];
  @observable todos = [{
    title: 'test',
    id: 1,
    completed: false
  },
  {
    title: 'test2',
    id: 2,
    completed: false
  }];

  @action completeTodo (index) {
    this.todos[index].completed = true;
  }
}

const appState = new AppState();
const appState2 = new AppState2();
const appState3 = new AppState3();

const App = observer({
  render ({props}) {
    return (
      <div>
        <div class='app'>{props.appState.counter}</div>
        <div class='app2'>{props.appState2.counter}</div>
        <div class='app3'>
          <div class='simpleArray'>{props.appState3.simpleArray[0]}</div>
          <div class='objectExample'>{props.appState3.objectOne.id}</div>
          {props.appState3.todos.map((todo, index) => {
            return (
              <div class={{'completed': todo.completed, todo: true}}>
                {todo.title}<span>{todo.id}</span>
                <button onClick={onClick(index)}></button>
              </div>
            );
          })}
        </div>
      </div>
    );
    function onClick (index) {
      return function () {
        props.appState3.completeTodo(index);
      };
    }
  }
});

const container = document.createElement('div');
const app = render(tree(<App appState={appState} appState2={appState2} appState3={appState3} />), container);

test('App gets rendered', (t) => {
  t.truthy(app);
  t.truthy(container.querySelector('.app'));
});

test.cb('App UI gets updated when data changes', (t) => {
  var $app = container.querySelector('.app');

  t.is($app.innerHTML, '0', 'Default value at 0');
  appState.increaseCounter();
  setTimeout(() => {
    t.is($app.innerHTML, '1', 'Updates to 1');
    appState.counter = 10;
  });
  setTimeout(() => {
    t.is($app.innerHTML, '10', 'updates to 10');
    t.end();
  }, 100);
});

test.cb('App UI gets updated when data changes in the second store', (t) => {
  var $app = container.querySelector('.app2');

  t.is($app.innerHTML, '0', 'Default value at 0');
  appState2.increaseCounter();
  setTimeout(() => {
    t.is($app.innerHTML, '1', 'Updates to 1');
    appState2.counter = 10;
  });
  setTimeout(() => {
    t.is($app.innerHTML, '10', 'updates to 10');
    t.end();
  }, 100);
});

test.cb('Todo list gets rendered', (t) => {
  var $app = container.querySelector('.app3');
  appState3.todos[0].title = 'New Title';
  appState3.todos[0].id = 20;

  t.is($app.querySelector('.simpleArray').innerHTML, '1');

  setTimeout(() => {
    t.is($app.querySelector('.todo').textContent, 'New Title20');
    $app.querySelector('button').click();
  });

  setTimeout(() => {
    t.is($app.querySelector('.todo').className, 'completed todo');
    appState3.objectOne.id = 'it worked!';
    appState3.simpleArray[0] = 42;
  }, 100);

  setTimeout(() => {
    t.is($app.querySelector('.objectExample').innerHTML, 'it worked!');
    t.is($app.querySelector('.simpleArray').innerHTML, '42');
    t.end();
  }, 200);
});
