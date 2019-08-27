import { Machine } from 'xstate';

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
      },
    },
    step2: {
      on: {
        NEXT: 'step3',
        PREV: 'step1',
      },
      meta: {
        title: 'step22',
        description: 'Step22 desc',
      },
    },
    step3: {
      on: {
        PREV: 'step2',
      },
      meta: {
        title: 'step333',
        description: 'Step333 desc',
      },
    },
  },
});
