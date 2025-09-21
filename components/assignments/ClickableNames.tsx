import { SafeUser } from "@apptypes";

export function ClickableNames({ users }: { users: SafeUser[] }) {
    return (
        <>
            {
                users.map
                    (
                        (user, index) =>
                            <span key={user.id}>
                                <i
                                    onClick={() => console.log(user.id)}
                                    className="not-italic cursor-pointer hover:underline"
                                >
                                    {user.name}
                                </i>
                                {index < users.length - 1 && ", "}
                            </span>
                    )
            }
        </>
    )
}