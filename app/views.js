import os from 'os';
import env from './env';

export var paths = {
  home: request => { return {view: 'home.jade'}; },
  problem_list: request => {
    return {
      view: 'problem_list.jade',
      locals: {
        problems_list: ['helloworld', 'aplusb']
      }
    };
  },

}
