"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect } from "react";
import { BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useCategoryContext } from "../context/category";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function EmptyCategoryState() {
  const { category, polling_query } = useCategoryContext();

  const codeSnippet = `await fetch('${BASE_URL}/api/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      category: '${category.name}',
      fields: {
        field1: 'value1', // for example: user id
        field2: 'value2' // for example: user email
      }
    })
  })`;

  const router = useRouter();

  useEffect(() => {
    if (polling_query.data?.has_events) {
      router.refresh();
    }
  }, [polling_query.data?.has_events, router]);

  return (
    <Card>
      <CardHeader>
        <h2>Create your first {category.name} event</h2>
        <p className="text-sm text-muted-foreground">
          Send your first request to our tracking API:
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm">your-first-event.js</span>
        </div>
        <SyntaxHighlighter
          language="javascript"
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            backgroundColor: "#1e1e1e",
          }}>
          {codeSnippet}
        </SyntaxHighlighter>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 items-center">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 flex items-center gap-1">
            Listening
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
            </span>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
