module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["http://localhost:3000/", "https://review.zasyasolutions.com/"],
  },

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
