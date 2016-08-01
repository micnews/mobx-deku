import {reaction, toJS} from 'mobx';

exports.observer = observer;

function observer (target) {
  const _render = target.render;
  const _beforeUnmount = target.beforeUnmount;
  let unsubscriber = null;
  let updateCount = 0;

  target.render = (component, setState) => {
    let baseRender = _render(component, setState);
    if (unsubscriber) {
      unsubscriber();
    }

    // Get all of the mobx stores from props
    const stores = Object.keys(component.props).map((prop) => {
      const property = component.props[prop];
      if (typeof property === 'object' && property.hasOwnProperty('$mobx')) {
        return property;
      }
    }).filter((prop) => prop);

    unsubscriber = reaction(
      () => {
        // Extract the observables
        const observables = stores.map((store) => {
          if (!store) return {};
          return Object.keys(store).map((prop) => {
            if (typeof store[prop] === 'object') {
              const obj = toJS(store[prop]);
              // If its an array, make all objects inside observable
              if (Array.isArray(obj)) {
                return obj.map((obj) => {
                  return Object.keys(obj).map((x) => x);
                });
              }
              // If its a regular object, make all props of the object observable
              return Object.keys(obj).map((x) => x);
            }
            return store[prop];
          });
        }).reduce((a, b) => a.concat(b));

        return observables;
      },
      (observables) => {
        _render(component, setState);
        setState({ __updates: updateCount++ });
      })
    ;

    return baseRender;
  };

  target.beforeUnmount = (component, el) => {
    if (unsubscriber) {
      unsubscriber();
    }
    if (_beforeUnmount) {
      _beforeUnmount(component, el);
    }
  };

  // If there's already a shouldUpdate, don't overwrite it.
  target.shouldUpdate = target.shouldUpdate || shouldUpdate;

  return target;
}

function shouldUpdate (component, nextProps, nextState) {
  const {props, state} = component;
  // Update on any state changes (as is the default)
  if (state !== nextState) {
    return true;
  }
  // Update if props are shallowly not equal, inspired by PureRenderMixin
  let keys = Object.keys(props);

  if (keys.length !== Object.keys(nextProps).length) {
    return true;
  }

  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    if (nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
}
