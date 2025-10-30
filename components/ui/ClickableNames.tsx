import type { BasicUser } from '@/types';

export function ClickableNames({
  users,
  isDisabled = false,
}: {
  users: BasicUser[];
  isDisabled?: boolean;
}) {
  const tw = isDisabled ? 'cursor-text' : 'cursor-pointer hover:underline';
  return (
    <div className="inline">
      {users.map((user, index) => (
        <button disabled={isDisabled} key={user.id}>
          <i className={'not-italic ' + tw}>{user.name}</i>
          {index < users.length - 1 && ', '}
        </button>
      ))}
    </div>
  );
}
