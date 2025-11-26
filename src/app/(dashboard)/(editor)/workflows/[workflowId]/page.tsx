type Props = {
  params: Promise<{
    workflowId: string;
  }>;
};

export default async function WorkflowIdPage(props: Props) {
  const params = await props.params;

  return <div>Workflow id: {params.workflowId}</div>;
}
