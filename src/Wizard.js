import React, { useState, useEffect } from 'react';
import { tsPropertySignature } from '@babel/types';
import { useMachine } from '@xstate/react';
import { isMachine } from 'xstate/es/utils';

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

  if (tabs) return <TabWizard {...rest}>{children}</TabWizard>;
  else if (graph)
    return (
      <GraphWizard graph={graph} {...rest}>
        {children}
      </GraphWizard>
    );
  else return <LinearWizard {...rest}>{children}</LinearWizard>;
}

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

// --------------------------

export function TabWizard(props) {
  return <LinearWizard {...props} />;
}

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

export function LinearWizard({ initial, children }) {
  const _Step = children.find(({ type }) => type === Step);
  const _Steps = children.find(({ type }) => type === Steps);
  // const _Nav = children.find(({ type }) => type === Nav);
  // const _Progress = children.find(({ type }) => type === ProgressIndicator);

  if (_Step) throw new Error('Step must be inside Steps');

  const [current, setCurrent] = useState(initial || 0);

  const [titleDescPairs] = useState(() => {
    return _Steps.props.children.map(({ props: { title, description } }) => ({
      title,
      description,
    }));
  });

  const newChildren = React.Children.map(children, child => {
    const newProps = {
      current,
      setCurrent,
      count: React.Children.count(_Steps.props.children),
      titleDescPairs,
    };

    return React.cloneElement(child, newProps);
  });

  return (
    <React.Fragment>
      {newChildren}

      <pre>{JSON.stringify(titleDescPairs[current], null, 2)}</pre>
    </React.Fragment>
  );
}

export function ProgressIndicator({ current, count, titleDescPairs = [] }) {
  return (
    <div>
      {titleDescPairs.map(({ title, description }, index) => {
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

export function Nav({ count, current, setCurrent, titleDescPairs }) {
  return (
    <div>
      {current > 0 && (
        <button onClick={() => setCurrent(current > 0 ? current - 1 : current)}>
          Back
        </button>
      )}

      {current < count - 1 && (
        <button onClick={() => setCurrent(current + 1)}>Next</button>
      )}
    </div>
  );
}

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
