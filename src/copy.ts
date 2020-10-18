import { Theme } from './state';
import { ColorRgba } from './style/variables';
import copy from './copy.json';

export type Route =
  | { name: 'player'; params: { videoName: PlayerVideoName } }
  | { name: 'home'; params: {} }
  | { name: 'casestudy'; params: { name: string } };

export type MediaType = 'image' | 'video';

export type Meta = {
  title: string;
  description: string;
  url: string;
  image: string;
};

type ProjectName =
  | 'lerreur'
  | 'moetta6'
  | 'under-the-sign'
  | 'addicted-to-the-void';

export type Project = {
  name: ProjectName;
  theme: Theme;
  backgroundRgba: ColorRgba;
  highlightRgba: ColorRgba;
  title: string;
  subtitle: string;
  videoLoopUrl: string;
  videoLoopMobile: string;
  player: PlayerVideoName;
  description: string;
  credits: string;
  medias: [
    { type: MediaType; src: string },
    { type: MediaType; src: string },
    { type: MediaType; src: string },
    { type: MediaType; src: string },
    { type: MediaType; src: string }
  ];
  meta: Meta;
};

type HomeFilmProject = {
  name: ProjectName;
  backImg: string;
  frontImg: string;
  backVideo: string;
  frontVideo: string;
};

export type PlayerVideoName = 'showreel' | ProjectName;

export type Player = {
  videoUrls: {
    1080: string;
    720: string;
  };
  imageUrl: string;
  backRoute: Route;
  backgroundRgba: ColorRgba;
  highlightRgba: ColorRgba;
};

type Copy = {
  player: {
    list: PlayerVideoName[];
    showreel: Player;
    lerreur: Player;
    moetta6: Player;
    'under-the-sign': Player;
    'addicted-to-the-void': Player;
  };
  home: {
    meta: Meta;
    showreel: {
      play: string;
      videoLoopUrl: string;
      videoLoopMobile: string;
      player: PlayerVideoName;
    };
    films: {
      weAre: string;
      rove: string;
      aStudioMaking: string;
      adjective: string;
      films: string;
      projects: {
        project1: HomeFilmProject;
        project2: HomeFilmProject;
        project3: HomeFilmProject;
        project4: HomeFilmProject;
      };
    };
    about: {
      weRoveThrough: string;
      ideasAndConcepts: string;
      guidedBy: string;
      artDirection: string;
      andTheWillTo: string;
      experiment: string;
      newNarrative: string;
      paths: string;
      alongWithThe: string;
      ambition: string;
      toChallenge: string;
      technicalSkills: string;
    };
    services: {
      weTakeCare: string;
      ofEverything: string;
      services: {
        title: string;
        icon: string;
      }[];
      skills: string[];
    };
    clients: {
      weWorkWith: string;
      clients: string[];
    };
    contact: {
      getInTouch: string;
      email: string;
      phone: string;
      addressLine1: string;
      addressLine2: string;
      vimeo: string;
      instagram: string;
    };
  };
  caseStudy: {
    nextFilm: string;
    order: ProjectName[];
    lerreur: Project;
    moetta6: Project;
    'under-the-sign': Project;
    'addicted-to-the-void': Project;
  };
};

export default copy as Copy;
