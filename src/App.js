import React, { useState } from 'react';
import Wizard, {
  GraphNav,
  TabNav,
  Nav,
  Steps,
  Step,
  ProgressIndicator,
} from './Wizard';
import StateMachine from './state-machine';

export default function App(props) {
  const [selectedOption, setSelected] = useState('step3');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
        <Steps />
      </Wizard>
    </div>
  );
}
