module.exports = {
  stories: ['../packages/**/*.stories.[tj]s'],
  webpackFinal: async config => {
    config.module.rules.unshift({
      test: /\.svg$/,
      use: 'raw-loader',
    })

    return config
  },
}
