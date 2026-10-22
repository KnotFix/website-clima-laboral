import { resource_route } from "@/components/resources/resource_routes";

// Solo `/en/resources`: `/es/resources` es un 404. Ver `resource_routes.jsx`.
const route = resource_route("en");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
