export default {
  // Build output directory
  build: {
    baseDirectory: "dist",
    publicDirectory: "public",
    command: "npm run build"
  },
  // Routes configuration
  routes: [
    { pattern: "/api/*", methods: ["GET", "POST"], script: "/api/[[path]].js" },
    { pattern: "/*", serve: "/index.html", status: 200 }
  ]
}
