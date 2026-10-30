import { Link } from "react-router-dom";

import { GuidePageLayout } from "@/features/guide/components/GuidePageLayout";
import { textLinkClassName } from "@/lib/textLink";

import { UPCOMING_FEATURES } from "../content/upcomingFeatures";

export const UpcomingPage = () => {
  return (
    <GuidePageLayout>
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-primary">Roadmap</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Upcoming features
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          These are not in the product yet. Tandem today is a sales CRM with
          one company per login, in-app alerts only, and a shared pipeline that
          includes site visit.{" "}
          <Link
            to="/guide"
            className={textLinkClassName}
          >
            How Tandem works
          </Link>{" "}
          explains what already shipped.
        </p>
      </div>

      <ol className="space-y-4">
        {UPCOMING_FEATURES.map((feature, index) => (
          <li
            key={feature.id}
            className="rounded-xl border bg-card px-5 py-4 shadow-sm"
          >
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="text-lg font-semibold tracking-tight">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.body}
            </p>
          </li>
        ))}
      </ol>
    </GuidePageLayout>
  );
};
