import {render, tree} from 'deku';
import element from 'magic-virtual-element'; // eslint-disable-line
import {observable} from 'mobx';
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

const appState = new AppState();
const appState2 = new AppState2();

const App = observer({
  render ({props}) {
    return (
      <div>
        <div class='app'>{props.appState.counter}</div>
        <div class='app2'>{props.appState2.counter}</div>
      </div>
    );
  }
});

const container = document.createElement('div');
const app = render(tree(<App appState={appState} appState2={appState2} />), container);

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
