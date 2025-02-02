import GroupMembersClient from "./group-members-client";

export default async function GroupMembersPage({
  params,
}: {
  params: { groupID: string };
}) {
  const { groupID } = await Promise.resolve(params);

  return <GroupMembersClient groupID={groupID} />;
}
