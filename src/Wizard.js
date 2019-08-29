import React, { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { isMachine } from 'xstate/lib/utils';
import PropTypes from 'prop-types';

const { number, bool, object, func } = PropTypes;

const WizardContext = React.createContext({
  from: null,
  to: null,
  goto: step => {},
  next: () => {},
});

//
//
//
function Wizard({ tabs, graph, children, ...rest }) {
  children = children
    ? React.Children.count(children) === 1
      ? [children]
      : children
    : [];

  if (tabs && graph) throw new Error('graphs and tabs are mutually exclusive');
  if (graph && !isMachine(graph))
    throw new Error('graph is not an xstate Machine');
  // if (graph && children.find(({ type }) => type === Steps))
  //   throw new Error('You cannot have a graph and Steps');
  if (graph && children.find(({ type }) => type === Step))
    throw new Error(
      'You cannot have a graph and Step. Also Step should be inside Steps'
    );
  if (graph && children.find(({ type }) => type === Nav))
    throw new Error('You cannot use Nav with graph. Use GraphNav instead');

  if (!children.find(({ type }) => type === Steps))
    throw new Error(
      'You must use a `Steps` component to wrap your steps (which will render your views)'
    );

  if (tabs) return <TabWizard {...rest}>{children}</TabWizard>;
  else if (graph)
    return (
      <GraphWizard graph={graph} {...rest}>
        {children}
      </GraphWizard>
    );
  else return <LinearWizard {...rest}>{children}</LinearWizard>;
}

Wizard.propTypes = {
  initial: number,
  tabs: bool,
  graph: object,
  onTransition: func,
};

//
//
//
export function GraphWizard({ graph, children, ...rest }) {
  const [current, send, service] = useMachine(graph);

  useEffect(() => {
    service.onTransition(state => console.log(state.value));
  }, [service]);

  const clonedChildren = React.Children.map(children, child => {
    const extraProps = {
      current,
      send,
      service,
      graph,
      ...rest,
      // titleDescPairs, // for ProgressIndicator
    };

    return React.cloneElement(child, extraProps);
  });

  return <React.Fragment>{clonedChildren}</React.Fragment>;
}

//
//
//
export function GraphNav({ current, send, selected }) {
  const nextEvents = current.nextEvents;
  const hasPrev = nextEvents.find(ev => ev.startsWith('PREV'));
  const hasNext = nextEvents.find(ev => ev.startsWith('NEXT'));
  const allNext = nextEvents.filter(ev => ev.startsWith('NEXT'));

  const nextEvent = allNext.find(ev => ev.endsWith(selected.toUpperCase()));

  return (
    <div>
      {hasPrev && <button onClick={() => send(hasPrev)}>Previous</button>}

      {hasNext && (
        <button onClick={() => send(nextEvent || hasNext)}>Next</button>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------

//
//
//
export function TabWizard(props) {
  return <LinearWizard {...props} />;
}

//
//
//
export function TabNav({ current, setCurrent, titleDescPairs }) {
  return (
    <div>
      {titleDescPairs.map(({ title }, index) => (
        <span key={`${index}`}>
          <button onClick={() => setCurrent(index)}>{title}</button>
        </span>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------

//
//
//
export function LinearWizard({ initial, children }) {
  const _Step = children.find(({ type }) => type === Step);
  const _Steps = children.find(({ type }) => type === Steps);
  // const _Nav = children.find(({ type }) => type === Nav);
  // const _Progress = children.find(({ type }) => type === ProgressIndicator);

  if (_Step) throw new Error('Step must be inside Steps');

  const [current, setCurrent] = useState(initial || 0);

  const [steps] = useState(() => {
    return _Steps.props.children.map(
      ({ props: { id, title, description } }) => ({
        id,
        title,
        description,
      })
    );
  });

  const count = React.Children.count(_Steps.props.children);
  const newChildren = React.Children.map(children, child => {
    const newProps = {
      current,
      previous: {
        exists: current > 0,
        disabled: false,
        text: 'Previous',
        onClick: () => setCurrent(current > 0 ? current - 1 : current),
      },
      next: {
        exists: current < count - 1,
        disabled: false,
        text: 'Next',
        onClick: () => setCurrent(current + 1),
      },
      count,
      steps,
    };

    return React.cloneElement(child, newProps);
  });

  return (
    <React.Fragment>
      {newChildren}

      <pre>{JSON.stringify(steps[current], null, 2)}</pre>
    </React.Fragment>
  );
}

//
//
//
export function Nav({ previous, next }) {
  return (
    <div>
      {previous.exists && (
        <button disabled={previous.disabled} onClick={previous.onClick}>
          {previous.text}
        </button>
      )}

      {next.exists && (
        <button disabled={next.disabled} onClick={next.onClick}>
          {next.text}
        </button>
      )}
    </div>
  );
}

//
//
//
export function ProgressIndicator({ current, count, steps = [] }) {
  return (
    <div>
      {steps.map(({ title, description }, index) => {
        return (
          <span key={`${title}-${description}-${index}`}>
            {index === current ? <strong>{title}</strong> : title}
            {index < count - 1 && '--->'}
          </span>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------

//
//
//
export function Steps({ current, graph, children }) {
  // if graph ....
  // maybe thius needs to split in separate graph and non-graph components
  if (graph) {
    const [[id, meta]] = Object.entries(current.meta);
    const { component: Comp } = meta;
    return <Comp />;
  } else return children[current];
}

export function Step({ children }) {
  return children || null;
}

export default Wizard;
