"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AICaptionGenerator() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [reelDescription, setReelDescription] = useState("");

  const generateCaption = async () => {
    if (!reelDescription) return;
    setLoading(true);
    setCaption("");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a creative Instagram Reels caption generator.",
            },
            {
              role: "user",
              content: `Generate an engaging caption for this Instagram Reel: ${reelDescription}`,
            },
          ],
        }),
      });

      const data = await res.json();
      const aiCaption = data.choices?.[0]?.message?.content || "No caption generated.";
      setCaption(aiCaption);
    } catch (err) {
      setCaption("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">AI Reels Caption Generator</h1>
          <Input
            type="text"
            placeholder="Describe your reel..."
            value={reelDescription}
            onChange={(e) => setReelDescription(e.target.value)}
            className="mb-4"
          />
          <Button onClick={generateCaption} className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Caption"}
          </Button>

          {caption && (
            <div className="mt-6 bg-purple-50 p-4 rounded-lg border text-gray-800 whitespace-pre-wrap">
              {caption}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
