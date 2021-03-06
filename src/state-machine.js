import { Machine } from 'xstate';
import React from 'react';

function Step1(props) {
  return <h4>Step1 View</h4>;
}

function Step2(props) {
  return <h4>Step22 View</h4>;
}

function Step3(props, onSelect) {
  return <h4>Step333 View</h4>;
}

function Step4(props) {
  return <h4>Step4444 View</h4>;
}

export default Machine({
  id: 'linear',
  initial: 'step1',
  states: {
    step1: {
      on: {
        NEXT: 'step2',
      },
      meta: {
        title: 'step1',
        description: 'Step1 desc',
        component: Step1,
      },
    },
    step2: {
      on: {
        NEXT_STEP3: 'step3',
        NEXT_STEP4: 'step4',
        PREV: 'step1',
      },
      meta: {
        title: 'step22',
        description: 'Step22 desc',
        component: Step2,
      },
    },
    step3: {
      on: {
        PREV: 'step2',
      },
      meta: {
        title: 'step333',
        description: 'Step333 desc',
        component: Step3,
      },
    },
    step4: {
      on: {
        PREV: 'step2',
      },
      meta: {
        title: 'step444',
        description: 'Step444 desc',
        component: Step4,
      },
    },
  },
});
