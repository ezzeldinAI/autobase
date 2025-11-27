"use client";

import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import {
  EntityContainer,
  EntityHeader,
  type EntityHeaderProps,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "@/feature/workflows/hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

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

type WorkflowContainerProps = PropsWithChildren;

export function WorkflowContainer(props: WorkflowContainerProps) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      // pagination={<></>}
      // search={<></>}
    >
      {props.children}
    </EntityContainer>
  );
}
