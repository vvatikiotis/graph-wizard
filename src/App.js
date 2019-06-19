import React, { useState } from 'react';
import ReactDOM from 'react-dom';

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

function Step(props) {
  return <h2>Im {props.title}</h2>;
}

function App(props) {
  return (
    <Wizard initial={3}>
      <Step id="one" title="one" />
      <Step id="two" title="two" />
      <Step id="three" title={3} />
      <Step id="four" title={4} />
      <Step id="five" title={5} />
    </Wizard>
  );
}

export default App;
