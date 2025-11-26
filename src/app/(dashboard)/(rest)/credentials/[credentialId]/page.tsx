type Props = {
  params: Promise<{
    credentialId: string;
  }>;
};

export default async function CredentialIdPage(props: Props) {
  const params = await props.params;
  return <div>Credential id: {params.credentialId}</div>;
}
