import { CallbackContent } from "./components/callback-content";

interface Props {
  searchParams: Promise<{
    intent: string;
  }>;
}

export default async function Page({ searchParams }: Readonly<Props>) {
  const intent = (await searchParams).intent;

  return <CallbackContent intent={intent} />;
}
