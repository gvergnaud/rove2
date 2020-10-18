import throttle from 'lodash/throttle';

export const getDocumentOffset = element => {
  const rect = element.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = Math.round(rect.top + scrollTop - clientTop);
  const left = Math.round(rect.left + scrollLeft - clientLeft);

  return {
    top,
    left,
    bottom: top + rect.height,
    right: left + rect.width
  };
};

export const applyRef = (...refs) => el =>
  refs.forEach(ref => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });

export const getOffset = (el, parent) => {
  return !el.offsetParent || el.offsetParent === parent
    ? {
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight
      }
    : {
        top: el.offsetTop + getOffset(el.offsetParent, parent).top,
        bottom:
          el.offsetTop +
          getOffset(el.offsetParent, parent).top +
          el.offsetHeight
      };
};

const mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;

// const tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i

export const isMobile = (ua: string) => {
  return mobileRE.test(ua);
};

const isTouchEvent = (e: Event): e is TouchEvent => {
  return Boolean(e.type.match(/^touch/));
};

export function getEventPosition(e: MouseEvent | TouchEvent) {
  return {
    x: isTouchEvent(e)
      ? e.changedTouches[0]
        ? e.changedTouches[0].pageX
        : 0
      : e.clientX,
    y: isTouchEvent(e)
      ? e.changedTouches[0]
        ? e.changedTouches[0].pageY
        : 0
      : e.clientY
  };
}

export const removeDomain = (url: string) =>
  url.replace(/^https?:\/\/[^/]+\//, '/');

export const loadImageElement = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
    if (img.complete) resolve(img);
  });

export const loadImage = (url: string): Promise<null> =>
  loadImageElement(url)
    .then(() => null)
    .catch(() => null);

export const loadVideo = (url: string): Promise<null> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.addEventListener('loadeddata', () => resolve(null));
    video.addEventListener('error', e => reject(e));
    video.autoplay = true;
    video.src = url;

    // has some data
    if (video.readyState >= 2) resolve(null);
  });

type DragHandlers = {
  onDrag: (e: MouseEvent | TouchEvent, start: { x: number; y: number }) => void;
  onDragStart: (
    e: MouseEvent | TouchEvent,
    start: { x: number; y: number }
  ) => void;
  onDragEnd: (
    e: MouseEvent | TouchEvent,
    start: { x: number; y: number }
  ) => void;
};

const createDragStartHandler = (
  moveEvent: string,
  endEvent: string,
  handlers: DragHandlers
) => {
  return function onDragStart(e) {
    let wasDragged = false;
    let hasEnded = false;
    let start: { x: number; y: number } = { x: 0, y: 0 };

    const _onDrag = throttle(e => {
      wasDragged = true;
      if (!hasEnded) handlers.onDrag(e, start);
    }, 16);

    const onDrag = e => {
      e.preventDefault();
      _onDrag(e);
    };

    const onDragEnd = e => {
      hasEnded = true;
      if (wasDragged) handlers.onDragEnd(e, start);
      window.removeEventListener(moveEvent, onDrag);
      window.removeEventListener(endEvent, onDragEnd);
    };

    window.addEventListener(moveEvent, onDrag);
    window.addEventListener(endEvent, onDragEnd);

    start = getEventPosition(e);
    handlers.onDragStart(e, start);
  };
};

export const dragEvents = ({
  onDrag = x => x,
  onDragStart = x => x,
  onDragEnd = x => x
}: Partial<DragHandlers> = {}) => ({
  onMouseDown: createDragStartHandler('mousemove', 'mouseup', {
    onDrag,
    onDragStart,
    onDragEnd
  }),
  onTouchStart: createDragStartHandler('touchmove', 'touchend', {
    onDrag,
    onDragStart,
    onDragEnd
  })
});
