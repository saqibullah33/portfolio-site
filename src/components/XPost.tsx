"use client";

import { useEffect, useRef, useState } from "react";
import { xPostId } from "@/lib/x-post";

type XWidgets = {
  widgets: {
    createTweet: (
      id: string,
      element: HTMLElement,
      options: { theme: "light"; dnt: true }
    ) => Promise<HTMLElement | null>;
  };
};

export function XPost({ url }: { url: string }) {
  const id = xPostId(url);
  const container = useRef<HTMLDivElement>(null);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    if (!id || !container.current) return;
    let active = true;
    const render = () => {
      const widgets = (window as Window & { twttr?: XWidgets }).twttr?.widgets;
      if (!widgets || !container.current) return;
      widgets.createTweet(id, container.current, { theme: "light", dnt: true })
        .then((tweet) => {
          if (active && tweet) setEmbedded(true);
        })
        .catch(() => {});
    };

    let script = document.querySelector<HTMLScriptElement>('script[src="https://platform.twitter.com/widgets.js"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.head.appendChild(script);
    }
    if ((window as Window & { twttr?: XWidgets }).twttr?.widgets) {
      render();
    } else {
      script.addEventListener("load", render);
    }
    return () => {
      active = false;
      script.removeEventListener("load", render);
    };
  }, [id]);

  if (!id) return null;
  return (
    <section className="mt-8">
      <h2 className="t-heading-sm text-ink-deep mb-4 heading-feature">
        From the meetup on X
      </h2>
      <div ref={container} className="max-w-[550px]" />
      {!embedded && (
        <a
          href={`https://x.com/i/status/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel hover:text-ink underline t-body-sm"
        >
          View post on X
        </a>
      )}
    </section>
  );
}
