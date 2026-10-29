import {
  BookOpen,
  ChevronsUpDown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { EntityAvatar } from "@/components/EntityAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { logout } from "@/features/auth/authSlice";
import { formatRoleLabel } from "@/lib/format";

const menuItemClassName = "gap-2 rounded-md px-2 py-2";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);

  if (!user) {
    return null;
  }

  const roleLabel = formatRoleLabel(user.role);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <EntityAvatar name={user.name} size="sm" />
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {roleLabel}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-xl p-1.5"
            side="top"
            align="start"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-3">
                <EntityAvatar name={user.name} size="default" />
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={menuItemClassName}
                onClick={() => navigate("/account")}
              >
                <Settings className="size-4" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={menuItemClassName}
                onClick={() => navigate("/guide")}
              >
                <BookOpen className="size-4" />
                How Tandem works
              </DropdownMenuItem>
              <DropdownMenuItem
                className={menuItemClassName}
                onClick={() => navigate("/upcoming")}
              >
                <Sparkles className="size-4" />
                Upcoming features
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className={menuItemClassName}
              onClick={() => void handleLogout()}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
