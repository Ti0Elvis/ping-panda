"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  api_key: string;
}

export function ApiKeySettings({ api_key }: Readonly<Props>) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy_api_key = () => {
    navigator.clipboard.writeText(api_key);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Card className="max-w-xl w-full">
      <CardContent>
        <Label>Your API Key</Label>
        <div className="mt-1 relative">
          <Input
            type="password"
            value={api_key}
            readOnly
            className="border-primary"
          />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              onClick={copy_api_key}
              className="focus:ring-2 focus:ring-primary">
              {copySuccess ? (
                <CheckIcon className="size-4" />
              ) : (
                <ClipboardIcon className="size-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm">
          Keep your key secret and do not share it with others.
        </p>
      </CardContent>
    </Card>
  );
}
