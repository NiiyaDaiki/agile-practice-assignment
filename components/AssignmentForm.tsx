"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "タイトルは必須"),
  content: z.string().trim().min(1, "内容は必須"),
  isPublic: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AssignmentForm({ initial }: { initial?: FormValues }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { title: "", content: "", isPublic: false },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await fetch("/api/assignments", {
        method: values.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) router.push("/admin/assignments");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...form.register("id")} />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input {...field} placeholder="課題タイトル" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>内容</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} placeholder="課題詳細" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id="isPublic"
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel>公開する</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {initial ? "更新" : "作成"}
        </Button>
      </form>
    </Form>
  );
}
