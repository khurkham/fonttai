import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  updater: (el: HTMLMetaElement) => void
) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  updater(el);
}

function upsertLink(
  selector: string,
  create: () => HTMLLinkElement,
  updater: (el: HTMLLinkElement) => void
) {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  updater(el);
}

export function SeoHead({
  title,
  description,
  path = "/",
  image = "/og-image.jpg",
}: Props) {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = new URL(path, origin).toString();
    const imageUrl = new URL(image, origin).toString();

    document.title = title;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "description";
        return meta;
      },
      (el) => {
        el.content = description;
      }
    );

    upsertLink(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement("link");
        link.rel = "canonical";
        return link;
      },
      (el) => {
        el.href = canonicalUrl;
      }
    );

    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        return meta;
      },
      (el) => {
        el.content = title;
      }
    );

    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        return meta;
      },
      (el) => {
        el.content = description;
      }
    );

    upsertMeta(
      'meta[property="og:type"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:type");
        return meta;
      },
      (el) => {
        el.content = "website";
      }
    );

    upsertMeta(
      'meta[property="og:url"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:url");
        return meta;
      },
      (el) => {
        el.content = canonicalUrl;
      }
    );

    upsertMeta(
      'meta[property="og:image"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        return meta;
      },
      (el) => {
        el.content = imageUrl;
      }
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "twitter:card";
        return meta;
      },
      (el) => {
        el.content = "summary_large_image";
      }
    );

    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "twitter:title";
        return meta;
      },
      (el) => {
        el.content = title;
      }
    );

    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "twitter:description";
        return meta;
      },
      (el) => {
        el.content = description;
      }
    );

    upsertMeta(
      'meta[name="twitter:image"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "twitter:image";
        return meta;
      },
      (el) => {
        el.content = imageUrl;
      }
    );
  }, [title, description, path, image]);

  return null;
}