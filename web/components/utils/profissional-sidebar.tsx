import { PackageSearch } from "lucide-react";
import { AppSidebar } from "./sidebar";
import { SidebarMenuButton } from "../ui/sidebar";

export default function ProfissionalSidebar() {
    return (
    <AppSidebar>
        <SidebarMenuButton tooltip="Pesquisar Pacotes">
            <a href="#" className="flex gap-3 items-center">
                <PackageSearch />
                <span className="group-data-[collapsible=icon]:hidden">
                    Pesquisar
                </span>
            </a>
        </SidebarMenuButton>
    </AppSidebar>
    )
}