import type { NextRequest } from "next/server";
import { deletePasskey } from "@/lib/credentials";
import { allowedOrigin, failure, forbiddenOrigin, json } from "@/lib/http";
import { currentUser, revokeOtherSessions } from "@/lib/session";
import { privateCopy as copy } from "@/data/private";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!allowedOrigin(request)) return forbiddenOrigin();
  const user = await currentUser(request);
  if (!user) return failure(401, copy.loginRequired);
  const { id } = await context.params;

  switch (await deletePasskey(user.id, id)) {
    case "deleted":
      // 지운 패스키는 잃어버렸거나 도난당했을 수 있으니 다른 기기의 세션도 함께 끝냄
      await revokeOtherSessions(request, user.id);
      return json({ deleted: true });
    case "last":
      return failure(409, copy.lastPasskey);
    case "conflict":
      return failure(409, copy.changedList);
    case "missing":
      return failure(404, copy.missingPasskey);
  }
}
