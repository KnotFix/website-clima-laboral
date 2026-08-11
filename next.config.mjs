/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Miniatura del video del hero. Es el unico host externo del sitio: sin
    // esta entrada, next/image responde 400 a cualquier URL remota.
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
};

export default nextConfig;
