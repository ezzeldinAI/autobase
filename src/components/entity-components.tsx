import {
  AlertTriangleIcon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

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

export function EntityContainer(props: EntityContainerProps) {
  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-y-8">
        {props.header}
        <div className="flex h-full flex-col gap-y-4">
          <section className="flex flex-row items-center justify-end gap-x-4">
            {props.search}
          </section>
          {props.children}
        </div>
        {props.pagination}
      </div>
    </div>
  );
}

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function EntitySearch(props: EntitySearchProps) {
  return (
    <InputGroup className="w-[25vw]">
      <InputGroupInput
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        value={props.value}
      />
      <InputGroupAddon align={"inline-start"}>
        <InputGroupButton>
          <SearchIcon className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  isLoadingPrev?: boolean;
  isLoadingNext?: boolean;
};

export function EntityPagination(props: EntityPaginationProps) {
  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <div className="flex-1 text-muted-foreground text-sm">
        Page {props.page} of {props.totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={
            props.page === 1 ||
            props.disabled ||
            props.isLoadingPrev ||
            props.isLoadingNext
          }
          onClick={() => props.onPageChange(Math.max(1, props.page - 1))}
          size="sm"
          variant="outline"
        >
          {props.isLoadingPrev ? <Spinner className="size-4" /> : "Previous"}
        </Button>
        <Button
          disabled={
            props.page === props.totalPages ||
            props.totalPages === 0 ||
            props.disabled ||
            props.isLoadingPrev ||
            props.isLoadingNext
          }
          onClick={() =>
            props.onPageChange(Math.min(props.totalPages, props.page + 1))
          }
          size="sm"
          variant="outline"
        >
          {props.isLoadingNext ? <Spinner className="size-4" /> : "Next"}
        </Button>
      </div>
    </div>
  );
}

type StateViewProps = {
  message?: string;
};

type LoadingViewProps = StateViewProps & {
  entity?: string;
};

export function LoadingView(props: LoadingViewProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <Spinner className="size-6 text-muted-foreground" />
      {props.message ? (
        <p className="text-muted-foreground text-sm">{props.message}</p>
      ) : null}
    </div>
  );
}

export function ErrorView(props: StateViewProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <AlertTriangleIcon className="size-6 text-muted-foreground" />
      {props.message ? (
        <p className="text-muted-foreground text-sm">{props.message}</p>
      ) : null}
    </div>
  );
}

type EmptyView = StateViewProps & {
  onNew?: () => void;
};

export function EmptyView(props: EmptyView) {
  return (
    <Empty className="border border-dashed bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon className="size-12 text-muted-foreground" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No workflows found</EmptyTitle>
      {props.message ? (
        <EmptyDescription>{props.message}</EmptyDescription>
      ) : null}

      {/* TODO: find a way to add a "clear search" button for better UX */}

      {props.onNew ? (
        <EmptyContent>
          <Button onClick={props.onNew}>
            <PlusIcon className="size-4" />
            New workflow
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

type EntityListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
};

export function EntityList<T>(props: EntityListProps<T>) {
  if (props.items.length === 0 && props.emptyView) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-sm">{props.emptyView}</div>
      </div>
    );
  }

  return (
    <ScrollArea
      className={cn(
        "max-h-fit min-h-fit w-full overflow-y-hidden rounded-md bg-neutral-200/50 p-2 ring ring-border",
        props.className
      )}
    >
      {props.items.map((item, index) => (
        <div
          className="my-2"
          key={props.getKey ? props.getKey(item, index) : index}
        >
          {props.renderItem(item, index)}
        </div>
      ))}
    </ScrollArea>
  );
}

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
};

export function EntityItem(props: EntityItemProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.isRemoving) {
      return;
    }

    if (props.onRemove) {
      await props.onRemove();
    }
  };

  return (
    <Link href={props.href} prefetch>
      <Card
        className={cn(
          "cursor-pointer p-4 shadow-none hover:shadow",
          props.isRemoving && "cursor-not-allowed opacity-50",
          props.className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {props.image}
            <div>
              <CardTitle className="font-medium text-base">
                {props.title}
              </CardTitle>
              {!!props.subtitle && (
                <CardDescription className="text-xs">
                  {props.subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(props.actions || props.onRemove) && (
            <div className="flex items-center gap-x-4">
              {props.actions}
              {props.onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      size="icon"
                      variant="ghost"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      disabled={props.isRemoving}
                      onClick={handleRemove}
                    >
                      {props.isRemoving ? (
                        <Spinner className="size-4" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                      {props.isRemoving ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
