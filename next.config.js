const copy = require('./src/copy.json');

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader']
    });

    return config;
  },
  async exportPathMap() {
    const caseStudies = copy.caseStudy.order.reduce(
      (acc, name) =>
        Object.assign({}, acc, {
          [`/case-study/${name}`]: {
            page: '/case-study/[name]',
            query: { name }
          }
        }),
      {}
    );

    const players = copy.player.list.reduce(
      (acc, videoName) =>
        Object.assign({}, acc, {
          [`/player/${videoName}`]: {
            page: '/player/[videoName]',
            query: { videoName }
          }
        }),
      {}
    );

    return Object.assign({}, caseStudies, players, {
      '/': { page: '/' }
    });
  }
};
