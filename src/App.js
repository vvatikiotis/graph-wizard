import React, { useState, useEffect } from 'react';
import { tsPropertySignature } from '@babel/types';
import { useMachine } from '@xstate/react';
import { isMachine } from 'xstate/es/utils';
import StateMachine from './state-machine';

function Wizard({ tabs, graph, children, ...rest }) {
  children = children
    ? React.Children.count(children) === 1
      ? [children]
      : children
    : [];

  if (tabs && graph) throw new Error('graphs and tabs are mutually exclusive');
  if (graph && !isMachine(graph))
    throw new Error('graph is not an xstate Machine');
  if (graph && children.find(({ type }) => type === Steps))
    throw new Error('You cannot have a graph and Steps');
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

function GraphWizard({ graph, children }) {
  const [current, send, service] = useMachine(graph);

  useEffect(() => {
    service.onTransition(state => console.log(state.value));
  }, [service]);

  const newChildren = React.Children.map(children, child => {
    const newProps = {
      current,
      send,
      service,
      // titleDescPairs,
    };

    return React.cloneElement(child, newProps);
  });

  return <React.Fragment>{newChildren}</React.Fragment>;
}

function GraphNav({ current, send }) {
  const nextEvents = current.nextEvents;

  return (
    <div>
      {nextEvents.includes('PREV') && (
        <button onClick={() => send('PREV')}>Back</button>
      )}

      {nextEvents.includes('NEXT') && (
        <button onClick={() => send('NEXT')}>Next</button>
      )}
    </div>
  );
}

function TabWizard(props) {
  return <LinearWizard {...props} />;
}

function TabNav({ current, setCurrent, titleDescPairs }) {
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

function LinearWizard({ initial, children }) {
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

function ProgressIndicator({ current, count, titleDescPairs = [] }) {
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

function Nav({ count, current, setCurrent, titleDescPairs }) {
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

function Steps({ children, current, tabs }) {
  if (tabs) console.warn('steps should be linear');

  return children[current];
}

function Step({ children }) {
  return children || null;
}

function App(props) {
  const graph = {};

  return (
    <Wizard initial={1} graph={StateMachine}>
      <GraphNav />
      {/* <Steps>
        <Step />
        <Step title="two" description="Description">
          Iam a step
        </Step>
        <Step title={3} />
        <Step title={4} />
        <Step title={5} />
      </Steps> */}
      {/* <ProgressIndicator /> */}
    </Wizard>
  );
}

Wizard.Step = Step;

export default App;
