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
import MarkdownPreview from "@/components/MarkdownPreview";
import { useQuery, QueryFunction } from "@tanstack/react-query";

type Genre = { id: string; name: string };

const fetchGenres: QueryFunction<Genre[]> = async () => {
  const res = await fetch("/api/genres");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "タイトルは必須"),
  content: z.string().trim().min(1, "内容は必須"),
  isPublic: z.boolean().optional(),
  genreId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AssignmentForm({ initial }: { initial?: FormValues }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: genres, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      title: "",
      content: "",
      isPublic: false,
      genreId: "",
    },
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
              <div className="grid grid-cols-2 gap-2 max-h-[36rem]">
                {/* Markdown 入力エリア */}
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="markdown形式で記述できます"
                  />
                </FormControl>

                {/* プレビュー：フォームの値を watch でリアルタイム反映 */}
                <MarkdownPreview value={form.watch("content")} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genreId"
          render={({ field }) => (
            <div>
              <label className="block mb-1 font-medium">ジャンル</label>
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : (
                <select {...field} className="border rounded p-2 w-full">
                  <option value="">未分類</option>
                  {genres?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
