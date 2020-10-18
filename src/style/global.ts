import reset from './reset';
import { ffSans, black } from './variables';

export default `
${reset}

html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  touch-action: none;
  background-color: ${black};
  
  font-family: ${ffSans};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
  position: relative;
}

@font-face {
  font-family: SuisseBP;
  src: url('/static/fonts/Suisse-BP-Antique.otf') format('opentype');
}

@font-face {
  font-family: SuisseWorks;
  font-weight: 600;
  src: url('/static/fonts/SuisseWorks-Medium.otf') format('opentype');
}

@font-face {
  font-family: SuisseWorks;
  font-weight: 400;
  src: url('/static/fonts/SuisseWorks-Regular.otf') format('opentype');
}

@font-face {
  font-family: SuisseWorks;
  font-weight: 400;
  font-style: italic;
  src: url('/static/fonts/SuisseWorks-RegularItalic.otf') format('opentype');
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
`;
