import React, { useState } from 'react';
import { tsPropertySignature } from '@babel/types';

function Wizard({ initial, children }) {
  const _Step = children.find(({ type }) => type === Step);
  const _Steps = children.find(({ type }) => type === Steps);
  const _Nav = children.find(({ type }) => type === Nav);
  const _Progress = children.find(({ type }) => type === ProgressIndicator);

  if (_Step) throw new Error('Step must be inside Steps');

  const [titleDescPairs] = useState(() => {
    return _Steps.props.children.map(({ props: { title, description } }) => ({
      title,
      description,
    }));
  });

  const [current, setCurrent] = useState(initial || 0);

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

function Steps({ children, current }) {
  return children[current];
}

function Step({ children }) {
  return children || null;
}

function ProgressIndicator({ current, count, titleDescPairs }) {
  return (
    <div>
      {titleDescPairs.map((pair, index) => {
        return (
          <span>
            {index === current ? <strong>{pair.title}</strong> : pair.title}
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

function TabNav({ current, setCurrent, titleDescPairs }) {
  return (
    <div>
      {titleDescPairs.map(({ title }, index) => (
        <span>
          <button onClick={() => setCurrent(index)}>{title}</button>
        </span>
      ))}
    </div>
  );
}

function App(props) {
  const graph = {};

  return (
    <Wizard initial={1}>
      <TabNav />
      <ProgressIndicator />
      <Steps>
        <Step />
        <Step title="two" description="Description">
          Iam a step
        </Step>
        <Step title={3} />
        <Step title={4} />
        <Step title={5} />
      </Steps>
    </Wizard>
  );
}

Wizard.Step = Step;

export default App;
