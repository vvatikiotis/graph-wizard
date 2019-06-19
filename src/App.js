import React, { useState } from 'react';
import { tsPropertySignature } from '@babel/types';

function Wizard({ initial, children }) {
  const [titleDescription] = useState(() => {
    return React.Children.map(children, ({ props, type }) => {
      const exclude = type === ProgressIndicator || type === Nav;

      return exclude
        ? undefined
        : { title: props.title, description: props.description };
    });
  });

  const [current, setCurrent] = useState(initial || 0);

  return (
    <React.Fragment>
      {children[current]}

      {current > 0 && (
        <button onClick={() => setCurrent(current > 0 ? current - 1 : current)}>
          Back
        </button>
      )}

      {current < React.Children.count(children) - 1 && (
        <button onClick={() => setCurrent(current + 1)}>Next</button>
      )}

      <pre>{JSON.stringify(titleDescription, null, 2)}</pre>
    </React.Fragment>
  );
}

function Step({ title, description, children }) {
  return children || null;
}

function ProgressIndicator(props) {
  return 'Progress Indicator';
}

function Nav() {
  return 'Buttons';
}
function View(props) {}
function ProgressInidicator() {}

function App(props) {
  const graph = {};

  return (
    <Wizard initial={3}>
      <ProgressIndicator />
      <Nav />
      <View>
        <Step />
        <Step title="two" description="Description">
          Iam a step
        </Step>
        <Step title={3} />
        <Step title={4} />
        <Step title={5} />
      </View>
    </Wizard>
  );
}

Wizard.Step = Step;

export default App;
