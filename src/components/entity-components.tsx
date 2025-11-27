import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export function EntityHeader({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-xs md:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {onNew && !newButtonHref ? (
        <Button disabled={isCreating || disabled} onClick={onNew} size="sm">
          {isCreating ? (
            <>
              <Spinner className="size-4" />
              <p>Creating...</p>
            </>
          ) : (
            <>
              <PlusIcon className="size-4" />
              {newButtonLabel}
            </>
          )}
        </Button>
      ) : null}
      {!onNew && newButtonHref ? (
        <Button asChild size="sm">
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

type EntityContainerProps = PropsWithChildren & {
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = (props: EntityContainerProps) => (
  <div className="h-full p-4 md:px-10 md:py-6">
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-y-8">
      {props.header}
      <div className="flex h-full flex-col gap-y-4">
        {props.search}
        {props.children}
      </div>
      {props.pagination}
    </div>
  </div>
);
