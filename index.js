import {reaction} from 'mobx';

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

    unsubscriber = reaction(
      () => {
        console.log(component.props.state);
        return component.props.state.counter
      },
      (counter) => {
        _render(component, setState)
        setState({ __updates: updateCount++ });
    });

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
