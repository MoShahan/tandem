import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getApiErrorDetails, getApiErrorMessage } from "@/lib/apiError";

import { updateLeadSchema, type UpdateLeadFormValues } from "../leadFormSchema";
import { updateLead } from "../leadsSlice";

import type { Lead } from "../leadsTypes";

type UpdateLeadDialogProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
};

const toDateInputValue = (value: string | null | undefined) =>
  value ? value.slice(0, 10) : "";

export const UpdateLeadDialog = ({
  lead,
  open,
  onOpenChange,
  onUpdated,
}: UpdateLeadDialogProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateLeadFormValues>({
    resolver: zodResolver(updateLeadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      source: "",
      project: "",
      expectedCloseDate: "",
    },
  });

  useEffect(() => {
    if (!lead || !open) return;

    form.reset({
      name: lead.name,
      mobileNumber: lead.mobileNumber ?? "",
      email: lead.email ?? "",
      source: lead.source ?? "",
      project: lead.project ?? "",
      expectedCloseDate: toDateInputValue(lead.expectedCloseDate),
    });
  }, [lead, open, form]);

  const onSubmit = async (values: UpdateLeadFormValues) => {
    if (!lead) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        updateLead({
          leadId: lead.id,
          input: {
            name: values.name.trim(),
            mobileNumber: values.mobileNumber.trim(),
            email: values.email?.trim() || null,
            source: values.source?.trim() || null,
            project: values.project?.trim() || null,
            expectedCloseDate: toDateInputValue(values.expectedCloseDate) || null,
          },
        }),
      ).unwrap();

      toast.success("Lead updated");
      onOpenChange(false);
      onUpdated?.();
    } catch (error) {
      getApiErrorDetails(error)?.forEach((detail) => {
        if (detail.field) {
          form.setError(detail.field as keyof UpdateLeadFormValues, {
            message: detail.message,
          });
        }
      });
      toast.error(getApiErrorMessage(error, "Failed to update lead"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit lead</DialogTitle>
          <DialogDescription>Update lead contact and details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        inputMode="numeric"
                        maxLength={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="expectedCloseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected close date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={toDateInputValue(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
