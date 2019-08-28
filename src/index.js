import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Wizard, {
  GraphNav,
  TabNav,
  Nav,
  Steps,
  Step,
  ProgressIndicator,
} from './Wizard';
import StateMachine from './state-machine';

function App(props) {
  const [selectedOption, setSelected] = useState('step3');

  return (
    <React.Fragment>
      <div>Only used in graph wizard</div>
      <label>
        <input
          type="radio"
          name="decision"
          value="step3"
          checked={selectedOption === 'step3'}
          onChange={evt => setSelected(evt.target.value)}
        />
        Step3
      </label>
      <label>
        <input
          type="radio"
          name="decision"
          value="step4"
          checked={selectedOption === 'step4'}
          onChange={evt => setSelected(evt.target.value)}
        />
        Step4
      </label>
      <hr />

      {/* The selected API break the Wizard abstraction.
      What if there's a 2nd selection prop?
      What if the selection mechanism is provided to us via a function?
      What if etc etc
      */}
      <Wizard initial={1} graph={StateMachine} selected={selectedOption}>
        <GraphNav />
        {/* <Nav /> */}
        {/* <Steps /> */}
        <Steps>
          {/* <Step />
          <Step title="twoTwo" description="Description">
            Iam a step
          </Step>
          <Step title={3} />
          <Step title={4} />
          <Step title={5} /> */}
        </Steps>
        <ProgressIndicator />
      </Wizard>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
