module.exports = {
  stories: ['../packages/**/*.stories.[tj]s'],
  core: {
    builder: 'webpack5',
  },

  webpackFinal: async (config) => {
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.type === 'asset/resource') {
        // Removing the rule for SVGs
        rule.test = /\.(ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
      }
      return rule
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: 'raw-loader',
    })

    console.log(config.module.rules)
    return config
  },
}
