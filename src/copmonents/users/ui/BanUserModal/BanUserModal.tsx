'use client';

import { Button, Modal } from '@jstrommash/ui-kit-lumio';
import { BAN_REASONS, BanReason } from '../../model/constants';
import s from './BanUserModal.module.scss';

type BanUserModalProps = {
  isLoading: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  onReasonChangeAction: (value: BanReason) => void;
  open: boolean;
  reason: BanReason;
  username?: string;
};

export const BanUserModal = ({
  isLoading,
  onCloseAction,
  onConfirmAction,
  onReasonChangeAction,
  open,
  reason,
  username,
}: BanUserModalProps) => {
  return (
    <Modal className={s.modal} onClose={onCloseAction} open={open} showCloseButton size="delete" title="Ban User">
      <div className={s.content}>
        <p className={s.text}>
          Are you sure to ban this user, <span>{username}</span>?
        </p>

        <div className={s.reasonField}>
          <select
            className={s.reasonSelect}
            id="ban-reason"
            onChange={(event) => onReasonChangeAction(event.currentTarget.value as BanReason)}
            value={reason}
          >
            {BAN_REASONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

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
