type Path = string;
type Params = { [k: string]: string };

const splitProperties = <T extends Object>(
  isLeft: (value: T[keyof T], key: string) => unknown,
  obj: T
) =>
  Object.entries(obj).reduce(
    ([left, right], [k, v]) =>
      isLeft(v, k)
        ? [{ ...left, [k]: v }, right]
        : [left, { ...right, [k]: v }],
    [{}, {}]
  );

const toString = (params: Params, prefix = '?') => {
  const queryString = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  return queryString ? prefix + queryString : '';
};

const paramRegExp = /(\[[^\/&\?]*\])(?:\/|$)/g;

const escapeRegExp = (str: string) =>
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

export const replaceWithParams = (pattern: string, params: Params) =>
  Object.keys(params)
    .reduce(
      (acc, param) =>
        acc.replace(
          new RegExp(`\\[${escapeRegExp(param)}\\](?=(\\/|$|\\?))`),
          params[param]
        ),
      pattern
    )
    .replace(paramRegExp, '');

const checkParams = (path: string, params: Params) => {
  const matches = path.match(paramRegExp);
  if (matches) {
    for (const match of matches) {
      const paramName = match.slice(1, match.length - 1);
      if (params[paramName] === undefined) {
        throw new Error(
          `createLinkProps error: required parameter \`${match}\` for route \`${path}\` wasn't provided`
        );
      }
    }
  }
};

const _createLinkProps = (path: string, params: Params = {}) => {
  checkParams(path, params);

  const [inlineParams, queryParams] = splitProperties(
    (_, key) => path.match(`[${key}]`),
    params
  );

  return {
    href: `${addInitialSlash(path)}${toString(queryParams)}`,
    as: `${replaceWithParams(path, inlineParams)}${toString(queryParams)}`
  };
};

type RouteMap<Name> = {
  [k: string]: { name: Name; path: string };
};

export const addInitialSlash = (str: string) =>
  !!str.match(/^\//) ? str : `/${str}`;

export const Router = <Name extends string>(routesConfig: [Name, Path][]) => {
  const routesByName: RouteMap<Name> = routesConfig.reduce(
    (acc, [name, path]) => ({ ...acc, [name]: { name, path } }),
    {}
  );

  const routesByPath: RouteMap<Name> = routesConfig.reduce(
    (acc, [name, path]) => ({ ...acc, [path]: { name, path } }),
    {}
  );

  const getRoute = (name: Name) => {
    const route = routesByName[name];
    if (!route) throw new Error(`The route ${name} doesn't exist.`);
    return route;
  };

  return {
    createLinkProps: (name: Name, params?: Params) => {
      const { path } = getRoute(name);
      return _createLinkProps(path, params);
    },
    getRouteName: (path: string): Name | null =>
      routesByPath[path]?.name ?? null
  };
};
