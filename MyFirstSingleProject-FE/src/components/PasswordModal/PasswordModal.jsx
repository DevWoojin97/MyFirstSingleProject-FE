import { useState } from 'react';
import styles from './PasswordModal.module.css';

export default function PasswordModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isPasswordRequired = true,
}) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await onConfirm(isPasswordRequired ? password : null);
    setIsLoading(false);
    setPassword('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {/* 💡 회원일 때는 이 입력창이 아예 안 보임! */}
          {isPasswordRequired && (
            <input
              type="password"
              className={styles.passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoFocus
            />
          )}
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || (isPasswordRequired && !password)}
            >
              {isLoading ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
