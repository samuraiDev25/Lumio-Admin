'use client';

import { Button, Modal } from '@jstrommash/ui-kit-lumio';
import s from './DeleteUserModal.module.scss';

type DeleteUserModalProps = {
  isLoading: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  open: boolean;
  username?: string;
};

export const DeleteUserModal = ({
  isLoading,
  onCloseAction,
  onConfirmAction,
  open,
  username,
}: DeleteUserModalProps) => {
  return (
    <Modal className={s.modal} onClose={onCloseAction} open={open} showCloseButton size="delete" title="Delete User">
      <div className={s.content}>
        <p className={s.text}>
          Are you sure you want to delete user <span>{username}</span>?
        </p>

        <div className={s.actions}>
          <Button disabled={isLoading} onClick={onConfirmAction} size="sm" type="button" variant="primary">
            Yes
          </Button>
          <Button disabled={isLoading} onClick={onCloseAction} size="sm" type="button" variant="outline">
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};
