import GroupMemberClient from "./group-member-client";

export default async function GroupMembersPage({
  params,
}: {
  params: { groupID: string; memberID: string };
}) {
  const { groupID, memberID } = await Promise.resolve(params);

  return <GroupMemberClient groupID={groupID} memberID={memberID} />;
}
