"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FaqCategory, FaqItem } from "@/app/data/faqsData";
import { faqCategories } from "@/app/data/faqsData";

type Props = {
  title?: string;
  subtitle?: string;
  categories?: FaqCategory[];
};

function classNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function renderAnswer(answer: string, link?: string) {
  // Función para procesar texto en negrita **text**
  const processBoldText = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Agregar texto antes del match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Agregar texto en negrita
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    // Agregar texto restante
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // Procesar enlace si existe
  if (link && answer.includes("{1}")) {
    const parts = answer.split("{1}");
    const result: (string | JSX.Element)[] = [];

    // Procesar primera parte con negritas
    result.push(...processBoldText(parts[0]));

    // Agregar enlace
    result.push(
      <Link
        key="link"
        href={link}
        className="text-sky-600 hover:text-sky-700 underline font-medium"
      >
        aquí
      </Link>
    );

    // Procesar segunda parte con negritas si existe
    if (parts[1]) {
      result.push(...processBoldText(parts[1]));
    }

    return <>{result}</>;
  }

  // Solo procesar negritas
  const boldParts = processBoldText(answer);
  return <>{boldParts}</>;
}

export default function FAQ({
  title = "Preguntas Frecuentes",
  subtitle =
    "Nuestra plataforma se adapta a tus necesidades y te ayuda a lograr tus objetivos.",
  categories = faqCategories,
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || ""
  );
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    categories[0]?.items[0]?.id ?? null
  );

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  const expandedItem: FaqItem | undefined = useMemo(() => {
    return activeCategory?.items.find((i) => i.id === expandedItemId);
  }, [activeCategory, expandedItemId]);

  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
          {/* Tabs - Mobile horizontal / Desktop vertical */}
          <div className="md:col-span-4">
            <div className="flex md:block overflow-x-auto md:overflow-visible -mx-4 md:mx-0 px-4 md:px-0 space-x-2 md:space-x-0 md:space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setExpandedItemId(cat.items[0]?.id ?? null);
                  }}
                  className={classNames(
                    "flex-shrink-0 text-left rounded-xl border transition-all md:w-full",
                    "px-4 py-3 md:px-5 md:py-4",
                    activeCategoryId === cat.id
                      ? "bg-white border-sky-400 shadow-md"
                      : "bg-white/70 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm sm:text-base font-medium text-slate-800">
                      {cat.title}
                    </span>
                    <svg
                      className="h-4 w-4 text-slate-400 md:block hidden"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 space-y-4">
            {/* Accordion list */}
            <div className="space-y-2">
              {activeCategory?.items.map((item) => {
                const isOpen = expandedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    className={classNames(
                      "rounded-xl border bg-white transition-all",
                      isOpen
                        ? "border-sky-300 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <button
                      type="button"
                      className="w-full px-4 py-4 text-left"
                      onClick={() =>
                        setExpandedItemId((prev) => (prev === item.id ? null : item.id))
                      }
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm sm:text-base font-medium text-slate-800">
                          {item.question}
                        </span>
                        <span
                          className={classNames(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md border text-slate-500",
                            isOpen ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"
                          )}
                          aria-hidden
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={classNames("h-4 w-4 transition-transform", isOpen && "rotate-45")}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 -mt-2">
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                          {renderAnswer(item.answer, item.link)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Subtle background dots to echo the reference design */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-50/60 via-transparent to-transparent" />
    </section>
  );
}


