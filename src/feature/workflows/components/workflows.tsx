"use client";

import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  type EntityHeaderProps,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "@/feature/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/feature/workflows/hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { visualErrorNotify, visualSuccessNotify } from "@/lib/utils";
import type { Workflow } from "@/server/db/types";

export function WorkflowsList() {
  // throw new Error("Intentional Error");

  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      emptyView={<WorkflowEmpty />}
      getKey={(workflow) => workflow.id}
      items={workflows.data.items}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
    />
  );
}

type WorkflowsHeaderProps = Pick<EntityHeaderProps, "disabled">;

export function WorkflowsHeader(props: WorkflowsHeaderProps) {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  function handleCreate() {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: ({ data }) => {
        visualSuccessNotify(
          `Workflow created successfully, redirecting you to "${data.name}"`
        );
      },
    });
  }

  return (
    <>
      {modal}
      <EntityHeader
        description="Manage your workflows"
        newButtonLabel="New workflow"
        onNew={handleCreate}
        title="Workflows"
        {...props}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
}

export function WorkflowSearch() {
  const [params, setParams] = useWorkflowsParams();
  const { value, onSearchChange } = useEntitySearch({
    params,
    setParams,
    debounceMs: 1000, // controls the delay/responsiveness of the search
  });

  return (
    <EntitySearch
      onChange={onSearchChange}
      placeholder="Search workflows"
      value={value}
    />
  );
}

export function WorkflowPagination() {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      isLoadingNext={workflows.isFetching && params.page < workflows.data.page}
      isLoadingPrev={workflows.isFetching && params.page > workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
    />
  );
}

type WorkflowContainerProps = PropsWithChildren;

export function WorkflowContainer(props: WorkflowContainerProps) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      pagination={<WorkflowPagination />}
      search={<WorkflowSearch />}
    >
      {props.children}
    </EntityContainer>
  );
}

export function WorkflowLoading() {
  return <LoadingView message="Loading workflows..." />;
}

export function WorkflowError() {
  return <ErrorView message="Failed to load workflows" />;
}

export function WorkflowEmpty() {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  function handleCreate() {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      // onSuccess: ({ data }) => {
      //   redirect to that workflow and visually show it a success conformation
      // },
    });
  }

  return (
    <>
      {modal}
      <EmptyView
        message="No workflows were found. Started by creating your workflow"
        onNew={handleCreate}
      />
    </>
  );
}

type WorkflowItemProps = {
  data: Workflow;
};
export function WorkflowItem(props: WorkflowItemProps) {
  const removeWorkflow = useRemoveWorkflow();
  const [isInvalidating, setIsInvalidating] = useState(false);

  function handleRemove() {
    setIsInvalidating(true);
    removeWorkflow.mutate(
      { id: props.data.id },
      {
        onSuccess: () => {
          visualSuccessNotify(
            `Workflow "${props.data.name}" removed successfully`
          );
        },
        onError: (error) => {
          visualErrorNotify(`Failed to remove workflow: ${error.message}`);
        },
        onSettled: () => {
          // Re-enable after invalidation settles (Note: find a better way)
          setTimeout(() => setIsInvalidating(false), 1200); // Small buffer
        },
      }
    );
  }

  return (
    <EntityItem
      href={`/workflows/${props.data.id}`}
      image={
        <div className="flex size-6 items-center justify-center rounded-full bg-gray-50">
          <WorkflowIcon className="size-4 text-muted-foreground" />
        </div>
      }
      isRemoving={removeWorkflow.isPending || isInvalidating}
      onRemove={handleRemove}
      subtitle={
        <>
          Updated{" "}
          {formatDistanceToNow(props.data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(props.data.createdAt, { addSuffix: true })}
        </>
      }
      title={props.data.name}
    />
  );
}
