import { useState } from "react";
import { toast } from "sonner";

import { useAppDispatch } from "@/app/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";

import { updateLead } from "../leadsSlice";
import {
  getAdvanceActionLabel,
  getAllowedNextStatuses,
  getQuickAdvanceStatuses,
  isTerminalLeadStatus,
  LEAD_STATUS_LABELS,
} from "../leadStatusPipeline";

import type { Lead, LeadStatus } from "../leadsTypes";

type LeadStatusAdvanceProps = {
  lead: Lead;
  disabled?: boolean;
  onAdvanced?: () => void;
};

const ADVANCE_BUTTON_STYLES: Partial<
  Record<LeadStatus, { variant: "default" | "outline"; className: string }>
> = {
  WON: {
    variant: "default",
    className:
      "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700 focus-visible:ring-emerald-500/40 dark:border-emerald-600 dark:bg-emerald-600 dark:hover:border-emerald-500 dark:hover:bg-emerald-500",
  },
  LOST: {
    variant: "outline",
    className:
      "border-rose-300 bg-background text-rose-700 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800 focus-visible:ring-rose-500/40 dark:border-rose-800 dark:bg-transparent dark:text-rose-300 dark:hover:border-rose-700 dark:hover:bg-rose-950/60 dark:hover:text-rose-200",
  },
};

const CONFIRM_ACTION_STYLES: Partial<Record<LeadStatus, string>> = {
  WON: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500",
  LOST: "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500",
};

export const LeadStatusAdvance = ({
  lead,
  disabled = false,
  onAdvanced,
}: LeadStatusAdvanceProps) => {
  const dispatch = useAppDispatch();
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null);
  const [lostReason, setLostReason] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedNext = getAllowedNextStatuses(lead.status);
  const quickStatuses = getQuickAdvanceStatuses(lead.status);
  const otherStatuses = allowedNext.filter(
    (status) => !quickStatuses.includes(status),
  );
  const isTerminal = isTerminalLeadStatus(lead.status);

  const openConfirm = (status: LeadStatus) => {
    setPendingStatus(status);
    setLostReason("");
    setDealValue(lead.dealValue != null ? String(lead.dealValue) : "");
  };

  const handleConfirm = async () => {
    if (!pendingStatus) return;

    if (pendingStatus === "LOST" && !lostReason.trim()) {
      toast.error("Add a lost reason");
      return;
    }

    const parsedDeal =
      pendingStatus === "WON" && dealValue.trim()
        ? Number(dealValue)
        : pendingStatus === "WON"
          ? null
          : undefined;

    if (parsedDeal !== undefined && parsedDeal !== null && Number.isNaN(parsedDeal)) {
      toast.error("Deal value must be a number");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        updateLead({
          leadId: lead.id,
          input: {
            status: pendingStatus,
            ...(pendingStatus === "LOST" ? { lostReason: lostReason.trim() } : {}),
            ...(parsedDeal !== undefined ? { dealValue: parsedDeal } : {}),
          },
        }),
      ).unwrap();

      toast.success(
        isTerminalLeadStatus(pendingStatus)
          ? "Lead status updated"
          : isTerminal
            ? "Lead reopened"
            : "Lead status updated",
      );
      setPendingStatus(null);
      setOtherStatus("");
      onAdvanced?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update lead status"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {quickStatuses.map((nextStatus) => {
          const buttonStyles = ADVANCE_BUTTON_STYLES[nextStatus];

          return (
            <Button
              key={nextStatus}
              type="button"
              variant={buttonStyles?.variant ?? "default"}
              className={buttonStyles?.className}
              disabled={disabled || isSubmitting}
              onClick={() => openConfirm(nextStatus)}
            >
              {getAdvanceActionLabel(nextStatus)}
            </Button>
          );
        })}

        {otherStatuses.length > 0 ? (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {isTerminal ? "Reopen or move to" : "Move to"}
            </span>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              disabled={disabled || isSubmitting}
              value={otherStatus}
              aria-label={isTerminal ? "Reopen or move to" : "Move to another stage"}
              onChange={(event) => {
                const value = event.target.value as LeadStatus;
                setOtherStatus(value);
                if (value) {
                  openConfirm(value);
                }
              }}
            >
              <option value="">Choose stage</option>
              {otherStatuses.map((status) => (
                <option key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setPendingStatus(null);
            setOtherStatus("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTerminal && pendingStatus && !isTerminalLeadStatus(pendingStatus)
                ? "Reopen this lead?"
                : "Change lead status?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Move <strong>{lead.name}</strong> from{" "}
              <strong>{LEAD_STATUS_LABELS[lead.status]}</strong> to{" "}
              <strong>
                {pendingStatus ? LEAD_STATUS_LABELS[pendingStatus] : ""}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingStatus === "LOST" ? (
            <div className="space-y-2">
              <Label htmlFor="lost-reason">Lost reason</Label>
              <Textarea
                id="lost-reason"
                value={lostReason}
                onChange={(event) => setLostReason(event.target.value)}
                placeholder="Why did this lead fall through?"
              />
            </div>
          ) : null}

          {pendingStatus === "WON" ? (
            <div className="space-y-2">
              <Label htmlFor="deal-value">Deal value (optional)</Label>
              <Input
                id="deal-value"
                inputMode="decimal"
                value={dealValue}
                onChange={(event) => setDealValue(event.target.value)}
                placeholder="0"
              />
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              className={cn(
                pendingStatus ? CONFIRM_ACTION_STYLES[pendingStatus] : undefined,
              )}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
            >
              {isSubmitting ? "Saving..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
