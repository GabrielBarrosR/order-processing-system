import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toglle"
import { PackageSearch } from "lucide-react"
import { PropsWithChildren } from "react"

export function AppSidebar({children}: PropsWithChildren) {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                        {children}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}