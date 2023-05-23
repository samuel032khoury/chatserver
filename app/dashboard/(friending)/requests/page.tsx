import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import FriendRequests from "@/components/FriendRequests";

const Requests = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingSenderIds = (await db.smembers(
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await db.get(`user:${senderId}`)) as User;
      return {
        senderId,
        senderEmail: sender.email,
      };
    })
  );
  return (
    <main className={"pt-8"}>
      <h1 className={"font-bold text-5xl mb-8"}>Friends Requests</h1>
      <div className={"flex flex-col gap-4"}>
        <FriendRequests
          sessionId={session.user.id}
          incomingFriendRequests={incomingFriendRequests}
        />
      </div>
    </main>
  );
};

export default Requests;