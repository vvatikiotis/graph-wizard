import React, { useState } from 'react';

function Wizard({ initial, children }) {
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
    </React.Fragment>
  );
}

function Step({ title }) {
  return <h2>Im {title}</h2>;
}

function App(props) {
  return (
    <Wizard initial={3}>
      <Step title="one" />
      <Step title="two" />
      <Step title={3} />
      <Step title={4} />
      <Step title={5} />
    </Wizard>
  );
}

Wizard.Step = Step;

export default App;
