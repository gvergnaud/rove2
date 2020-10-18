import { flatMap } from './arrays';

const isObjectStrict = x => x && typeof x === 'object' && !Array.isArray(x);

export const cn = (...classes) =>
  flatMap(classes, className =>
    isObjectStrict(className)
      ? flatMap(Object.keys(className), key => (className[key] ? [key] : []))
      : Array.isArray(className)
      ? className
      : className
      ? [className]
      : []
  ).join(' ');
