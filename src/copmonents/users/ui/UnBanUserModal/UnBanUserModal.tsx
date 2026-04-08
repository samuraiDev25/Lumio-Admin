'use client';

import { Button, Modal } from '@jstrommash/ui-kit-lumio';
import s from './UnBanUserModal.module.scss';

type UnBanUserModalProps = {
  isLoading: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  open: boolean;
  username?: string;
};

export const UnBanUserModal = ({ isLoading, onCloseAction, onConfirmAction, open, username }: UnBanUserModalProps) => {
  return (
    <Modal className={s.modal} onClose={onCloseAction} open={open} showCloseButton size="delete" title="Un-Ban User">
      <div className={s.content}>
        <p className={s.text}>
          Are you sure want to un-ban <span>{username}</span>?
        </p>

        <div className={s.actions}>
          <Button disabled={isLoading} onClick={onCloseAction} size="sm" type="button" variant="outline">
            No
          </Button>
          <Button disabled={isLoading} onClick={onConfirmAction} size="sm" type="button" variant="primary">
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
