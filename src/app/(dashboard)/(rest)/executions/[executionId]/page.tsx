type Props = {
  params: Promise<{
    executionId: string;
  }>;
};

export default async function ExecutionIdPage(props: Props) {
  const params = await props.params;

  return <div>Execution id: {params.executionId}</div>;
}
