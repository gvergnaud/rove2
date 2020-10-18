export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export class PromiseQueue {
  concurrency: number;
  ongoingPromisesCount: number = 0;
  toRun: (() => Promise<any>)[] = [];

  constructor({ concurrency = 1 } = {}) {
    this.concurrency = concurrency;
  }

  private onPromiseFinished() {
    const getPromise = this.toRun.pop();
    if (getPromise) this.run(getPromise);
  }

  add<A>(getPromise: () => Promise<A>): Promise<A> {
    if (this.ongoingPromisesCount < this.concurrency) {
      return this.run(getPromise);
    } else {
      return new Promise((resolve, reject) => {
        this.toRun.unshift(() =>
          getPromise()
            .then(res => {
              resolve(res);
              return res;
            })
            .catch(err => {
              reject(err);
              throw err;
            })
        );
      });
    }
  }

  run<A>(getPromise: () => Promise<A>): Promise<A> {
    this.ongoingPromisesCount++;
    return getPromise()
      .catch(err => {
        this.ongoingPromisesCount--;
        this.onPromiseFinished();
        throw err;
      })
      .then(res => {
        this.ongoingPromisesCount--;
        this.onPromiseFinished();
        return res;
      });
  }
}

export class Deffered<T> {
  private status:
    | { type: 'resolved'; value: T }
    | { type: 'rejected'; error: any }
    | { type: 'pending' } = { type: 'pending' };

  promise: Promise<T>;

  resolve: (v: T) => void = value => {
    this.status = { type: 'resolved', value };
  };

  reject: (e: any) => void = error => {
    this.status = { type: 'rejected', error };
  };

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      if (this.status.type === 'resolved') {
        resolve(this.status.value);
      } else if (this.status.type === 'rejected') {
        reject(this.status.error);
      }
    });
  }
}
