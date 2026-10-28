import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { ROLE_ROWS } from "../content/guideContent";

import { GUIDE_WELL } from "./GuideFigure";

const ScopeBadge = ({
  scope,
}: {
  scope: (typeof ROLE_ROWS)[number]["scope"];
}) => (
  <Badge variant="secondary" className="font-normal">
    {scope === "platform" ? "Platform" : "Company"}
  </Badge>
);

export const GuideRolesTable = () => (
  <div className="overflow-hidden rounded-xl border bg-card">
    <div className="divide-y sm:hidden">
      {ROLE_ROWS.map((row) => (
        <article key={row.role} className="space-y-2 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">{row.role}</h3>
            <ScopeBadge scope={row.scope} />
          </div>
          <p className="text-sm text-foreground">{row.realLife}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {row.does}
          </p>
        </article>
      ))}
    </div>

    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow className={cn("border-b hover:bg-transparent", GUIDE_WELL)}>
            <TableHead className="h-11 w-[11.5rem] px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Role in Tandem
            </TableHead>
            <TableHead className="h-11 min-w-[16rem] px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Who they are
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              What they do here
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROLE_ROWS.map((row, index) => (
            <TableRow
              key={row.role}
              className={cn(
                "hover:bg-muted/40",
                index % 2 === 1 && "bg-muted/25",
              )}
            >
              <TableCell className="px-4 py-3.5 align-top">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="font-medium text-foreground">{row.role}</span>
                  <ScopeBadge scope={row.scope} />
                </div>
              </TableCell>
              <TableCell className="px-4 py-3.5 align-top whitespace-normal text-sm text-foreground">
                {row.realLife}
              </TableCell>
              <TableCell className="px-4 py-3.5 align-top whitespace-normal text-sm leading-relaxed text-muted-foreground">
                {row.does}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
