import { Router } from './utils/routing';

export const { createLinkProps, getRouteName } = Router([
  ['home', '/'],
  ['casestudy', '/case-study/[name]'],
  ['player', '/player/[videoName]']
]);
