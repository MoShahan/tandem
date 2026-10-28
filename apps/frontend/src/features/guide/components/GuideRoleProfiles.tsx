import { Badge } from "@/components/ui/badge";

import {
  CUSTOM_ROLE_EXAMPLES,
  ROLE_PROFILES,
  type GuideRoleProfile,
} from "../content/guideContent";

import { GUIDE_WELL } from "./GuideFigure";

const RoleCard = ({ profile }: { profile: GuideRoleProfile }) => (
  <article className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
    <header className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{profile.role}</h3>
        <Badge variant="secondary" className="font-normal">
          {profile.scope === "platform" ? "Platform" : "Company"}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Reports to:{" "}
        <span className="text-foreground">{profile.reportsTo}</span>
      </p>
    </header>
    <p className="text-sm leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">In a company. </span>
      {profile.realWorld}
    </p>
    <p className="text-sm leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">In Tandem. </span>
      {profile.inTandem}
    </p>
    <div className="grid gap-3 sm:grid-cols-2">
      <div className={`rounded-lg p-3 ${GUIDE_WELL}`}>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-foreground">
          Typically can
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
          {profile.can.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={`rounded-lg p-3 ${GUIDE_WELL}`}>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-foreground">
          Typically cannot
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
          {profile.cannot.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </article>
);

export const GuideRoleProfiles = () => (
  <div className="space-y-4">
    {ROLE_PROFILES.map((profile) => (
      <RoleCard key={profile.id} profile={profile} />
    ))}
  </div>
);

export const GuideCustomRoleExamples = () => (
  <div className="space-y-4">
    {CUSTOM_ROLE_EXAMPLES.map((profile) => (
      <RoleCard key={profile.id} profile={profile} />
    ))}
  </div>
);
