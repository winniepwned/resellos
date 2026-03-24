import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface Props { title: string | null; description: string | null; hashtags: string | null; }

export function ListingCopyCard({ title, description, hashtags }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(text, field)}>
      {copied === field ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
    </Button>
  );

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Listing-Text</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {title && (
          <div className="flex items-start justify-between gap-2">
            <div><p className="text-xs text-muted-foreground">Titel</p><p className="text-sm font-medium">{title}</p></div>
            <CopyBtn text={title} field="title" />
          </div>
        )}
        {description && (
          <div className="flex items-start justify-between gap-2">
            <div><p className="text-xs text-muted-foreground">Beschreibung</p><p className="text-sm">{description}</p></div>
            <CopyBtn text={description} field="description" />
          </div>
        )}
        {hashtags && (
          <div className="flex items-start justify-between gap-2">
            <div><p className="text-xs text-muted-foreground">Hashtags</p><p className="text-sm text-primary">{hashtags}</p></div>
            <CopyBtn text={hashtags} field="hashtags" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
