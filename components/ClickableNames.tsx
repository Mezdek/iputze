import { SafeUser } from "@/types";

export function ClickableNames({ users, isDisabled = false }: { users: SafeUser[], isDisabled?: boolean }) {
    const tw = isDisabled ? "cursor-text" : "cursor-pointer hover:underline"
    return (
        <div className="inline">
            {users.map
                ((user, index) =>
                    <button key={user.id} disabled={isDisabled}>
                        <i className={"not-italic " + tw}>{user.name}</i>
                        {index < users.length - 1 && ", "}
                    </button>)}
        </div>
    )
}