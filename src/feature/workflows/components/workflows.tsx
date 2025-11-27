"use client";

import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import {
  EntityContainer,
  EntityHeader,
  type EntityHeaderProps,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "@/feature/workflows/hooks/use-workflows";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return <pre>{JSON.stringify(workflows, null, 2)}</pre>;
}

type WorkflowsHeaderProps = Pick<EntityHeaderProps, "disabled">;

export function WorkflowsHeader(props: WorkflowsHeaderProps) {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  function handleCreate() {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: ({ data }) => {
        router.push(`/workflows/${data.id}`);
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
