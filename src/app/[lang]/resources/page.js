import { resources_index_route } from "@/components/resources/resource_routes";

// Solo `/en/resources`: `/es/resources` es un 404. Ver `resource_routes.jsx`.
const route = resources_index_route("en");

export const generateMetadata = route.generateMetadata;
export default route.Page;
