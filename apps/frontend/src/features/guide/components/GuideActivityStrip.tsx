import {
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Video,
} from "lucide-react";

import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

const ACTIVITIES = [
  { icon: Phone, label: "Call" },
  { icon: Mail, label: "Email" },
  { icon: Video, label: "Meeting" },
  { icon: MapPin, label: "Site visit" },
  { icon: MessageSquare, label: "Message" },
  { icon: FileText, label: "Note" },
] as const;

export const GuideActivityStrip = () => (
  <div className="space-y-4">
    <GuideFigure
      label="Activities are the work log"
      caption="Each icon is a kind of follow-up you can attach to a lead. This is the salesperson's diary, not the security log."
    >
      <div className="flex flex-wrap justify-center gap-3">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.label}
            className={`flex w-20 flex-col items-center gap-2 rounded-xl border py-3 ${GUIDE_WELL}`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <activity.icon className="size-4" />
            </div>
            <span className="text-xs font-medium">{activity.label}</span>
          </div>
        ))}
      </div>
    </GuideFigure>
  </div>
);
