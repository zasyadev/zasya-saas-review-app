module.exports = {
  reactStrictMode: true,

  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/auth/login",
        destination: "/auth/login",
      },
    ];
  },
};
