module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "http://localhost:3000/",
      "review.zasyasolutions.com",
      "zsreview.s3.ap-south-1.amazonaws.com",
    ],
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
