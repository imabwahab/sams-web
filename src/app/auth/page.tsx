import AuthPage from "@/features/auth/AuthPage";

export default async function AuthRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthPage nextPath={params.next} />;
}
