import { resources_index_route } from "@/components/resources/resource_routes";

// Solo `/es/recursos`: `/en/recursos` es un 404. Ver `resource_routes.jsx`.
const route = resources_index_route("es");

export const generateMetadata = route.generateMetadata;
export default route.Page;
