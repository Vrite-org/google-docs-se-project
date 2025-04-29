import { handlers } from './handlers';
import { setupServer } from '/home/tabish/Desktop/Vrite/Vrite/node_modules/msw/lib/node/index';

export const server = setupServer(...handlers);
