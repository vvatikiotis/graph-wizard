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

function Step3Linear(props) {
  return <h3>Step3 Linear View</h3>;
}
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
      {/* <Wizard initial={1} graph={StateMachine} selected={selectedOption}> */}
      <Wizard initial={1}>
        {/* <GraphNav /> */}
        <Nav onNext={() => {}} onPrev={() => {}} />
        <Steps>
          <Step id="step1" title="Step1 title">
            {' '}
            Step111
          </Step>
          <Step id="step2" title="Step22 title">
            Step 2222 or component
          </Step>
          <Step id="step3" title="Step33 title">
            <Step3Linear />
          </Step>
          <Step id="step4" title="Step44 title">
            asdfasdf
          </Step>
        </Steps>
      </Wizard>
    </div>
  );
}
