import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
};

export function SeoHead({ title, description }: Props) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description;
  }, [title, description]);

  return null;
}